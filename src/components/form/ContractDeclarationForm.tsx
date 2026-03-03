import React, { useState } from 'react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import GlassInput from './GlassInput';
import GlassRadio from './GlassRadio';
import SignaturePad from './SignaturePad';
import GlassButton from './GlassButton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface IndividualData {
  signerType: 'individual';
  fullName: string;
  nationalId: string;
  email: string;
  confirmEmail: string;
  phone?: string;
  signature: string;
}

interface CompanyData {
  signerType: 'company';
  companyName: string;
  taxId: string;
  representativeName: string;
  representativeTitle: string;
  email: string;
  confirmEmail: string;
  signature: string;
}

type FormData = IndividualData | CompanyData;

interface FormErrors {
  [key: string]: string;
}

interface ContractDeclarationFormProps {
  title?: string;
  description?: string;
  agreementContent?: string;
  webhookUrl?: string;
  onSubmit?: (data: FormData & { signingDate: string }) => void;
  onSuccess?: () => void;
  className?: string;
}

const ContractDeclarationForm: React.FC<ContractDeclarationFormProps> = ({
  title = '切結書／合約',
  description = '請詳閱以下條款並完成簽署',
  agreementContent = '請在此處填入合約或切結書內容...',
  webhookUrl,
  onSubmit,
  onSuccess,
  className,
}) => {
  const [signerType, setSignerType] = useState<'individual' | 'company'>('individual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [signature, setSignature] = useState('');
  
  // Individual fields
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  
  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [representativeTitle, setRepresentativeTitle] = useState('');
  
  // Shared fields
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  
  const signingDate = format(new Date(), 'yyyy年MM月dd日', { locale: zhTW });

  const resetForm = () => {
    setFullName('');
    setNationalId('');
    setPhone('');
    setCompanyName('');
    setTaxId('');
    setRepresentativeName('');
    setRepresentativeTitle('');
    setEmail('');
    setConfirmEmail('');
    setSignature('');
    setErrors({});
  };

  const handleSignerTypeChange = (value: string) => {
    setSignerType(value as 'individual' | 'company');
    resetForm();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (signerType === 'individual') {
      if (!fullName.trim()) newErrors.fullName = '請輸入姓名';
      if (!nationalId.trim()) newErrors.nationalId = '請輸入身分證字號';
    } else {
      if (!companyName.trim()) newErrors.companyName = '請輸入公司名稱';
      if (!taxId.trim()) newErrors.taxId = '請輸入統一編號';
      if (!representativeName.trim()) newErrors.representativeName = '請輸入代表人姓名';
      if (!representativeTitle.trim()) newErrors.representativeTitle = '請輸入代表人職稱';
    }

    if (!email.trim()) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '請輸入有效的電子郵件';
    }

    if (!confirmEmail.trim()) {
      newErrors.confirmEmail = '請再次輸入電子郵件';
    } else if (email !== confirmEmail) {
      newErrors.confirmEmail = '電子郵件不一致';
    }

    if (!signature) {
      newErrors.signature = '請簽名';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    const baseData = {
      email,
      confirmEmail,
      signature,
      signingDate,
    };

    const submissionData: (FormData & { signingDate: string }) = signerType === 'individual'
      ? {
          signerType: 'individual',
          fullName,
          nationalId,
          phone,
          ...baseData,
        }
      : {
          signerType: 'company',
          companyName,
          taxId,
          representativeName,
          representativeTitle,
          ...baseData,
        };

    try {
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        });
      }

      if (onSubmit) {
        onSubmit(submissionData);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const signerTypeOptions = [
    { value: 'individual', label: '個人' },
    { value: 'company', label: '公司／法人' },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Title Section */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* B. Signing Identity Selection */}
        <div className="space-y-4">
          <GlassRadio
            name="signerType"
            label="簽署身份"
            options={signerTypeOptions}
            value={signerType}
            onChange={handleSignerTypeChange}
            required
          />
        </div>

        {/* C. Signer Information - Individual */}
        {signerType === 'individual' && (
          <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-card/30">
            <p className="text-xs font-medium text-muted-foreground mb-3">個人資料</p>
            
            <GlassInput
              label="姓名"
              placeholder="請輸入您的全名"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
            />

            <GlassInput
              label="身分證字號"
              placeholder="請輸入身分證字號"
              required
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              error={errors.nationalId}
            />

            <GlassInput
              label="電子郵件"
              type="email"
              placeholder="請輸入電子郵件"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <GlassInput
              label="確認電子郵件"
              type="email"
              placeholder="請再次輸入電子郵件"
              required
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              error={errors.confirmEmail}
            />

            <GlassInput
              label="電話號碼"
              type="tel"
              placeholder="請輸入電話號碼（選填）"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        )}

        {/* C. Signer Information - Company */}
        {signerType === 'company' && (
          <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-card/30">
            <p className="text-xs font-medium text-muted-foreground mb-3">公司／法人資料</p>
            
            <GlassInput
              label="公司名稱"
              placeholder="請輸入公司全稱"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={errors.companyName}
            />

            <GlassInput
              label="統一編號"
              placeholder="請輸入統一編號"
              required
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              error={errors.taxId}
            />

            <GlassInput
              label="代表人姓名"
              placeholder="請輸入代表人姓名"
              required
              value={representativeName}
              onChange={(e) => setRepresentativeName(e.target.value)}
              error={errors.representativeName}
            />

            <GlassInput
              label="代表人職稱"
              placeholder="請輸入代表人職稱"
              required
              value={representativeTitle}
              onChange={(e) => setRepresentativeTitle(e.target.value)}
              error={errors.representativeTitle}
            />

            <GlassInput
              label="電子郵件"
              type="email"
              placeholder="請輸入電子郵件"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <GlassInput
              label="確認電子郵件"
              type="email"
              placeholder="請再次輸入電子郵件"
              required
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              error={errors.confirmEmail}
            />
          </div>
        )}

        {/* D. Agreement / Declaration Content */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground/70">
            合約／切結書內容 <span className="text-destructive">*</span>
          </p>
          <ScrollArea className="h-48 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {agreementContent}
            </div>
          </ScrollArea>
          <p className="text-xs text-muted-foreground">
            請仔細閱讀上述條款，簽署即表示同意遵守
          </p>
        </div>

        {/* E. Signature Section */}
        <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-card/30">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">簽署資訊</p>
            <p className="text-xs text-foreground/70">
              簽署日期：<span className="font-medium">{signingDate}</span>
            </p>
          </div>

          <SignaturePad
            label="電子簽名"
            required
            onSignatureChange={setSignature}
            error={errors.signature}
          />
        </div>

        {/* Submit Button */}
        <GlassButton
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? '提交中...' : '確認簽署'}
        </GlassButton>
      </form>
    </div>
  );
};

export default ContractDeclarationForm;
