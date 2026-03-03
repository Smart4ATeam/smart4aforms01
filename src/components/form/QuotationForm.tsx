import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassTextarea from './GlassTextarea';
import GlassCheckbox from './GlassCheckbox';
import GlassButton from './GlassButton';
import { cn } from '@/lib/utils';
import { AlertCircle, ChevronLeft, ChevronRight, Send, Calculator } from 'lucide-react';

interface QuotationFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting: boolean;
}

// 報價人員選項與對應 Email
const ISSUER_OPTIONS = [
  { value: '丁禹勝', label: '丁禹勝', email: 'vincent@fans.tw' },
  { value: '黃竹瑄', label: '黃竹瑄', email: 'joyce@fans.tw' },
  { value: '李姿瑩', label: '李姿瑩', email: 'zin@fans.tw' },
];

// 費率表
const RATES = {
  transformation: {
    '基礎陪跑': { price: 360000, description: '48小時指導、3個自動化流程。' },
    '完整轉型': { price: 480000, description: '含 AI Agent + 知識庫 + 5個流程。' },
    '企業客製': { price: 0, description: '適合多部門整合、私有化部署。' },
  },
  consulting: {
    '輕量型': { base: 30000, designated: 50000, ragCost: 20000, description: '每月1次現場' },
    '中量型': { base: 50000, designated: 70000, ragCost: 10000, description: '每月2次現場' },
    '重量型': { base: 80000, designated: 100000, ragCost: 0, description: '每週1次現場' },
  },
};

// 技術指導 & 教育訓練選項
const TRAINING_OPTIONS = {
  // 技術指導 (Level 5)
  technical: {
    category: 'technical',
    title: '專案技術指導（Level 5）',
    description: '針對專案開發遇到的關鍵問題，提供 1對1 手把手指導',
    details: '• 專案開發進行中，遇到關鍵問題或流程設計問題\n• 每次2小時\n• 地點由教練指定',
    hoursPerSession: 2,
    options: [
      { value: 'tech_base', label: '基礎講師 - NT$ 5,000/hr', rate: 5000 },
      { value: 'tech_designated', label: '指定講師 - NT$ 7,000/hr', rate: 7000 },
    ],
  },
  // 教育訓練 (Level 3+)
  education: {
    category: 'education',
    title: '企業教育訓練（Level 3+）',
    description: '適用 5-30人團體課程，每單元3小時',
    details: '• 五人以上、三十人以下之課程單元教學\n• 每單元三小時\n• 適用於公司、團體、組織教育訓練學習\n• 客戶自備場地，台北以外縣市車資另計；線上課程則無此限制',
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
  // 教練指導 (Level 4+)
  coaching: {
    category: 'coaching',
    title: '教練指導（Level 4+）',
    description: '適用 5人以下小班制、1對1或團隊帶領',
    details: '• 五人以下之教學\n• 每次二小時\n• 地點由教練指定',
    hoursPerSession: 2,
    options: [
      { value: 'coach_1on1_base', label: '1對1手把手 - 基礎教練 - NT$ 3,000/hr', rate: 3000 },
      { value: 'coach_1on1_designated', label: '1對1手把手 - 指定教練 - NT$ 4,500/hr', rate: 4500 },
      { value: 'coach_team_base', label: '1對多(團隊帶領) - 基礎教練 - NT$ 4,500/hr', rate: 4500 },
      { value: 'coach_team_designated', label: '1對多(團隊帶領) - 指定教練 - NT$ 6,000/hr', rate: 6000 },
    ],
  },
};

const steps = [
  { id: 'issuer', title: '報價人員' },
  { id: 'customer', title: '客戶資料' },
  { id: 'packages', title: '方案選擇' },
  { id: 'summary', title: '費用總計' },
];

const QuotationForm: React.FC<QuotationFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // 表單資料
  const [formData, setFormData] = useState({
    // 報價人員資訊
    issuer_name: '',
    issuer_email: '',
    quotation_date: new Date().toISOString().split('T')[0],
    inquiry_number: '',
    // 客戶資料
    company_name: '',
    contact_person: '',
    invoice_title: '',
    tax_id: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    // 方案選擇
    transformation_package: '', // 改為單選
    custom_description: '', // 企業客製細項說明
    custom_amount: 0, // 企業客製金額
    consulting_plan: '',
    consulting_type: '公司指派（基礎費用）',
    consulting_designated_name: '', // 指定顧問姓名
    consulting_months: 1,
    consulting_rag: '不需要',
    // 技術指導 & 教育訓練
    training_category: '', // 'technical' | 'education' | 'coaching'
    training_option: '', // 選擇的費率選項
    training_sessions: 1, // 預計次數
    training_designated_name: '', // 指定講師/教練姓名
    // 費用計算
    discount_amount: 0,
    discount_reason: '',
  });

  // 從 URL 參數預填表單（除開立人員外）
  useEffect(() => {
    const prefillData: Partial<typeof formData> = {};
    
    // 報價日期 & 詢價單號
    const quotationDate = searchParams.get('quotation_date');
    if (quotationDate) prefillData.quotation_date = quotationDate;
    
    const inquiryNumber = searchParams.get('inquiry_number');
    if (inquiryNumber) prefillData.inquiry_number = inquiryNumber;
    
    // 客戶資料
    const companyName = searchParams.get('company_name');
    if (companyName) {
      prefillData.company_name = companyName;
      prefillData.invoice_title = companyName; // 同步更新發票抬頭
    }
    
    const contactPerson = searchParams.get('contact_person');
    if (contactPerson) prefillData.contact_person = contactPerson;
    
    const invoiceTitle = searchParams.get('invoice_title');
    if (invoiceTitle) prefillData.invoice_title = invoiceTitle;
    
    const taxId = searchParams.get('tax_id');
    if (taxId) prefillData.tax_id = taxId;
    
    const customerEmail = searchParams.get('customer_email');
    if (customerEmail) prefillData.customer_email = customerEmail;
    
    const customerPhone = searchParams.get('customer_phone');
    if (customerPhone) prefillData.customer_phone = customerPhone;
    
    const customerAddress = searchParams.get('customer_address');
    if (customerAddress) prefillData.customer_address = customerAddress;
    
    // 方案選擇 - 陪跑轉型
    const transformationPackage = searchParams.get('transformation_package');
    if (transformationPackage && ['基礎陪跑', '完整轉型', '企業客製'].includes(transformationPackage)) {
      prefillData.transformation_package = transformationPackage;
    }
    
    const customDescription = searchParams.get('custom_description');
    if (customDescription) prefillData.custom_description = customDescription;
    
    const customAmount = searchParams.get('custom_amount');
    if (customAmount) prefillData.custom_amount = Number(customAmount) || 0;
    
    // 方案選擇 - 顧問服務
    const consultingPlan = searchParams.get('consulting_plan');
    if (consultingPlan && ['輕量型', '中量型', '重量型'].includes(consultingPlan)) {
      prefillData.consulting_plan = consultingPlan;
      // 重量型自動設定 RAG 為已包含
      if (consultingPlan === '重量型') {
        prefillData.consulting_rag = '已包含（重量型免費）';
      }
    }
    
    const consultingType = searchParams.get('consulting_type');
    if (consultingType && ['公司指派（基礎費用）', '指定顧問（+費用）'].includes(consultingType)) {
      prefillData.consulting_type = consultingType;
    }
    
    const consultingDesignatedName = searchParams.get('consulting_designated_name');
    if (consultingDesignatedName) prefillData.consulting_designated_name = consultingDesignatedName;
    
    const consultingMonths = searchParams.get('consulting_months');
    if (consultingMonths) prefillData.consulting_months = Number(consultingMonths) || 1;
    
    const consultingRag = searchParams.get('consulting_rag');
    if (consultingRag && ['不需要', '加購（付費）', '已包含（重量型免費）'].includes(consultingRag)) {
      prefillData.consulting_rag = consultingRag;
    }
    
    // 方案選擇 - 技術指導 & 教育訓練
    const trainingCategory = searchParams.get('training_category');
    if (trainingCategory && ['technical', 'education', 'coaching'].includes(trainingCategory)) {
      prefillData.training_category = trainingCategory;
    }
    
    const trainingOption = searchParams.get('training_option');
    if (trainingOption) prefillData.training_option = trainingOption;
    
    const trainingSessions = searchParams.get('training_sessions');
    if (trainingSessions) prefillData.training_sessions = Number(trainingSessions) || 1;
    
    const trainingDesignatedName = searchParams.get('training_designated_name');
    if (trainingDesignatedName) prefillData.training_designated_name = trainingDesignatedName;
    
    // 費用計算
    const discountAmount = searchParams.get('discount_amount');
    if (discountAmount) prefillData.discount_amount = Number(discountAmount) || 0;
    
    const discountReason = searchParams.get('discount_reason');
    if (discountReason) prefillData.discount_reason = discountReason;
    
    // 如果有預填資料，更新表單
    if (Object.keys(prefillData).length > 0) {
      setFormData(prev => ({ ...prev, ...prefillData }));
    }
  }, [searchParams]);

  const updateField = (key: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };
      
      // 當選擇開立人員時，自動帶入對應 Email
      if (key === 'issuer_name') {
        const issuer = ISSUER_OPTIONS.find(opt => opt.value === value);
        if (issuer) {
          updated.issuer_email = issuer.email;
        }
      }
      
      // 當輸入公司名稱時，自動帶入發票抬頭
      if (key === 'company_name') {
        updated.invoice_title = value;
      }
      
      // 當選擇顧問方案等級為重量型時，自動設定 RAG 為已包含
      if (key === 'consulting_plan') {
        if (value === '重量型') {
          updated.consulting_rag = '已包含（重量型免費）';
        } else if (prev.consulting_rag === '已包含（重量型免費）') {
          // 如果從重量型改為其他方案，重設 RAG 為不需要
          updated.consulting_rag = '不需要';
        }
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
    
    // 各服務類別小計
    let transformationSubtotal = 0;
    let consultingSubtotal = 0;
    let trainingSubtotal = 0;

    // 陪跑轉型方案（單選）
    if (formData.transformation_package) {
      const pkg = formData.transformation_package;
      const rateInfo = RATES.transformation[pkg as keyof typeof RATES.transformation];
      if (pkg === '企業客製') {
        // 使用客製金額
        const customAmount = formData.custom_amount || 0;
        if (customAmount > 0) {
          transformationSubtotal = customAmount;
          subtotal += customAmount;
          breakdown.push(`企業客製方案：NT$ ${customAmount.toLocaleString()}`);
        } else {
          breakdown.push(`企業客製方案：客製報價`);
        }
      } else if (rateInfo.price > 0) {
        transformationSubtotal = rateInfo.price;
        subtotal += rateInfo.price;
        breakdown.push(`${pkg}方案：NT$ ${rateInfo.price.toLocaleString()}`);
      }
    }

    // 顧問服務
    if (formData.consulting_plan) {
      const planInfo = RATES.consulting[formData.consulting_plan as keyof typeof RATES.consulting];
      const months = formData.consulting_months || 1;
      
      // 指定顧問是完整價格，不是加價
      let monthlyRate = formData.consulting_type === '指定顧問（+費用）' 
        ? planInfo.designated 
        : planInfo.base;
      
      // RAG 費用依方案而異
      let ragCost = 0;
      if (formData.consulting_rag === '加購（付費）') {
        ragCost = planInfo.ragCost;
      }
      // 重量型免費已包含，ragCost 為 0
      
      const consultingMonthly = monthlyRate + ragCost;
      const consultingTotal = consultingMonthly * months;
      consultingSubtotal = consultingTotal;
      subtotal += consultingTotal;
      
      let consultingDesc = `顧問服務（${formData.consulting_plan}）：`;
      if (formData.consulting_type === '指定顧問（+費用）') {
        consultingDesc += `NT$ ${planInfo.designated.toLocaleString()}(指定顧問)`;
      } else {
        consultingDesc += `NT$ ${planInfo.base.toLocaleString()}`;
      }
      if (ragCost > 0) {
        consultingDesc += ` + NT$ ${ragCost.toLocaleString()}(RAG)`;
      }
      consultingDesc += ` = NT$ ${consultingMonthly.toLocaleString()}/月 × ${months} 月 = NT$ ${consultingTotal.toLocaleString()}`;
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
        trainingSubtotal = total;
        subtotal += total;
        
        const sessionLabel = categoryInfo.category === 'education' ? '單元' : '次';
        breakdown.push(`${categoryInfo.title}：NT$ ${ratePerHour.toLocaleString()}/hr × ${hoursPerSession}hr = NT$ ${costPerSession.toLocaleString()}/${sessionLabel} × ${formData.training_sessions} ${sessionLabel} = NT$ ${total.toLocaleString()}`);
      }
    }

    // 折扣
    const discount = formData.discount_amount || 0;
    const total = Math.max(0, subtotal - discount);

    return { 
      subtotal, 
      discount, 
      total, 
      breakdown,
      // 各服務類別小計
      transformationSubtotal,
      consultingSubtotal,
      trainingSubtotal,
    };
  }, [formData]);

  // 驗證各步驟
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // 報價人員資訊
      if (!formData.issuer_name) {
        newErrors.issuer_name = '請選擇開立人員';
      }
      if (!formData.issuer_email.trim()) {
        newErrors.issuer_email = '請填寫聯絡 Email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.issuer_email)) {
        newErrors.issuer_email = '請輸入有效的電子郵件格式';
      }
      if (!formData.quotation_date) {
        newErrors.quotation_date = '請選擇報價日期';
      }
    } else if (step === 1) {
      // 客戶資料
      if (!formData.company_name.trim()) {
        newErrors.company_name = '請填寫公司名稱';
      }
      if (!formData.contact_person.trim()) {
        newErrors.contact_person = '請填寫聯絡窗口';
      }
      if (!formData.customer_email.trim()) {
        newErrors.customer_email = '請填寫客戶 Email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
        newErrors.customer_email = '請輸入有效的電子郵件格式';
      }
      if (!formData.customer_phone.trim()) {
        newErrors.customer_phone = '請填寫聯絡電話';
      }
      if (!formData.customer_address.trim()) {
        newErrors.customer_address = '請填寫地址';
      }
    } else if (step === 2) {
      // 方案選擇 - 至少選一項
      const hasTraining = formData.training_category && formData.training_option && formData.training_sessions > 0;
      const hasSelection = 
        formData.transformation_package ||
        formData.consulting_plan ||
        hasTraining;
      
      if (!hasSelection) {
        newErrors.packages = '請至少選擇一項服務方案';
      }
      
      // 企業客製需填寫金額
      if (formData.transformation_package === '企業客製' && formData.custom_amount <= 0) {
        newErrors.custom_amount = '請填寫客製化金額';
      }
      
      // 指定顧問需填寫姓名
      if (formData.consulting_plan && formData.consulting_type === '指定顧問（+費用）' && !formData.consulting_designated_name.trim()) {
        newErrors.consulting_designated_name = '請填寫指定顧問姓名';
      }
      
      // 指定講師/教練需填寫姓名
      const isDesignatedInstructor = formData.training_option?.includes('designated');
      if (formData.training_category && isDesignatedInstructor && !formData.training_designated_name.trim()) {
        newErrors.training_designated_name = '請填寫指定講師/教練姓名';
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
    e.stopPropagation();
    setSubmitError(null);

    // 確保只有在最後一步才能提交
    if (currentStep !== steps.length - 1) {
      return;
    }

    if (!validateStep(currentStep)) {
      return;
    }

    // 取得顧問月費（不含 RAG）
    const getConsultantMonthlyFee = (): number => {
      if (!formData.consulting_plan) return 0;
      const planInfo = RATES.consulting[formData.consulting_plan as keyof typeof RATES.consulting];
      if (!planInfo) return 0;
      return formData.consulting_type === '指定顧問（+費用）' ? planInfo.designated : planInfo.base;
    };

    // 取得 RAG 加購價格
    const getRagPrice = (): number => {
      if (!formData.consulting_plan) return 0;
      const planInfo = RATES.consulting[formData.consulting_plan as keyof typeof RATES.consulting];
      if (!planInfo) return 0;
      if (formData.consulting_rag === '加購（付費）') {
        return planInfo.ragCost;
      }
      return 0;
    };

    // 取得訓練類型（依 webhook 規格：專案技術指導/企業教育訓練/教練指導）
    const getTrainingType = (): string => {
      if (!formData.training_category) return '';
      if (formData.training_category === 'technical') return '專案技術指導';
      if (formData.training_category === 'education') return '企業教育訓練';
      if (formData.training_category === 'coaching') return '教練指導';
      return '';
    };

    // 顧問等級（輕量型/中量型/重量型）
    const getConsultantTier = (): string => {
      if (!formData.consulting_plan) return '';
      return formData.consulting_plan; // 直接回傳中文：輕量型、中量型、重量型
    };
    
    // 顧問類型（基礎費用/指定顧問）
    const getConsultantType = (): string => {
      if (!formData.consulting_plan) return '';
      return formData.consulting_type === '指定顧問（+費用）' ? '指定顧問' : '基礎費用';
    };

    // 取得講師規格/課程等級（依指定的中文格式）
    const getTrainingTier = (): string => {
      if (!formData.training_category || !formData.training_option) return '';
      
      const option = formData.training_option;
      
      // 專案技術指導
      if (formData.training_category === 'technical') {
        if (option === 'tech_base') return '基礎講師';
        if (option === 'tech_designated') return '指定講師';
      }
      
      // 企業教育訓練
      if (formData.training_category === 'education') {
        if (option === 'edu_intro_base') return '入門課程_基礎講師';
        if (option === 'edu_intro_designated') return '入門課程_指定講師';
        if (option === 'edu_basic_base') return '基礎課程_基礎講師';
        if (option === 'edu_basic_designated') return '基礎課程_指定講師';
        if (option === 'edu_mid_base') return '中階課程_基礎講師';
        if (option === 'edu_mid_designated') return '中階課程_指定講師';
        if (option === 'edu_adv_base') return '進階課程_基礎講師';
        if (option === 'edu_adv_designated') return '進階課程_指定講師';
      }
      
      // 教練指導
      if (formData.training_category === 'coaching') {
        if (option === 'coach_1on1_base') return '1對1_基礎';
        if (option === 'coach_1on1_designated') return '1對1_指定';
        if (option === 'coach_team_base') return '1對多_基礎';
        if (option === 'coach_team_designated') return '1對多_指定';
      }
      
      return '';
    };

    // 產生時間戳記 YYYY-MM-DD HH:MM
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 計算顧問總價 ((月費 + RAG) × 月數)
    const consultantMonthlyFee = getConsultantMonthlyFee();
    const ragPrice = getRagPrice();
    const consultantPrice = formData.consulting_plan 
      ? (consultantMonthlyFee + ragPrice) * formData.consulting_months 
      : 0;

    // 依據新的 webhook 參數規格組裝 payload
    const payload = {
      // === 開立人資訊 ===
      issuerName: formData.issuer_name,
      issuerEmail: formData.issuer_email,
      quoteDate: formData.quotation_date,
      inquiryNumber: formData.inquiry_number || '',
      
      // === 客戶資訊 ===
      company: formData.company_name,
      contactPerson: formData.contact_person,
      email: formData.customer_email,
      phone: formData.customer_phone,
      taxId: formData.tax_id || '',
      invoiceTitle: formData.invoice_title || '',
      address: formData.customer_address,
      
      // === 服務項目 ===
      projectPlan: formData.transformation_package || '',
      customPlanDetails: formData.transformation_package === '企業客製' ? formData.custom_description : '',
      customPlanPrice: formData.transformation_package === '企業客製' ? String(formData.custom_amount) : '',
      consultantTier: getConsultantTier(),
      consultantType: getConsultantType(),
      consultantMonths: formData.consulting_plan ? formData.consulting_months : 0,
      consultantAddonRag: formData.consulting_plan ? formData.consulting_rag : '',
      designatedConsultant: formData.consulting_type === '指定顧問（+費用）' ? formData.consulting_designated_name : '',
      trainingType: getTrainingType(),
      trainingTier: getTrainingTier(),
      trainingHours: formData.training_category ? formData.training_sessions : 0,
      designatedInstructor: formData.training_option?.includes('designated') ? formData.training_designated_name : '',
      notes: formData.discount_reason || '',
      
      // === 價格資訊 ===
      projectPlanPrice: priceCalculation.transformationSubtotal,
      consultantMonthlyFee: consultantMonthlyFee,
      ragPrice: ragPrice,
      consultantPrice: consultantPrice,
      trainingPrice: priceCalculation.trainingSubtotal,
      subtotal: priceCalculation.subtotal,
      discountAmount: formData.discount_amount || 0,
      totalPrice: priceCalculation.total,
      timestamp: timestamp,
    };

    onSubmit(payload);
  };

  const isLastStep = currentStep === steps.length - 1;

  // Step 1: 報價人員資訊
  const renderIssuerInfo = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          報價人員資訊
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassSelect
            label="開立人員"
            name="issuer_name"
            value={formData.issuer_name}
            onChange={(e) => updateField('issuer_name', e.target.value)}
            options={ISSUER_OPTIONS}
            placeholder="請選擇開立人員"
            error={errors.issuer_name}
            required
          />
          <GlassInput
            label="聯絡 Email"
            name="issuer_email"
            type="email"
            placeholder="請輸入聯絡 Email"
            value={formData.issuer_email}
            onChange={(e) => updateField('issuer_email', e.target.value)}
            error={errors.issuer_email}
            required
          />
          <GlassInput
            label="報價日期"
            name="quotation_date"
            type="date"
            value={formData.quotation_date}
            onChange={(e) => updateField('quotation_date', e.target.value)}
            error={errors.quotation_date}
            required
          />
          <GlassInput
            label="詢價單號"
            name="inquiry_number"
            placeholder="若有詢價單號請填入"
            value={formData.inquiry_number}
            onChange={(e) => updateField('inquiry_number', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  // Step 2: 客戶資料
  const renderCustomerInfo = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          客戶資料
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="公司名稱"
            name="company_name"
            placeholder="請輸入公司名稱"
            value={formData.company_name}
            onChange={(e) => updateField('company_name', e.target.value)}
            error={errors.company_name}
            required
          />
          <GlassInput
            label="聯絡窗口"
            name="contact_person"
            placeholder="請輸入聯絡窗口姓名"
            value={formData.contact_person}
            onChange={(e) => updateField('contact_person', e.target.value)}
            error={errors.contact_person}
            required
          />
          <GlassInput
            label="發票抬頭"
            name="invoice_title"
            placeholder="請輸入發票抬頭"
            value={formData.invoice_title}
            onChange={(e) => updateField('invoice_title', e.target.value)}
          />
          <GlassInput
            label="統一編號"
            name="tax_id"
            placeholder="請輸入統一編號"
            value={formData.tax_id}
            onChange={(e) => updateField('tax_id', e.target.value)}
          />
          <GlassInput
            label="客戶 Email"
            name="customer_email"
            type="email"
            placeholder="請輸入客戶 Email"
            value={formData.customer_email}
            onChange={(e) => updateField('customer_email', e.target.value)}
            error={errors.customer_email}
            required
          />
          <GlassInput
            label="聯絡電話"
            name="customer_phone"
            type="tel"
            placeholder="請輸入聯絡電話"
            value={formData.customer_phone}
            onChange={(e) => updateField('customer_phone', e.target.value)}
            error={errors.customer_phone}
            required
          />
          <div className="md:col-span-2">
            <GlassInput
              label="地址"
              name="customer_address"
              placeholder="請輸入地址"
              value={formData.customer_address}
              onChange={(e) => updateField('customer_address', e.target.value)}
              error={errors.customer_address}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: 方案選擇
  const renderPackageSelection = () => (
    <div className="space-y-6 animate-fade-in">
      {/* 陪跑轉型方案 - 單選卡片 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          陪跑與轉型方案
        </h3>
        
        {/* 基礎陪跑 & 完整轉型 - 並排 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['基礎陪跑', '完整轉型'] as const).map((name) => {
            const rateInfo = RATES.transformation[name];
            const isSelected = formData.transformation_package === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => updateField('transformation_package', isSelected ? '' : name)}
                className={cn(
                  'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                    )}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                    </div>
                    <span className="font-medium text-foreground">{name}方案</span>
                  </div>
                  <span className="text-primary font-semibold whitespace-nowrap">
                    NT$ {rateInfo.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 ml-8">
                  {rateInfo.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* 企業客製方案 - 獨立一行 */}
        {(() => {
          const name = '企業客製';
          const rateInfo = RATES.transformation[name];
          const isSelected = formData.transformation_package === name;
          return (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => updateField('transformation_package', isSelected ? '' : name)}
                className={cn(
                  'relative w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                    )}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                    </div>
                    <span className="font-medium text-foreground">{name}方案</span>
                  </div>
                  <span className="text-primary font-semibold">客製報價</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 ml-8">
                  {rateInfo.description}
                </p>
              </button>
              
              {/* 企業客製展開欄位 */}
              {isSelected && (
                <div className="ml-0 p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4 animate-fade-in">
                  <GlassTextarea
                    label="細項說明"
                    name="custom_description"
                    placeholder="輸入客製化項目..."
                    value={formData.custom_description}
                    onChange={(e) => updateField('custom_description', e.target.value)}
                    rows={4}
                  />
                  <GlassInput
                    label="客製化金額 (NT$)"
                    name="custom_amount"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formData.custom_amount}
                    onChange={(e) => updateField('custom_amount', parseInt(e.target.value) || 0)}
                    error={errors.custom_amount}
                    className="text-primary"
                  />
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* 顧問服務 (月費) */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          顧問服務 (月費)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassSelect
            label="方案等級"
            name="consulting_plan"
            value={formData.consulting_plan}
            onChange={(e) => updateField('consulting_plan', e.target.value)}
            options={[
              { value: '', label: '不選擇' },
              { value: '輕量型', label: `輕量型（${RATES.consulting['輕量型'].description}）- NT$ ${RATES.consulting['輕量型'].base.toLocaleString()}/月` },
              { value: '中量型', label: `中量型（${RATES.consulting['中量型'].description}）- NT$ ${RATES.consulting['中量型'].base.toLocaleString()}/月` },
              { value: '重量型', label: `重量型（${RATES.consulting['重量型'].description}）- NT$ ${RATES.consulting['重量型'].base.toLocaleString()}/月` },
            ]}
            placeholder="請選擇方案等級"
          />
          
          {/* 方案詳細說明 */}
          {formData.consulting_plan && (
            <div className="md:col-span-2 p-4 rounded-xl bg-muted/30 border border-border/30 space-y-2 text-sm animate-fade-in">
              <p className="font-medium text-foreground mb-2">
                {formData.consulting_plan}服務內容：
              </p>
              {formData.consulting_plan === '輕量型' && (
                <ul className="space-y-1.5 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">●</span>
                    <span>每月一次現場指導，每次三小時</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">●</span>
                    <span>通訊提問：有（Email、Line 等）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">○</span>
                    <span className="text-muted-foreground">視訊提問：無</span>
                  </li>
                  <li className="flex items-start gap-2 mt-2 pt-2 border-t border-border/20">
                    <span className="text-accent">★</span>
                    <span className="text-foreground/60">適用於初期學習或自動化專案規劃協助</span>
                  </li>
                </ul>
              )}
              {formData.consulting_plan === '中量型' && (
                <ul className="space-y-1.5 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">●</span>
                    <span>每月二次現場指導，每次三小時</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">●</span>
                    <span>通訊提問：有（Email、Line 等）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">●</span>
                    <span>視訊提問：有（每週最多一次、每次60分鐘）</span>
                  </li>
                  <li className="flex items-start gap-2 mt-2 pt-2 border-t border-border/20">
                    <span className="text-accent">★</span>
                    <span className="text-foreground/60">適用於公司導入自動化服務、開發自動化流程</span>
                  </li>
                </ul>
              )}
              {formData.consulting_plan === '重量型' && (
                <ul className="space-y-1.5 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">●</span>
                    <span>每週一次現場指導，每次三小時</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">●</span>
                    <span>通訊提問：有（Email、Line 等）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">●</span>
                    <span>視訊提問：有（每週最多三次、總和不超過200分鐘）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">●</span>
                    <span>開通 Make 共同開發權限</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">●</span>
                    <span className="text-primary font-medium">免費提供 RAG 知識庫助理（價值 NT$ 40,000/月）</span>
                  </li>
                  <li className="flex items-start gap-2 mt-2 pt-2 border-t border-border/20">
                    <span className="text-accent">★</span>
                    <span className="text-foreground/60">適用於公司密集導入自動化流程與開發建置</span>
                  </li>
                </ul>
              )}
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/20">
                * 台北以外縣市車資另計
              </p>
            </div>
          )}
          
          {/* 只有選擇顧問方案時才顯示以下欄位 */}
          {formData.consulting_plan && (
            <>
              <GlassSelect
                label="顧問類型"
                name="consulting_type"
                value={formData.consulting_type}
                onChange={(e) => updateField('consulting_type', e.target.value)}
                options={[
                  { value: '公司指派（基礎費用）', label: '公司指派（基礎費用）' },
                  { value: '指定顧問（+費用）', label: '指定顧問（+NT$ 20,000/月）' },
                ]}
                placeholder="請選擇顧問類型"
              />
              
              {/* 當選擇指定顧問時顯示姓名欄位 */}
              {formData.consulting_type === '指定顧問（+費用）' && (
                <GlassInput
                  label="指定顧問姓名"
                  name="consulting_designated_name"
                  placeholder="請輸入指定的顧問姓名"
                  value={formData.consulting_designated_name}
                  onChange={(e) => updateField('consulting_designated_name', e.target.value)}
                  error={errors.consulting_designated_name}
                  required
                />
              )}
              
              <GlassSelect
                label="服務月數"
                name="consulting_months"
                value={formData.consulting_months.toString()}
                onChange={(e) => updateField('consulting_months', parseInt(e.target.value) || 1)}
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
                  { value: '10', label: '10 個月' },
                  { value: '11', label: '11 個月' },
                  { value: '12', label: '12 個月' },
                ]}
                placeholder="請選擇服務月數"
              />
              <div className={formData.consulting_type === '指定顧問（+費用）' ? '' : 'md:col-span-1'}>
                <GlassSelect
                  label="RAG 知識庫助理"
                  name="consulting_rag"
                  value={formData.consulting_rag}
                  onChange={(e) => updateField('consulting_rag', e.target.value)}
                  options={(() => {
                    const planInfo = RATES.consulting[formData.consulting_plan as keyof typeof RATES.consulting];
                    const ragCost = planInfo?.ragCost || 0;
                    const isHeavy = formData.consulting_plan === '重量型';
                    
                    if (isHeavy) {
                      // 重量型：只顯示「已包含」選項
                      return [
                        { value: '已包含（重量型免費）', label: '已包含（重量型免費）' },
                      ];
                    } else {
                      // 輕量型、中量型：只顯示「不需要」和「加購」
                      return [
                        { value: '不需要', label: '不需要' },
                        { value: '加購（付費）', label: `加購（+NT$ ${ragCost.toLocaleString()}/月）` },
                      ];
                    }
                  })()}
                  placeholder="請選擇 RAG 知識庫助理"
                />
              </div>
            </>
          )}
        </div>
        {formData.consulting_plan && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-foreground/70">
                <span>方案基本費</span>
                <span>NT$ {RATES.consulting[formData.consulting_plan as keyof typeof RATES.consulting]?.base?.toLocaleString() || 0}/月</span>
              </div>
              {formData.consulting_type === '指定顧問（+費用）' && (
                <div className="flex justify-between text-foreground/70">
                  <span>指定顧問</span>
                  <span>+ NT$ 20,000/月</span>
                </div>
              )}
              {formData.consulting_rag === '加購（付費）' && (
                <div className="flex justify-between text-foreground/70">
                  <span>RAG 知識庫助理</span>
                  <span>+ NT$ {RATES.consulting[formData.consulting_plan as keyof typeof RATES.consulting]?.ragCost?.toLocaleString() || 0}/月</span>
                </div>
              )}
              {formData.consulting_rag === '已包含（重量型免費）' && (
                <div className="flex justify-between text-foreground/70">
                  <span>RAG 知識庫助理</span>
                  <span className="text-primary">已包含（免費）</span>
                </div>
              )}
              <div className="border-t border-border/30 pt-2 mt-2 flex justify-between font-medium">
                <span>月費小計</span>
                <span className="text-primary">
                  NT$ {(() => {
                    const planInfo = RATES.consulting[formData.consulting_plan as keyof typeof RATES.consulting];
                    if (!planInfo) return 0;
                    let monthly = formData.consulting_type === '指定顧問（+費用）' 
                      ? planInfo.designated 
                      : planInfo.base;
                    if (formData.consulting_rag === '加購（付費）') {
                      monthly += planInfo.ragCost;
                    }
                    return monthly.toLocaleString();
                  })()}/月
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>總計（{formData.consulting_months} 個月）</span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  NT$ {(() => {
                    const planInfo = RATES.consulting[formData.consulting_plan as keyof typeof RATES.consulting];
                    if (!planInfo) return 0;
                    let monthly = formData.consulting_type === '指定顧問（+費用）' 
                      ? planInfo.designated 
                      : planInfo.base;
                    if (formData.consulting_rag === '加購（付費）') {
                      monthly += planInfo.ragCost;
                    }
                    return (monthly * formData.consulting_months).toLocaleString();
                  })()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 技術指導 & 教育訓練 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2 flex items-center gap-2">
          <span className="text-primary">🔧</span>
          技術指導 & 教育訓練
        </h3>
        
        {/* 類別選擇卡片 - 技術指導和教育訓練並排 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['technical', 'education'] as const).map((category) => {
            const info = TRAINING_OPTIONS[category];
            const isSelected = formData.training_category === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    updateField('training_category', '');
                    updateField('training_option', '');
                    updateField('training_sessions', 1);
                  } else {
                    updateField('training_category', category);
                    updateField('training_option', info.options[0].value);
                    updateField('training_sessions', 1);
                  }
                }}
                className={cn(
                  'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 mt-0.5',
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                  )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{info.title}</span>
                    <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 教練指導卡片 - 獨立一行 */}
        {(() => {
          const category = 'coaching' as const;
          const info = TRAINING_OPTIONS[category];
          const isSelected = formData.training_category === category;
          return (
            <button
              type="button"
              onClick={() => {
                if (isSelected) {
                  updateField('training_category', '');
                  updateField('training_option', '');
                  updateField('training_sessions', 1);
                } else {
                  updateField('training_category', category);
                  updateField('training_option', info.options[0].value);
                  updateField('training_sessions', 1);
                }
              }}
              className={cn(
                'relative w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 mt-0.5',
                  isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                )}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                </div>
                <div>
                  <span className="font-medium text-foreground">{info.title}</span>
                  <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                </div>
              </div>
            </button>
          );
        })()}

        {/* 選擇類別後顯示詳細選項 */}
        {formData.training_category && (
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4 animate-fade-in">
            {(() => {
              const categoryInfo = TRAINING_OPTIONS[formData.training_category as keyof typeof TRAINING_OPTIONS];
              const selectedOption = categoryInfo.options.find(opt => opt.value === formData.training_option);
              const hoursPerSession = categoryInfo.hoursPerSession;
              const costPerSession = selectedOption ? selectedOption.rate * hoursPerSession : 0;
              const sessionLabel = categoryInfo.category === 'education' ? '單元' : '次';
              
              return (
                <>
                  <GlassSelect
                    label={categoryInfo.category === 'education' ? `課程等級（團體 5-30人）` : categoryInfo.category === 'coaching' ? '指導形式（1對1 / 團隊帶領）' : '講師規格'}
                    name="training_option"
                    value={formData.training_option}
                    onChange={(e) => {
                      updateField('training_option', e.target.value);
                      // 如果從指定切換到基礎，清除指定講師姓名
                      if (!e.target.value.includes('designated')) {
                        updateField('training_designated_name', '');
                      }
                    }}
                    options={categoryInfo.options.map(opt => ({ value: opt.value, label: opt.label }))}
                    placeholder="請選擇"
                  />
                  
                  {/* 選擇指定講師/教練時顯示姓名欄位 */}
                  {formData.training_option.includes('designated') && (
                    <GlassInput
                      label="指定講師/教練姓名"
                      name="training_designated_name"
                      placeholder="請輸入指定的講師或教練姓名"
                      value={formData.training_designated_name}
                      onChange={(e) => updateField('training_designated_name', e.target.value)}
                      error={errors.training_designated_name}
                      required
                    />
                  )}
                  
                  <GlassInput
                    label={`預計${sessionLabel}數（每${sessionLabel}${hoursPerSession}小時）`}
                    name="training_sessions"
                    type="number"
                    min={1}
                    value={formData.training_sessions}
                    onChange={(e) => updateField('training_sessions', parseInt(e.target.value) || 1)}
                  />

                  {/* 費用預覽 */}
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-foreground/70">小計</span>
                      <span className="font-semibold text-primary">
                        NT$ {costPerSession.toLocaleString()}/{sessionLabel} × {formData.training_sessions} {sessionLabel} = NT$ {(costPerSession * formData.training_sessions).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* 注意事項 */}
                  <p className="text-xs text-muted-foreground whitespace-pre-line">
                    {categoryInfo.details}
                  </p>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {errors.packages && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
          <AlertCircle className="w-4 h-4" />
          {errors.packages}
        </div>
      )}
    </div>
  );

  // Step 4: 費用總計
  const renderSummary = () => (
    <div className="space-y-6 animate-fade-in">
      {/* 費用明細 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2 flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          費用明細
        </h3>
        
        {priceCalculation.breakdown.length > 0 ? (
          <div className="space-y-2">
            {priceCalculation.breakdown.map((item, index) => (
              <div key={index} className="text-sm text-foreground/80 py-1 border-b border-border/20 last:border-0">
                {item}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">尚未選擇任何方案</p>
        )}

        <div className="border-t border-border/30 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/70">原價小計</span>
            <span className="font-medium">NT$ {priceCalculation.subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 特別折扣 */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground border-b border-border/30 pb-2">
          特別折扣
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="折扣金額"
            name="discount_amount"
            type="number"
            min={0}
            placeholder="0"
            value={formData.discount_amount}
            onChange={(e) => updateField('discount_amount', parseInt(e.target.value) || 0)}
          />
          <GlassInput
            label="折扣說明"
            name="discount_reason"
            placeholder="例如：早鳥優惠、老客戶折扣"
            value={formData.discount_reason}
            onChange={(e) => updateField('discount_reason', e.target.value)}
          />
        </div>
      </div>

      {/* 最終報價 */}
      <div className="glass rounded-xl p-6 space-y-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-foreground">最終報價總額</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NT$ {priceCalculation.total.toLocaleString()}
          </span>
        </div>
        {priceCalculation.discount > 0 && (
          <p className="text-sm text-muted-foreground">
            已折抵 NT$ {priceCalculation.discount.toLocaleString()}
            {formData.discount_reason && `（${formData.discount_reason}）`}
          </p>
        )}
      </div>

      {submitError && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
          <AlertCircle className="w-4 h-4" />
          {submitError}
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderIssuerInfo();
      case 1:
        return renderCustomerInfo();
      case 2:
        return renderPackageSelection();
      case 3:
        return renderSummary();
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
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
                    'w-6 h-[2px] rounded-full transition-colors duration-300',
                    index < currentStep ? 'bg-[hsl(270_50%_45%)]' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      {renderStepContent()}

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
            type="button"
            variant="gradient"
            loading={isSubmitting}
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
          >
            <Send className="w-4 h-4" />
            產生報價單
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

export default QuotationForm;
