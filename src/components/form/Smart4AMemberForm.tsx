import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassButton from './GlassButton';
import ImageLightbox from './ImageLightbox';
import GlassCard from '../GlassCard';
import { ChevronLeft, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import makeOrgIdExample from '@/assets/make-org-id-example.jpg';

interface Smart4AMemberFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting: boolean;
}

const Smart4AMemberForm: React.FC<Smart4AMemberFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [searchParams] = useSearchParams();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get URL parameters for pre-filling
  const urlParams = useMemo(() => ({
    fullName: searchParams.get('fullName') || searchParams.get('name') || '',
    phone: searchParams.get('phone') || '',
    email: searchParams.get('email') || '',
    postalCode: searchParams.get('postalCode') || '',
    address: searchParams.get('address') || '',
    lineId: searchParams.get('lineId') || searchParams.get('line_id') || '',
    referralCode: searchParams.get('referralCode') || searchParams.get('ref') || '',
    makeOrganizationId: searchParams.get('makeOrganizationId') || searchParams.get('orgId') || '',
  }), [searchParams]);

  const [formData, setFormData] = useState<Record<string, any>>({
    fullName: urlParams.fullName,
    phone: urlParams.phone,
    email: urlParams.email,
    emailConfirm: '',
    postalCode: urlParams.postalCode,
    address: urlParams.address,
    // Hidden fields from URL
    lineId: urlParams.lineId,
    referralCode: urlParams.referralCode,
    makeOrganizationId: urlParams.makeOrganizationId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = '請輸入姓名';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '請輸入聯絡電話';
    }
    if (!formData.email.trim()) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }
    if (formData.email !== formData.emailConfirm) {
      newErrors.emailConfirm = '電子郵件不一致，請確認輸入正確';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShowConfirmation = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleBackToForm = () => {
    setShowConfirmation(false);
  };

  // Generate submissionID: YYYYMMDDHHMMSS + 2 random digits
  const generateSubmissionId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}${random}`;
  };

  const handleSubmit = () => {
    const submissionId = generateSubmissionId();
    onSubmit({
      submissionId,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      postalCode: formData.postalCode || null,
      address: formData.address || null,
      lineId: formData.lineId || null,
      referralCode: formData.referralCode || null,
      makeOrganizationId: formData.makeOrganizationId || null,
    });
  };

  // Confirmation Page
  if (showConfirmation) {
    return (
      <GlassCard className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="w-6 h-6 text-primary" />
          <h2 className="form-section-title mb-0">資料確認</h2>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          請確認以下資料是否正確，確認後點擊「確認送出」完成登記。
        </p>

        <div className="space-y-4 bg-muted/30 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">姓名</p>
              <p className="font-medium">{formData.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">聯絡電話</p>
              <p className="font-medium">{formData.phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-muted-foreground">E-mail</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            {formData.postalCode && (
              <div>
                <p className="text-xs text-muted-foreground">郵遞區號</p>
                <p className="font-medium">{formData.postalCode}</p>
              </div>
            )}
            {formData.address && (
              <div className={formData.postalCode ? '' : 'md:col-span-2'}>
                <p className="text-xs text-muted-foreground">地址</p>
                <p className="font-medium">{formData.address}</p>
              </div>
            )}
            {formData.makeOrganizationId && (
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground">MAKE Organization ID</p>
                <p className="font-medium">{formData.makeOrganizationId}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <GlassButton
            type="button"
            variant="outline"
            onClick={handleBackToForm}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            返回修改
          </GlassButton>
          <GlassButton
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>處理中...</>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                確認送出
              </>
            )}
          </GlassButton>
        </div>
      </GlassCard>
    );
  }

  // Main Form
  return (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">會員資料登記</h2>

      <GlassInput
        label="姓名"
        name="fullName"
        placeholder="請輸入您的姓名"
        value={formData.fullName}
        onChange={(e) => updateField('fullName', e.target.value)}
        error={errors.fullName}
        required
      />

      <GlassInput
        label="聯絡電話"
        name="phone"
        type="tel"
        placeholder="請輸入您的行動電話"
        value={formData.phone}
        onChange={(e) => updateField('phone', e.target.value)}
        error={errors.phone}
        required
      />

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="E-mail"
            name="email"
            type="email"
            placeholder="example@example.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={errors.email}
            required
          />
          <GlassInput
            label="確認 E-mail"
            name="emailConfirm"
            type="email"
            placeholder="請再次輸入電子郵件"
            value={formData.emailConfirm}
            onChange={(e) => updateField('emailConfirm', e.target.value)}
            error={errors.emailConfirm}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          請再次輸入 E-mail 以確保填寫正確。如您已有報名課程，請填寫與課程報名時相同的 E-mail。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassInput
          label="郵遞區號"
          name="postalCode"
          placeholder="郵遞區號"
          value={formData.postalCode}
          onChange={(e) => updateField('postalCode', e.target.value)}
        />
        <div className="md:col-span-2">
          <GlassInput
            label="地址"
            name="address"
            placeholder="請輸入地址（選填）"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <GlassInput
          label="MAKE Organization ID"
          name="makeOrganizationId"
          placeholder="請輸入您的 Organization ID（選填）"
          value={formData.makeOrganizationId}
          onChange={(e) => updateField('makeOrganizationId', e.target.value)}
        />
        <ImageLightbox src={makeOrgIdExample} alt="Organization ID 範例" className="max-w-md" />
        <p className="text-xs text-muted-foreground">
          如果您已經有組織編號，可以優先填寫，這將使用在套件應用相關服務。當然，這在日後是可以補登上去的。
        </p>
      </div>

      <div className="pt-4">
        <GlassButton
          type="button"
          onClick={handleShowConfirmation}
          className="w-full"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          確認資料
        </GlassButton>
      </div>
    </GlassCard>
  );
};

export default Smart4AMemberForm;
