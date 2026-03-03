import React, { useState, useEffect } from 'react';
import GlassInput from './GlassInput';
import GlassRadio from './GlassRadio';
import GlassCheckbox from './GlassCheckbox';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import ConditionalField from './ConditionalField';
import { getFormOptionsFromDB, getPersistedFormOptions, FORM_OPTIONS_UPDATED_EVENT } from '@/data/forms';
import type { FormOptionsConfig, FormOption } from '@/data/forms';

interface ReferralLinkApplicationFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

const DEFAULT_FILLERS: FormOption[] = [
  { value: 'Elena', label: 'Elena' },
  { value: 'Joyce', label: 'Joyce' },
  { value: 'Jimbo', label: 'Jimbo' },
  { value: 'Rush', label: 'Rush' },
  { value: 'Silent', label: 'Silent' },
  { value: 'Vincent', label: 'Vincent' },
  { value: 'Zin', label: 'Zin' },
];

const DEFAULT_IDENTITY_TYPES: FormOption[] = [
  { value: '經銷商', label: '經銷商' },
  { value: '合作夥伴', label: '合作夥伴' },
  { value: '團隊成員', label: '團隊成員' },
];

const DEFAULT_PACKAGES: FormOption[] = [
  { value: 'LineRichMenu', label: 'LineRichMenu' },
  { value: 'LinePay', label: 'LinePay' },
  { value: 'DifyAPI', label: 'DifyAPI' },
  { value: '認證與編號生成器', label: '認證與編號生成器' },
  { value: 'Line Flex 名片樣板', label: 'Line Flex 名片樣板' },
  { value: 'Ragic Plus', label: 'Ragic Plus' },
  { value: '財政部電子發票', label: '財政部電子發票' },
  { value: 'AI Voice 優聲學', label: 'AI Voice 優聲學' },
  { value: 'LINE FLEX 會員卡掃碼系列', label: 'LINE FLEX 會員卡掃碼系列' },
  { value: 'Meeting Wizard', label: 'Meeting Wizard' },
  { value: 'Whimsical', label: 'Whimsical' },
  { value: '黑貓Pay金流', label: '黑貓Pay金流' },
  { value: '綠界金流支付', label: '綠界金流支付' },
  { value: '藍新金流支付', label: '藍新金流支付' },
  { value: 'Threads', label: 'Threads' },
  { value: 'MitakeSMS 三竹簡訊', label: 'MitakeSMS 三竹簡訊' },
  { value: 'Reurl 短網址產生器', label: 'Reurl 短網址產生器' },
  { value: 'VoAI 絕好聲創', label: 'VoAI 絕好聲創' },
  { value: 'CometAI Plus', label: 'CometAI Plus' },
  { value: 'Smart4A 應用工具', label: 'Smart4A 應用工具' },
];

const ReferralLinkApplicationForm: React.FC<ReferralLinkApplicationFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    selectedPackages: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic options
  const [fillers, setFillers] = useState(DEFAULT_FILLERS);
  const [identityTypes, setIdentityTypes] = useState(DEFAULT_IDENTITY_TYPES);
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);

  useEffect(() => {
    const loadOptions = async () => {
      const dbOpts = await getFormOptionsFromDB('referral-link-application');
      const localOpts = getPersistedFormOptions('referral-link-application');
      const opts: any = dbOpts || localOpts || {};
      if (opts.fillers) setFillers(opts.fillers);
      if (opts.identityTypes) setIdentityTypes(opts.identityTypes);
      if (opts.packages) setPackages(opts.packages);
    };
    loadOptions();

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.formPath === 'referral-link-application' && detail?.options) {
        if (detail.options.fillers) setFillers(detail.options.fillers);
        if (detail.options.identityTypes) setIdentityTypes(detail.options.identityTypes);
        if (detail.options.packages) setPackages(detail.options.packages);
      }
    };
    window.addEventListener(FORM_OPTIONS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(FORM_OPTIONS_UPDATED_EVENT, handler);
  }, []);

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handlePackageToggle = (pkg: string) => {
    const current = formData.selectedPackages as string[];
    const updated = current.includes(pkg)
      ? current.filter((p: string) => p !== pkg)
      : [...current, pkg];
    updateField('selectedPackages', updated);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.filler) e.filler = '請選擇填表人';
    if (!formData.applicantName?.trim()) e.applicantName = '請輸入申請人姓名/公司行號';
    if (!formData.identityType) e.identityType = '請選擇申請人身份類別';
    if (!formData.isDealerSelfUse) e.isDealerSelfUse = '請選擇是否為經銷商自用';
    if ((formData.selectedPackages as string[]).length === 0) e.selectedPackages = '請至少選擇一個套件';
    if (!formData.sendDirectly) e.sendDirectly = '請選擇是否直接將連結寄給申請人';
    if (formData.sendDirectly === '是' && !formData.applicantEmail?.trim()) {
      e.applicantEmail = '選擇直接寄送時，請務必填寫申請人 E-mail';
    }
    if (!formData.sendCopyToFiller) e.sendCopyToFiller = '請選擇是否需要寄副本給填表人';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Record<string, any> = {
      填表人: formData.filler,
      '申請人姓名/公司行號': formData.applicantName,
      申請人身份類別: formData.identityType,
      是否為經銷商自用: formData.isDealerSelfUse,
      套件選擇: (formData.selectedPackages as string[]).join(', '),
      套件選擇陣列: formData.selectedPackages,
      是否直接將連結寄給申請人: formData.sendDirectly,
      '申請人E-mail': formData.applicantEmail || '',
      是否需要寄副本給填表人: formData.sendCopyToFiller,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 填表人 */}
      <GlassCard className="p-5 space-y-4">
        <GlassRadio
          name="filler"
          label="填表人"
          options={fillers}
          value={formData.filler || ''}
          onChange={val => updateField('filler', val)}
          error={errors.filler}
          required
        />
      </GlassCard>

      {/* 申請人姓名/公司行號 */}
      <GlassCard className="p-5 space-y-4">
        <GlassInput
          label="申請人姓名/公司行號"
          name="applicantName"
          placeholder="請填寫完整中文名稱"
          value={formData.applicantName || ''}
          onChange={e => updateField('applicantName', e.target.value)}
          error={errors.applicantName}
          required
        />
      </GlassCard>

      {/* 申請人身份類別 */}
      <GlassCard className="p-5 space-y-4">
        <GlassRadio
          name="identityType"
          label="申請人身份類別"
          options={identityTypes}
          value={formData.identityType || ''}
          onChange={val => updateField('identityType', val)}
          error={errors.identityType}
          required
        />
      </GlassCard>

      {/* 是否為經銷商自用 */}
      <GlassCard className="p-5 space-y-4">
        <GlassRadio
          name="isDealerSelfUse"
          label="是否為經銷商自用"
          options={[
            { value: '否', label: '否' },
            { value: '是－0.5', label: '是－0.5' },
          ]}
          value={formData.isDealerSelfUse || ''}
          onChange={val => updateField('isDealerSelfUse', val)}
          error={errors.isDealerSelfUse}
          required
        />
      </GlassCard>

      {/* 套件選擇 */}
      <GlassCard className="p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-foreground/70">
            套件選擇 <span className="text-destructive">*</span>
          </label>
          <div className="space-y-2">
            {packages.map((pkg) => (
              <GlassCheckbox
                key={pkg.value}
                name={`pkg-${pkg.value}`}
                label={pkg.label}
                checked={(formData.selectedPackages as string[]).includes(pkg.value)}
                onChange={() => handlePackageToggle(pkg.value)}
              />
            ))}
          </div>
          {errors.selectedPackages && (
            <p className="text-xs text-destructive mt-1">{errors.selectedPackages}</p>
          )}
        </div>
      </GlassCard>

      {/* 是否直接將連結寄給申請人 */}
      <GlassCard className="p-5 space-y-4">
        <GlassRadio
          name="sendDirectly"
          label="是否直接將連結寄給申請人"
          options={[
            { value: '是', label: '是' },
            { value: '否', label: '否' },
          ]}
          value={formData.sendDirectly || ''}
          onChange={val => updateField('sendDirectly', val)}
          error={errors.sendDirectly}
          required
        />
      </GlassCard>

      {/* 申請人 E-mail Address */}
      <GlassCard className="p-5 space-y-4">
        <GlassInput
          label="申請人 E-mail Address"
          name="applicantEmail"
          type="email"
          placeholder="請輸入申請人 E-mail"
          value={formData.applicantEmail || ''}
          onChange={e => updateField('applicantEmail', e.target.value)}
          error={errors.applicantEmail}
        />
        <p className="text-xs text-muted-foreground">
          發送推薦連結使用，選擇直接寄送給申請人，請務必填寫
        </p>
      </GlassCard>

      {/* 是否需要寄副本給填表人 */}
      <GlassCard className="p-5 space-y-4">
        <GlassRadio
          name="sendCopyToFiller"
          label="是否需要寄副本給填表人"
          options={[
            { value: '是', label: '是' },
            { value: '否', label: '否' },
          ]}
          value={formData.sendCopyToFiller || ''}
          onChange={val => updateField('sendCopyToFiller', val)}
          error={errors.sendCopyToFiller}
          required
        />
      </GlassCard>

      <GlassButton
        type="submit"
        variant="gradient"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        提交申請
      </GlassButton>
    </form>
  );
};

export default ReferralLinkApplicationForm;
