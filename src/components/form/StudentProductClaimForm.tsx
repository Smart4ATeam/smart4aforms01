import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassCheckbox from './GlassCheckbox';
import GlassRadio from './GlassRadio';
import GlassButton from './GlassButton';
import ImageLightbox from './ImageLightbox';
import GlassCard from '../GlassCard';
import { AlertTriangle, Send } from 'lucide-react';
import orgIdExample from '@/assets/org-id-example.jpg';
import { getFormByPath, getFormOptionsFromDB, getPersistedFormOptions, FormOption, FORM_OPTIONS_UPDATED_EVENT } from '@/data/forms';

interface StudentProductClaimFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

// 從設定檔取得預設選項
const formConfig = getFormByPath('student-product-claim');
const DEFAULT_PACKAGES: FormOption[] = formConfig?.options?.packages || [];
const DEFAULT_TEMPLATES: FormOption[] = formConfig?.options?.templates || [];

export const StudentProductClaimForm: React.FC<StudentProductClaimFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [searchParams] = useSearchParams();

  // 動態載入選項（從 Supabase → localStorage → 預設值）
  const [packageOptions, setPackageOptions] = useState<FormOption[]>(DEFAULT_PACKAGES);
  const [templateOptions, setTemplateOptions] = useState<FormOption[]>(DEFAULT_TEMPLATES);

  useEffect(() => {
    const loadOptions = async () => {
      const dbOptions = await getFormOptionsFromDB('student-product-claim');
      const localOptions = getPersistedFormOptions('student-product-claim');
      const options = dbOptions || localOptions;
      if (options?.packages) setPackageOptions(options.packages);
      if (options?.templates) setTemplateOptions(options.templates);
    };
    loadOptions();

    const handleOptionsUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.formId === 'student-product-claim') loadOptions();
    };
    window.addEventListener(FORM_OPTIONS_UPDATED_EVENT, handleOptionsUpdate);
    return () => window.removeEventListener(FORM_OPTIONS_UPDATED_EVENT, handleOptionsUpdate);
  }, []);

  const [formData, setFormData] = useState({
    nameOrCompany: '',
    studentId: '',
    email: '',
    confirmEmail: '',
    makeOrganizationId: '',
  });

  // 使用物件記錄勾選狀態（套件為多選）
  const [selectedPackages, setSelectedPackages] = useState<Record<string, boolean>>({});
  // 樣板為單選
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // URL 參數預填（僅基本資料）
  useEffect(() => {
    const nameOrCompany = searchParams.get('nameOrCompany');
    const studentId = searchParams.get('studentId');
    const email = searchParams.get('email');
    const makeOrganizationId = searchParams.get('makeOrganizationId');

    if (nameOrCompany || studentId || email || makeOrganizationId) {
      setFormData(prev => ({
        ...prev,
        ...(nameOrCompany && { nameOrCompany }),
        ...(studentId && { studentId }),
        ...(email && { email, confirmEmail: email }),
        ...(makeOrganizationId && { makeOrganizationId }),
      }));
    }
  }, [searchParams]);

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // 清除對應的錯誤
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const togglePackage = (value: string) => {
    setSelectedPackages(prev => ({
      ...prev,
      [value]: !prev[value],
    }));
    // 清除選項錯誤
    if (errors.selection) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.selection;
        return newErrors;
      });
    }
  };

  const selectTemplate = (value: string) => {
    setSelectedTemplate(value);
    // 清除選項錯誤
    if (errors.selection) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.selection;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nameOrCompany.trim()) {
      newErrors.nameOrCompany = '請輸入姓名或公司行號';
    }

    if (!formData.email.trim()) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }

    if (!formData.confirmEmail.trim()) {
      newErrors.confirmEmail = '請確認電子郵件';
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = '電子郵件不一致';
    }

    if (!formData.makeOrganizationId.trim()) {
      newErrors.makeOrganizationId = '請輸入 Make Organization ID';
    }

    // 檢查是否至少選擇了一個產品
    const hasSelectedPackage = Object.values(selectedPackages).some(v => v);
    const hasSelectedTemplate = selectedTemplate !== '';

    if (!hasSelectedPackage && !hasSelectedTemplate) {
      newErrors.selection = '請至少選擇一個套件或樣板';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 收集已選擇的套件
    const packages = packageOptions
      .filter(opt => selectedPackages[opt.value])
      .map(opt => opt.label);

    // 收集已選擇的樣板（單選）
    const selectedTemplateOption = templateOptions.find(opt => opt.value === selectedTemplate);
    const template = selectedTemplateOption ? selectedTemplateOption.label : '';

    // 組合 claimItems
    const claimItems = [
      ...packageOptions
        .filter(opt => selectedPackages[opt.value])
        .map(opt => ({
          type: 'package' as const,
          value: opt.value,
          label: opt.label,
        })),
      ...(selectedTemplateOption ? [{
        type: 'template' as const,
        value: selectedTemplateOption.value,
        label: selectedTemplateOption.label,
      }] : []),
    ];

    onSubmit({
      ...formData,
      packages,
      template, // 單一字串
      claimItems,
      submittedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本資料區塊 */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">基本資料</h2>

        <GlassInput
          label="姓名/公司行號"
          name="nameOrCompany"
          placeholder="請輸入您的姓名或公司行號"
          value={formData.nameOrCompany}
          onChange={(e) => updateFormData('nameOrCompany', e.target.value)}
          required
          error={errors.nameOrCompany}
        />

        <div className="space-y-1">
          <GlassInput
            label="學員編號"
            name="studentId"
            placeholder="如您有學員編號，請填入"
            value={formData.studentId}
            onChange={(e) => updateFormData('studentId', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">如您有學員編號，請填入</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="電子郵件信箱"
            name="email"
            type="email"
            placeholder="example@example.com"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            required
            error={errors.email}
          />
          <GlassInput
            label="確認電子郵件信箱"
            name="confirmEmail"
            type="email"
            placeholder="請再次輸入電子郵件"
            value={formData.confirmEmail}
            onChange={(e) => updateFormData('confirmEmail', e.target.value)}
            required
            error={errors.confirmEmail}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          認證金鑰將寄到您提供的電子郵件信箱
        </p>

        <div className="space-y-3">
          <GlassInput
            label="MAKE Organization ID"
            name="makeOrganizationId"
            placeholder="請輸入您的 Organization ID"
            value={formData.makeOrganizationId}
            onChange={(e) => updateFormData('makeOrganizationId', e.target.value)}
            required
            error={errors.makeOrganizationId}
          />
          <ImageLightbox src={orgIdExample} alt="Organization ID 範例" />
          <div className="notice-box notice-box-warning">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <p>請務必確認填寫正確的 Organization ID，提交後將無法更改，亦無法取消</p>
          </div>
        </div>
      </GlassCard>

      {/* 領用產品清單區塊 */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">領用產品清單</h2>

        {errors.selection && (
          <div className="notice-box notice-box-warning">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <p>{errors.selection}</p>
          </div>
        )}

        {/* 套件選項 */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-3">
            套件類型
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packageOptions.map((option) => (
              <GlassCheckbox
                key={option.value}
                label={option.label}
                name={`package_${option.value}`}
                checked={selectedPackages[option.value] || false}
                onChange={() => togglePackage(option.value)}
              />
            ))}
          </div>
        </div>

        {/* 樣板選項（單選） */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-3">
            樣板類型（只能選擇一個）
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassRadio
              name="templateType"
              options={templateOptions}
              value={selectedTemplate}
              onChange={selectTemplate}
            />
          </div>
        </div>
      </GlassCard>

      {/* 提交按鈕 */}
      <div className="flex justify-center">
        <GlassButton
          type="submit"
          variant="gradient"
          loading={isSubmitting}
          className="min-w-[200px]"
        >
          <Send className="w-4 h-4" />
          提交申請
        </GlassButton>
      </div>
    </form>
  );
};

export default StudentProductClaimForm;
