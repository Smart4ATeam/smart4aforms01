import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  GlassInput,
  GlassSelect,
  GlassTextarea,
  GlassCheckbox,
  GlassRadio,
  GlassButton,
  SignaturePad,
  MultiStepForm,
  ConditionalField,
  AutomationMarketplaceForm,
  AutomationMarketplaceFormEN,
  StudentProductClaimForm,
  TemplateStoreForm,
  TemplateStoreFormEN,
  LearningVideoConfidentialityForm,
  CourseRetrainingForm,
  InstructorPaymentForm,
  RevenueSharingRecipientForm,
  VenueRentalForm,
  ConsultingServiceForm,
  StudentClubForm,
  TuesdayMeetupForm,
  CourseQuizForm,
  PaymentNotificationForm,
  AIDigitalTransformCourseForm,
  QuotationForm,
  Smart4AMemberForm,
  ServiceInquiryForm,
  LearningSatisfactionSurveyForm,
  PromptModeChangeForm,
  ProductManagementForm,
  ReferralLinkApplicationForm,
  ProjectContractForm,
  FormPageTemplate,
} from '@/components/form';
import { getFormByPath, syncProductToRelatedForms } from '@/data/forms';

const FormPage: React.FC = () => {
  const { formName } = useParams<{ formName: string }>();
  const formConfig = getFormByPath(formName || '');

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 找不到表單
  if (!formConfig) {
    return <FormPageTemplate status="notfound" />;
  }

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (customData?: Record<string, any>) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const dataToSubmit = customData || formData;
      // Use signature from customData if provided, otherwise use local state
      const signatureData = customData?.signature || signature;
      const payload = {
        ...dataToSubmit,
        signature: signatureData,
        // Add signature format for forms that provide signatures
        ...(signatureData ? { signature_format: 'dataurl_png' } : {}),
        submittedAt: new Date().toISOString(),
        formId: formConfig.id,
        formName: formConfig.name,
        verificationKey: 'Smart4A@Lovable',
      };

      const response = await fetch(formConfig.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Form submissions are handled via Make.com webhook
        // No direct database insert needed here

        // Sync new product to referral-link & project-contract package options
        if (formConfig.path === 'product-management' && dataToSubmit.appName) {
          syncProductToRelatedForms(dataToSubmit.appName).catch(console.error);
        }

        // All form submissions are handled via Make.com webhook

        // Course quiz manages its own result display, don't set success status
        if (formConfig.path !== 'course-quiz') {
          setSubmitStatus('success');
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 提交成功
  if (submitStatus === 'success') {
    // English version success page
    if (formConfig.path === 'automation-marketplace-en') {
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: 'Order Submitted Successfully',
            message: 'Thank you for your order! We have received your information.',
            subMessage: 'A PayPal payment link will be sent to your email.',
            buttonText: 'Return to Operation Store',
            buttonHref: 'https://make.fan/operation-store/',
            footerText: 'Questions? Contact us at service@smart4a.tw',
          }}
        />
      );
    }
    // Student product claim success page
    if (formConfig.path === 'student-product-claim') {
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '申請提交成功',
            message: '感謝您的申請，我們已收到您的資料',
            subMessage: '認證金鑰將會寄送至您填寫的電子郵件信箱',
            buttonText: '返回首頁',
            buttonHref: 'https://make.fan/',
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Template store success page
    if (formConfig.path === 'template-store') {
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '訂單提交成功',
            message: '感謝您的訂購，我們已收到您的訂單資料',
            subMessage: '我們將盡快處理您的訂單',
            buttonText: '返回範本商城',
            buttonHref: 'https://make.fan/templates-store/',
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Template store EN success page
    if (formConfig.path === 'template-store-en') {
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: 'Order Submitted Successfully',
            message: 'Thank you for your order! We have received your information.',
            subMessage: 'A PayPal payment link will be sent to your email.',
            buttonText: 'Return to Templates Store',
            buttonHref: 'https://make.fan/templates-store/',
            footerText: 'Questions? Contact us at service@smart4a.tw',
          }}
        />
      );
    }
    // Learning video confidentiality success page
    if (formConfig.path === 'learning-video-confidentiality') {
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '切結書簽署完成',
            message: '感謝您完成簽署，我們已收到您的切結書',
            subMessage: '確認副本將寄送至您填寫的電子郵件信箱',
            buttonText: '返回首頁',
            buttonHref: 'https://make.fan/',
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Course retraining success page
    if (formConfig.path === 'course-retraining') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '報名成功',
            message: '感謝您的報名，我們已收到您的資料',
            subMessage: '付款連結將透過簡訊發送至您的手機，發票將寄送至您填寫的電子郵件',
            buttonText: '繼續報名',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Instructor payment success page
    if (formConfig.path === 'instructor-payment') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '申請提交成功',
            message: '感謝您的申請，我們已收到您的請款資料',
            subMessage: '請款處理狀態將透過 Email 通知您',
            buttonText: '繼續填寫',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Revenue sharing recipient success page
    if (formConfig.path === 'revenue-sharing-recipient') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '資料提交成功',
            message: '感謝您的填寫，我們已收到您的收款人資料',
            subMessage: '後續處理狀態將透過 Email 通知您',
            buttonText: '繼續填寫',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Venue rental success page
    if (formConfig.path === 'venue-rental') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '場地租借申請成功',
            message: '感謝您的申請，我們已收到您的場地租借資料',
            subMessage: '後續確認將透過 Email 通知您，請留意信箱',
            buttonText: '繼續申請',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: joyce@fans.tw',
          }}
        />
      );
    }
    // Student club success page
    if (formConfig.path === 'student-club') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '報名成功',
            message: '感謝您的報名，我們已收到您的資料',
            subMessage: '付款連結將透過簡訊發送至您的手機，發票將寄送至您填寫的電子郵件',
            buttonText: '繼續報名',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Tuesday meetup success page
    if (formConfig.path === 'tuesday-meetup') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '報名成功',
            message: '感謝您的報名，我們已收到您的資料',
            subMessage: '活動詳情將透過 Email 通知您',
            buttonText: '繼續報名',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Course quiz - uses internal result display, don't show success page
    if (formConfig.path === 'course-quiz') {
      // Reset submit status so the form can show its own result step
      setSubmitStatus('idle');
      return null;
    }
    // Consulting service success page
    if (formConfig.path === 'consulting-service') {
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '送出成功',
            message: '我們已收到您的需求，將以 Email 或電話與您聯繫',
            subMessage: `訂單編號：${formData.order_no || ''}`,
            buttonText: '回到 make.fan',
            buttonHref: 'https://make.fan',
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Payment notification success page
    if (formConfig.path === 'payment-notification') {
      const orderNumberDisplay = formData.orderNumber ? `訂單編號：${formData.orderNumber}\n` : '';
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '送出成功',
            message: '感謝您的通知，我們已收到您的匯款資訊',
            subMessage: `${orderNumberDisplay}我們將盡快確認您的款項`,
            buttonText: '回到 make.fan',
            buttonHref: 'https://make.fan',
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // AI Digital Transform Course success page
    if (formConfig.path === 'ai-digital-transform-course') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '報名成功',
            message: '感謝您的報名，我們已收到您的資料',
            subMessage: '付款連結將透過 Email 發送給您，請留意信箱',
            buttonText: '繼續報名',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Smart4A Member Registration success page
    if (formConfig.path === 'smart4a-member') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '登記成功',
            message: '感謝您的登記，我們已收到您的會員資料',
            subMessage: '後續服務通知將透過 Email 發送給您',
            buttonText: '繼續登記',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Quotation Form success page
    if (formConfig.path === 'quotation') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '報價單建立成功',
            message: '報價單已成功產生',
            subMessage: '系統已記錄報價資料，後續流程將自動處理',
            buttonText: '繼續建立報價',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Service Inquiry success page
    if (formConfig.path === 'service-inquiry') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '詢價單送出成功',
            message: '感謝您的詢問，我們已收到您的需求',
            subMessage: '專人將盡快與您聯繫，提供報價與服務規劃',
            buttonText: '繼續填寫',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Learning Satisfaction Survey success page
    if (formConfig.path === 'learning-satisfaction-survey') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '問卷提交成功',
            message: '感謝您的寶貴回饋！',
            subMessage: '您的意見將幫助我們持續改進課程品質',
            buttonText: '再填一份',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Product Management success page
    if (formConfig.path === 'product-management') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '產品新增成功',
            message: '產品資料已成功提交',
            subMessage: '系統將自動同步至自動化商城',
            buttonText: '繼續新增',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Referral Link Application success page
    if (formConfig.path === 'referral-link-application') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '申請提交成功',
            message: '感謝您的申請，推薦連結將依設定方式發送',
            subMessage: '如選擇直接寄送，連結將發送至申請人 E-mail',
            buttonText: '繼續申請',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Project Contract success page
    if (formConfig.path === 'project-contract') {
      const handleReturnToForm = () => {
        setFormData({});
        setSignature(null);
        setSubmitStatus('idle');
      };
      return (
        <FormPageTemplate
          status="success"
          successConfig={{
            title: '合約資料提交成功',
            message: '合約資料已成功送出至 Make.com 進行處理',
            subMessage: '系統將自動產生合約文件',
            buttonText: '繼續製作合約',
            onButtonClick: handleReturnToForm,
            footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
          }}
        />
      );
    }
    // Chinese version success page (automation marketplace)
    return (
      <FormPageTemplate
        status="success"
        successConfig={{
          title: '訂單提交成功',
          message: '感謝您的訂購，我們已收到您的訂單資料',
          subMessage: '付款連結將透過簡訊發送至您的手機',
          buttonText: '返回 Operation Store',
          buttonHref: 'https://make.fan/operation-store/',
          footerText: '如有任何問題，請聯繫我們 | Email: service@smart4a.tw',
        }}
      />
    );
  }

  // 多步驟表單內容
  const steps = [
    {
      id: 'basic',
      title: '基本資料',
      content: (
        <div className="space-y-6">
          <GlassInput
            label="姓名"
            name="name"
            placeholder="請輸入您的姓名"
            value={formData.name || ''}
            onChange={(e) => updateFormData('name', e.target.value)}
            required
          />
          <GlassInput
            label="電子郵件"
            name="email"
            type="email"
            placeholder="請輸入您的電子郵件"
            value={formData.email || ''}
            onChange={(e) => updateFormData('email', e.target.value)}
            required
          />
          <GlassInput
            label="電話號碼"
            name="phone"
            type="tel"
            placeholder="請輸入您的電話號碼"
            value={formData.phone || ''}
            onChange={(e) => updateFormData('phone', e.target.value)}
          />
        </div>
      ),
    },
    {
      id: 'details',
      title: '詳細資訊',
      content: (
        <div className="space-y-6">
          <GlassSelect
            label="服務類型"
            name="serviceType"
            placeholder="請選擇服務類型"
            options={[
              { value: 'consulting', label: '顧問服務' },
              { value: 'automation', label: '自動化方案' },
              { value: 'training', label: '教育訓練' },
              { value: 'other', label: '其他' },
            ]}
            value={formData.serviceType || ''}
            onChange={(e) => updateFormData('serviceType', e.target.value)}
            required
          />
          <ConditionalField show={formData.serviceType === 'other'}>
            <GlassInput
              label="請說明服務類型"
              name="otherService"
              placeholder="請描述您需要的服務"
              value={formData.otherService || ''}
              onChange={(e) => updateFormData('otherService', e.target.value)}
            />
          </ConditionalField>
          <GlassRadio
            name="priority"
            label="優先程度"
            options={[
              { value: 'low', label: '一般' },
              { value: 'medium', label: '中等' },
              { value: 'high', label: '緊急' },
            ]}
            value={formData.priority || ''}
            onChange={(value) => updateFormData('priority', value)}
            required
          />
          <GlassTextarea
            label="詳細說明"
            name="description"
            placeholder="請詳細描述您的需求..."
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            rows={4}
          />
        </div>
      ),
    },
    {
      id: 'confirm',
      title: '確認送出',
      content: (
        <div className="space-y-6">
          <GlassCheckbox
            name="agree"
            label="我同意服務條款與隱私政策"
            checked={formData.agree || false}
            onChange={(e) => updateFormData('agree', e.target.checked)}
            required
          />
          {formConfig.hasSignature && (
            <SignaturePad
              label="簽名"
              required
              onSignatureChange={setSignature}
            />
          )}
          {submitStatus === 'error' && (
            <div className="p-4 rounded-lg bg-destructive/20 border border-destructive/30 text-destructive text-sm">
              提交失敗，請稍後再試。
            </div>
          )}
        </div>
      ),
    },
  ];

  // 表單內容
  const formContent = formConfig.path === 'automation-marketplace' ? (
    <AutomationMarketplaceForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'automation-marketplace-en' ? (
    <AutomationMarketplaceFormEN
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'student-product-claim' ? (
    <StudentProductClaimForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'template-store' ? (
    <TemplateStoreForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'template-store-en' ? (
    <TemplateStoreFormEN
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'learning-video-confidentiality' ? (
    <LearningVideoConfidentialityForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'course-retraining' ? (
    <CourseRetrainingForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'instructor-payment' ? (
    <InstructorPaymentForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'revenue-sharing-recipient' ? (
    <RevenueSharingRecipientForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'venue-rental' ? (
    <VenueRentalForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'consulting-service' ? (
    <ConsultingServiceForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'student-club' ? (
    <StudentClubForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'tuesday-meetup' ? (
    <TuesdayMeetupForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'course-quiz' ? (
    <CourseQuizForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'payment-notification' ? (
    <PaymentNotificationForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'ai-digital-transform-course' ? (
    <AIDigitalTransformCourseForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'smart4a-member' ? (
    <Smart4AMemberForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'quotation' ? (
    <QuotationForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'service-inquiry' ? (
    <ServiceInquiryForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'learning-satisfaction-survey' ? (
    <LearningSatisfactionSurveyForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'prompt-mode-change' ? (
    <PromptModeChangeForm
      webhookUrl={formConfig.webhookUrl}
    />
  ) : formConfig.path === 'product-management' ? (
    <ProductManagementForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'referral-link-application' ? (
    <ReferralLinkApplicationForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.path === 'project-contract' ? (
    <ProjectContractForm
      onSubmit={(data) => handleSubmit(data)}
      isSubmitting={isSubmitting}
    />
  ) : formConfig.isMultiStep ? (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-6"
    >
      {steps.map((step) => (
        <div key={step.id}>{step.content}</div>
      ))}
      <GlassButton
        type="submit"
        variant="gradient"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        提交表單
      </GlassButton>
    </form>
  );

  return (
    <FormPageTemplate
      status="form"
      title={formConfig.name}
      description={formConfig.description}
    >
      {formContent}
    </FormPageTemplate>
  );
};

export default FormPage;
