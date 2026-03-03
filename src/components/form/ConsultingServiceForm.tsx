import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassTextarea from './GlassTextarea';
import GlassCheckbox from './GlassCheckbox';
import GlassRadio from './GlassRadio';
import GlassButton from './GlassButton';
import { cn } from '@/lib/utils';
import { AlertCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface ConsultingServiceFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting: boolean;
}

// 費率表
const RATES = {
  training: {
    入門: { 基礎費用: 6000, 指定講師: 8000 },
    基礎: { 基礎費用: 7000, 指定講師: 9000 },
    中階: { 基礎費用: 8000, 指定講師: 10000 },
    高階: { 基礎費用: 10000, 指定講師: 12000 },
  },
  coaching: {
    一對一: { 基礎費用: 3000, 指定講師: 5000 },
    一對多: { 基礎費用: 5000, 指定講師: 7000 },
  },
  technical: {
    基礎費用: 6000,
    指定講師: 8000,
  },
  consulting: {
    輕量型: { 基礎費用: 30000, 指定顧問: 50000, ragAddon: 20000 },
    中量型: { 基礎費用: 50000, 指定顧問: 70000, ragAddon: 10000 },
    重量型: { 基礎費用: 80000, 指定顧問: 100000, ragAddon: 0 },
  },
};

const steps = [
  { id: 'basic', title: '基本資訊' },
  { id: 'service', title: '服務選擇' },
  { id: 'time-price', title: '時段與費用' },
  { id: 'payment', title: '付款確認' },
];

const ConsultingServiceForm: React.FC<ConsultingServiceFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // 表單資料
  const [formData, setFormData] = useState({
    // 基本資訊
    customer_name_company: '',
    email: '',
    email_confirm: '',
    mobile: '',
    zip_code: '',
    address: '',
    // 隱藏欄位
    dealer: searchParams.get('dealer') || '',
    ref: searchParams.get('ref') || '',
    // 服務選擇
    service_category: '',
    // 教育訓練
    training_level: '',
    pricing_tier: '',
    units: 1,
    // 教練指導
    coaching_mode: '',
    sessions: 1,
    // 顧問服務
    consulting_plan: '',
    months: 1,
    rag_addon: false,
    // 通用
    specified_person: '',
    // 時段
    preferred_time_slots: [] as string[],
    // 付款發票
    payment_method: '',
    invoice_type: '',
    invoice_title: '',
    invoice_tax_id: '',
    // 備註
    notes: '',
  });

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  // 計算費用
  const priceCalculation = useMemo(() => {
    const { service_category, training_level, pricing_tier, units, coaching_mode, sessions, consulting_plan, months, rag_addon } = formData;
    
    let total = 0;
    let breakdown: string[] = [];

    if (service_category === '教育訓練' && training_level && pricing_tier) {
      const level = training_level as keyof typeof RATES.training;
      const tier = pricing_tier as keyof typeof RATES.training['基礎'];
      const rate = RATES.training[level]?.[tier] || 0;
      const hours = 3;
      total = rate * hours * units;
      breakdown = [
        `服務類別：教育訓練`,
        `課程等級：${training_level}`,
        `計價方案：${pricing_tier}`,
        `費率：NT$ ${rate.toLocaleString()} / 小時`,
        `時數：${hours} 小時 / 單元`,
        `單元數：${units}`,
        `小計：NT$ ${total.toLocaleString()}`,
      ];
    } else if (service_category === '教練指導' && coaching_mode && pricing_tier) {
      const mode = coaching_mode as keyof typeof RATES.coaching;
      const tier = pricing_tier as keyof typeof RATES.coaching['一對一'];
      const rate = RATES.coaching[mode]?.[tier] || 0;
      const hours = 2;
      total = rate * hours * sessions;
      breakdown = [
        `服務類別：教練指導`,
        `指導形式：${coaching_mode}`,
        `計價方案：${pricing_tier}`,
        `費率：NT$ ${rate.toLocaleString()} / 小時`,
        `時數：${hours} 小時 / 次`,
        `次數：${sessions}`,
        `小計：NT$ ${total.toLocaleString()}`,
      ];
    } else if (service_category === '技術指導' && pricing_tier) {
      const tier = pricing_tier === '基礎費用' ? '基礎費用' : '指定講師';
      const rate = RATES.technical[tier as keyof typeof RATES.technical] || 0;
      const hours = 2;
      total = rate * hours * sessions;
      breakdown = [
        `服務類別：技術指導`,
        `計價方案：${pricing_tier}`,
        `費率：NT$ ${rate.toLocaleString()} / 小時`,
        `時數：${hours} 小時 / 次`,
        `次數：${sessions}`,
        `小計：NT$ ${total.toLocaleString()}`,
      ];
    } else if (service_category === '顧問服務' && consulting_plan && pricing_tier) {
      const plan = consulting_plan as keyof typeof RATES.consulting;
      const tier = pricing_tier === '基礎費用' ? '基礎費用' : '指定顧問';
      const planRates = RATES.consulting[plan];
      const baseRate = planRates?.[tier as keyof typeof planRates] || 0;
      const addonRate = planRates?.ragAddon || 0;
      const addonCost = rag_addon ? addonRate : 0;
      const monthlyTotal = baseRate + addonCost;
      total = monthlyTotal * months;

      breakdown = [
        `服務類別：顧問服務`,
        `方案：${consulting_plan}`,
        `計價方案：${pricing_tier}`,
        `月費：NT$ ${baseRate.toLocaleString()} / 月`,
      ];
      
      if (rag_addon && plan !== '重量型') {
        breakdown.push(`AI RAG 加購：NT$ ${addonRate.toLocaleString()} / 月`);
      } else if (plan === '重量型') {
        breakdown.push(`AI RAG 服務：已含（免費提供）`);
      }
      
      breakdown.push(`月數：${months}`);
      breakdown.push(`總計：NT$ ${total.toLocaleString()}`);
    }

    return { total, breakdown };
  }, [formData]);

  // 驗證各步驟
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // 基本資訊
      if (!formData.customer_name_company.trim()) {
        newErrors.customer_name_company = '請填寫姓名或公司行號';
      }
      if (!formData.email.trim()) {
        newErrors.email = '請填寫電子郵件';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '請輸入有效的電子郵件格式';
      }
      if (!formData.email_confirm.trim()) {
        newErrors.email_confirm = '請再次輸入電子郵件';
      } else if (formData.email !== formData.email_confirm) {
        newErrors.email_confirm = '兩次輸入的電子郵件不一致';
      }
      if (!formData.mobile.trim()) {
        newErrors.mobile = '請填寫行動電話';
      } else if (!/^09\d{8}$/.test(formData.mobile.replace(/[-\s]/g, ''))) {
        newErrors.mobile = '請輸入有效的手機號碼格式（09開頭共10碼）';
      }
    } else if (step === 1) {
      // 服務選擇
      if (!formData.service_category) {
        newErrors.service_category = '請選擇服務類別';
      }

      if (formData.service_category === '教育訓練') {
        if (!formData.training_level) newErrors.training_level = '請選擇課程等級';
        if (!formData.pricing_tier) newErrors.pricing_tier = '請選擇計價方案';
      } else if (formData.service_category === '教練指導') {
        if (!formData.coaching_mode) newErrors.coaching_mode = '請選擇指導形式';
        if (!formData.pricing_tier) newErrors.pricing_tier = '請選擇計價方案';
      } else if (formData.service_category === '技術指導') {
        if (!formData.pricing_tier) newErrors.pricing_tier = '請選擇計價方案';
      } else if (formData.service_category === '顧問服務') {
        if (!formData.consulting_plan) newErrors.consulting_plan = '請選擇顧問方案';
        if (!formData.pricing_tier) newErrors.pricing_tier = '請選擇計價方案';
      }

      // 指定講師/顧問
      if (formData.pricing_tier === '指定講師' || formData.pricing_tier === '指定顧問') {
        if (!formData.specified_person.trim()) {
          newErrors.specified_person = '請填寫指定人員姓名';
        }
      }
    } else if (step === 2) {
      // 時段
      if (formData.preferred_time_slots.length === 0) {
        newErrors.preferred_time_slots = '請選擇至少一個期望服務時段';
      }
    } else if (step === 3) {
      // 付款發票
      if (!formData.payment_method) {
        newErrors.payment_method = '請選擇付款方式';
      }
      if (!formData.invoice_type) {
        newErrors.invoice_type = '請選擇發票種類';
      }
      if (formData.invoice_type === '三聯式') {
        if (!formData.invoice_title.trim()) {
          newErrors.invoice_title = '三聯式發票需填寫發票抬頭';
        }
        if (!formData.invoice_tax_id.trim()) {
          newErrors.invoice_tax_id = '三聯式發票需填寫統一編號';
        } else if (!/^\d{8}$/.test(formData.invoice_tax_id)) {
          newErrors.invoice_tax_id = '統一編號為8碼數字';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateStep(currentStep)) {
      return;
    }

    // 計算方案單價（含 RAG 加購費用）
    const getUnitPrice = (): string => {
      const { service_category, training_level, pricing_tier, coaching_mode, consulting_plan, rag_addon } = formData;
      
      if (service_category === '教育訓練' && training_level && pricing_tier) {
        const level = training_level as keyof typeof RATES.training;
        const tier = pricing_tier as keyof typeof RATES.training['基礎'];
        const rate = RATES.training[level]?.[tier] || 0;
        return `TWD ${rate.toLocaleString()}/小時`;
      } else if (service_category === '教練指導' && coaching_mode && pricing_tier) {
        const mode = coaching_mode as keyof typeof RATES.coaching;
        const tier = pricing_tier as keyof typeof RATES.coaching['一對一'];
        const rate = RATES.coaching[mode]?.[tier] || 0;
        return `TWD ${rate.toLocaleString()}/小時`;
      } else if (service_category === '技術指導' && pricing_tier) {
        const tier = pricing_tier === '基礎費用' ? '基礎費用' : '指定講師';
        const rate = RATES.technical[tier as keyof typeof RATES.technical] || 0;
        return `TWD ${rate.toLocaleString()}/小時`;
      } else if (service_category === '顧問服務' && consulting_plan && pricing_tier) {
        const plan = consulting_plan as keyof typeof RATES.consulting;
        const tier = pricing_tier === '基礎費用' ? '基礎費用' : '指定顧問';
        const planRates = RATES.consulting[plan];
        const baseRate = planRates?.[tier as keyof typeof planRates] || 0;
        const addonRate = planRates?.ragAddon || 0;
        
        // 計算含 RAG 加購的月費
        if (rag_addon && plan !== '重量型') {
          const totalMonthly = baseRate + addonRate;
          return `TWD ${totalMonthly.toLocaleString()}/月（含 RAG 加購 TWD ${addonRate.toLocaleString()}）`;
        } else if (plan === '重量型') {
          return `TWD ${baseRate.toLocaleString()}/月（RAG 已含）`;
        }
        return `TWD ${baseRate.toLocaleString()}/月`;
      }
      return '';
    };

    // 取得標準服務時數
    const getStandardServiceHours = (): string => {
      const { service_category } = formData;
      
      if (service_category === '教育訓練') {
        return '每單元 3 小時';
      } else if (service_category === '教練指導') {
        return '每次 2 小時';
      } else if (service_category === '技術指導') {
        return '每次 2 小時';
      } else if (service_category === '顧問服務') {
        return '月費制（不限時數）';
      }
      return '';
    };

    const payload = {
      customer_name_company: formData.customer_name_company,
      email: formData.email,
      mobile: formData.mobile,
      zip_code: formData.zip_code,
      address: formData.address,
      referral_code: formData.ref,
      reseller_code: formData.dealer,
      coupon_code: '',
      service_category: formData.service_category,
      training_level: formData.training_level,
      coaching_mode: formData.coaching_mode,
      consulting_plan: formData.consulting_plan,
      pricing_tier: formData.pricing_tier,
      units: formData.units,
      sessions: formData.sessions,
      months: formData.months,
      rag_addon: formData.rag_addon,
      specified_person: formData.specified_person,
      preferred_time_slots: formData.preferred_time_slots,
      payment_method: formData.payment_method,
      invoice_type: formData.invoice_type,
      invoice_title: formData.invoice_title,
      invoice_tax_id: formData.invoice_tax_id,
      notes: formData.notes,
      unit_price: getUnitPrice(),
      standard_service_hours: getStandardServiceHours(),
      price_breakdown: priceCalculation.breakdown.join('\n'),
      total_price: priceCalculation.total,
    };

    onSubmit(payload);
  };

  const handleTimeSlotChange = (slot: string) => {
    const current = formData.preferred_time_slots;
    if (current.includes(slot)) {
      updateField('preferred_time_slots', current.filter(s => s !== slot));
    } else {
      updateField('preferred_time_slots', [...current, slot]);
    }
  };

  // 重設服務相關欄位
  useEffect(() => {
    if (formData.service_category) {
      setFormData(prev => ({
        ...prev,
        training_level: '',
        coaching_mode: '',
        consulting_plan: '',
        pricing_tier: '',
        units: 1,
        sessions: 1,
        months: 1,
        rag_addon: false,
        specified_person: '',
      }));
    }
  }, [formData.service_category]);

  // 預設勾選顧問服務時段
  useEffect(() => {
    if (formData.service_category === '顧問服務' && !formData.preferred_time_slots.includes('顧問服務')) {
      updateField('preferred_time_slots', [...formData.preferred_time_slots, '顧問服務']);
    }
  }, [formData.service_category]);

  const needsSpecifiedPerson = formData.pricing_tier === '指定講師' || formData.pricing_tier === '指定顧問';

  const timeSlotOptions = [
    { value: '平日-白天', label: '平日-白天' },
    { value: '平日-晚上', label: '平日-晚上' },
    { value: '週末假日-白天', label: '週末假日-白天' },
    { value: '週末假日-晚上', label: '週末假日-晚上' },
    { value: '顧問服務', label: '顧問服務' },
  ];

  const isLastStep = currentStep === steps.length - 1;

  // Step 1: 基本資訊
  const renderBasicInfo = () => (
    <div className="space-y-6 animate-fade-in">
      {/* 頁首介紹 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Smart4A 教學指導與顧問服務
        </h2>
        <div className="text-sm text-foreground/80 space-y-3 leading-relaxed">
          <p className="font-medium text-primary/90">
            Smart4A Team 是 MAKE.com 在台灣唯一的正式授權合作夥伴。
          </p>
          <p>
            我們專注於自動化流程的設計與優化，特別是針對make.com等平台的場景流程設計，提供專業的輔導與教學：各種Operation使用方式的深度指導，幫助您有效管理與自動化工作流程，針對AI技術的應用，如智慧客服系統，我們提供AI生成結果的調教服務，幫助提升客服效率與顧客滿意度。
          </p>
          <p>
            透過我們的專業指導，您將能夠大幅提升工作效率，實現業務流程的自動化，減少人力資源的浪費。
          </p>
        </div>
      </div>

      {/* 基本資訊表單 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          基本資訊
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="姓名/公司行號"
            name="customer_name_company"
            placeholder="請輸入姓名或公司行號"
            value={formData.customer_name_company}
            onChange={(e) => updateField('customer_name_company', e.target.value)}
            error={errors.customer_name_company}
            required
          />
          <GlassInput
            label="行動電話"
            name="mobile"
            type="tel"
            placeholder="0912345678"
            value={formData.mobile}
            onChange={(e) => updateField('mobile', e.target.value)}
            error={errors.mobile}
            required
          />
          <GlassInput
            label="電子郵件信箱"
            name="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={errors.email}
            required
          />
          <GlassInput
            label="確認電子郵件信箱"
            name="email_confirm"
            type="email"
            placeholder="請再次輸入電子郵件"
            value={formData.email_confirm}
            onChange={(e) => updateField('email_confirm', e.target.value)}
            error={errors.email_confirm}
            required
          />
          <GlassInput
            label="郵遞區號"
            name="zip_code"
            placeholder="選填"
            value={formData.zip_code}
            onChange={(e) => updateField('zip_code', e.target.value)}
          />
          <GlassInput
            label="地址"
            name="address"
            placeholder="選填"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  // Step 2: 服務選擇
  const renderServiceSelection = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          服務選擇
        </h3>
        <GlassSelect
          label="服務選擇"
          name="service_category"
          placeholder="請選擇服務類別"
          options={[
            { value: '教育訓練', label: '教育訓練' },
            { value: '教練指導', label: '教練指導' },
            { value: '技術指導', label: '技術指導' },
            { value: '顧問服務', label: '顧問服務' },
          ]}
          value={formData.service_category}
          onChange={(e) => updateField('service_category', e.target.value)}
          error={errors.service_category}
          required
        />

        {/* 教育訓練 */}
        {formData.service_category === '教育訓練' && (
          <div className="space-y-5 pt-4 border-t border-border/20">
            {/* 說明卡片 */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
              {/* 標題區 */}
              <div className="px-5 py-3 bg-primary/10 border-b border-primary/20">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  教育訓練
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    講師為原廠認證資格 Level 3 以上
                  </span>
                </h4>
              </div>
              
              {/* 內容區 */}
              <div className="p-5 space-y-4">
                {/* 服務說明 */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    5-30 人團體課程
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    公司、團體、組織適用
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    每單元 3 小時
                  </span>
                </div>

                {/* 費率表 */}
                <div className="rounded-lg border border-border/30 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-4 py-2.5 text-left font-medium text-foreground/80">課程等級</th>
                        <th className="px-4 py-2.5 text-right font-medium text-foreground/80">基礎費用</th>
                        <th className="px-4 py-2.5 text-right font-medium text-foreground/80">指定講師</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-foreground">入門課程</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 6,000/時</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 8,000/時</td>
                      </tr>
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-foreground">基礎課程</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 7,000/時</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 9,000/時</td>
                      </tr>
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-foreground">中階課程</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 8,000/時</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 10,000/時</td>
                      </tr>
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-foreground">高階課程</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 10,000/時</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 12,000/時</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 注意事項 */}
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    客戶自備場地，台北以外縣市車資另計；線上課程則無此限制
                  </p>
                </div>
              </div>
            </div>

            {/* 表單選項 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassRadio
                name="training_level"
                label="課程等級"
                options={[
                  { value: '入門', label: '入門課程' },
                  { value: '基礎', label: '基礎課程' },
                  { value: '中階', label: '中階課程' },
                  { value: '高階', label: '高階課程' },
                ]}
                value={formData.training_level}
                onChange={(value) => updateField('training_level', value)}
                error={errors.training_level}
                required
              />
              <GlassRadio
                name="pricing_tier"
                label="計價方案"
                options={[
                  { value: '基礎費用', label: '基礎費用' },
                  { value: '指定講師', label: '指定講師' },
                ]}
                value={formData.pricing_tier}
                onChange={(value) => updateField('pricing_tier', value)}
                error={errors.pricing_tier}
                required
              />
              <GlassInput
                label="單元數"
                name="units"
                type="number"
                min={1}
                value={formData.units}
                onChange={(e) => updateField('units', Math.max(1, parseInt(e.target.value) || 1))}
                required
              />
            </div>
          </div>
        )}

        {/* 教練指導 */}
        {formData.service_category === '教練指導' && (
          <div className="space-y-5 pt-4 border-t border-border/20">
            {/* 說明卡片 */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
              {/* 標題區 */}
              <div className="px-5 py-3 bg-primary/10 border-b border-primary/20">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  教練指導
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    教練為原廠認證資格 Level 4 以上
                  </span>
                </h4>
              </div>
              
              {/* 內容區 */}
              <div className="p-5 space-y-4">
                {/* 服務說明 */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    5 人以下教學
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    每次 2 小時
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    地點由教練指定
                  </span>
                </div>

                {/* 費率表 */}
                <div className="rounded-lg border border-border/30 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-4 py-2.5 text-left font-medium text-foreground/80">指導形式</th>
                        <th className="px-4 py-2.5 text-left font-medium text-foreground/80">說明</th>
                        <th className="px-4 py-2.5 text-right font-medium text-foreground/80">基礎費用</th>
                        <th className="px-4 py-2.5 text-right font-medium text-foreground/80">指定講師</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-foreground">一對一指導</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          教練手把手指導<br/>
                          <span className="text-foreground/60">適用於想短期學習技巧或專案開發範本指導或輔導取得認證</span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 3,000/時</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 5,000/時</td>
                      </tr>
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-foreground">一對多指導</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          開發團隊帶領<br/>
                          <span className="text-foreground/60">適用於帶領團隊專案開發設計、範本指導或團隊學習或輔導取得認證</span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 5,000/時</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 7,000/時</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 表單選項 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassRadio
                name="coaching_mode"
                label="指導形式"
                options={[
                  { value: '一對一', label: '一對一' },
                  { value: '一對多', label: '一對多' },
                ]}
                value={formData.coaching_mode}
                onChange={(value) => updateField('coaching_mode', value)}
                error={errors.coaching_mode}
                required
              />
              <GlassRadio
                name="pricing_tier"
                label="計價方案"
                options={[
                  { value: '基礎費用', label: '基礎費用' },
                  { value: '指定講師', label: '指定講師' },
                ]}
                value={formData.pricing_tier}
                onChange={(value) => updateField('pricing_tier', value)}
                error={errors.pricing_tier}
                required
              />
              <GlassInput
                label="次數"
                name="sessions"
                type="number"
                min={1}
                value={formData.sessions}
                onChange={(e) => updateField('sessions', Math.max(1, parseInt(e.target.value) || 1))}
                required
              />
            </div>
          </div>
        )}

        {/* 技術指導 */}
        {formData.service_category === '技術指導' && (
          <div className="space-y-5 pt-4 border-t border-border/20">
            {/* 說明卡片 */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
              {/* 標題區 */}
              <div className="px-5 py-3 bg-primary/10 border-b border-primary/20">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  技術指導
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    教練為原廠頂級認證資格 Level 5
                  </span>
                </h4>
              </div>
              
              {/* 內容區 */}
              <div className="p-5 space-y-4">
                {/* 服務說明 */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    關鍵問題或流程設計問題
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    每次 2 小時
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    地點由教練指定
                  </span>
                </div>

                {/* 費率表 */}
                <div className="rounded-lg border border-border/30 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-4 py-2.5 text-left font-medium text-foreground/80">服務項目</th>
                        <th className="px-4 py-2.5 text-left font-medium text-foreground/80">說明</th>
                        <th className="px-4 py-2.5 text-right font-medium text-foreground/80">基礎費用</th>
                        <th className="px-4 py-2.5 text-right font-medium text-foreground/80">指定講師</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-foreground">專案技術指導</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          專案開發進行中，遇到關鍵問題或流程設計問題<br/>
                          <span className="text-foreground/60">適用於專案或產品開發過程中，遇到流程開發或設計的問題</span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 6,000/時</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">NT$ 8,000/時</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 表單選項 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassRadio
                name="pricing_tier"
                label="計價方案"
                options={[
                  { value: '基礎費用', label: '基礎費用' },
                  { value: '指定講師', label: '指定講師' },
                ]}
                value={formData.pricing_tier}
                onChange={(value) => updateField('pricing_tier', value)}
                error={errors.pricing_tier}
                required
              />
              <GlassInput
                label="次數"
                name="sessions"
                type="number"
                min={1}
                value={formData.sessions}
                onChange={(e) => updateField('sessions', Math.max(1, parseInt(e.target.value) || 1))}
                required
              />
            </div>
          </div>
        )}

        {/* 顧問服務 */}
        {formData.service_category === '顧問服務' && (
          <div className="space-y-5 pt-4 border-t border-border/20">
            {/* 說明卡片 */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
              {/* 標題區 */}
              <div className="px-5 py-3 bg-primary/10 border-b border-primary/20">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  顧問服務
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    顧問為原廠頂級認證資格 Level 5
                  </span>
                </h4>
              </div>
              
              {/* 內容區 */}
              <div className="p-5 space-y-4">
                {/* 服務說明 */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    視企業需求度選擇方案
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    每次 3 小時
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    通訊提問支援
                  </span>
                </div>

                {/* 方案比較表 */}
                <div className="rounded-lg border border-border/30 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-3 py-2.5 text-left font-medium text-foreground/80">方案</th>
                        <th className="px-3 py-2.5 text-left font-medium text-foreground/80">服務內容</th>
                        <th className="px-3 py-2.5 text-right font-medium text-foreground/80">基礎費用</th>
                        <th className="px-3 py-2.5 text-right font-medium text-foreground/80">指定顧問</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {/* 輕量型 */}
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-3 font-medium text-foreground align-top">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                            輕量型
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          <div className="space-y-1">
                            <p>• 每月一次現場指導</p>
                            <p>• 通訊提問（Email、Line 等）</p>
                            <p className="text-foreground/60 mt-2">適用於初期學習或自動化專案規劃協助、輔導公司自動化流程規劃與設計、自動化流程設計建議</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right text-muted-foreground align-top whitespace-nowrap">NT$ 30,000/月</td>
                        <td className="px-3 py-3 text-right text-muted-foreground align-top whitespace-nowrap">NT$ 50,000/月</td>
                      </tr>
                      {/* 中量型 */}
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-3 font-medium text-foreground align-top">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-medium">
                            中量型
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          <div className="space-y-1">
                            <p>• 每月二次現場指導</p>
                            <p>• 通訊提問（Email、Line 等）</p>
                            <p>• 視訊提問（每週最多一次、每次60分鐘）</p>
                            <p className="text-foreground/60 mt-2">適用於公司導入自動化服務、開發自動化服務流程，選擇使用套件的建議</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right text-muted-foreground align-top whitespace-nowrap">NT$ 50,000/月</td>
                        <td className="px-3 py-3 text-right text-muted-foreground align-top whitespace-nowrap">NT$ 70,000/月</td>
                      </tr>
                      {/* 重量型 */}
                      <tr className="hover:bg-muted/20 transition-colors bg-primary/5">
                        <td className="px-3 py-3 font-medium text-foreground align-top">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                            重量型
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          <div className="space-y-1">
                            <p>• 每週一次現場指導</p>
                            <p>• 通訊提問（Email、Line 等）</p>
                            <p>• 視訊提問（每週最多三次、總和不超過 200 分鐘）</p>
                            <p>• 開通 make 共同開發權限</p>
                            <p>• 協助關鍵問題</p>
                            <p className="text-foreground/60 mt-2">適用於公司密集導入自動化流程與開發建置，或系統上線時需要密集配合修改與除錯的技術協助</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right text-muted-foreground align-top whitespace-nowrap">NT$ 80,000/月</td>
                        <td className="px-3 py-3 text-right text-muted-foreground align-top whitespace-nowrap">NT$ 100,000/月</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* AI RAG 加購說明 */}
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3">
                  <h5 className="font-medium text-foreground text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    加購：智慧型 AI Knowledge 動態 RAG 訓練助理導入
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    價值 40,000 / 月，協助企業動態建置 Auto Agent 知識庫
                  </p>
                  <div className="rounded-lg border border-border/30 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="px-3 py-2 text-left font-medium text-foreground/80">方案</th>
                          <th className="px-3 py-2 text-right font-medium text-foreground/80">基礎費用 + AI RAG</th>
                          <th className="px-3 py-2 text-right font-medium text-foreground/80">指定顧問 + AI RAG</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        <tr className="hover:bg-muted/20 transition-colors">
                          <td className="px-3 py-2 text-muted-foreground">輕量型</td>
                          <td className="px-3 py-2 text-right text-muted-foreground">NT$ 30,000 + 20,000/月</td>
                          <td className="px-3 py-2 text-right text-muted-foreground">NT$ 50,000 + 20,000/月</td>
                        </tr>
                        <tr className="hover:bg-muted/20 transition-colors">
                          <td className="px-3 py-2 text-muted-foreground">中量型</td>
                          <td className="px-3 py-2 text-right text-muted-foreground">NT$ 50,000 + 10,000/月</td>
                          <td className="px-3 py-2 text-right text-muted-foreground">NT$ 70,000 + 10,000/月</td>
                        </tr>
                        <tr className="hover:bg-muted/20 transition-colors bg-primary/5">
                          <td className="px-3 py-2 text-primary font-medium">重量型</td>
                          <td className="px-3 py-2 text-right text-primary font-medium" colSpan={2}>免費贈送（價值 40,000/月）</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 注意事項 */}
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    台北以外縣市車資另計
                  </p>
                </div>
              </div>
            </div>

            {/* 表單選項 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassRadio
                name="consulting_plan"
                label="方案"
                options={[
                  { value: '輕量型', label: '輕量型' },
                  { value: '中量型', label: '中量型' },
                  { value: '重量型', label: '重量型' },
                ]}
                value={formData.consulting_plan}
                onChange={(value) => updateField('consulting_plan', value)}
                error={errors.consulting_plan}
                required
              />
              <GlassRadio
                name="pricing_tier"
                label="計價方案"
                options={[
                  { value: '基礎費用', label: '基礎費用' },
                  { value: '指定顧問', label: '指定顧問' },
                ]}
                value={formData.pricing_tier}
                onChange={(value) => updateField('pricing_tier', value)}
                error={errors.pricing_tier}
                required
              />
              <GlassInput
                label="月數"
                name="months"
                type="number"
                min={1}
                value={formData.months}
                onChange={(e) => updateField('months', Math.max(1, parseInt(e.target.value) || 1))}
                required
              />
            </div>

            {/* AI RAG 加購選項 */}
            <div className="space-y-2">
              <GlassCheckbox
                name="rag_addon"
                label={`加購：智慧型 AI Knowledge 動態 RAG 訓練助理導入${formData.consulting_plan === '重量型' ? '（已含，免費提供）' : ''}`}
                checked={formData.rag_addon || formData.consulting_plan === '重量型'}
                onChange={(e) => updateField('rag_addon', e.target.checked)}
                disabled={formData.consulting_plan === '重量型'}
              />
              <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3 ml-6">
                <span className="font-medium">附註：</span>Auto Agent 是 Smart4A 精心打造的 RAG 動態更新服務，專注於實現知識庫的持續動態更新與學習，助力企業流程自動化及知識管理的高效落地。作為 AI Agent 的核心支柱，Auto Agent 為智慧客服與智慧助理的構建提供了穩定可靠的運作核心。
              </div>
            </div>
          </div>
        )}

        {/* 指定人員欄位 */}
        {needsSpecifiedPerson && (
          <GlassInput
            label="指定講師/教練/顧問"
            name="specified_person"
            placeholder="請輸入指定人員姓名"
            value={formData.specified_person}
            onChange={(e) => updateField('specified_person', e.target.value)}
            error={errors.specified_person}
            required
          />
        )}
      </div>
    </div>
  );

  // Step 3: 時段與費用
  const renderTimeAndPrice = () => (
    <div className="space-y-6 animate-fade-in">
      {/* 期望服務時段 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          期望服務時段
        </h3>
        <div className="space-y-2">
          {timeSlotOptions.map((slot) => (
            <GlassCheckbox
              key={slot.value}
              name={`time_slot_${slot.value}`}
              label={slot.label}
              checked={formData.preferred_time_slots.includes(slot.value)}
              onChange={() => handleTimeSlotChange(slot.value)}
            />
          ))}
          {errors.preferred_time_slots && (
            <p className="text-xs text-destructive">{errors.preferred_time_slots}</p>
          )}
        </div>
      </div>

      {/* 費用 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          費用
        </h3>
        {priceCalculation.breakdown.length > 0 ? (
          <div className="space-y-3">
            <div className="bg-muted/30 rounded-lg p-4 space-y-1">
              {priceCalculation.breakdown.map((line, idx) => (
                <p key={idx} className="text-sm text-foreground/80">{line}</p>
              ))}
            </div>
            <div className="flex justify-between items-center bg-primary/10 rounded-lg p-4">
              <span className="font-semibold text-foreground">費用總計</span>
              <span className="text-2xl font-bold text-primary">
                NT$ {priceCalculation.total.toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">
            請選擇服務類別與方案以計算費用
          </div>
        )}
      </div>

      {/* 備註 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          備註
        </h3>
        <GlassTextarea
          label="備註"
          name="notes"
          placeholder="如有其他需求或說明，請填寫於此"
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );

  // Step 4: 付款確認
  const renderPaymentConfirmation = () => (
    <div className="space-y-6 animate-fade-in">
      {/* 付款與發票 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          付款與發票
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassSelect
            label="付款方式"
            name="payment_method"
            placeholder="請選擇付款方式"
            options={[
              { value: '刷卡', label: '刷卡' },
              { value: 'ATM轉帳', label: 'ATM轉帳' },
              { value: '公司匯款', label: '公司匯款' },
            ]}
            value={formData.payment_method}
            onChange={(e) => updateField('payment_method', e.target.value)}
            error={errors.payment_method}
            required
          />
          <GlassSelect
            label="發票種類"
            name="invoice_type"
            placeholder="請選擇發票種類"
            options={[
              { value: '二聯式', label: '二聯式' },
              { value: '三聯式', label: '三聯式' },
            ]}
            value={formData.invoice_type}
            onChange={(e) => updateField('invoice_type', e.target.value)}
            error={errors.invoice_type}
            required
          />
        </div>
        {formData.invoice_type === '三聯式' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput
              label="發票抬頭"
              name="invoice_title"
              placeholder="請輸入發票抬頭"
              value={formData.invoice_title}
              onChange={(e) => updateField('invoice_title', e.target.value)}
              error={errors.invoice_title}
              required
            />
            <GlassInput
              label="統一編號"
              name="invoice_tax_id"
              placeholder="請輸入統一編號（8碼）"
              value={formData.invoice_tax_id}
              onChange={(e) => updateField('invoice_tax_id', e.target.value)}
              error={errors.invoice_tax_id}
              required
            />
          </div>
        )}
      </div>

      {/* 訂單摘要 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          訂單摘要
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">訂購人</span>
            <span className="text-foreground">{formData.customer_name_company}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">電子郵件</span>
            <span className="text-foreground">{formData.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">行動電話</span>
            <span className="text-foreground">{formData.mobile}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">服務類別</span>
            <span className="text-foreground">{formData.service_category}</span>
          </div>
          {formData.service_category === '教育訓練' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">課程等級</span>
                <span className="text-foreground">{formData.training_level}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">單元數</span>
                <span className="text-foreground">{formData.units}</span>
              </div>
            </>
          )}
          {formData.service_category === '教練指導' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">指導形式</span>
                <span className="text-foreground">{formData.coaching_mode}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">次數</span>
                <span className="text-foreground">{formData.sessions}</span>
              </div>
            </>
          )}
          {formData.service_category === '技術指導' && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">次數</span>
              <span className="text-foreground">{formData.sessions}</span>
            </div>
          )}
          {formData.service_category === '顧問服務' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">方案</span>
                <span className="text-foreground">{formData.consulting_plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">月數</span>
                <span className="text-foreground">{formData.months}</span>
              </div>
              {(formData.rag_addon || formData.consulting_plan === '重量型') && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">AI RAG 服務</span>
                  <span className="text-foreground">{formData.consulting_plan === '重量型' ? '已含（免費）' : '已加購'}</span>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">計價方案</span>
            <span className="text-foreground">{formData.pricing_tier}</span>
          </div>
          {needsSpecifiedPerson && formData.specified_person && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">指定人員</span>
              <span className="text-foreground">{formData.specified_person}</span>
            </div>
          )}
          <div className="border-t border-border/30 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">費用總計</span>
              <span className="text-2xl font-bold text-primary">
                NT$ {priceCalculation.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderServiceSelection();
      case 2:
        return renderTimeAndPrice();
      case 3:
        return renderPaymentConfirmation();
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
      <div key={currentStep}>
        {getStepContent()}
      </div>

      {/* 錯誤提示 */}
      {submitError && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/20 border border-destructive/30 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

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

        {isLastStep ? (
          <GlassButton
            type="submit"
            variant="gradient"
            loading={isSubmitting}
          >
            <Send className="w-4 h-4" />
            提交表單
          </GlassButton>
        ) : (
          <GlassButton type="button" variant="gradient" onClick={goToNext}>
            下一步
            <ChevronRight className="w-4 h-4" />
          </GlassButton>
        )}
      </div>
    </form>
  );
};

export default ConsultingServiceForm;
