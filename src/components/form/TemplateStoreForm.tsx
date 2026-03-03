import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassRadio from './GlassRadio';
import GlassButton from './GlassButton';
import ConditionalField from './ConditionalField';
import GlassCard from '../GlassCard';
import { ChevronLeft, ChevronRight, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateStoreFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting: boolean;
}

const TemplateStoreForm: React.FC<TemplateStoreFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);

  // Get URL parameters for pre-filling
  const urlParams = useMemo(() => ({
    template_id: searchParams.get('template_id') || '',
    template: searchParams.get('template') || '',
    price: searchParams.get('price') || searchParams.get('費用') || '0',
    referral_code: searchParams.get('ref') || searchParams.get('referral_code') || '',
    dealer_code: searchParams.get('dealer') || searchParams.get('dealer_code') || '',
    nameOrCompany: searchParams.get('nameOrCompany') || '',
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
  }), [searchParams]);

  const [formData, setFormData] = useState<Record<string, any>>({
    // Basic Info
    nameOrCompany: urlParams.nameOrCompany,
    email: urlParams.email,
    emailConfirm: '',
    phone: urlParams.phone,
    postalCode: '',
    address: '',
    // Product Info (visible)
    template: urlParams.template,
    price: urlParams.price,
    // Hidden fields
    template_id: urlParams.template_id,
    referral_code: urlParams.referral_code,
    dealer_code: urlParams.dealer_code,
    // Payment & Invoice (conditional)
    paymentMethod: '',
    invoiceType: '',
    invoiceTitle: '',
    taxId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Parse price as number
  const priceValue = useMemo(() => {
    const parsed = parseFloat(formData.price) || 0;
    return parsed;
  }, [formData.price]);

  // Check if payment section should be shown
  const showPaymentSection = priceValue > 0;

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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.nameOrCompany.trim()) {
        newErrors.nameOrCompany = '請輸入姓名或公司行號';
      }
      if (!formData.email.trim()) {
        newErrors.email = '請輸入電子郵件';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '請輸入有效的電子郵件格式';
      }
      if (!formData.emailConfirm.trim()) {
        newErrors.emailConfirm = '請再次輸入電子郵件';
      } else if (formData.email !== formData.emailConfirm) {
        newErrors.emailConfirm = '兩次輸入的電子郵件不一致';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = '請輸入聯絡電話';
      }
      if (!formData.template.trim()) {
        newErrors.template = '請輸入範本名稱';
      }
      if (formData.price === '' || formData.price === undefined) {
        newErrors.price = '請輸入費用';
      }
    } else if (step === 1 && showPaymentSection) {
      // Only validate payment fields when price > 0
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = '請選擇付款方式';
      }
      if (!formData.invoiceType) {
        newErrors.invoiceType = '請選擇發票種類';
      }
      // Only require taxId and invoiceTitle for 三聯式 (value === '1')
      if (formData.invoiceType === '1') {
        if (!formData.taxId.trim()) {
          newErrors.taxId = '請輸入統一編號';
        }
        if (!formData.invoiceTitle.trim()) {
          newErrors.invoiceTitle = '請輸入發票抬頭';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNext = () => {
    if (validateStep(currentStep)) {
      // If price is 0, skip payment step and go directly to confirm
      if (currentStep === 0 && !showPaymentSection) {
        setCurrentStep(2);
      } else if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const goToPrevious = () => {
    // If price is 0 and on confirm step, go back to basic info
    if (currentStep === 2 && !showPaymentSection) {
      setCurrentStep(0);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const lastValidationStep = showPaymentSection ? 1 : 0;
    if (validateStep(lastValidationStep)) {
      // Ensure price is always a number (0 when free, not empty string or null)
      const finalPrice = typeof priceValue === 'number' ? priceValue : 0;
      onSubmit({
        ...formData,
        price: finalPrice,
        currency: 'TWD',
      });
    }
  };

  // Dynamic steps based on price
  const steps = showPaymentSection
    ? [
        { id: 'basic', title: '基本資料' },
        { id: 'payment', title: '付款發票' },
        { id: 'confirm', title: '確認送出' },
      ]
    : [
        { id: 'basic', title: '基本資料' },
        { id: 'confirm', title: '確認送出' },
      ];

  // Step 1: Basic Info + Product
  const renderBasicInfo = () => (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">基本資料與產品</h2>

      <GlassInput
        label="姓名或公司行號"
        name="nameOrCompany"
        placeholder="個人請輸入姓名，公司行號請輸入公司名稱"
        value={formData.nameOrCompany}
        onChange={(e) => updateField('nameOrCompany', e.target.value)}
        error={errors.nameOrCompany}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="電子郵件信箱"
          name="email"
          type="email"
          placeholder="example@example.com"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
          required
        />
        <GlassInput
          label="確認電子郵件信箱"
          name="emailConfirm"
          type="email"
          placeholder="請再次輸入電子郵件"
          value={formData.emailConfirm}
          onChange={(e) => updateField('emailConfirm', e.target.value)}
          error={errors.emailConfirm}
          required
        />
      </div>

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
            placeholder="請輸入地址"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="border-t border-border/30 pt-6 mt-6">
        <h3 className="text-sm font-medium text-foreground/80 mb-4">產品資訊</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="Template（範本名稱）"
            name="template"
            placeholder="範本名稱"
            value={formData.template}
            onChange={(e) => updateField('template', e.target.value)}
            error={errors.template}
            required
            readOnly={!!urlParams.template}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground/70">
              費用 <span className="text-destructive">*</span>
            </label>
            <div className="h-11 px-4 flex items-center rounded-lg bg-muted/50 border border-border text-foreground font-semibold">
              {priceValue > 0 ? `TWD ${priceValue.toLocaleString()}` : 'TWD 0（免費）'}
            </div>
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price}</p>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );

  // Step 2: Payment & Invoice (only when price > 0)
  const renderPaymentInfo = () => (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">付款與發票資訊</h2>

      <GlassRadio
        name="paymentMethod"
        label="付款方式"
        options={[
          { value: '0', label: '7-11 超商 ibon 付款' },
          { value: '1', label: 'ATM 虛擬帳戶繳款' },
          { value: '2', label: '信用卡付款' },
        ]}
        value={formData.paymentMethod}
        onChange={(value) => updateField('paymentMethod', value)}
        error={errors.paymentMethod}
        required
      />

      <GlassRadio
        name="invoiceType"
        label="發票種類"
        options={[
          { value: '0', label: '二聯式發票（個人）' },
          { value: '1', label: '三聯式發票（公司行號）' },
        ]}
        value={formData.invoiceType}
        onChange={(value) => updateField('invoiceType', value)}
        error={errors.invoiceType}
        required
      />

      <ConditionalField show={formData.invoiceType === '1'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="發票抬頭"
            name="invoiceTitle"
            placeholder="請輸入完整公司名稱"
            value={formData.invoiceTitle}
            onChange={(e) => updateField('invoiceTitle', e.target.value)}
            error={errors.invoiceTitle}
            required
          />
          <div className="space-y-1">
            <GlassInput
              label="統一編號"
              name="taxId"
              placeholder="請輸入統一編號"
              value={formData.taxId}
              onChange={(e) => updateField('taxId', e.target.value)}
              error={errors.taxId}
              required
            />
            <p className="text-xs text-muted-foreground">
              選擇開立三聯式發票時請務必提供
            </p>
          </div>
        </div>
      </ConditionalField>
    </GlassCard>
  );

  // Step 3: Confirmation
  const renderConfirmation = () => (
    <GlassCard className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-primary" />
        </div>
        <h2 className="form-section-title !text-center !after:left-1/2 !after:-translate-x-1/2">訂單確認</h2>
        <p className="text-xs text-gray-500">請確認以下資訊無誤</p>
      </div>

      <div className="space-y-3">
        {/* Basic Info Summary */}
        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <span className="confirmation-card-number">1</span>
            <span>基本資料</span>
          </div>
          <div className="confirmation-card-content">
            <div className="confirmation-item">
              <span className="confirmation-label">姓名/公司</span>
              <span className="confirmation-value">{formData.nameOrCompany}</span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">電子郵件</span>
              <span className="confirmation-value">{formData.email}</span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">聯絡電話</span>
              <span className="confirmation-value">{formData.phone}</span>
            </div>
            {(formData.postalCode || formData.address) && (
              <div className="confirmation-item">
                <span className="confirmation-label">地址</span>
                <span className="confirmation-value">
                  {formData.postalCode} {formData.address}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info Summary */}
        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <span className="confirmation-card-number">2</span>
            <span>產品資訊</span>
          </div>
          <div className="confirmation-card-content">
            <div className="confirmation-item">
              <span className="confirmation-label">Template</span>
              <span className="confirmation-value">{formData.template}</span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">費用</span>
              <span className="confirmation-value font-semibold text-primary">
                {priceValue > 0 ? `TWD ${priceValue.toLocaleString()}` : 'TWD 0（免費）'}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Info Summary (only if price > 0) */}
        <ConditionalField show={showPaymentSection}>
          <div className="confirmation-card">
            <div className="confirmation-card-header">
              <span className="confirmation-card-number">3</span>
              <span>付款與發票</span>
            </div>
            <div className="confirmation-card-content">
              <div className="confirmation-item">
                <span className="confirmation-label">付款方式</span>
                <span className="confirmation-value">
                  {formData.paymentMethod === '0' && '7-11 超商 ibon 付款'}
                  {formData.paymentMethod === '1' && 'ATM 虛擬帳戶繳款'}
                  {formData.paymentMethod === '2' && '信用卡付款'}
                </span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">發票種類</span>
                <span className="confirmation-value">
                  {formData.invoiceType === '0' && '二聯式發票（個人）'}
                  {formData.invoiceType === '1' && '三聯式發票（公司行號）'}
                </span>
              </div>
              {formData.invoiceType === '1' && (
                <>
                  <div className="confirmation-item">
                    <span className="confirmation-label">發票抬頭</span>
                    <span className="confirmation-value">{formData.invoiceTitle}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="confirmation-label">統一編號</span>
                    <span className="confirmation-value">{formData.taxId}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </ConditionalField>
      </div>
    </GlassCard>
  );

  // Determine which step content to render
  const getStepContent = () => {
    if (showPaymentSection) {
      switch (currentStep) {
        case 0:
          return renderBasicInfo();
        case 1:
          return renderPaymentInfo();
        case 2:
          return renderConfirmation();
        default:
          return null;
      }
    } else {
      switch (currentStep) {
        case 0:
          return renderBasicInfo();
        case 2:
          return renderConfirmation();
        default:
          return null;
      }
    }
  };

  const isLastStep = showPaymentSection ? currentStep === 2 : currentStep === 2;
  const isFirstStep = currentStep === 0;

  return (
    <div className="space-y-6">
      {/* Hidden inputs */}
      <input type="hidden" name="template_id" value={formData.template_id} />
      <input type="hidden" name="referral_code" value={formData.referral_code} />
      <input type="hidden" name="dealer_code" value={formData.dealer_code} />

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((step, index) => {
          // Map display index to actual step index
          const actualIndex = showPaymentSection ? index : (index === 0 ? 0 : 2);
          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300',
                    currentStep === actualIndex
                      ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30'
                      : currentStep > actualIndex
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/50 text-muted-foreground'
                  )}
                >
                  {index + 1}
                </div>
                <span
                  className={cn(
                    'text-xs hidden sm:inline transition-colors',
                    currentStep === actualIndex
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 h-px transition-colors',
                    currentStep > actualIndex ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      {getStepContent()}

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <GlassButton
          type="button"
          variant="outline"
          onClick={goToPrevious}
          disabled={isFirstStep}
          className={cn(isFirstStep && 'opacity-0 pointer-events-none')}
        >
          <ChevronLeft className="w-4 h-4" />
          上一步
        </GlassButton>

        {isLastStep ? (
          <GlassButton
            type="button"
            variant="gradient"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            <Send className="w-4 h-4" />
            送出訂單
          </GlassButton>
        ) : (
          <GlassButton type="button" variant="gradient" onClick={goToNext}>
            下一步
            <ChevronRight className="w-4 h-4" />
          </GlassButton>
        )}
      </div>
    </div>
  );
};

export default TemplateStoreForm;
