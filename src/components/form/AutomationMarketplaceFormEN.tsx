import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassRadio from './GlassRadio';
import GlassButton from './GlassButton';
import ConditionalField from './ConditionalField';
import ImageLightbox from './ImageLightbox';

import GlassCard from '../GlassCard';
import { AlertTriangle, ChevronLeft, ChevronRight, Send, CheckCircle, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import orgIdExample from '@/assets/org-id-example.jpg';
import renewalInstruction from '@/assets/renewal-instruction.png';

interface AutomationMarketplaceFormENProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting: boolean;
}

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'SG', label: 'Singapore' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'TH', label: 'Thailand' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'PH', label: 'Philippines' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IN', label: 'India' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'OTHER', label: 'Other' },
];

const AutomationMarketplaceFormEN: React.FC<AutomationMarketplaceFormENProps> = ({
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
    country: searchParams.get('country') || '',
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
    country: urlParams.country,
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
    // Payment (static - PayPal only)
    paymentMethod: 'paypal',
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
        newErrors.makeOrganizationId = 'Please enter your MAKE Organization ID';
      }
      if (!formData.automationModule.trim()) {
        newErrors.automationModule = 'Please enter the automation module';
      }
      if (!formData.plan) {
        newErrors.plan = 'Please select a plan';
      }
      if (!formData.unitPrice) {
        newErrors.unitPrice = 'Please enter the unit price';
      }
      if (!isRenewal && !formData.activationDate) {
        newErrors.activationDate = 'Please select an activation date';
      }
      // Lovable product requires email
      if (isLovableProduct && !formData.lovableEmail.trim()) {
        newErrors.lovableEmail = 'Please enter your Lovable login email';
      } else if (isLovableProduct && formData.lovableEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.lovableEmail)) {
        newErrors.lovableEmail = 'Please enter a valid email address';
      }
    } else if (step === 1) {
      if (!formData.nameOrCompany.trim()) {
        newErrors.nameOrCompany = 'Please enter your name or company';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email address';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (formData.email !== formData.emailConfirm) {
        newErrors.emailConfirm = 'Email addresses do not match';
      }
      if (!formData.country) {
        newErrors.country = 'Please select your country';
      }
      // Phone is optional - no validation required
    }
    // Step 2 (Payment) has no validation needed - PayPal is static

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
    // No step 2 validation needed
    onSubmit({
      ...formData,
      totalCost,
      currency: 'USD',
    });
  };

  const steps = [
    { id: 'product', title: 'Product Info' },
    { id: 'basic', title: 'Basic Info' },
    { id: 'payment', title: 'Payment' },
    { id: 'confirm', title: 'Confirm' },
  ];

  // Step 1: Basic Info
  const renderBasicInfo = () => (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">Basic Information</h2>

      <GlassInput
        label="Name or Company"
        name="nameOrCompany"
        placeholder="Enter your name or company name"
        value={formData.nameOrCompany}
        onChange={(e) => updateField('nameOrCompany', e.target.value)}
        error={errors.nameOrCompany}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="example@example.com"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
          required
        />
        <GlassInput
          label="Confirm Email Address"
          name="emailConfirm"
          type="email"
          placeholder="Re-enter your email"
          value={formData.emailConfirm}
          onChange={(e) => updateField('emailConfirm', e.target.value)}
          error={errors.emailConfirm}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassSelect
          label="Country"
          name="country"
          placeholder="Select your country"
          options={COUNTRIES}
          value={formData.country}
          onChange={(e) => updateField('country', e.target.value)}
          error={errors.country}
          required
        />
        <div className="space-y-2">
          <GlassInput
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="Enter your phone number (optional)"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Optional. We may use this to contact you about your order.
          </p>
        </div>
      </div>
    </GlassCard>
  );

  // Step 2: Product Info
  const renderProductInfo = () => (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">Product Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="Automation Module"
          name="automationModule"
          placeholder="Enter the automation module name"
          value={formData.automationModule}
          onChange={(e) => updateField('automationModule', e.target.value)}
          error={errors.automationModule}
          required
          readOnly={!!urlParams.automationModule}
        />
        <GlassRadio
          name="plan"
          label="Plan"
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
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
            label="Number of Months"
            name="purchaseMonths"
            options={[
              { value: '1', label: '1 Month' },
              { value: '2', label: '2 Months' },
              { value: '3', label: '3 Months' },
              { value: '4', label: '4 Months' },
              { value: '5', label: '5 Months' },
              { value: '6', label: '6 Months' },
              { value: '7', label: '7 Months' },
              { value: '8', label: '8 Months' },
              { value: '9', label: '9 Months' },
            ]}
            value={formData.purchaseMonths}
            onChange={(e) => updateField('purchaseMonths', e.target.value)}
            required
          />
          <div className="notice-box notice-box-amber">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p>Please note: The license key cannot be used after expiration. A new key is required for renewal.</p>
          </div>
        </div>
      </ConditionalField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="Monthly Unit Price (USD)"
          name="unitPrice"
          type="number"
          placeholder="Price"
          value={formData.unitPrice}
          onChange={(e) => updateField('unitPrice', e.target.value)}
          error={errors.unitPrice}
          readOnly={!!urlParams.unitPrice}
          required
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80">
            Total Cost <span className="text-orange-500">*</span>
          </label>
          <div className="h-11 px-4 flex items-center rounded-lg bg-muted/50 border border-border text-foreground font-semibold">
            {totalCost > 0 ? `USD ${totalCost.toLocaleString()}` : '-'}
          </div>
        </div>
      </div>

      <ConditionalField show={!isRenewal}>
        <div className="space-y-3">
          <GlassInput
            label="MAKE Organization ID"
            name="makeOrganizationId"
            placeholder="Enter your Organization ID"
            value={formData.makeOrganizationId}
            onChange={(e) => updateField('makeOrganizationId', e.target.value)}
            error={errors.makeOrganizationId}
            required
          />
          <ImageLightbox src={orgIdExample} alt="Organization ID Example" />
          <div className="notice-box notice-box-warning">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <p>Please ensure the Organization ID is correct. Once payment is complete, it cannot be changed or cancelled.</p>
          </div>
        </div>
      </ConditionalField>

      <ConditionalField show={!isRenewal}>
        <div className="space-y-1">
          <GlassInput
            label="Activation Date"
            name="activationDate"
            type="date"
            placeholder="YYYY-MM-DD"
            value={formData.activationDate}
            onChange={(e) => updateField('activationDate', e.target.value)}
            error={errors.activationDate}
            required
          />
          <p className="text-xs text-muted-foreground">
            Expected module activation date / plan start date
          </p>
        </div>
      </ConditionalField>

      <ConditionalField show={isRenewal}>
        <div className="space-y-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-sm text-foreground">
            Your new expiry date will be calculated from the original expiry date: <strong>{formData.originalExpiryDate}</strong>
          </p>
          <div className="notice-box notice-box-amber">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p>Please note: After renewal and payment, you must update your license key to continue using the service.</p>
          </div>
          <ImageLightbox src={renewalInstruction} alt="Renewal Instructions - How to update your license key" />
        </div>
      </ConditionalField>

      <ConditionalField show={isLovableProduct}>
        <div className="space-y-1">
          <GlassInput
            label="Lovable Login Email"
            name="lovableEmail"
            type="email"
            placeholder="your-email@gmail.com"
            value={formData.lovableEmail}
            onChange={(e) => updateField('lovableEmail', e.target.value)}
            error={errors.lovableEmail}
            required
          />
          <p className="text-xs text-muted-foreground">
            Must be a Google account (Lovable Migration Tool is a Google add-on)
          </p>
        </div>
      </ConditionalField>
    </GlassCard>
  );

  // Step 3: Payment Info (PayPal only - static info)
  const renderPaymentInfo = () => (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">Payment Information</h2>

      <div className="notice-box notice-box-warning">
        <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
        <p>This product uses license keys for authorization. Once a key is issued, it cannot be revoked. Refunds are not available. Please confirm your subscription period before purchasing.</p>
      </div>

      <div className="p-6 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">PayPal Payment</h3>
            <p className="text-sm text-muted-foreground">Secure payment via PayPal</p>
          </div>
        </div>
        <div className="space-y-3 text-sm text-foreground/80">
          <p>
            After submitting this form, you will receive a <strong>PayPal payment link</strong> via email.
          </p>
          <p>
            Please complete your payment through the PayPal link within 24 hours to ensure your order is processed.
          </p>
          <p className="text-xs text-muted-foreground">
            PayPal accepts major credit cards, debit cards, and PayPal balance.
          </p>
        </div>
      </div>
    </GlassCard>
  );

  // Step 4: Confirmation
  const renderConfirmation = () => {
    const countryLabel = COUNTRIES.find(c => c.value === formData.country)?.label || formData.country;
    
    return (
      <GlassCard className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="form-section-title !text-center !after:left-1/2 !after:-translate-x-1/2">Order Confirmation</h2>
          <p className="text-xs text-gray-500">Please review your information</p>
        </div>

        <div className="space-y-3">
          {/* Product Info Summary */}
          <div className="confirmation-card">
            <div className="confirmation-card-header">
              <span className="confirmation-card-number">1</span>
              <span>Product Information</span>
            </div>
            <div className="confirmation-card-content">
              {!isRenewal && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Organization ID</span>
                  <span className="confirmation-value font-mono text-xs">{formData.makeOrganizationId}</span>
                </div>
              )}
              <div className="confirmation-item">
                <span className="confirmation-label">Automation Module</span>
                <span className="confirmation-value">{formData.automationModule}</span>
              </div>
              {isLovableProduct && formData.lovableEmail && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Lovable Email</span>
                  <span className="confirmation-value">{formData.lovableEmail}</span>
                </div>
              )}
              <div className="confirmation-item">
                <span className="confirmation-label">Plan</span>
                <span className="confirmation-value">{formData.plan === 'monthly' ? 'Monthly' : 'Yearly'}</span>
              </div>
              {formData.plan === 'monthly' && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Number of Months</span>
                  <span className="confirmation-value">{formData.purchaseMonths} Month(s)</span>
                </div>
              )}
              <div className="confirmation-item">
                <span className="confirmation-label">Monthly Price</span>
                <span className="confirmation-value">USD {parseFloat(formData.unitPrice).toLocaleString()}</span>
              </div>
              {!isRenewal && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Activation Date</span>
                  <span className="confirmation-value">{formData.activationDate}</span>
                </div>
              )}
              {isRenewal && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Original Expiry Date</span>
                  <span className="confirmation-value">{formData.originalExpiryDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Basic Info Summary */}
          <div className="confirmation-card">
            <div className="confirmation-card-header">
              <span className="confirmation-card-number">2</span>
              <span>Basic Information</span>
            </div>
            <div className="confirmation-card-content">
              {!isRenewal && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Organization ID</span>
                  <span className="confirmation-value font-mono text-xs">{formData.makeOrganizationId}</span>
                </div>
              )}
              <div className="confirmation-item">
                <span className="confirmation-label">Automation Module</span>
                <span className="confirmation-value">{formData.automationModule}</span>
              </div>
              {isLovableProduct && formData.lovableEmail && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Lovable Email</span>
                  <span className="confirmation-value">{formData.lovableEmail}</span>
                </div>
              )}
              <div className="confirmation-item">
                <span className="confirmation-label">Plan</span>
                <span className="confirmation-value">{formData.plan === 'monthly' ? 'Monthly' : 'Yearly'}</span>
              </div>
              {formData.plan === 'monthly' && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Number of Months</span>
                  <span className="confirmation-value">{formData.purchaseMonths} Month(s)</span>
                </div>
              )}
              <div className="confirmation-item">
                <span className="confirmation-label">Monthly Price</span>
                <span className="confirmation-value">USD {parseFloat(formData.unitPrice).toLocaleString()}</span>
              </div>
              {!isRenewal && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Activation Date</span>
                  <span className="confirmation-value">{formData.activationDate}</span>
                </div>
              )}
              {isRenewal && (
                <div className="confirmation-item">
                  <span className="confirmation-label">Original Expiry Date</span>
                  <span className="confirmation-value">{formData.originalExpiryDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info Summary */}
          <div className="confirmation-card">
            <div className="confirmation-card-header">
              <span className="confirmation-card-number">3</span>
              <span>Payment</span>
            </div>
            <div className="confirmation-card-content">
              <div className="confirmation-item">
                <span className="confirmation-label">Payment Method</span>
                <span className="confirmation-value">PayPal</span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="confirmation-total">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground/80">Total Cost</span>
              <div className="text-right">
                <span className="text-2xl font-bold gradient-text">USD {totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center">
          By clicking "Submit Order" you agree to our Terms of Service
        </p>
      </GlassCard>
    );
  };

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
          Previous
        </GlassButton>

        {currentStep === 3 ? (
          <GlassButton
            type="button"
            variant="gradient"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            <Send className="w-4 h-4" />
            Submit Order
          </GlassButton>
        ) : (
          <GlassButton type="button" variant="gradient" onClick={goToNext}>
            Next
            <ChevronRight className="w-4 h-4" />
          </GlassButton>
        )}
      </div>
    </div>
  );
};

export default AutomationMarketplaceFormEN;
