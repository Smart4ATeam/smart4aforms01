import React from 'react';
import { CheckCircle, Info, AlertTriangle, LucideIcon } from 'lucide-react';
import GlassButton from './GlassButton';

type CardVariant = 'success' | 'info' | 'warning';

interface SuccessCardProps {
  /** 卡片變體類型 */
  variant?: CardVariant;
  /** 自訂圖標（覆蓋 variant 預設圖標） */
  icon?: LucideIcon;
  /** 成功標題 */
  title?: string;
  /** 主要訊息 */
  message?: string;
  /** 次要訊息/說明 */
  subMessage?: string;
  /** 下一步分隔線文字 */
  nextStepLabel?: string;
  /** 按鈕文字 */
  buttonText?: string;
  /** 按鈕連結 */
  buttonHref?: string;
  /** 按鈕點擊事件（優先於 buttonHref） */
  onButtonClick?: () => void;
  /** 頁尾文字 */
  footerText?: string;
  /** 自訂內容（放在訊息和按鈕之間） */
  children?: React.ReactNode;
}

const variantConfig: Record<CardVariant, {
  icon: LucideIcon;
  borderColor: string;
  bgGradient: string;
  shadowColor: string;
}> = {
  success: {
    icon: CheckCircle,
    borderColor: 'border-[hsl(270_50%_60%/0.2)]',
    bgGradient: 'from-[hsl(270_50%_55%)] to-[hsl(270_60%_45%)]',
    shadowColor: 'shadow-[hsl(270_50%_50%/0.25)]',
  },
  info: {
    icon: Info,
    borderColor: 'border-[hsl(200_60%_50%/0.2)]',
    bgGradient: 'from-[hsl(200_60%_50%)] to-[hsl(210_70%_45%)]',
    shadowColor: 'shadow-[hsl(200_60%_50%/0.25)]',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-[hsl(40_80%_50%/0.2)]',
    bgGradient: 'from-[hsl(40_80%_50%)] to-[hsl(30_90%_45%)]',
    shadowColor: 'shadow-[hsl(40_80%_50%/0.25)]',
  },
};

const SuccessCard: React.FC<SuccessCardProps> = ({
  variant = 'success',
  icon,
  title = '提交成功',
  message = '感謝您的填寫，我們已收到您的資料',
  subMessage,
  nextStepLabel = '下一步',
  buttonText = '返回首頁',
  buttonHref = '/',
  onButtonClick,
  footerText,
  children,
}) => {
  const ButtonWrapper = onButtonClick ? 'button' : 'a';
  const buttonProps = onButtonClick 
    ? { onClick: onButtonClick, type: 'button' as const }
    : { href: buttonHref };

  const config = variantConfig[variant];
  const IconComponent = icon || config.icon;

  return (
    <div className="w-full max-w-sm animate-fade-in">
      {/* Card - Light frosted glass */}
      <div className="bg-white/15 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center shadow-xl">
        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className={`absolute w-14 h-14 rounded-full border ${config.borderColor}`} />
          <div className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${config.bgGradient} flex items-center justify-center shadow-md ${config.shadowColor}`}>
            <IconComponent className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-lg font-semibold text-white mb-2">
          {title}
        </h1>
        
        {/* Messages */}
        <p className="text-white/70 text-sm mb-1">
          {message}
        </p>
        {subMessage && (
          <p className="text-white/40 text-xs mb-4">
            {subMessage}
          </p>
        )}

        {/* Custom Content */}
        {children && (
          <div className="mb-4">
            {children}
          </div>
        )}
        
        {/* Elegant Divider */}
        <div className="flex items-center gap-3 mb-5 mt-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="text-white/30 text-[10px] tracking-wider uppercase">{nextStepLabel}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        
        {/* CTA Button */}
        <ButtonWrapper {...buttonProps} className="block w-full">
          <GlassButton
            variant="gradient"
            size="md"
            className="w-full text-sm pointer-events-none"
          >
            {buttonText}
          </GlassButton>
        </ButtonWrapper>
      </div>
      
      {/* Footer */}
      {footerText && (
        <p className="text-center mt-6 text-xs text-white/40">
          {footerText}
        </p>
      )}
    </div>
  );
};

export default SuccessCard;
