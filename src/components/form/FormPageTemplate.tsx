import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '@/components/ParticleBackground';
import GlassCard from '@/components/GlassCard';
import { SuccessCard } from '@/components/form';
import { XCircle, ArrowLeft, LucideIcon } from 'lucide-react';
import GlassButton from './GlassButton';
import makefanLogo from '@/assets/makefan-logo.png';

type BackgroundVariant = 'purple' | 'blue' | 'teal' | 'dark' | 'custom';

const backgroundStyles: Record<Exclude<BackgroundVariant, 'custom'>, string> = {
  purple: 'bg-gradient-to-br from-[hsl(280_60%_15%)] via-[hsl(260_50%_20%)] to-[hsl(290_45%_18%)]',
  blue: 'bg-gradient-to-br from-[hsl(220_60%_15%)] via-[hsl(210_50%_20%)] to-[hsl(230_45%_18%)]',
  teal: 'bg-gradient-to-br from-[hsl(180_50%_12%)] via-[hsl(190_45%_18%)] to-[hsl(200_40%_15%)]',
  dark: 'bg-gradient-to-br from-[hsl(240_10%_8%)] via-[hsl(240_10%_12%)] to-[hsl(240_10%_10%)]',
};

interface FormPageTemplateProps {
  /** 頁面狀態 */
  status: 'form' | 'success' | 'error' | 'notfound';
  /** 背景變體 */
  background?: BackgroundVariant;
  /** 自訂背景 class（當 background='custom' 時使用） */
  customBackground?: string;
  /** Logo 圖片來源 */
  logo?: string;
  /** Logo 高度 class */
  logoHeight?: string;
  /** 表單標題 */
  title?: string;
  /** 表單描述 */
  description?: string;
  /** 粒子背景數量（設為 0 隱藏粒子） */
  particleCount?: number;
  /** 頁尾文字 */
  footerText?: string;
  /** 表單內容 */
  children?: React.ReactNode;
  /** 成功頁面配置 */
  successConfig?: {
    title?: string;
    message?: string;
    subMessage?: string;
    buttonText?: string;
    buttonHref?: string;
    onButtonClick?: () => void;
    footerText?: string;
    variant?: 'success' | 'info' | 'warning';
    icon?: LucideIcon;
  };
  /** 找不到頁面配置 */
  notFoundConfig?: {
    title?: string;
    message?: string;
    buttonText?: string;
    buttonHref?: string;
  };
  /** 卡片最大寬度 class */
  maxWidth?: string;
  /** 是否顯示卡片容器 */
  showCard?: boolean;
}

const FormPageTemplate: React.FC<FormPageTemplateProps> = ({
  status,
  background = 'purple',
  customBackground,
  logo = makefanLogo,
  logoHeight = 'h-10',
  title,
  description,
  particleCount = 60,
  footerText = '如有任何問題，請聯繫我們 | Email: service@smart4a.tw | 禹動科技整合服務股份有限公司 | 統編：94238652',
  children,
  successConfig = {},
  notFoundConfig = {},
  maxWidth = 'max-w-4xl',
  showCard = true,
}) => {
  const bgClass = background === 'custom' && customBackground 
    ? customBackground 
    : backgroundStyles[background === 'custom' ? 'purple' : background];
  // 找不到頁面狀態
  if (status === 'notfound') {
    const {
      title: notFoundTitle = '找不到表單',
      message = '此表單不存在或已被移除',
      buttonText = '返回首頁',
      buttonHref = '/',
    } = notFoundConfig;

    return (
      <div className={`${bgClass} min-h-screen flex items-center justify-center p-4`}>
        <ParticleBackground variant="cosmic" particleCount={particleCount} />
        <GlassCard className="p-8 text-center max-w-md relative z-10">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-white mb-2">
            {notFoundTitle}
          </h1>
          <p className="text-white/60 mb-6">{message}</p>
          <Link to={buttonHref}>
            <GlassButton variant="outline">
              <ArrowLeft className="w-4 h-4" />
              {buttonText}
            </GlassButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  // 成功狀態
  if (status === 'success') {
    const {
      title: successTitle = '提交成功',
      message = '感謝您的填寫，我們已收到您的資料',
      subMessage,
      buttonText = '返回首頁',
      buttonHref = '/',
      onButtonClick,
      footerText: successFooterText,
      variant = 'success',
      icon,
    } = successConfig;

    return (
      <div className={`${bgClass} min-h-screen flex flex-col items-center justify-center p-4`}>
        <ParticleBackground variant="cosmic" particleCount={particleCount} />
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src={logo}
              alt="Logo"
              className={`${logoHeight.replace('h-10', 'h-8')} object-contain mx-auto`}
            />
          </div>

          {/* Success Card */}
          <SuccessCard
            variant={variant}
            icon={icon}
            title={successTitle}
            message={message}
            subMessage={subMessage}
            buttonText={buttonText}
            buttonHref={buttonHref}
            onButtonClick={onButtonClick}
            footerText={successFooterText}
          />
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (status === 'error') {
    return (
      <div className={`${bgClass} min-h-screen flex flex-col items-center justify-center p-4`}>
        <ParticleBackground variant="cosmic" particleCount={particleCount} />
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src={logo}
              alt="Logo"
              className={`${logoHeight.replace('h-10', 'h-8')} object-contain mx-auto`}
            />
          </div>

          {/* Error Card */}
          <SuccessCard
            variant="warning"
            title="發生錯誤"
            message="提交失敗，請稍後再試"
            buttonText="重新嘗試"
            onButtonClick={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  // 表單狀態（預設）
  return (
    <div className={`${bgClass} min-h-screen py-8 px-4`}>
      <ParticleBackground variant="cosmic" particleCount={particleCount} />

      <div className={`relative z-10 container mx-auto ${maxWidth}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className={`${logoHeight} object-contain mx-auto mb-6`}
          />
          {title && (
            <h1 className="text-3xl font-semibold text-white mb-2">{title}</h1>
          )}
          {description && <p className="text-white/60">{description}</p>}
        </div>

        {/* Form Content */}
        {showCard ? (
          <GlassCard className="p-8">{children}</GlassCard>
        ) : (
          children
        )}

        {/* Footer */}
        {footerText && (
          <p className="text-center mt-8 text-sm text-white/40">{footerText}</p>
        )}
      </div>
    </div>
  );
};

export default FormPageTemplate;
