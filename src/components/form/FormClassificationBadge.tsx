import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Primary categories (exactly one required)
export type PrimaryCategory = '自動化商城' | '課程相關' | '內部管理' | '外部合作' | '教學顧問' | '產品相關';

// Attribute examples (optional, max one)
export type FormAttribute = '英文版' | '中文版' | '產品領用' | '簽署流程' | string;

export interface FormClassification {
  primaryCategory: PrimaryCategory;
  attribute?: FormAttribute;
}

interface FormClassificationBadgeProps {
  classification: FormClassification;
  className?: string;
}

// Color mapping for primary categories - more prominent, refined colors
// Using higher saturation and visibility while maintaining elegance
const categoryColors: Record<PrimaryCategory, string> = {
  '自動化商城': 'bg-[hsl(270_50%_55%/0.18)] text-[hsl(270_60%_75%)] border-[hsl(270_50%_55%/0.35)]',
  '課程相關': 'bg-[hsl(190_55%_45%/0.18)] text-[hsl(190_60%_70%)] border-[hsl(190_55%_45%/0.35)]',
  '內部管理': 'bg-[hsl(220_25%_50%/0.15)] text-[hsl(220_30%_70%)] border-[hsl(220_25%_50%/0.30)]',
  '外部合作': 'bg-[hsl(35_55%_50%/0.18)] text-[hsl(35_60%_70%)] border-[hsl(35_55%_50%/0.35)]',
  '教學顧問': 'bg-[hsl(145_45%_45%/0.18)] text-[hsl(145_50%_65%)] border-[hsl(145_45%_45%/0.35)]',
  '產品相關': 'bg-[hsl(300_45%_50%/0.18)] text-[hsl(300_50%_70%)] border-[hsl(300_45%_50%/0.35)]',
};

// Color mapping for attributes - elegant palette harmonizing with purple/cyan system
// Using muted, sophisticated tones that complement the primary (270° purple) and accent (190° cyan)
const attributeColors: Record<string, string> = {
  // Language variants - elegant blue-violet tones
  '英文版': 'bg-[hsl(240_40%_60%/0.12)] text-[hsl(240_35%_70%)] border-[hsl(240_40%_60%/0.25)]',
  '中文版': 'bg-[hsl(200_45%_55%/0.12)] text-[hsl(200_40%_65%)] border-[hsl(200_45%_55%/0.25)]',
  
  // Process types - sophisticated rose and lavender
  '產品領用': 'bg-[hsl(280_35%_60%/0.12)] text-[hsl(280_30%_70%)] border-[hsl(280_35%_60%/0.25)]',
  '簽署流程': 'bg-[hsl(330_35%_60%/0.12)] text-[hsl(330_30%_70%)] border-[hsl(330_35%_60%/0.25)]',
  
  // Status presets - refined, muted tones
  '報名中': 'bg-[hsl(175_40%_50%/0.12)] text-[hsl(175_35%_60%)] border-[hsl(175_40%_50%/0.25)]',
  '已結束': 'bg-[hsl(260_15%_55%/0.12)] text-[hsl(260_10%_65%)] border-[hsl(260_15%_55%/0.25)]',
  '草稿': 'bg-[hsl(220_30%_55%/0.12)] text-[hsl(220_25%_65%)] border-[hsl(220_30%_55%/0.25)]',
  '審核中': 'bg-[hsl(45_40%_55%/0.12)] text-[hsl(45_35%_65%)] border-[hsl(45_40%_55%/0.25)]',
  '已核准': 'bg-[hsl(165_35%_50%/0.12)] text-[hsl(165_30%_60%)] border-[hsl(165_35%_50%/0.25)]',
  '已拒絕': 'bg-[hsl(350_40%_55%/0.12)] text-[hsl(350_35%_65%)] border-[hsl(350_40%_55%/0.25)]',
  '限時': 'bg-[hsl(355_45%_58%/0.12)] text-[hsl(355_40%_68%)] border-[hsl(355_45%_58%/0.25)]',
  '熱門': 'bg-[hsl(20_45%_55%/0.12)] text-[hsl(20_40%_65%)] border-[hsl(20_45%_55%/0.25)]',
  '新增': 'bg-accent/12 text-accent/80 border-accent/25',
};

// Fallback uses system accent color for unknown attributes
const getAttributeColor = (attribute: string): string => {
  return attributeColors[attribute] || 'bg-accent/15 text-accent border-accent/30';
};

const FormClassificationBadge: React.FC<FormClassificationBadgeProps> = ({
  classification,
  className,
}) => {
  const { primaryCategory, attribute } = classification;

  return (
    <div className={cn('flex items-center gap-1.5 flex-wrap justify-end', className)}>
      {/* Primary Category Badge (required) */}
      <Badge
        variant="outline"
        className={cn(
          'text-[10px] font-medium px-2 py-0.5 rounded-full border',
          categoryColors[primaryCategory]
        )}
      >
        {primaryCategory}
      </Badge>

      {/* Attribute Badge (optional) */}
      {attribute && (
        <Badge
          variant="outline"
          className={cn(
            'text-[10px] font-medium px-2 py-0.5 rounded-full border',
            getAttributeColor(attribute)
          )}
        >
          {attribute}
        </Badge>
      )}
    </div>
  );
};

export default FormClassificationBadge;
