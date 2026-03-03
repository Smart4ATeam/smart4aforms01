import React, { useState } from 'react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import GlassInput from './GlassInput';
import SignaturePad from './SignaturePad';
import GlassButton from './GlassButton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface FormData {
  fullName: string;
  nationalId: string;
  email: string;
  confirmEmail: string;
  phone?: string;
  signature: string;
  signingDate: string;
}

interface FormErrors {
  [key: string]: string;
}

interface LearningVideoConfidentialityFormProps {
  onSubmit?: (data: FormData) => void;
  isSubmitting?: boolean;
  className?: string;
}

const AGREEMENT_CONTENT = `茲因參加 SMART4A Workshop／學員俱樂部（以下簡稱「本課程」），本人如於上課過程中進行錄音、錄影或螢幕錄製（以下合稱「錄製行為」），特此聲明並切結如下：

一、用途限定

本人錄製之影音檔僅供本人於課後複習或自我學習使用，絕不得以任何方式提供、轉發、外流或公開發布，亦不得上傳至任何社群平台、網站、郵件或通訊工具。

二、保密義務

本人承諾對課程內容及授課過程中涉及之教學資料、案例分析、講師示範、同學提問與討論內容等，負有嚴格保密義務；非經主辦單位或講師事先書面同意，不得以任何形式對外洩漏或公開。

三、智慧財產權

本課程之教材、投影片、影音檔、講義等教學資源，皆屬主辦單位、講師或相關權利人所有。本人未經授權，不得翻印、改作，或以其他方式侵害上述智慧財產權。

四、違約責任

若本人違反前述任何一項約定，致使主辦單位、講師或其他學員遭受損害，本人願賠償因此所生之一切損失，包括但不限於訴訟費用、律師費及相關賠償金額。

五、切結生效

本切結書自本人完成簽署之日起生效，並於課程結束後仍持續有效，直至所有相關影音資料完整銷毀為止。

六、其他約定

如本切結書未盡事宜，悉依相關法令或主辦單位之相關規範辦理。`;

const LearningVideoConfidentialityForm: React.FC<LearningVideoConfidentialityFormProps> = ({
  onSubmit,
  isSubmitting = false,
  className,
}) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [signature, setSignature] = useState('');
  
  // Individual fields
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const signingDate = format(new Date(), 'yyyy年MM月dd日', { locale: zhTW });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) newErrors.fullName = '請輸入姓名';
    if (!nationalId.trim()) newErrors.nationalId = '請輸入身分證字號';

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

    // Validate signature - must be a valid base64 data URL with actual content
    if (!signature || !signature.startsWith('data:image/png;base64,')) {
      newErrors.signature = '請簽名';
    } else {
      // Check if the canvas has actual content (not just empty/white canvas)
      const base64Data = signature.replace('data:image/png;base64,', '');
      // An empty canvas typically produces a very small base64 string
      if (base64Data.length < 1000) {
        newErrors.signature = '請簽名';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submissionData: FormData = {
      fullName,
      nationalId,
      email,
      confirmEmail,
      phone,
      signature,
      signingDate,
    };

    if (onSubmit) {
      onSubmit(submissionData);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Signer Information - Individual Only */}
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
            label="身分證字號/護照號碼"
            placeholder="請輸入身分證字號/護照號碼"
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
            label="聯絡電話"
            type="tel"
            placeholder="請輸入聯絡電話（選填）"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Agreement / Declaration Content */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground/70">
            切結書內容 <span className="text-destructive">*</span>
          </p>
          <ScrollArea className="h-64 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {AGREEMENT_CONTENT}
            </div>
          </ScrollArea>
          <p className="text-xs text-muted-foreground">
            請仔細閱讀上述條款，簽署即表示同意遵守
          </p>
        </div>

        {/* Signature Section */}
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

export default LearningVideoConfidentialityForm;
