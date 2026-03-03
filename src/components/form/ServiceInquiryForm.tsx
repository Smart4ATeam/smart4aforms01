import React, { useState, useMemo } from 'react';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassTextarea from './GlassTextarea';
import GlassButton from './GlassButton';
import { cn } from '@/lib/utils';
import { AlertCircle, Send, Calculator, Building2, Rocket, Briefcase, Wrench, Check, Eye, ArrowLeft, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface ServiceInquiryFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting: boolean;
}

// 費率表
const RATES = {
  transformation: {
    '基礎陪跑方案': { 
      price: 360000, 
      description: '48小時專業指導、3個自動化流程導入',
      includes: [
        '48小時專業顧問指導時數',
        '3個自動化流程規劃與導入',
        '流程建議書與導入計畫',
        '1個月維護支援',
      ]
    },
    '完整轉型方案': { 
      price: 480000, 
      description: '含 AI Agent 建置、知識庫訓練、5個自動化流程導入',
      includes: [
        '72小時專業顧問指導時數',
        '5個自動化流程規劃與導入',
        'AI Agent 建置（含知識庫訓練）',
        '流程建議書與導入計畫',
        '3個月維護支援',
        '專屬顧問群組即時回應',
      ]
    },
    '企業客製方案': { 
      price: 0, 
      description: '適合多部門整合、私有化部署、複雜權限管理設計',
      includes: [
        '依需求規劃專屬時數',
        '多部門整合與權限設計',
        '私有化部署支援',
        '複雜流程客製開發',
        '長期維護合約可議',
        '專案經理全程服務',
      ]
    },
  },
  consulting: {
    '輕量型': { base: 30000, designated: 50000, ragCost: 20000, description: '每月1次現場指導' },
    '中量型': { base: 50000, designated: 70000, ragCost: 10000, description: '每月2次現場指導' },
    '重量型': { base: 80000, designated: 100000, ragCost: 0, description: '每週1次現場指導' },
  },
};

// 技術指導 & 教育訓練選項
const TRAINING_OPTIONS = {
  technical: {
    category: 'technical',
    title: '專案技術指導（Level 5）',
    description: '針對專案開發遇到的關鍵問題，提供 1對1 手把手指導',
    hoursPerSession: 2,
    options: [
      { value: 'tech_base', label: '基礎講師 - NT$ 5,000/hr', rate: 5000 },
      { value: 'tech_designated', label: '指定講師 - NT$ 7,000/hr', rate: 7000 },
    ],
  },
  education: {
    category: 'education',
    title: '企業教育訓練（Level 3+）',
    description: '適用 5-30人團體課程，每單元3小時',
    hoursPerSession: 3,
    options: [
      { value: 'edu_intro_base', label: '入門課程 - 基礎講師 - NT$ 6,000/hr', rate: 6000 },
      { value: 'edu_intro_designated', label: '入門課程 - 指定講師 - NT$ 8,000/hr', rate: 8000 },
      { value: 'edu_basic_base', label: '基礎課程 - 基礎講師 - NT$ 6,000/hr', rate: 6000 },
      { value: 'edu_basic_designated', label: '基礎課程 - 指定講師 - NT$ 8,000/hr', rate: 8000 },
      { value: 'edu_mid_base', label: '中階課程 - 基礎講師 - NT$ 7,000/hr', rate: 7000 },
      { value: 'edu_mid_designated', label: '中階課程 - 指定講師 - NT$ 9,000/hr', rate: 9000 },
      { value: 'edu_adv_base', label: '進階課程 - 基礎講師 - NT$ 8,000/hr', rate: 8000 },
      { value: 'edu_adv_designated', label: '進階課程 - 指定講師 - NT$ 10,000/hr', rate: 10000 },
    ],
  },
  coaching: {
    category: 'coaching',
    title: '教練指導（Level 4+）',
    description: '適用 5人以下小班制、1對1或團隊帶領',
    hoursPerSession: 2,
    options: [
      { value: 'coach_1on1_base', label: '1對1手把手 - 基礎教練 - NT$ 3,000/hr', rate: 3000 },
      { value: 'coach_1on1_designated', label: '1對1手把手 - 指定教練 - NT$ 4,500/hr', rate: 4500 },
      { value: 'coach_team_base', label: '1對多(團隊帶領) - 基礎教練 - NT$ 4,500/hr', rate: 4500 },
      { value: 'coach_team_designated', label: '1對多(團隊帶領) - 指定教練 - NT$ 6,000/hr', rate: 6000 },
    ],
  },
};

const ServiceInquiryForm: React.FC<ServiceInquiryFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [invoiceTitleManuallyEdited, setInvoiceTitleManuallyEdited] = useState(false);

  // 表單資料
  const [formData, setFormData] = useState({
    // 客戶聯絡資訊
    company_name: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    // 發票資訊（選填）
    tax_id: '',
    invoice_title: '',
    company_address: '',
    // 陪跑與轉型方案（單選）
    transformation_package: '',
    custom_description: '',
    // 顧問服務
    consulting_plan: '',
    consulting_type: '公司指派（基礎費用）',
    consulting_months: 1,
    consulting_rag: '不需要',
    consulting_designated_name: '',
    // 技術指導 & 教育訓練
    training_category: '',
    training_option: '',
    training_sessions: 1,
    training_designated_name: '',
    // 其他需求或備註
    notes: '',
  });

  const updateField = (key: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };
      
      // 當輸入公司名稱時，自動同步到發票抬頭（除非用戶已手動修改）
      if (key === 'company_name' && !invoiceTitleManuallyEdited) {
        updated.invoice_title = value;
      }
      
      // 當用戶手動修改發票抬頭時，標記為已手動修改
      if (key === 'invoice_title') {
        setInvoiceTitleManuallyEdited(true);
      }
      
      // 當選擇顧問方案等級為重量型時，自動設定 RAG 為已包含
      if (key === 'consulting_plan') {
        if (value === '重量型') {
          updated.consulting_rag = '已包含（重量型免費）';
        } else if (prev.consulting_rag === '已包含（重量型免費）') {
          updated.consulting_rag = '不需要';
        }
      }
      
      // 清除訓練選項當類別改變時
      if (key === 'training_category') {
        updated.training_option = '';
        updated.training_sessions = 1;
        updated.training_designated_name = '';
      }
      
      return updated;
    });
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  // 計算費用
  const priceCalculation = useMemo(() => {
    let subtotal = 0;
    const breakdown: string[] = [];
    let hasCustomPackage = false;

    // 陪跑轉型方案（單選）
    if (formData.transformation_package) {
      const pkg = formData.transformation_package;
      const rateInfo = RATES.transformation[pkg as keyof typeof RATES.transformation];
      if (pkg === '企業客製方案') {
        hasCustomPackage = true;
        breakdown.push(`企業客製方案：專人評估報價`);
      } else if (rateInfo && rateInfo.price > 0) {
        subtotal += rateInfo.price;
        breakdown.push(`${pkg}：NT$ ${rateInfo.price.toLocaleString()}`);
      }
    }

    // 顧問服務
    if (formData.consulting_plan) {
      const planInfo = RATES.consulting[formData.consulting_plan as keyof typeof RATES.consulting];
      const months = formData.consulting_months || 1;
      
      let monthlyRate = formData.consulting_type === '指定顧問（+費用）' 
        ? planInfo.designated 
        : planInfo.base;
      
      let ragCost = 0;
      if (formData.consulting_rag === '加購（付費）') {
        ragCost = planInfo.ragCost;
      }
      
      const consultingMonthly = monthlyRate + ragCost;
      const consultingTotal = consultingMonthly * months;
      subtotal += consultingTotal;
      
      let consultingDesc = `顧問服務（${formData.consulting_plan}）：NT$ ${consultingMonthly.toLocaleString()}/月 × ${months} 月 = NT$ ${consultingTotal.toLocaleString()}`;
      breakdown.push(consultingDesc);
    }

    // 技術指導 & 教育訓練
    if (formData.training_category && formData.training_option && formData.training_sessions > 0) {
      const categoryInfo = TRAINING_OPTIONS[formData.training_category as keyof typeof TRAINING_OPTIONS];
      const selectedOption = categoryInfo.options.find(opt => opt.value === formData.training_option);
      if (selectedOption) {
        const hoursPerSession = categoryInfo.hoursPerSession;
        const ratePerHour = selectedOption.rate;
        const costPerSession = ratePerHour * hoursPerSession;
        const total = costPerSession * formData.training_sessions;
        subtotal += total;
        
        const sessionLabel = categoryInfo.category === 'education' ? '單元' : '次';
        breakdown.push(`${categoryInfo.title}：NT$ ${costPerSession.toLocaleString()}/${sessionLabel} × ${formData.training_sessions} ${sessionLabel} = NT$ ${total.toLocaleString()}`);
      }
    }

    return { 
      subtotal, 
      breakdown,
      hasCustomPackage,
    };
  }, [formData]);

  // 驗證表單
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 客戶聯絡資訊
    if (!formData.company_name.trim()) {
      newErrors.company_name = '請填寫公司名稱';
    }
    if (!formData.contact_person.trim()) {
      newErrors.contact_person = '請填寫聯絡人姓名';
    }
    if (!formData.contact_email.trim()) {
      newErrors.contact_email = '請填寫聯絡 Email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = '請輸入有效的電子郵件格式';
    }
    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = '請填寫聯絡電話';
    }

    // 至少選擇一項服務
    const hasTraining = formData.training_category && formData.training_option && formData.training_sessions > 0;
    const hasSelection = 
      formData.transformation_package ||
      formData.consulting_plan ||
      hasTraining;
    
    if (!hasSelection) {
      newErrors.packages = '請至少選擇一項服務方案';
    }

    // 企業客製需填寫需求說明
    if (formData.transformation_package === '企業客製方案' && !formData.custom_description.trim()) {
      newErrors.custom_description = '請簡述您的客製化需求';
    }

    // 指定顧問需填寫姓名
    if (formData.consulting_plan && formData.consulting_type === '指定顧問（+費用）' && !formData.consulting_designated_name.trim()) {
      newErrors.consulting_designated_name = '請填寫指定顧問姓名';
    }

    // 選擇訓練類別後必須選擇具體選項
    if (formData.training_category && !formData.training_option) {
      newErrors.training_option = '請選擇指導形式';
    }

    // 指定講師/教練需填寫姓名
    const isDesignatedInstructor = formData.training_option?.includes('designated');
    if (formData.training_category && isDesignatedInstructor && !formData.training_designated_name.trim()) {
      newErrors.training_designated_name = '請填寫指定講師/教練姓名';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 取得訓練類型標籤
  const getTrainingCategoryLabel = (): string => {
    if (!formData.training_category) return '';
    if (formData.training_category === 'technical') return '專案技術指導';
    if (formData.training_category === 'education') return '企業教育訓練';
    if (formData.training_category === 'coaching') return '教練指導';
    return '';
  };

  // 取得訓練選項標籤
  const getTrainingOptionLabel = (): string => {
    if (!formData.training_category || !formData.training_option) return '';
    const categoryInfo = TRAINING_OPTIONS[formData.training_category as keyof typeof TRAINING_OPTIONS];
    const option = categoryInfo.options.find(opt => opt.value === formData.training_option);
    return option?.label || '';
  };

  // 構建 payload
  const buildPayload = () => ({
    // 客戶聯絡資訊
    company_name: formData.company_name.trim(),
    contact_person: formData.contact_person.trim(),
    contact_email: formData.contact_email.trim(),
    contact_phone: formData.contact_phone.trim(),
    // 發票資訊
    tax_id: formData.tax_id.trim() || null,
    invoice_title: formData.invoice_title.trim() || null,
    company_address: formData.company_address.trim() || null,
    // 陪跑與轉型方案
    transformation_package: formData.transformation_package || null,
    custom_description: formData.custom_description.trim() || null,
    // 顧問服務
    consulting_plan: formData.consulting_plan || null,
    consulting_type: formData.consulting_plan ? formData.consulting_type : null,
    consulting_months: formData.consulting_plan ? formData.consulting_months : null,
    consulting_rag: formData.consulting_plan ? formData.consulting_rag : null,
    consulting_designated_name: formData.consulting_designated_name.trim() || null,
    // 技術指導 & 教育訓練
    training_category: getTrainingCategoryLabel() || null,
    training_option: getTrainingOptionLabel() || null,
    training_sessions: formData.training_category ? formData.training_sessions : null,
    training_designated_name: formData.training_designated_name.trim() || null,
    // 其他需求
    notes: formData.notes.trim() || null,
    // 預估參考金額
    estimated_amount: priceCalculation.subtotal,
    has_custom_package: priceCalculation.hasCustomPackage,
  });

  // 點擊預覽按鈕 - 驗證後顯示確認彈窗
  const handlePreviewClick = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setShowConfirmDialog(true);
  };

  // 寫入 Supabase
  const saveToSupabase = async (payload: ReturnType<typeof buildPayload>) => {
    try {
      const { error } = await supabase
        .from('service_inquiry_submissions')
        .insert({
          company_name: payload.company_name,
          contact_person: payload.contact_person,
          contact_email: payload.contact_email,
          contact_phone: payload.contact_phone,
          tax_id: payload.tax_id,
          invoice_title: payload.invoice_title,
          company_address: payload.company_address,
          transformation_package: payload.transformation_package,
          custom_description: payload.custom_description,
          consulting_plan: payload.consulting_plan,
          consulting_type: payload.consulting_type,
          consulting_months: payload.consulting_months,
          consulting_rag: payload.consulting_rag,
          consulting_designated_name: payload.consulting_designated_name,
          training_category: payload.training_category,
          training_option: payload.training_option,
          training_sessions: payload.training_sessions,
          training_designated_name: payload.training_designated_name,
          notes: payload.notes,
          estimated_amount: payload.estimated_amount,
        });
      
      if (error) {
        console.error('Supabase insert error:', error);
      }
    } catch (err) {
      console.error('Failed to save to Supabase:', err);
    }
  };

  // 確認送出
  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    const payload = buildPayload();
    // 同時寫入 Supabase 和呼叫 webhook
    saveToSupabase(payload);
    onSubmit(payload);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    const payload = buildPayload();
    // 同時寫入 Supabase 和呼叫 webhook
    saveToSupabase(payload);
    onSubmit(payload);
  };

  // 確認彈窗內容項目
  const ConfirmItem = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between py-2 border-b border-border/30">
        <span className="text-muted-foreground text-sm">{label}</span>
        <span className="text-foreground text-sm font-medium text-right max-w-[60%]">{value}</span>
      </div>
    );
  };

  // 選擇卡片元件（支援詳細內容展示）
  const SelectionCard = ({ 
    selected, 
    onClick, 
    title, 
    price, 
    description,
    includes,
  }: { 
    selected: boolean; 
    onClick: () => void; 
    title: string; 
    price?: string; 
    description: string;
    includes?: string[];
  }) => (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl p-6 cursor-pointer transition-all duration-200",
        "border-2",
        selected 
          ? "border-primary bg-primary/5 shadow-lg" 
          : "border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
          selected ? "border-primary bg-primary" : "border-muted-foreground/40"
        )}>
          {selected && <Check className="w-4 h-4 text-primary-foreground" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="font-semibold text-foreground">{title}</h4>
            {price && <span className="text-primary font-bold">{price}</span>}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          
          {/* 包含內容明細 */}
          {includes && includes.length > 0 && (
            <div className={cn(
              "mt-3 pt-3 border-t border-border/30 space-y-1.5 transition-all duration-200",
              selected ? "opacity-100" : "opacity-60"
            )}>
              <p className="text-xs font-medium text-muted-foreground mb-2">方案包含：</p>
              {includes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                  <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* 步驟指示器 */}
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-primary">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">1</div>
          <span className="hidden sm:inline">客戶資訊</span>
        </div>
        <div className="w-8 h-0.5 bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">2</div>
          <span className="hidden sm:inline">服務選擇</span>
        </div>
      </div>

      {/* 客戶聯絡資訊 */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">客戶聯絡資訊</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassInput
            label="公司名稱"
            name="company_name"
            placeholder="例如：未來科技有限公司"
            value={formData.company_name}
            onChange={(e) => updateField('company_name', e.target.value)}
            required
            error={errors.company_name}
          />
          <GlassInput
            label="聯絡人姓名"
            name="contact_person"
            placeholder=""
            value={formData.contact_person}
            onChange={(e) => updateField('contact_person', e.target.value)}
            required
            error={errors.contact_person}
          />
          <GlassInput
            label="聯絡 Email"
            name="contact_email"
            type="email"
            placeholder="name@company.com"
            value={formData.contact_email}
            onChange={(e) => updateField('contact_email', e.target.value)}
            required
            error={errors.contact_email}
          />
          <GlassInput
            label="聯絡電話"
            name="contact_phone"
            placeholder="0912-345-678"
            value={formData.contact_phone}
            onChange={(e) => updateField('contact_phone', e.target.value)}
            required
            error={errors.contact_phone}
          />
        </div>

        {/* 發票資訊（選填） */}
        <div className="mt-8 p-6 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground mb-4">
            ▼ 若您需要正式報價單，請填寫以下發票資訊（選填）
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput
              label="統一編號"
              name="tax_id"
              placeholder="8碼數字"
              value={formData.tax_id}
              onChange={(e) => updateField('tax_id', e.target.value)}
            />
            <GlassInput
              label="發票抬頭"
              name="invoice_title"
              placeholder="若同公司名可留空"
              value={formData.invoice_title}
              onChange={(e) => updateField('invoice_title', e.target.value)}
            />
          </div>
          <div className="mt-4">
            <GlassInput
              label="公司地址"
              name="company_address"
              placeholder="發票地址"
              value={formData.company_address}
              onChange={(e) => updateField('company_address', e.target.value)}
            />
          </div>
        </div>
      </section>

      <hr className="border-border/50" />

      {/* 陪跑與轉型方案 */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">陪跑與轉型方案</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SelectionCard
            selected={formData.transformation_package === '基礎陪跑方案'}
            onClick={() => updateField('transformation_package', formData.transformation_package === '基礎陪跑方案' ? '' : '基礎陪跑方案')}
            title="基礎陪跑方案"
            price="NT$ 360,000"
            description="48小時專業指導、3個自動化流程導入"
            includes={RATES.transformation['基礎陪跑方案'].includes}
          />
          <SelectionCard
            selected={formData.transformation_package === '完整轉型方案'}
            onClick={() => updateField('transformation_package', formData.transformation_package === '完整轉型方案' ? '' : '完整轉型方案')}
            title="完整轉型方案"
            price="NT$ 480,000"
            description="含 AI Agent 建置、知識庫訓練、5個自動化流程導入"
            includes={RATES.transformation['完整轉型方案'].includes}
          />
        </div>
        
        {/* 企業客製方案 */}
        <div className={cn(
          "rounded-xl p-6 cursor-pointer transition-all duration-200 border-2",
          formData.transformation_package === '企業客製方案'
            ? "border-primary bg-primary/5 shadow-lg"
            : "border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50"
        )}
        onClick={() => updateField('transformation_package', formData.transformation_package === '企業客製方案' ? '' : '企業客製方案')}>
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
              formData.transformation_package === '企業客製方案' ? "border-primary bg-primary" : "border-muted-foreground/40"
            )}>
              {formData.transformation_package === '企業客製方案' && <Check className="w-4 h-4 text-primary-foreground" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="font-semibold text-foreground">企業客製方案</h4>
                <span className="text-muted-foreground text-sm">專人評估報價</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">適合多部門整合、私有化部署、複雜權限管理設計</p>
              
              {/* 企業客製方案包含內容 */}
              <div className={cn(
                "mt-3 pt-3 border-t border-border/30 space-y-1.5 transition-all duration-200",
                formData.transformation_package === '企業客製方案' ? "opacity-100" : "opacity-60"
              )}>
                <p className="text-xs font-medium text-muted-foreground mb-2">方案包含：</p>
                {RATES.transformation['企業客製方案'].includes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                    <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {formData.transformation_package === '企業客製方案' && (
            <div className="mt-4 pl-9" onClick={(e) => e.stopPropagation()}>
              <GlassTextarea
                label="請簡述您的客製化需求"
                name="custom_description"
                placeholder="例如：我們需要將系統部署在私有雲，並串接內部的 ERP 系統..."
                value={formData.custom_description}
                onChange={(e) => updateField('custom_description', e.target.value)}
                rows={4}
                required
                error={errors.custom_description}
              />
            </div>
          )}
        </div>
      </section>

      <hr className="border-border/50" />

      {/* 顧問服務 */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">顧問服務</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassSelect
            label="選擇方案等級"
            name="consulting_plan"
            placeholder="-- 不需此服務 --"
            value={formData.consulting_plan}
            onChange={(e) => updateField('consulting_plan', e.target.value)}
            options={[
              { value: '', label: '-- 不需此服務 --' },
              { value: '輕量型', label: '輕量型（每月1次現場指導）- NT$ 30,000/月' },
              { value: '中量型', label: '中量型（每月2次現場指導）- NT$ 50,000/月' },
              { value: '重量型', label: '重量型（每週1次現場指導）- NT$ 80,000/月' },
            ]}
          />
          
          {formData.consulting_plan && (
            <GlassSelect
              label="顧問類型"
              name="consulting_type"
              value={formData.consulting_type}
              onChange={(e) => updateField('consulting_type', e.target.value)}
              options={[
                { value: '公司指派（基礎費用）', label: '公司指派（基礎費用）' },
                { value: '指定顧問（+費用）', label: '指定顧問（+費用）' },
              ]}
            />
          )}
        </div>

        {formData.consulting_plan && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput
              label="服務月數"
              name="consulting_months"
              type="number"
              min={1}
              value={formData.consulting_months}
              onChange={(e) => updateField('consulting_months', Math.max(1, parseInt(e.target.value) || 1))}
            />
            
            {formData.consulting_type === '指定顧問（+費用）' && (
              <GlassInput
                label="指定顧問姓名"
                name="consulting_designated_name"
                placeholder="請填寫顧問姓名"
                value={formData.consulting_designated_name}
                onChange={(e) => updateField('consulting_designated_name', e.target.value)}
                required
                error={errors.consulting_designated_name}
              />
            )}
          </div>
        )}

        {formData.consulting_plan && (
          <GlassSelect
            label="AI Knowledge 知識庫助理（RAG）"
            name="consulting_rag"
            value={formData.consulting_rag}
            onChange={(e) => updateField('consulting_rag', e.target.value)}
            options={
              formData.consulting_plan === '重量型'
                ? [{ value: '已包含（重量型免費）', label: '已包含（重量型免費）' }]
                : [
                    { value: '不需要', label: '不需要' },
                    { value: '加購（付費）', label: `加購（+NT$ ${RATES.consulting[formData.consulting_plan as keyof typeof RATES.consulting]?.ragCost?.toLocaleString() || 0}/月）` },
                  ]
            }
          />
        )}

        {/* 顧問服務詳細說明 */}
        {formData.consulting_plan && (
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50 animate-fade-in">
            <h5 className="font-medium text-foreground mb-3">方案內容說明</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {formData.consulting_plan === '輕量型' && (
                <>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />每月 1 次現場指導</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />通訊提問支援</li>
                  <li className="flex items-center gap-2 text-muted-foreground/60"><span className="w-4 h-4">×</span>不含視訊通話</li>
                </>
              )}
              {formData.consulting_plan === '中量型' && (
                <>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />每月 2 次現場指導</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />通訊提問支援</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />每週 1 次視訊（60分鐘）</li>
                </>
              )}
              {formData.consulting_plan === '重量型' && (
                <>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />每週 1 次現場指導</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />通訊提問支援</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />每週 3 次視訊（共200分鐘）</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Make 協作開發帳號</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />RAG 知識庫助理已包含</li>
                </>
              )}
            </ul>
          </div>
        )}
      </section>

      <hr className="border-border/50" />

      {/* 技術指導 & 教育訓練 */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Wrench className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">技術指導 & 教育訓練</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectionCard
            selected={formData.training_category === 'technical'}
            onClick={() => updateField('training_category', formData.training_category === 'technical' ? '' : 'technical')}
            title="專案技術指導（Level 5）"
            description="針對專案開發遇到的關鍵問題，提供 1對1 手把手指導"
          />
          <SelectionCard
            selected={formData.training_category === 'education'}
            onClick={() => updateField('training_category', formData.training_category === 'education' ? '' : 'education')}
            title="企業教育訓練（Level 3+）"
            description="適用 5-30人團體課程，每單元3小時"
          />
        </div>
        
        <SelectionCard
          selected={formData.training_category === 'coaching'}
          onClick={() => updateField('training_category', formData.training_category === 'coaching' ? '' : 'coaching')}
          title="教練指導（Level 4+）"
          description="適用 5人以下小班制、1對1或團隊帶領"
        />

        {formData.training_category && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassSelect
                label={formData.training_category === 'technical' ? '講師規格' : formData.training_category === 'education' ? '課程等級與講師' : '指導形式'}
                name="training_option"
                placeholder="請選擇"
                value={formData.training_option}
                onChange={(e) => updateField('training_option', e.target.value)}
                options={TRAINING_OPTIONS[formData.training_category as keyof typeof TRAINING_OPTIONS].options}
                required
                error={errors.training_option}
              />
              <GlassInput
                label="預計次數（每次 2 小時）"
                name="training_sessions"
                type="number"
                min={1}
                value={formData.training_sessions}
                onChange={(e) => updateField('training_sessions', Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            
            {formData.training_option?.includes('designated') && (
              <GlassInput
                label="指定講師/教練姓名"
                name="training_designated_name"
                placeholder="請填寫姓名"
                value={formData.training_designated_name}
                onChange={(e) => updateField('training_designated_name', e.target.value)}
                required
                error={errors.training_designated_name}
              />
            )}
          </div>
        )}
      </section>

      <hr className="border-border/50" />

      {/* 其他需求或備註 */}
      <section>
        <GlassTextarea
          label="其他需求或備註"
          name="notes"
          placeholder="請輸入您希望開始的時間，或其他特殊需求..."
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={4}
        />
      </section>

      {/* 錯誤提示 */}
      {errors.packages && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errors.packages}
        </div>
      )}

      {/* 預估參考金額 */}
      <section className="p-6 rounded-xl bg-card/50 border border-border/50">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4">
          <span className="w-12 h-px bg-border" />
          <span>ESTIMATE</span>
          <span className="w-12 h-px bg-border" />
        </div>
        
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-lg text-foreground">預估參考金額</span>
          <span className="text-3xl font-bold text-primary">
            NT$ {priceCalculation.subtotal.toLocaleString()}
          </span>
        </div>

        {priceCalculation.hasCustomPackage && (
          <p className="text-warning text-sm mt-3">
            ※ 您勾選了客製化方案，最終報價將包含另外評估的客製化費用
          </p>
        )}

        <div className="text-right text-sm text-muted-foreground mt-4 space-y-1">
          <p>※ 此金額僅供參考，最終報價以正式報價單為準</p>
          <p>※ 顧問服務費用為單月計算</p>
        </div>
      </section>

      {/* 提交錯誤 */}
      {submitError && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {submitError}
        </div>
      )}

      {/* 預覽確認按鈕 */}
      <GlassButton
        type="button"
        variant="gradient"
        size="lg"
        onClick={handlePreviewClick}
        disabled={isSubmitting}
        className="w-full"
      >
        <Eye className="w-5 h-5 mr-2" />
        預覽並確認送出
      </GlassButton>

      {/* 確認彈窗 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Eye className="w-5 h-5 text-primary" />
              確認詢價單內容
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 客戶聯絡資訊 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                客戶聯絡資訊
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-1">
                <ConfirmItem label="公司名稱" value={formData.company_name} />
                <ConfirmItem label="聯絡人姓名" value={formData.contact_person} />
                <ConfirmItem label="聯絡 Email" value={formData.contact_email} />
                <ConfirmItem label="聯絡電話" value={formData.contact_phone} />
                <ConfirmItem label="統一編號" value={formData.tax_id} />
                <ConfirmItem label="發票抬頭" value={formData.invoice_title} />
                <ConfirmItem label="公司地址" value={formData.company_address} />
              </div>
            </div>

            {/* 服務選擇 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                服務選擇
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-1">
                {formData.transformation_package && (
                  <>
                    <ConfirmItem label="陪跑轉型方案" value={formData.transformation_package} />
                    {formData.transformation_package === '企業客製方案' && formData.custom_description && (
                      <ConfirmItem label="客製化需求說明" value={formData.custom_description} />
                    )}
                  </>
                )}
                {formData.consulting_plan && (
                  <>
                    <ConfirmItem label="顧問服務方案" value={formData.consulting_plan} />
                    <ConfirmItem label="顧問類型" value={formData.consulting_type} />
                    <ConfirmItem label="顧問服務月數" value={`${formData.consulting_months} 個月`} />
                    <ConfirmItem label="RAG 智能助理" value={formData.consulting_rag} />
                    {formData.consulting_designated_name && (
                      <ConfirmItem label="指定顧問" value={formData.consulting_designated_name} />
                    )}
                  </>
                )}
                {formData.training_category && formData.training_option && (
                  <>
                    <ConfirmItem label="訓練類別" value={getTrainingCategoryLabel()} />
                    <ConfirmItem label="訓練選項" value={getTrainingOptionLabel()} />
                    <ConfirmItem label="訓練次數/單元" value={formData.training_sessions} />
                    {formData.training_designated_name && (
                      <ConfirmItem label="指定講師/教練" value={formData.training_designated_name} />
                    )}
                  </>
                )}
                {!formData.transformation_package && !formData.consulting_plan && !formData.training_category && (
                  <p className="text-muted-foreground text-sm">尚未選擇任何服務</p>
                )}
              </div>
            </div>

            {/* 其他需求 */}
            {formData.notes && (
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-primary" />
                  其他需求或備註
                </h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{formData.notes}</p>
                </div>
              </div>
            )}

            {/* 預估金額 */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium">預估參考金額</span>
                <span className="text-2xl font-bold text-primary">
                  NT$ {priceCalculation.subtotal.toLocaleString()}
                </span>
              </div>
              {priceCalculation.hasCustomPackage && (
                <p className="text-warning text-xs mt-2">
                  ※ 包含客製化方案，最終報價將另行評估
                </p>
              )}
            </div>

            {/* 明細 */}
            {priceCalculation.breakdown.length > 0 && (
              <div className="text-xs text-muted-foreground space-y-1 bg-muted/20 p-3 rounded-lg">
                <p className="font-medium mb-2">費用明細：</p>
                {priceCalculation.breakdown.map((item, idx) => (
                  <p key={idx}>• {item}</p>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/50">
            <GlassButton
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回修改
            </GlassButton>
            <GlassButton
              type="button"
              variant="gradient"
              size="lg"
              onClick={handleConfirmSubmit}
              loading={isSubmitting}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              確認送出
            </GlassButton>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default ServiceInquiryForm;
