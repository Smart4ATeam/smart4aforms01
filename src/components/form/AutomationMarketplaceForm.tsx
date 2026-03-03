import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassRadio from './GlassRadio';
import GlassButton from './GlassButton';
import ConditionalField from './ConditionalField';
import ImageLightbox from './ImageLightbox';

import GlassCard from '../GlassCard';
import { AlertTriangle, ChevronLeft, ChevronRight, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import orgIdExample from '@/assets/org-id-example.jpg';
import renewalInstruction from '@/assets/renewal-instruction.png';

interface AutomationMarketplaceFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting: boolean;
}

const AutomationMarketplaceForm: React.FC<AutomationMarketplaceFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);

  // Get URL parameters for pre-filling
  const urlParams = useMemo(() => ({
    distributorId: searchParams.get('distributorId') || '',
    referralCode: searchParams.get('referralCode') || '',
    automationModule: searchParams.get('module') || '',
    appId: searchParams.get('appId') || '',
    plan: searchParams.get('plan') || '',
    unitPrice: searchParams.get('unitPrice') || '',
    originalExpiryDate: searchParams.get('originalExpiryDate') || '',
    originalKey: searchParams.get('originalKey') || '',
    originalOrderNumber: searchParams.get('originalOrderNumber') || '',
    nameOrCompany: searchParams.get('nameOrCompany') || '',
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
    makeOrganizationId: searchParams.get('makeOrganizationId') || '',
    lovableEmail: searchParams.get('lovableEmail') || '',
  }), [searchParams]);

  const isRenewal = !!urlParams.originalExpiryDate;

  const [formData, setFormData] = useState<Record<string, any>>({
    // Basic Info
    nameOrCompany: urlParams.nameOrCompany,
    email: urlParams.email,
    emailConfirm: '',
    phone: urlParams.phone,
    postalCode: '',
    address: '',
    // Hidden fields
    distributorId: urlParams.distributorId,
    referralCode: urlParams.referralCode,
    originalExpiryDate: urlParams.originalExpiryDate,
    originalKey: urlParams.originalKey,
    originalOrderNumber: urlParams.originalOrderNumber,
    appId: urlParams.appId,
    // Product Info
    makeOrganizationId: urlParams.makeOrganizationId,
    automationModule: urlParams.automationModule,
    plan: urlParams.plan,
    purchaseMonths: '1',
    unitPrice: urlParams.unitPrice,
    activationDate: '',
    // Lovable specific field
    lovableEmail: urlParams.lovableEmail,
    // Payment Info
    paymentMethod: '',
    invoiceType: '',
    invoiceTitle: '',
    taxId: '',
  });

  // Check if Lovable product requires additional field (accepts both URL format and display format)
  const isLovableProduct = (formData.automationModule === 'Lovable Migration Tool' || formData.automationModule === 'LovableMigrationTool') && formData.appId === 'lovable2025';

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate total cost
  const totalCost = useMemo(() => {
    const price = parseFloat(formData.unitPrice) || 0;
    if (formData.plan === 'yearly') {
      return price * 10;
    } else if (formData.plan === 'monthly') {
      const months = parseInt(formData.purchaseMonths) || 1;
      return price * months;
    }
    return 0;
  }, [formData.unitPrice, formData.plan, formData.purchaseMonths]);

  // Track if user has manually edited the invoice title
  const [invoiceTitleManuallyEdited, setInvoiceTitleManuallyEdited] = useState(false);

  // Sync invoice title with name/company (only if not manually edited)
  useEffect(() => {
    if (formData.nameOrCompany && !invoiceTitleManuallyEdited) {
      setFormData(prev => ({ ...prev, invoiceTitle: prev.nameOrCompany }));
    }
  }, [formData.nameOrCompany, invoiceTitleManuallyEdited]);

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
      if (!isRenewal && !formData.makeOrganizationId.trim()) {
        newErrors.makeOrganizationId = '請輸入 MAKE Organization ID';
      }
      if (!formData.automationModule.trim()) {
        newErrors.automationModule = '請輸入自動化模組';
      }
      if (!formData.plan) {
        newErrors.plan = '請選擇方案';
      }
      if (!formData.unitPrice) {
        newErrors.unitPrice = '請輸入方案月單價';
      }
      if (!isRenewal && !formData.activationDate) {
        newErrors.activationDate = '請選擇啟用日期';
      }
      // Lovable product requires email
      if (isLovableProduct && !formData.lovableEmail.trim()) {
        newErrors.lovableEmail = '請輸入 Lovable 登入用 E-mail 帳號';
      } else if (isLovableProduct && formData.lovableEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.lovableEmail)) {
        newErrors.lovableEmail = '請輸入有效的電子郵件格式';
      }
    } else if (step === 1) {
      if (!formData.nameOrCompany.trim()) {
        newErrors.nameOrCompany = '請輸入姓名或公司行號';
      }
      if (!formData.email.trim()) {
        newErrors.email = '請輸入電子郵件';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '請輸入有效的電子郵件格式';
      }
      if (formData.email !== formData.emailConfirm) {
        newErrors.emailConfirm = '電子郵件不一致';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = '請輸入聯絡電話';
      }
    } else if (step === 2) {
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = '請選擇付款方式';
      }
      if (!formData.invoiceType) {
        newErrors.invoiceType = '請選擇發票種類';
      }
      if (!formData.invoiceTitle.trim()) {
        newErrors.invoiceTitle = '請輸入發票抬頭';
      }
      if (formData.invoiceType === '1' && !formData.taxId.trim()) {
        newErrors.taxId = '請輸入統一編號';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNext = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(2)) {
      onSubmit({
        ...formData,
        totalCost,
        currency: 'TWD',
      });
    }
  };

  const steps = [
    { id: 'product', title: '產品資訊' },
    { id: 'basic', title: '基本資料' },
    { id: 'payment', title: '付款發票' },
    { id: 'confirm', title: '確認送出' },
  ];

  // Step 1: Basic Info
  const renderBasicInfo = () => (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">基本資料</h2>

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

      <div className="space-y-2">
        <GlassInput
          label="聯絡電話（行動電話）"
          name="phone"
          type="tel"
          placeholder="請輸入您的行動電話"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          error={errors.phone}
          required
        />
        <p className="text-xs text-muted-foreground">
          表單送出後，我們會將付款連結以簡訊的方式發送給您，請務必填寫正確的電話號碼。
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
            placeholder="請輸入地址"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
          />
        </div>
      </div>
    </GlassCard>
  );

  // Step 2: Product Info
  const renderProductInfo = () => (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">產品資訊</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="自動化模組"
          name="automationModule"
          placeholder="請輸入自動化模組名稱"
          value={formData.automationModule}
          onChange={(e) => updateField('automationModule', e.target.value)}
          error={errors.automationModule}
          required
          readOnly={!!urlParams.automationModule}
        />
        <GlassRadio
          name="plan"
          label="方案"
          options={[
            { value: 'monthly', label: '月繳' },
            { value: 'yearly', label: '年繳' },
          ]}
          value={formData.plan}
          onChange={(value) => updateField('plan', value)}
          error={errors.plan}
          required
        />
      </div>

      <ConditionalField show={formData.plan === 'monthly'}>
        <div className="space-y-3">
          <GlassSelect
            label="購買月數"
            name="purchaseMonths"
            options={[
              { value: '1', label: '1 個月' },
              { value: '2', label: '2 個月' },
              { value: '3', label: '3 個月' },
              { value: '4', label: '4 個月' },
              { value: '5', label: '5 個月' },
              { value: '6', label: '6 個月' },
              { value: '7', label: '7 個月' },
              { value: '8', label: '8 個月' },
              { value: '9', label: '9 個月' },
            ]}
            value={formData.purchaseMonths}
            onChange={(e) => updateField('purchaseMonths', e.target.value)}
            required
          />
          <div className="notice-box notice-box-amber">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p>請注意，金鑰到期後將無法續用。到期後若續訂，需更換為新的金鑰才能繼續使用。</p>
          </div>
        </div>
      </ConditionalField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="方案月單價"
          name="unitPrice"
          type="number"
          placeholder="單價"
          value={formData.unitPrice}
          onChange={(e) => updateField('unitPrice', e.target.value)}
          error={errors.unitPrice}
          readOnly={!!urlParams.unitPrice}
          required
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80">
            費用總計 <span className="text-orange-500">*</span>
          </label>
          <div className="h-11 px-4 flex items-center rounded-lg bg-muted/50 border border-border text-foreground font-semibold">
            {totalCost > 0 ? `TWD ${totalCost.toLocaleString()}` : '-'}
          </div>
        </div>
      </div>

      <ConditionalField show={!isRenewal}>
        <div className="space-y-3">
          <GlassInput
            label="MAKE Organization ID"
            name="makeOrganizationId"
            placeholder="請輸入您的 Organization ID"
            value={formData.makeOrganizationId}
            onChange={(e) => updateField('makeOrganizationId', e.target.value)}
            error={errors.makeOrganizationId}
            required
          />
          <ImageLightbox src={orgIdExample} alt="Organization ID 範例" />
          <div className="notice-box notice-box-warning">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <p>請務必確認填寫正確的 Organization ID，下單付款後將無法更改，亦無法取消</p>
          </div>
        </div>
      </ConditionalField>

      <ConditionalField show={!isRenewal}>
        <div className="space-y-1">
          <GlassInput
            label="啟用日期"
            name="activationDate"
            type="date"
            placeholder="YYYY-MM-DD"
            value={formData.activationDate}
            onChange={(e) => updateField('activationDate', e.target.value)}
            error={errors.activationDate}
            required
          />
          <p className="text-xs text-muted-foreground">
            模組預計啟用日期 / 方案起始日
          </p>
        </div>
      </ConditionalField>

      <ConditionalField show={isRenewal}>
        <div className="space-y-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-sm text-foreground">
            新的到期日將從原到期日 <strong>{formData.originalExpiryDate}</strong> 起計算。
          </p>
          <div className="notice-box notice-box-amber">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p>請留意，續訂並完成付款後，請立即更換金鑰以繼續使用。</p>
          </div>
          <ImageLightbox src={renewalInstruction} alt="續約說明 - 如何更換金鑰" />
        </div>
      </ConditionalField>

      <ConditionalField show={isLovableProduct}>
        <div className="space-y-1">
          <GlassInput
            label="Lovable 登入用 E-mail 帳號"
            name="lovableEmail"
            type="email"
            placeholder="your-email@gmail.com"
            value={formData.lovableEmail}
            onChange={(e) => updateField('lovableEmail', e.target.value)}
            error={errors.lovableEmail}
            required
          />
          <p className="text-xs text-muted-foreground">
            必須使用 Google 帳號（Lovable Migration Tool 為 Google 插件）
          </p>
        </div>
      </ConditionalField>
    </GlassCard>
  );

  // Step 3: Payment & Invoice
  const renderPaymentInfo = () => (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">付款與發票資訊</h2>

      <div className="notice-box notice-box-warning">
        <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
        <p>本套件為採用序號方式發行授權，序號一經發出即無法回收，因此無法提供退款服務。請您在購買前務必確認所需的授權使用期間，以確保您的權益。</p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="發票抬頭"
          name="invoiceTitle"
          placeholder="個人請輸入姓名，公司行號請輸入完整公司名稱"
          value={formData.invoiceTitle}
          onChange={(e) => {
            setInvoiceTitleManuallyEdited(true);
            updateField('invoiceTitle', e.target.value);
          }}
          error={errors.invoiceTitle}
          required
        />
        <ConditionalField show={formData.invoiceType === '1'}>
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
        </ConditionalField>
      </div>
    </GlassCard>
  );

  // Step 4: Confirmation
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
        {/* Product Info Summary */}
        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <span className="confirmation-card-number">1</span>
            <span>產品資訊</span>
          </div>
          <div className="confirmation-card-content">
            {!isRenewal && (
              <div className="confirmation-item">
                <span className="confirmation-label">Organization ID</span>
                <span className="confirmation-value font-mono text-xs">{formData.makeOrganizationId}</span>
              </div>
            )}
            <div className="confirmation-item">
              <span className="confirmation-label">自動化模組</span>
              <span className="confirmation-value">{formData.automationModule}</span>
            </div>
            {isLovableProduct && formData.lovableEmail && (
              <div className="confirmation-item">
                <span className="confirmation-label">Lovable E-mail</span>
                <span className="confirmation-value">{formData.lovableEmail}</span>
              </div>
            )}
            <div className="confirmation-item">
              <span className="confirmation-label">方案</span>
              <span className="confirmation-value">{formData.plan === 'monthly' ? '月繳' : '年繳'}</span>
            </div>
            {formData.plan === 'monthly' && (
              <div className="confirmation-item">
                <span className="confirmation-label">購買月數</span>
                <span className="confirmation-value">{formData.purchaseMonths} 個月</span>
              </div>
            )}
            <div className="confirmation-item">
              <span className="confirmation-label">月單價</span>
              <span className="confirmation-value">TWD {parseFloat(formData.unitPrice).toLocaleString()}</span>
            </div>
            {!isRenewal && (
              <div className="confirmation-item">
                <span className="confirmation-label">啟用日期</span>
                <span className="confirmation-value">{formData.activationDate}</span>
              </div>
            )}
            {isRenewal && (
              <div className="confirmation-item">
                <span className="confirmation-label">原到期日</span>
                <span className="confirmation-value">{formData.originalExpiryDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Basic Info Summary */}
        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <span className="confirmation-card-number">2</span>
            <span>基本資料</span>
          </div>
          <div className="confirmation-card-content">
            {!isRenewal && (
              <div className="confirmation-item">
                <span className="confirmation-label">Organization ID</span>
                <span className="confirmation-value font-mono text-xs">{formData.makeOrganizationId}</span>
              </div>
            )}
            <div className="confirmation-item">
              <span className="confirmation-label">自動化模組</span>
              <span className="confirmation-value">{formData.automationModule}</span>
            </div>
            {isLovableProduct && formData.lovableEmail && (
              <div className="confirmation-item">
                <span className="confirmation-label">Lovable E-mail</span>
                <span className="confirmation-value">{formData.lovableEmail}</span>
              </div>
            )}
            <div className="confirmation-item">
              <span className="confirmation-label">方案</span>
              <span className="confirmation-value">{formData.plan === 'monthly' ? '月繳' : '年繳'}</span>
            </div>
            {formData.plan === 'monthly' && (
              <div className="confirmation-item">
                <span className="confirmation-label">購買月數</span>
                <span className="confirmation-value">{formData.purchaseMonths} 個月</span>
              </div>
            )}
            <div className="confirmation-item">
              <span className="confirmation-label">月單價</span>
              <span className="confirmation-value">TWD {parseFloat(formData.unitPrice).toLocaleString()}</span>
            </div>
            {!isRenewal && (
              <div className="confirmation-item">
                <span className="confirmation-label">啟用日期</span>
                <span className="confirmation-value">{formData.activationDate}</span>
              </div>
            )}
            {isRenewal && (
              <div className="confirmation-item">
                <span className="confirmation-label">原到期日</span>
                <span className="confirmation-value">{formData.originalExpiryDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Info Summary */}
        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <span className="confirmation-card-number">3</span>
            <span>付款與發票</span>
          </div>
          <div className="confirmation-card-content">
            <div className="confirmation-item">
              <span className="confirmation-label">付款方式</span>
              <span className="confirmation-value">
                {formData.paymentMethod === '0' ? '7-11 超商 ibon' : 
                 formData.paymentMethod === '1' ? 'ATM 虛擬帳戶' : '信用卡'}
              </span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">發票種類</span>
              <span className="confirmation-value">
                {formData.invoiceType === '0' ? '二聯式（個人）' : '三聯式（公司）'}
              </span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">發票抬頭</span>
              <span className="confirmation-value">{formData.invoiceTitle}</span>
            </div>
            {formData.invoiceType === '1' && (
              <div className="confirmation-item">
                <span className="confirmation-label">統一編號</span>
                <span className="confirmation-value font-mono">{formData.taxId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="confirmation-total">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground/80">費用總計</span>
            <div className="text-right">
              <span className="text-2xl font-bold gradient-text">TWD {totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 text-center">
        點擊「提交訂單」即表示您同意我們的服務條款
      </p>
    </GlassCard>
  );

  const stepContents = [
    renderProductInfo,
    renderBasicInfo,
    renderPaymentInfo,
    renderConfirmation,
  ];

  return (
    <div className="space-y-8">
      {/* Hidden fields */}
      <input type="hidden" name="distributorId" value={formData.distributorId} />
      <input type="hidden" name="referralCode" value={formData.referralCode} />
      <input type="hidden" name="originalExpiryDate" value={formData.originalExpiryDate} />
      <input type="hidden" name="originalKey" value={formData.originalKey} />
      <input type="hidden" name="appId" value={formData.appId} />

      {/* Progress indicator - Pills style */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  'step-pill',
                  isActive && 'step-pill-active',
                  isCompleted && 'step-pill-completed',
                  !isActive && !isCompleted && 'step-pill-inactive'
                )}
              >
                <span className="step-pill-number">{index + 1}</span>
                <span className="step-pill-title">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    'w-6 h-[2px] rounded-full transition-colors duration-300 hidden sm:block',
                    index < currentStep ? 'bg-[hsl(270_50%_45%)]' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      <div className="animate-fade-in" key={currentStep}>
        {stepContents[currentStep]()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-4">
        <GlassButton
          type="button"
          variant="outline"
          onClick={goToPrevious}
          disabled={currentStep === 0}
          className={cn(currentStep === 0 && 'invisible')}
        >
          <ChevronLeft className="w-4 h-4" />
          上一步
        </GlassButton>

        {currentStep === 3 ? (
          <GlassButton
            type="button"
            variant="gradient"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            <Send className="w-4 h-4" />
            提交訂單
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

export default AutomationMarketplaceForm;
