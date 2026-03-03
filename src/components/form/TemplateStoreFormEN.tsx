import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import { AlertTriangle, ChevronLeft, ChevronRight, Send, CheckCircle, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateStoreFormENProps {
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
  { value: 'TW', label: 'Taiwan' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'CN', label: 'China' },
  { value: 'OTHER', label: 'Other' },
];

const TemplateStoreFormEN: React.FC<TemplateStoreFormENProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);

  // Get URL parameters for pre-filling
  const urlParams = useMemo(() => ({
    template_id: searchParams.get('template_id') || '',
    template: searchParams.get('template') || '',
    price: searchParams.get('price') || '0',
    referral_code: searchParams.get('ref') || searchParams.get('referral_code') || '',
    dealer_code: searchParams.get('dealer') || searchParams.get('dealer_code') || '',
    nameOrCompany: searchParams.get('nameOrCompany') || '',
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
    country: searchParams.get('country') || '',
  }), [searchParams]);

  const [formData, setFormData] = useState<Record<string, any>>({
    // Basic Info
    nameOrCompany: urlParams.nameOrCompany,
    email: urlParams.email,
    emailConfirm: '',
    phone: urlParams.phone,
    country: urlParams.country,
    // Product Info (visible)
    template: urlParams.template,
    price: urlParams.price,
    // Hidden fields
    template_id: urlParams.template_id,
    referral_code: urlParams.referral_code,
    dealer_code: urlParams.dealer_code,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Parse price as number
  const priceValue = useMemo(() => {
    const parsed = parseFloat(formData.price) || 0;
    return parsed;
  }, [formData.price]);

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
        newErrors.nameOrCompany = 'Please enter your name or company';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email address';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.emailConfirm.trim()) {
        newErrors.emailConfirm = 'Please confirm your email address';
      } else if (formData.email !== formData.emailConfirm) {
        newErrors.emailConfirm = 'Email addresses do not match';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Please enter your phone number';
      }
      if (!formData.country) {
        newErrors.country = 'Please select your country';
      }
      if (!formData.template.trim()) {
        newErrors.template = 'Please enter the template name';
      }
      if (formData.price === '' || formData.price === undefined) {
        newErrors.price = 'Please enter the price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNext = () => {
    if (validateStep(currentStep) && currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      price: priceValue,
      currency: 'USD',
    });
  };

  const steps = [
    { id: 'basic', title: 'Basic Info' },
    { id: 'payment', title: 'Payment' },
    { id: 'confirm', title: 'Confirm' },
  ];

  // Step 1: Basic Info + Product
  const renderBasicInfo = () => (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">Basic Information & Product</h2>

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
        <GlassInput
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          error={errors.phone}
          required
        />
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
      </div>

      {/* Product Info */}
      <div className="border-t border-border/30 pt-6 mt-6">
        <h3 className="text-sm font-medium text-foreground/80 mb-4">Product Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="Template"
            name="template"
            placeholder="Template name"
            value={formData.template}
            onChange={(e) => updateField('template', e.target.value)}
            error={errors.template}
            required
            readOnly={!!urlParams.template}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground/70">
              Price <span className="text-destructive">*</span>
            </label>
            <div className="h-11 px-4 flex items-center rounded-lg bg-muted/50 border border-border text-foreground font-semibold">
              {priceValue > 0 ? `USD ${priceValue.toLocaleString()}` : 'USD 0 (Free)'}
            </div>
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price}</p>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );

  // Step 2: Payment Info (PayPal only - static info)
  const renderPaymentInfo = () => (
    <GlassCard className="space-y-6">
      <h2 className="form-section-title">Payment Information</h2>

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
            Please complete the payment within 24 hours to ensure your order is processed.
          </p>
          <p>
            This is a digital product delivered automatically after successful payment.
          </p>
          <p className="text-xs text-muted-foreground">
            PayPal accepts major credit cards, debit cards, and PayPal balance.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/80">
            <p className="font-medium text-destructive mb-1">No Refund Policy</p>
            <p>This is a digital product delivered automatically after payment. All sales are final. Refunds are not available once the payment is completed. Please make sure this template meets your needs before purchasing.</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );

  // Step 3: Confirmation
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
          {/* Basic Info Summary */}
          <div className="confirmation-card">
            <div className="confirmation-card-header">
              <span className="confirmation-card-number">1</span>
              <span>Basic Information</span>
            </div>
            <div className="confirmation-card-content">
              <div className="confirmation-item">
                <span className="confirmation-label">Name/Company</span>
                <span className="confirmation-value">{formData.nameOrCompany}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">Email</span>
                <span className="confirmation-value">{formData.email}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">Phone</span>
                <span className="confirmation-value">{formData.phone}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">Country</span>
                <span className="confirmation-value">{countryLabel}</span>
              </div>
            </div>
          </div>

          {/* Product Info Summary */}
          <div className="confirmation-card">
            <div className="confirmation-card-header">
              <span className="confirmation-card-number">2</span>
              <span>Product Information</span>
            </div>
            <div className="confirmation-card-content">
              <div className="confirmation-item">
                <span className="confirmation-label">Template</span>
                <span className="confirmation-value">{formData.template}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">Price</span>
                <span className="confirmation-value font-semibold text-primary">
                  {priceValue > 0 ? `USD ${priceValue.toLocaleString()}` : 'USD 0 (Free)'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="confirmation-card">
            <div className="confirmation-card-header">
              <span className="confirmation-card-number">3</span>
              <span>Payment</span>
            </div>
            <div className="confirmation-card-content">
              <div className="confirmation-item">
                <span className="confirmation-label">Method</span>
                <span className="confirmation-value">PayPal</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">Refund Policy</span>
                <span className="confirmation-value text-destructive">No Refunds</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    );
  };

  const getStepContent = () => {
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
  };

  const isLastStep = currentStep === 2;
  const isFirstStep = currentStep === 0;

  return (
    <div className="space-y-6">
      {/* Hidden inputs */}
      <input type="hidden" name="template_id" value={formData.template_id} />
      <input type="hidden" name="referral_code" value={formData.referral_code} />
      <input type="hidden" name="dealer_code" value={formData.dealer_code} />

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300',
                  currentStep === index
                    ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30'
                    : currentStep > index
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted/50 text-muted-foreground'
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  'text-xs hidden sm:inline transition-colors',
                  currentStep === index
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
                  currentStep > index ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </React.Fragment>
        ))}
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
          Previous
        </GlassButton>

        {isLastStep ? (
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

export default TemplateStoreFormEN;
