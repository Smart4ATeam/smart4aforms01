import type { Json } from '@/integrations/supabase/types';

export interface PrefillParam {
  key: string;
  label: string;
  description?: string;
}

// Webhook 資料欄位介面
export interface WebhookField {
  key: string;
  label: string;
  type?: 'string' | 'number' | 'array' | 'object' | 'boolean';
  description?: string;
}

// 選項配置介面
export interface FormOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuizCourseDateOption {
  courseName: string;
  dates: string[];
}

export interface RetrainingCourseDateOption {
  courseValue: string;     // e.g., 'design-flow-intro'
  courseName: string;      // e.g., '設計流程(入門) - 複訓'
  webhookLabel: string;    // Label for webhook
  webhookDateKey: string;  // Key for date in webhook
  isSingleDay: boolean;    // Is single day course
  dates: string[];         // Dates array
}

export interface FormOptionsConfig {
  packages?: FormOption[];
  templates?: FormOption[];
  courseDates?: FormOption[];
  eventDates?: FormOption[];
  quizCourseDates?: QuizCourseDateOption[];
  retrainingCourseDates?: RetrainingCourseDateOption[];
  categories?: FormOption[];
  creators?: FormOption[];
  priceTiers?: { twd: number; usd: number }[];
  fillers?: FormOption[];
  identityTypes?: FormOption[];
}

export interface OptionsInfo {
  lineRange: string;      // 例如 "113-130"
  notes?: string[];       // 額外注意事項
}

// Primary categories (exactly one required)
export type PrimaryCategory = '自動化商城' | '課程相關' | '內部管理' | '外部合作' | '教學顧問' | '產品相關';

// Attribute examples (optional, max one)
export type FormAttribute = '英文版' | '中文版' | '產品領用' | '簽署流程' | string;

export interface FormClassification {
  primaryCategory: PrimaryCategory;
  attribute?: FormAttribute;
}

export interface FormConfig {
  id: string;
  name: string;
  displayName?: string; // 儀表板顯示名稱（若未設定則使用 name）
  description: string;
  scenarioName: string;
  scenarioUrl: string;
  webhookUrl: string;
  path: string;
  hasSignature: boolean;
  isMultiStep: boolean;
  status: 'active' | 'draft' | 'inactive';
  classification?: FormClassification; // 表單分類
  prefillParams?: PrefillParam[];
  webhookFields?: WebhookField[]; // Webhook 傳送的資料結構
  options?: FormOptionsConfig; // 表單選項配置
  optionsInfo?: OptionsInfo;   // 選項設定資訊（行數、注意事項）
}

export const forms: FormConfig[] = [
  {
    id: '7',
    name: '範本商城訂購表',
    displayName: '範本商城',
    description: '自動化範本商城下單/申請（中文版）',
    scenarioName: 'TEMP商城-01-接收訂單 NEW',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4473107/edit',
    webhookUrl: 'https://hook.us1.make.com/mdpz6nygwcdhwfl096cwhkc5vh4svenu',
    path: 'template-store',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '自動化商城', attribute: '中文版' },
    prefillParams: [
      { key: 'template_id', label: 'Template ID', description: '範本識別碼（隱藏欄位）' },
      { key: 'template', label: 'Template', description: '範本名稱' },
      { key: 'price', label: '費用', description: 'TWD 金額' },
      { key: 'ref', label: '推薦碼', description: '或使用 referral_code' },
      { key: 'dealer', label: '經銷商代碼', description: '或使用 dealer_code' },
      { key: 'nameOrCompany', label: '姓名或公司行號' },
      { key: 'email', label: '電子郵件' },
      { key: 'phone', label: '聯絡電話' },
    ],
    webhookFields: [
      { key: 'nameOrCompany', label: '姓名/公司', type: 'string' },
      { key: 'email', label: '電子郵件', type: 'string' },
      { key: 'phone', label: '聯絡電話', type: 'string' },
      { key: 'postalCode', label: '郵遞區號', type: 'string' },
      { key: 'address', label: '地址', type: 'string' },
      { key: 'template', label: 'Template（範本名稱）', type: 'string' },
      { key: 'template_id', label: 'Template ID', type: 'string', description: '隱藏欄位' },
      { key: 'price', label: '費用', type: 'number' },
      { key: 'referral_code', label: '推薦碼', type: 'string', description: '隱藏欄位' },
      { key: 'dealer_code', label: '經銷商代碼', type: 'string', description: '隱藏欄位' },
      { key: 'paymentMethod', label: '付款方式', type: 'string', description: '0=ibon / 1=ATM / 2=信用卡（費用>0時）' },
      { key: 'invoiceType', label: '發票種類', type: 'string', description: '0=二聯式 / 1=三聯式（費用>0時）' },
      { key: 'invoiceTitle', label: '發票抬頭', type: 'string', description: '三聯式時必填' },
      { key: 'taxId', label: '統一編號', type: 'string', description: '三聯式時必填' },
      { key: 'currency', label: '幣別', type: 'string', description: 'TWD' },
    ],
  },
  {
    id: '8',
    name: 'Template Store',
    displayName: '範本商城 英文版',
    description: 'Automation Template Store Order/Application',
    scenarioName: 'TEMP商城-01-接收訂單 NEW',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4473107/edit',
    webhookUrl: 'https://hook.us1.make.com/mdpz6nygwcdhwfl096cwhkc5vh4svenu',
    path: 'template-store-en',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '自動化商城', attribute: '英文版' },
    prefillParams: [
      { key: 'template_id', label: 'Template ID', description: 'Hidden field' },
      { key: 'template', label: 'Template', description: 'Template name' },
      { key: 'price', label: 'Price', description: 'USD amount' },
      { key: 'ref', label: 'Referral Code', description: 'or use referral_code' },
      { key: 'dealer', label: 'Dealer Code', description: 'or use dealer_code' },
      { key: 'nameOrCompany', label: 'Name or Company' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'country', label: 'Country' },
    ],
    webhookFields: [
      { key: 'nameOrCompany', label: 'Name/Company', type: 'string' },
      { key: 'email', label: 'Email', type: 'string' },
      { key: 'emailConfirm', label: 'Email Confirm', type: 'string' },
      { key: 'phone', label: 'Phone', type: 'string' },
      { key: 'country', label: 'Country', type: 'string' },
      { key: 'template', label: 'Template', type: 'string' },
      { key: 'template_id', label: 'Template ID', type: 'string', description: 'Hidden field' },
      { key: 'price', label: 'Price', type: 'number' },
      { key: 'referral_code', label: 'Referral Code', type: 'string', description: 'Hidden field' },
      { key: 'dealer_code', label: 'Dealer Code', type: 'string', description: 'Hidden field' },
      { key: 'currency', label: 'Currency', type: 'string', description: 'USD' },
    ],
  },
  {
    id: '1',
    name: '自動化商城',
    description: '自動化模組訂購表單',
    scenarioName: 'APP商城-01-接收訂單(含續約)NEW',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4462094/edit',
    webhookUrl: 'https://hook.us1.make.com/x19jz82mlhxldoqfgnsiap2dox8lwchm',
    path: 'automation-marketplace',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '自動化商城', attribute: '中文版' },
    prefillParams: [
      { key: 'nameOrCompany', label: '姓名或公司行號' },
      { key: 'email', label: '電子郵件' },
      { key: 'phone', label: '聯絡電話' },
      { key: 'makeOrganizationId', label: 'Make Organization ID' },
      { key: 'module', label: '自動化模組名稱' },
      { key: 'plan', label: '方案', description: 'monthly 或 yearly' },
      { key: 'unitPrice', label: '方案月單價' },
      { key: 'distributorId', label: '經銷商 ID' },
      { key: 'referralCode', label: '推薦碼' },
      { key: 'appId', label: 'App ID' },
      { key: 'originalExpiryDate', label: '原到期日', description: '續約時使用' },
      { key: 'originalKey', label: '原金鑰', description: '續約時使用' },
      { key: 'originalOrderNumber', label: '原始單號', description: '續約時使用' },
      { key: 'lovableEmail', label: 'Lovable 登入用 E-mail', description: 'Lovable Migration Tool 專用' },
    ],
    webhookFields: [
      { key: 'nameOrCompany', label: '姓名/公司', type: 'string' },
      { key: 'email', label: '電子郵件', type: 'string' },
      { key: 'emailConfirm', label: '確認電子郵件', type: 'string' },
      { key: 'phone', label: '聯絡電話', type: 'string' },
      { key: 'postalCode', label: '郵遞區號', type: 'string' },
      { key: 'address', label: '地址', type: 'string' },
      { key: 'distributorId', label: '經銷商 ID', type: 'string' },
      { key: 'referralCode', label: '推薦碼', type: 'string' },
      { key: 'originalExpiryDate', label: '原到期日', type: 'string', description: '續約時有值' },
      { key: 'originalKey', label: '原金鑰', type: 'string', description: '續約時有值' },
      { key: 'appId', label: 'App ID', type: 'string' },
      { key: 'makeOrganizationId', label: 'Make Organization ID', type: 'string' },
      { key: 'automationModule', label: '自動化模組', type: 'string' },
      { key: 'plan', label: '方案', type: 'string', description: 'monthly / yearly' },
      { key: 'purchaseMonths', label: '購買月數', type: 'string', description: '月繳時使用' },
      { key: 'unitPrice', label: '方案月單價', type: 'string' },
      { key: 'activationDate', label: '啟用日期', type: 'string' },
      { key: 'paymentMethod', label: '付款方式', type: 'string', description: '0=ibon / 1=ATM / 2=信用卡' },
      { key: 'invoiceType', label: '發票種類', type: 'string', description: '0=二聯式 / 1=三聯式' },
      { key: 'invoiceTitle', label: '發票抬頭', type: 'string' },
      { key: 'taxId', label: '統一編號', type: 'string' },
      { key: 'totalCost', label: '費用總計', type: 'number' },
      { key: 'currency', label: '幣別', type: 'string', description: 'TWD' },
    ],
  },
  {
    id: '5',
    name: 'Automation Marketplace (EN)',
    displayName: '自動化商城 英文版',
    description: 'Automation Module Order Form (English)',
    scenarioName: 'APP商城-01-接收訂單(含續約)NEW',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4462094/edit',
    webhookUrl: 'https://hook.us1.make.com/x19jz82mlhxldoqfgnsiap2dox8lwchm',
    path: 'automation-marketplace-en',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '自動化商城', attribute: '英文版' },
    prefillParams: [
      { key: 'nameOrCompany', label: 'Name or Company' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'country', label: 'Country' },
      { key: 'makeOrganizationId', label: 'Make Organization ID' },
      { key: 'module', label: 'Automation Module' },
      { key: 'plan', label: 'Plan', description: 'monthly or yearly' },
      { key: 'unitPrice', label: 'Monthly Unit Price (USD)' },
      { key: 'distributorId', label: 'Distributor ID' },
      { key: 'referralCode', label: 'Referral Code' },
      { key: 'appId', label: 'App ID' },
      { key: 'originalExpiryDate', label: 'Original Expiry Date', description: 'For renewals' },
      { key: 'originalKey', label: 'Original Key', description: 'For renewals' },
      { key: 'originalOrderNumber', label: 'Original Order Number', description: 'For renewals' },
      { key: 'lovableEmail', label: 'Lovable Login Email', description: 'For Lovable Migration Tool' },
    ],
    webhookFields: [
      { key: 'nameOrCompany', label: 'Name/Company', type: 'string' },
      { key: 'email', label: 'Email', type: 'string' },
      { key: 'emailConfirm', label: 'Email Confirm', type: 'string' },
      { key: 'phone', label: 'Phone', type: 'string' },
      { key: 'country', label: 'Country', type: 'string' },
      { key: 'distributorId', label: 'Distributor ID', type: 'string' },
      { key: 'referralCode', label: 'Referral Code', type: 'string' },
      { key: 'originalExpiryDate', label: 'Original Expiry Date', type: 'string' },
      { key: 'originalKey', label: 'Original Key', type: 'string' },
      { key: 'appId', label: 'App ID', type: 'string' },
      { key: 'makeOrganizationId', label: 'Make Organization ID', type: 'string' },
      { key: 'automationModule', label: 'Automation Module', type: 'string' },
      { key: 'plan', label: 'Plan', type: 'string', description: 'monthly / yearly' },
      { key: 'purchaseMonths', label: 'Purchase Months', type: 'string' },
      { key: 'unitPrice', label: 'Unit Price', type: 'string' },
      { key: 'activationDate', label: 'Activation Date', type: 'string' },
      { key: 'totalCost', label: 'Total Cost', type: 'number' },
      { key: 'currency', label: 'Currency', type: 'string', description: 'USD' },
    ],
  },
  {
    id: '6',
    name: '學員產品領用申請表',
    description: '學員專用自動化商城產品領用申請',
    scenarioName: 'APP商城-01-接收學員申請',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4020463/edit',
    webhookUrl: 'https://hook.us1.make.com/146wel4iuunysjri969skjkt0pt5qyao',
    path: 'student-product-claim',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '課程相關', attribute: '產品領用' },
    prefillParams: [
      { key: 'nameOrCompany', label: '姓名或公司行號' },
      { key: 'studentId', label: '學員編號' },
      { key: 'email', label: '電子郵件' },
      { key: 'makeOrganizationId', label: 'Make Organization ID' },
    ],
    webhookFields: [
      { key: 'nameOrCompany', label: '姓名/公司', type: 'string' },
      { key: 'studentId', label: '學員編號', type: 'string' },
      { key: 'email', label: '電子郵件', type: 'string' },
      { key: 'confirmEmail', label: '確認電子郵件', type: 'string' },
      { key: 'makeOrganizationId', label: 'Make Organization ID', type: 'string' },
      { key: 'packages', label: '已選套件', type: 'array', description: '套件名稱陣列' },
      { key: 'template', label: '已選樣板', type: 'string', description: '單一樣板名稱' },
      { key: 'claimItems', label: '領用項目', type: 'array', description: '包含 type, value, label' },
      { key: 'submittedAt', label: '提交時間', type: 'string', description: 'ISO 8601 格式' },
    ],
    // ========================================
    // 🔧 管理員選項設定區 - 修改此處來新增/調整選項
    // ========================================
    options: {
      // 套件選項（多選）- 新增格式：{ value: '識別碼', label: '顯示名稱' }
      packages: [
        { value: 'threads-08cujl', label: 'Threads' },
        { value: 'difyaiagent-qvtlvt', label: 'DifyAPI' },
        { value: 'getnews-vw9mdc', label: '新聞快訊' },
        { value: 'difyknowledge-t3by2l', label: 'Dify Knowledge API 國際版' },
        { value: 'makemcpserver-fff181', label: 'Make MCP Server' },
        { value: 'richmenu-yrfqmv', label: 'LineRichMenu' },
        { value: 'chromeplugintool-qo2kux', label: 'Chrome Plugin Tool' },
        { value: 'chromelineoatool-ifxul0', label: 'Chrome LINE OA Tool' },
        { value: 'chromeagentkm-jx2a14', label: 'Chrome Dify Agent KM' },
      ],
      // 樣板選項（單選）- 新增格式：{ value: '識別碼', label: '顯示名稱' }
      templates: [
        { value: 'TEMP-25001', label: 'Threads 頻道自動化經營' },
        { value: 'TEMP-25002', label: '表單串接金流與電子發票' },
        { value: 'TEMP-25003', label: 'LINE@智能客服' },
      ],
    },
    optionsInfo: {
      lineRange: '181-203',
      notes: [
        '修改後儲存檔案即時生效',
        'value 為傳送到 webhook 的識別碼',
        'label 為表單上顯示的文字',
        '套件類型為多選，樣板類型為單選',
      ],
    },
  },
  // ============================================
  // SMART4A 課程複訓報名表
  // Based on: 活動報名表 template
  // ============================================
  {
    id: 'course-retraining-2026',
    name: 'SMART4A 課程複訓報名表',
    displayName: 'SMART4A 課程複訓報名表',
    description: '提供上過正規課程的學員報名複訓',
    scenarioName: '[Smart4A教育學院]2026 - Workshop - 報名',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4385230/edit',
    webhookUrl: 'https://hook.us1.make.com/1kb2u3www4o4qgsqsf49qmuh1qjmce5p',
    path: 'course-retraining',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '課程相關' },
    webhookFields: [
      { key: '選擇課程', label: '選擇課程', type: 'string' },
      { key: '上課天數', label: '上課天數', type: 'string' },
      { key: '姓名', label: '姓名', type: 'string' },
      { key: '手機號碼', label: '手機號碼', type: 'string' },
      { key: '電子郵件', label: '電子郵件', type: 'string' },
      { key: '總金額', label: '總金額', type: 'string' },
      { key: '付款方式', label: '付款方式', type: 'string' },
      { key: '發票形式', label: '發票形式', type: 'string' },
      { key: '發票抬頭', label: '發票抬頭', type: 'string', description: '三聯式時必填' },
      { key: '統一編號', label: '統一編號', type: 'string', description: '三聯式時必填' },
      { key: 'lovable表單', label: 'lovable表單', type: 'boolean' },
      { key: 'submittedAt', label: '提交時間', type: 'string', description: 'ISO 8601 格式' },
    ],
    // ========================================
    // 🔧 管理員選項設定區 - 課程日期可在 Dashboard 動態調整
    // ========================================
    options: {
      retrainingCourseDates: [
        {
          courseValue: 'design-flow-intro',
          courseName: '設計流程(入門) - 複訓',
          webhookLabel: '設計流程(入門) - 複訓',
          webhookDateKey: '入門課日期',
          isSingleDay: true,
          dates: [
            '2026/1/15',
            '2026/3/12',
            '2026/4/16',
            '2026/5/7',
            '2026/6/11',
            '2026/7/9',
            '2026/8/13',
            '2026/9/10',
            '2026/10/15',
            '2026/11/12',
            '2026/12/27'
          ]
        },
        {
          courseValue: 'work-flow-basic',
          courseName: '工作流程(初階) - 複訓',
          webhookLabel: '工作流程(初階) - 複訓',
          webhookDateKey: '初階課日期',
          isSingleDay: false,
          dates: [
            '2026/1/17-1/18',
            '2026/3/21-3/22',
            '2026/5/9-5/10',
            '2026/7/11-7/12',
            '2026/9/12-9/13',
            '2026/11/14-11/15'
          ]
        },
        {
          courseValue: 'thinking-flow-mid',
          courseName: '思維流程(中階) - 複訓',
          webhookLabel: '思維流程(中階) - 複訓',
          webhookDateKey: '中階課日期',
          isSingleDay: false,
          dates: [
            '2026/2/7-2/8',
            '2026/5/23-5/24',
            '2026/8/15-8/16',
            '2026/11/21-11/22'
          ]
        },
        {
          courseValue: 'interaction-flow-adv',
          courseName: '互動流程(高階) - 複訓',
          webhookLabel: '互動流程(高階) - 複訓',
          webhookDateKey: '高階課日期',
          isSingleDay: false,
          dates: [
            '2026/3/14-3/15',
            '2026/6/13-6/14',
            '2026/9/19-9/20',
            '2026/12/12-12/13'
          ]
        }
      ]
    },
    optionsInfo: {
      lineRange: '351-410',
      notes: [
        '日期可從 Dashboard 選項設定直接編輯',
        '日期格式支援 YYYY/MM/DD 或 YYYY/M/D',
        '兩日課程格式：YYYY/M/D-M/D 或 YYYY/MM/DD-MM/DD',
        '過期日期會自動被過濾不顯示於表單中',
      ],
    },
  },
  // ============================================
  // Smart4A 講師/助教請款申請表
  // Based on: 活動報名表 template
  // ============================================
  {
    id: 'instructor-payment',
    name: 'Smart4A 講師/助教請款申請表',
    displayName: '講師/助教請款申請',
    description: '提供講師/助教申請費用',
    scenarioName: '講師/助教請款',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4141997/edit',
    webhookUrl: 'https://hook.us1.make.com/3h1hfxnqez0ap4ipv6jz42mbpwgt529h',
    path: 'instructor-payment',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '內部管理' },
    prefillParams: [
      { key: 'fullName', label: '姓名', description: '講師/助教姓名' },
      { key: 'phone', label: '聯絡電話' },
      { key: 'address', label: '地址' },
      { key: 'email', label: 'E-mail' },
      { key: 'role', label: '參與活動身分', description: '講師 或 助教' },
      { key: 'activityCategory', label: '參與活動分類', description: 'Workshop / 學員俱樂部 / 企業內訓(非指定講師) / 企業內訓(指定講師)' },
      { key: 'activityDays', label: '參與活動天數', description: '1 或 2' },
    ],
    webhookFields: [
      { key: '姓名', label: '姓名', type: 'string' },
      { key: '聯絡電話', label: '聯絡電話', type: 'string' },
      { key: '地址', label: '地址', type: 'string' },
      { key: 'E-mail', label: 'E-mail', type: 'string' },
      { key: '參與活動身分', label: '參與活動身分', type: 'string' },
      { key: '參與活動分類', label: '參與活動分類', type: 'string' },
      { key: '參與活動天數', label: '參與活動天數', type: 'string' },
      { key: '活動日期1', label: '活動日期1', type: 'string' },
      { key: '活動日期1開始時間', label: '活動日期1開始時間', type: 'string' },
      { key: '活動日期1結束時間', label: '活動日期1結束時間', type: 'string' },
      { key: '活動日期2', label: '活動日期2', type: 'string', description: '2天時填寫' },
      { key: '活動日期2開始時間', label: '活動日期2開始時間', type: 'string', description: '2天時填寫' },
      { key: '活動日期2結束時間', label: '活動日期2結束時間', type: 'string', description: '2天時填寫' },
      { key: '休息時間(小時)', label: '休息時間(小時)', type: 'number' },
      { key: '合計時數', label: '合計時數', type: 'number' },
      { key: 'lovable表單', label: 'lovable表單', type: 'boolean' },
      { key: 'submittedAt', label: '提交時間', type: 'string', description: 'ISO 8601 格式' },
    ],
  },
  // ============================================
  // 學習影音保密使用切結書
  // Based on: 切結書／合約類表單模板
  // ============================================
  {
    id: 'learning-video-confidentiality',
    name: '學習影音保密使用切結書',
    displayName: '學習影音保密使用切結書',
    description: '本表單用於確認學員對課程學習影音之保密與使用約定，並具有法律效力。',
    scenarioName: '[Smart4A教育學院] 學習影音保密使用切結書 資料接收',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4473317/edit',
    webhookUrl: 'https://hook.us1.make.com/1943kasmxjwlscvjvoh1d2bbgoipmf1d',
    path: 'learning-video-confidentiality',
    hasSignature: true,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '課程相關', attribute: '切結書' },
    prefillParams: [
      { key: 'fullName', label: '姓名', description: '簽署人姓名' },
      { key: 'email', label: '電子郵件', description: '簽署人電子郵件' },
    ],
    webhookFields: [
      { key: 'fullName', label: '姓名', type: 'string' },
      { key: 'nationalId', label: '身分證字號', type: 'string' },
      { key: 'email', label: '電子郵件', type: 'string' },
      { key: 'confirmEmail', label: '確認電子郵件', type: 'string' },
      { key: 'phone', label: '聯絡電話', type: 'string', description: '選填' },
      { key: 'signature', label: '電子簽名', type: 'string', description: 'Base64 圖像' },
      { key: 'signingDate', label: '簽署日期', type: 'string' },
    ],
  },
  // ============================================
  // 模板：切結書／合約類表單
  // Template for legally binding documents
  // ============================================
  {
    id: 'template-contract-declaration',
    name: '切結書／合約類表單模板',
    displayName: '切結書／合約模板',
    description: '用於切結書、保密協議、合約、同意書等法律文件的表單模板',
    scenarioName: '', // 模板不綁定場景，由各表單自行設定
    scenarioUrl: '', // 模板不綁定場景
    webhookUrl: '', // 模板不綁定 webhook
    path: 'contract-declaration-template',
    hasSignature: true,
    isMultiStep: false,
    status: 'draft', // 模板預設為 draft，不自動發布
    classification: { primaryCategory: '內部管理', attribute: '簽署流程' },
    prefillParams: [
      { key: 'title', label: '表單標題', description: '切結書或合約標題' },
      { key: 'description', label: '表單說明', description: '簡短描述' },
      { key: 'agreementContent', label: '合約內容', description: '法律條款全文' },
    ],
    webhookFields: [
      { key: 'signerType', label: '簽署身份', type: 'string', description: 'individual / company' },
      // Individual fields
      { key: 'fullName', label: '姓名', type: 'string', description: '個人簽署時' },
      { key: 'nationalId', label: '身分證字號', type: 'string', description: '個人簽署時' },
      { key: 'phone', label: '電話號碼', type: 'string', description: '選填' },
      // Company fields
      { key: 'companyName', label: '公司名稱', type: 'string', description: '公司簽署時' },
      { key: 'taxId', label: '統一編號', type: 'string', description: '公司簽署時' },
      { key: 'representativeName', label: '代表人姓名', type: 'string', description: '公司簽署時' },
      { key: 'representativeTitle', label: '代表人職稱', type: 'string', description: '公司簽署時' },
      // Shared fields
      { key: 'email', label: '電子郵件', type: 'string' },
      { key: 'confirmEmail', label: '確認電子郵件', type: 'string' },
      { key: 'signature', label: '電子簽名', type: 'string', description: 'Base64 圖片' },
      { key: 'signingDate', label: '簽署日期', type: 'string', description: '自動產生' },
    ],
  },
  // ============================================
  // 分潤收款人資料表
  // Based on: 活動報名表 template
  // ============================================
  {
    id: 'revenue-sharing-recipient',
    name: '分潤收款人資料表',
    displayName: '分潤收款人資料表',
    description: '資料僅供禹動科技整合股份有限公司 分潤撥款、報稅使用',
    scenarioName: '分潤收款人資料表串接',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/3769394/edit',
    webhookUrl: 'https://hook.us1.make.com/i9tgj8kq6blfsg13azadpp7ynq4ouxvc',
    path: 'revenue-sharing-recipient',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '內部管理' },
    webhookFields: [
      { key: '收款人身分別', label: '收款人身分別', type: 'string', description: '公司戶 / 個人戶' },
      // 公司戶欄位
      { key: '公司名稱', label: '公司名稱', type: 'string', description: '公司戶時填寫' },
      { key: '公司統編', label: '公司統編', type: 'string', description: '公司戶時填寫' },
      { key: '公司聯絡人姓名', label: '公司聯絡人姓名', type: 'string', description: '公司戶時填寫' },
      { key: '聯絡地址', label: '聯絡地址', type: 'string', description: '公司戶時填寫' },
      // 個人戶欄位
      { key: '收款人姓名', label: '收款人姓名', type: 'string', description: '個人戶時填寫' },
      { key: '收款人身份證字號', label: '收款人身份證字號', type: 'string', description: '個人戶時填寫，格式：1碼大寫英文+9碼數字' },
      { key: '戶籍地址', label: '戶籍地址', type: 'string', description: '個人戶時填寫' },
      // 共用欄位
      { key: 'E-mail', label: 'E-mail', type: 'string' },
      { key: '聯絡電話', label: '聯絡電話', type: 'string' },
      // 銀行帳戶資訊
      { key: '銀行名稱', label: '銀行名稱', type: 'string' },
      { key: '銀行代碼', label: '銀行代碼', type: 'string' },
      { key: '分行名稱', label: '分行名稱', type: 'string' },
      { key: '分行代碼', label: '分行代碼', type: 'string' },
      { key: '帳戶號碼', label: '帳戶號碼', type: 'string' },
      { key: '存摺封面影本', label: '存摺封面影本', type: 'string', description: 'Base64 圖片' },
      // 身分證影本 (個人戶)
      { key: '身分證正面影本', label: '身分證正面影本', type: 'string', description: '個人戶時填寫，Base64 圖片' },
      { key: '身分證反面影本', label: '身分證反面影本', type: 'string', description: '個人戶時填寫，Base64 圖片' },
    ],
  },
  // ============================================
  // SMART4A 台北交流中心-場地租借申請
  // Based on: 活動報名表 template
  // ============================================
  {
    id: 'venue-rental',
    name: 'SMART4A 台北交流中心-場地租借申請',
    displayName: '台北交流中心場地租借',
    description: '租借場地使用填表',
    scenarioName: 'Smart4A台北交流中心場租-租借申請表提交',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/3581999/edit',
    webhookUrl: 'https://hook.us1.make.com/i4jkamekp751k6edsm8t4q0cwfnw2ku2',
    path: 'venue-rental',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '內部管理' },
    prefillParams: [
      { key: 'rentalDays', label: '租借天數', description: '1天 或 2天' },
      { key: 'eventTheme', label: '活動/課程主題' },
      { key: 'contactName', label: '聯絡人姓名' },
      { key: 'contactPhone', label: '聯絡電話' },
      { key: 'contactEmail', label: '聯絡人 E-mail' },
      { key: 'invoiceType', label: '發票選擇', description: '二聯發票 或 三聯發票' },
      { key: 'invoiceTitle', label: '發票抬頭', description: '三聯發票時使用' },
      { key: 'invoiceTaxId', label: '發票統編', description: '三聯發票時使用' },
    ],
    webhookFields: [
      { key: '租借天數', label: '租借天數', type: 'string' },
      { key: '租借日期1', label: '租借日期1', type: 'string' },
      { key: '租借起始時間1', label: '租借起始時間1', type: 'string' },
      { key: '租借結束時間1', label: '租借結束時間1', type: 'string' },
      { key: '租借日期2', label: '租借日期2', type: 'string', description: '2天時填寫' },
      { key: '租借起始時間2', label: '租借起始時間2', type: 'string', description: '2天時填寫' },
      { key: '租借結束時間2', label: '租借結束時間2', type: 'string', description: '2天時填寫' },
      { key: '優惠時數', label: '優惠時數', type: 'number' },
      { key: '租借時間總計', label: '租借時間總計', type: 'number' },
      { key: '活動課程主題', label: '活動課程主題', type: 'string' },
      { key: '聯絡人姓名', label: '聯絡人姓名', type: 'string' },
      { key: '聯絡電話', label: '聯絡電話', type: 'string' },
      { key: '聯絡人Email', label: '聯絡人Email', type: 'string' },
      { key: '總金額', label: '總金額', type: 'number' },
      { key: '發票選擇', label: '發票選擇', type: 'string' },
      { key: '發票抬頭', label: '發票抬頭', type: 'string', description: '三聯發票時填寫' },
      { key: '發票統編', label: '發票統編', type: 'string', description: '三聯發票時填寫' },
      { key: 'lovable表單', label: 'lovable表單', type: 'boolean' },
      { key: 'submittedAt', label: '提交時間', type: 'string', description: 'ISO 8601 格式' },
    ],
  },
  // ============================================
  // 教學指導與顧問服務訂購表
  // ============================================
  {
    id: 'consulting-service',
    name: '教學指導與顧問服務',
    displayName: '教學指導與顧問服務',
    description: 'Smart4A 教學指導與顧問服務下單表單',
    scenarioName: '教學顧問訂單-01-接收訂單',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/2057767/edit',
    webhookUrl: 'https://hook.us1.make.com/62u4cse9ya3f98t656jeu278pxl9rxxf',
    path: 'consulting-service',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '教學顧問' },
    prefillParams: [
      { key: 'dealer', label: '經銷商代碼', description: '隱藏欄位' },
      { key: 'ref', label: '推薦碼', description: '隱藏欄位' },
    ],
    webhookFields: [
      { key: 'order_no', label: '訂單編號', type: 'string' },
      { key: 'customer_name_company', label: '姓名/公司行號', type: 'string' },
      { key: 'email', label: '電子郵件', type: 'string' },
      { key: 'mobile', label: '行動電話', type: 'string' },
      { key: 'zip_code', label: '郵遞區號', type: 'string' },
      { key: 'address', label: '地址', type: 'string' },
      { key: 'referral_code', label: '推薦碼', type: 'string' },
      { key: 'reseller_code', label: '經銷商代碼', type: 'string' },
      { key: 'coupon_code', label: '優惠碼', type: 'string' },
      { key: 'service_category', label: '服務類別', type: 'string', description: '教育訓練/教練指導/技術指導/顧問服務' },
      { key: 'training_level', label: '課程等級', type: 'string', description: '教育訓練時填寫' },
      { key: 'coaching_mode', label: '指導形式', type: 'string', description: '教練指導時填寫' },
      { key: 'consulting_plan', label: '顧問方案', type: 'string', description: '顧問服務時填寫' },
      { key: 'pricing_tier', label: '計價方案', type: 'string' },
      { key: 'units', label: '單元數', type: 'number', description: '教育訓練時填寫' },
      { key: 'sessions', label: '次數', type: 'number', description: '教練指導/技術指導時填寫' },
      { key: 'months', label: '月數', type: 'number', description: '顧問服務時填寫' },
      { key: 'rag_addon', label: 'RAG加購', type: 'boolean' },
      { key: 'specified_person', label: '指定人員', type: 'string' },
      { key: 'preferred_time_slots', label: '期望服務時段', type: 'array' },
      { key: 'payment_method', label: '付款方式', type: 'string' },
      { key: 'invoice_type', label: '發票種類', type: 'string' },
      { key: 'invoice_title', label: '發票抬頭', type: 'string' },
      { key: 'invoice_tax_id', label: '統一編號', type: 'string' },
      { key: 'notes', label: '備註', type: 'string' },
      { key: 'unit_price', label: '方案單價', type: 'string', description: '例如 TWD 3,000/小時 或 TWD 30,000/月（含 RAG 加購費用）' },
      { key: 'standard_service_hours', label: '標準服務時數', type: 'string', description: '例如「每單元 3 小時」或「每次 2 小時」' },
      { key: 'price_breakdown', label: '計價明細', type: 'string' },
      { key: 'total_price', label: '費用總計', type: 'number' },
      { key: 'submittedAt', label: '提交時間', type: 'string', description: 'ISO 8601 格式' },
    ],
  },
  // ============================================
  // 學員俱樂部報名表
  // Based on: 活動報名表 template
  // ============================================
  {
    id: 'student-club',
    name: '學員俱樂部報名表',
    displayName: '學員俱樂部報名表',
    description: '學員俱樂部報名專用表單',
    scenarioName: '[Smart4A教育學院] 學員俱樂部',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/3276083/edit',
    webhookUrl: 'https://hook.us1.make.com/iakt0zmhddcxhwonrsysgs52x4q8wh2e',
    path: 'student-club',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '課程相關' },
    webhookFields: [
      { key: '課程日期', label: '課程日期', type: 'string' },
      { key: '姓名', label: '姓名', type: 'string' },
      { key: '手機號碼', label: '手機號碼', type: 'string' },
      { key: 'E-mail', label: 'E-mail', type: 'string' },
      { key: '是否為學員', label: '是否為學員', type: 'string', description: '是 / 否' },
      { key: '學員編號', label: '學員編號', type: 'string', description: '學員時填寫' },
      { key: '點數狀態', label: '點數狀態', type: 'string', description: '點數足夠 / 點數不足 / 空值' },
      { key: '金額', label: '金額', type: 'number', description: '0 或 800' },
      { key: '付款方式', label: '付款方式', type: 'string', description: '信用卡/ATM/ibon/學習點數折抵' },
      { key: '發票類型', label: '發票類型', type: 'string', description: '二聯式 / 三聯式 / 空值' },
      { key: '發票抬頭', label: '發票抬頭', type: 'string', description: '三聯式時填寫' },
      { key: '統一編號', label: '統一編號', type: 'string', description: '三聯式時填寫' },
      { key: 'lovable表單', label: 'lovable表單', type: 'boolean' },
      { key: 'submittedAt', label: '提交時間', type: 'string', description: 'ISO 8601 格式' },
    ],
    // ========================================
    // 🔧 管理員選項設定區 - 修改此處來新增/調整課程日期選項
    // ========================================
    options: {
      // 課程日期選項 - 新增格式：{ value: 'YYYY/MM/DD', label: '顯示名稱' }
      courseDates: [
        { value: '2026/01/14', label: '2026/01/14' },
        { value: '2026/01/28', label: '2026/01/28' },
        { value: '2026/02/11', label: '2026/02/11' },
        { value: '2026/02/25', label: '2026/02/25' },
      ],
    },
    optionsInfo: {
      lineRange: '636-649',
      notes: [
        '修改後儲存檔案即時生效',
        'value 為日期值（YYYY/MM/DD 格式）',
        'label 為表單下拉選單顯示的文字',
        '過期日期會自動被過濾掉不顯示',
      ],
    },
  },
  // ============================================
  // 週二線下交流會登記表
  // Based on: 活動報名表 template
  // ============================================
  {
    id: 'tuesday-meetup',
    name: '週二線下交流會登記表',
    displayName: '週二線下交流會',
    description: '週二線下交流會報名登記',
    scenarioName: 'Smart4A 週二線下分享會',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/2300757/edit',
    webhookUrl: 'https://hook.us1.make.com/xwb5lnmygksdw3ra18frmhop53vjli6n',
    path: 'tuesday-meetup',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '課程相關' },
    webhookFields: [
      { key: '訂單編號', label: '訂單編號', type: 'string', description: '自動產生：YYYYMMDDHHmmss + 2位亂數' },
      { key: '活動日期', label: '活動日期', type: 'string' },
      { key: '姓名', label: '姓名', type: 'string' },
      { key: '手機號碼', label: '手機號碼', type: 'string' },
      { key: 'Email', label: 'Email', type: 'string' },
      { key: '參加目的', label: '參加目的', type: 'string', description: '多選，以頓號分隔' },
      { key: '如何得知本活動', label: '如何得知本活動', type: 'string' },
      { key: 'lovable表單', label: 'lovable表單', type: 'boolean' },
      { key: 'submittedAt', label: '提交時間', type: 'string', description: 'ISO 8601 格式' },
    ],
    // ========================================
    // 🔧 管理員選項設定區 - 活動日期
    // ========================================
    options: {
      eventDates: [
        { value: '2026/01/06', label: '2026/01/06 (二)' },
        { value: '2026/02/03', label: '2026/02/03 (二)' },
        { value: '2026/03/10', label: '2026/03/10 (二)' },
        { value: '2026/04/14', label: '2026/04/14 (二)' },
      ],
    },
  },
  // ============================================
  // 課後線上測驗
  // ============================================
  {
    id: 'course-quiz',
    name: '訓後測驗',
    displayName: '訓後測驗',
    description: '課程完訓後線上測驗',
    scenarioName: '課後測驗',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/2057767/edit',
    webhookUrl: 'https://hook.us1.make.com/yw8f4kwyk1bpk88x5jkstdilj38k1gvo',
    path: 'course-quiz',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '課程相關' },
    prefillParams: [
      { key: 'courseDate', label: '課程日期', description: '可為日期區間，例如：2025/01/23-01/24' },
      { key: 'completionDate', label: '完訓日期' },
    ],
    options: {
      quizCourseDates: [
        { courseName: '設計流程（入門）', dates: ['2026/1/15', '2026/3/12', '2026/4/16', '2026/5/7', '2026/6/11', '2026/7/9', '2026/8/13', '2026/9/10', '2026/10/15', '2026/11/12', '2026/12/17'] },
        { courseName: '工作流程（基礎）', dates: ['2026/1/17-1/18', '2026/3/14-3/15', '2026/5/9-5/10', '2026/7/11-7/12', '2026/9/12-9/13', '2026/11/14-11/15'] },
        { courseName: '思維流程（中階）', dates: ['2026/2/7-2/8', '2026/5/23-5/24', '2026/8/15-8/16', '2026/11/21-11/22'] },
        { courseName: '互動流程（高階）', dates: ['2026/3/21-3/22', '2026/6/12-6/14', '2026/9/19-9/20', '2026/12/12-12/13'] },
      ],
    },
    webhookFields: [
      { key: 'student_name', label: '學員姓名', type: 'string' },
      { key: 'email', label: '電子郵件', type: 'string' },
      { key: 'course_name', label: '課程名稱', type: 'string' },
      { key: 'course_date', label: '課程日期', type: 'string' },
      { key: 'completion_date', label: '完訓日期', type: 'string' },
      { key: 'submitted_at', label: '送出日期時間', type: 'string', description: 'ISO 8601 格式' },
      { key: 'total_score', label: '總分', type: 'number' },
      { key: 'max_score', label: '滿分', type: 'number' },
      { key: 'correct_count', label: '答對題數', type: 'number' },
      { key: 'question_count', label: '總題數', type: 'number' },
      { key: 'q1_question', label: '第1題題目', type: 'string' },
      { key: 'q1_answer', label: '第1題選擇答案', type: 'string' },
      { key: 'q1_correct', label: '第1題是否正確', type: 'boolean' },
      { key: 'q2_question', label: '第2題題目', type: 'string' },
      { key: 'q2_answer', label: '第2題選擇答案', type: 'string' },
      { key: 'q2_correct', label: '第2題是否正確', type: 'boolean' },
      { key: 'q3_question', label: '第3題題目', type: 'string' },
      { key: 'q3_answer', label: '第3題選擇答案', type: 'string' },
      { key: 'q3_correct', label: '第3題是否正確', type: 'boolean' },
      { key: 'qN_question', label: '第N題題目', type: 'string', description: '依題數動態產生' },
      { key: 'qN_answer', label: '第N題選擇答案', type: 'string', description: '依題數動態產生' },
      { key: 'qN_correct', label: '第N題是否正確', type: 'boolean', description: '依題數動態產生' },
    ],
  },
  // ============================================
  // 匯款通知
  // ============================================
  {
    id: 'payment-notification',
    name: '匯款通知',
    displayName: '匯款通知',
    description: '客戶匯款後填寫的付款通知表單',
    scenarioName: '客戶付款通知',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4512544/edit',
    webhookUrl: 'https://hook.us1.make.com/unoxfva9yeehtzklost5u5xicymitp6c',
    path: 'payment-notification',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '內部管理' },
    prefillParams: [
      { key: 'orderNumber', label: '訂單編號', description: '或使用 order' },
      { key: 'nameOrCompany', label: '姓名/公司行號', description: '或使用 name' },
      { key: 'email', label: '電子郵件信箱' },
      { key: 'productService', label: '產品/服務', description: '或使用 product' },
      { key: 'paymentAmount', label: '匯款金額', description: '或使用 amount' },
    ],
    webhookFields: [
      { key: 'nameOrCompany', label: '姓名/公司行號', type: 'string' },
      { key: 'email', label: '電子郵件信箱', type: 'string' },
      { key: 'orderNumber', label: '訂單編號', type: 'string' },
      { key: 'productService', label: '產品/服務', type: 'string' },
      { key: 'paymentDate', label: '匯款日期', type: 'string' },
      { key: 'paymentAmount', label: '匯款金額', type: 'number' },
      { key: 'bankName', label: '匯款銀行', type: 'string' },
      { key: 'accountLast5', label: '帳號末五碼', type: 'string' },
      { key: 'proofFileName', label: '匯款證明檔名', type: 'string' },
      { key: 'proofFileBase64', label: '匯款證明Base64', type: 'string', description: 'Data URL 格式' },
      { key: 'submittedAt', label: '提交時間', type: 'string', description: 'ISO 8601 格式' },
    ],
  },
  // ============================================
  // AI x 自動化數位轉型系列課程
  // ============================================
  {
    id: 'ai-digital-transform-course',
    name: 'AI x 自動化數位轉型系列課程',
    displayName: 'AI數位轉型課程',
    description: 'AI進化術 - 智慧行銷客戶體驗升級',
    scenarioName: '外部合作課程_林毓晟_訂單接收',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4512676/edit?folder=286504',
    webhookUrl: 'https://hook.us1.make.com/mfjmbt52jy1lwlq5hz6fg1ky09g4blkt',
    path: 'ai-digital-transform-course',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '外部合作' },
    webhookFields: [
      { key: '課程名稱', label: '課程名稱', type: 'string' },
      { key: '報名場次', label: '報名場次', type: 'string' },
      { key: '參加類型', label: '參加類型', type: 'string' },
      { key: '希望獲得', label: '希望獲得', type: 'string' },
      { key: 'AI程度', label: 'AI程度', type: 'string' },
      { key: '姓名', label: '姓名', type: 'string' },
      { key: '聯絡電話', label: '聯絡電話', type: 'string' },
      { key: 'Email', label: 'Email', type: 'string' },
      { key: 'LINE帳號', label: 'LINE帳號', type: 'string' },
      { key: '公司團隊名稱', label: '公司團隊名稱', type: 'string' },
      { key: '職位', label: '職位', type: 'string' },
      { key: '推薦人', label: '推薦人', type: 'string' },
      { key: '報名人數', label: '報名人數', type: 'number' },
      { key: '課程總金額', label: '課程總金額', type: 'number' },
      { key: '付款方式', label: '付款方式', type: 'string' },
      { key: '發票聯式', label: '發票聯式', type: 'string' },
      { key: '發票抬頭', label: '發票抬頭', type: 'string' },
      { key: '發票統編', label: '發票統編', type: 'string' },
      { key: '補助專案統編', label: '補助專案統編', type: 'string' },
      { key: '其他備註', label: '其他備註', type: 'string' },
      { key: 'lovable表單', label: 'lovable表單', type: 'boolean' },
      { key: 'submittedAt', label: '提交時間', type: 'string' },
    ],
  },
  // ============================================
  // Smart4A 會員中心登記
  // ============================================
  {
    id: 'smart4a-member-registration',
    name: 'Smart4A 會員中心登記',
    displayName: '會員中心登記',
    description: 'Smart4A 會員資料登記表',
    scenarioName: '產品：Smart4A 會員中心登記',
    scenarioUrl: 'https://us1.make.com/230050/scenarios/4512781/edit?folder=151237',
    webhookUrl: 'https://hook.us1.make.com/psoy1l88mov0gfp69iluglbfw5g5ocfi',
    path: 'smart4a-member',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '內部管理' },
    prefillParams: [
      { key: 'fullName', label: '姓名', description: '或使用 name' },
      { key: 'phone', label: '聯絡電話' },
      { key: 'email', label: 'E-mail' },
      { key: 'postalCode', label: '郵遞區號' },
      { key: 'address', label: '地址' },
      { key: 'lineId', label: 'LINE ID', description: '隱藏欄位，或使用 line_id' },
      { key: 'referralCode', label: '推薦碼', description: '隱藏欄位，或使用 ref' },
      { key: 'makeOrganizationId', label: 'Make Organization ID', description: '或使用 orgId' },
    ],
    webhookFields: [
      { key: '姓名', label: '姓名', type: 'string' },
      { key: '聯絡電話', label: '聯絡電話', type: 'string' },
      { key: 'Email', label: 'E-mail', type: 'string' },
      { key: '郵遞區號', label: '郵遞區號', type: 'string' },
      { key: '地址', label: '地址', type: 'string' },
      { key: 'LINE ID', label: 'LINE ID', type: 'string', description: '隱藏欄位' },
      { key: '推薦碼', label: '推薦碼', type: 'string', description: '隱藏欄位' },
      { key: 'MAKE Organization ID', label: 'MAKE Organization ID', type: 'string' },
      { key: 'lovable表單', label: 'lovable表單', type: 'boolean' },
      { key: 'submittedAt', label: '提交時間', type: 'string' },
    ],
  },
  // ============================================
  // 內部報價單產生表單
  // ============================================
  {
    id: 'quotation-form',
    name: '教學指導與顧問服務報價單',
    displayName: '顧問服務報價單',
    description: '教學指導與顧問服務報價單產生表單',
    scenarioName: '企業陪跑教育訓練-報價單',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4426097/edit',
    webhookUrl: 'https://hook.us1.make.com/84rk95lofd7idx2xwqxq4cy8vok3fsmf',
    path: 'quotation',
    hasSignature: false,
    isMultiStep: true,
    status: 'active',
    classification: { primaryCategory: '教學顧問' },
    prefillParams: [
      // === 報價資訊 ===
      { key: 'quotation_date', label: '報價日期', description: 'YYYY-MM-DD 格式' },
      { key: 'inquiry_number', label: '詢價單號' },
      // === 客戶資訊 ===
      { key: 'company_name', label: '公司名稱', description: '同步作為發票抬頭' },
      { key: 'contact_person', label: '聯絡人姓名' },
      { key: 'tax_id', label: '統一編號' },
      { key: 'customer_email', label: '客戶 Email' },
      { key: 'customer_phone', label: '客戶電話' },
      { key: 'customer_address', label: '客戶地址' },
      // === 陪跑轉型方案 ===
      { key: 'transformation_package', label: '陪跑轉型方案', description: 'startup/growth/scaleup/enterprise-custom' },
      { key: 'custom_description', label: '客製方案說明', description: '企業客製方案使用' },
      { key: 'custom_amount', label: '客製方案金額' },
      // === 顧問服務 ===
      { key: 'consulting_plan', label: '顧問方案等級', description: 'lite/pro/enterprise' },
      { key: 'consulting_type', label: '顧問類型', description: 'single/monthly' },
      { key: 'consulting_designated_name', label: '指定顧問姓名' },
      { key: 'consulting_months', label: '顧問月數' },
      { key: 'consulting_rag', label: 'RAG 加購', description: 'none/rag/rag-multi' },
      // === 技術指導與教育訓練 ===
      { key: 'training_category', label: '訓練類別', description: 'education/coaching/technical' },
      { key: 'training_option', label: '訓練選項', description: '如 basic-base、advanced-designated 等' },
      { key: 'training_sessions', label: '訓練次數' },
      { key: 'training_designated_name', label: '指定講師/教練姓名' },
      // === 折扣 ===
      { key: 'discount_amount', label: '折扣金額' },
      { key: 'discount_reason', label: '折扣原因' },
    ],
    webhookFields: [
      // === 開立人資訊 ===
      { key: 'issuerName', label: '開立人姓名', type: 'string' },
      { key: 'issuerEmail', label: '開立人 Email', type: 'string' },
      { key: 'quoteDate', label: '報價日期 (YYYY-MM-DD)', type: 'string' },
      { key: 'inquiryNumber', label: '詢價單號 (可選)', type: 'string' },
      // === 客戶資訊 ===
      { key: 'company', label: '公司名稱', type: 'string' },
      { key: 'contactPerson', label: '聯絡人姓名', type: 'string' },
      { key: 'email', label: '聯絡人 Email', type: 'string' },
      { key: 'phone', label: '聯絡電話', type: 'string' },
      { key: 'taxId', label: '統一編號', type: 'string' },
      { key: 'invoiceTitle', label: '發票抬頭', type: 'string' },
      { key: 'address', label: '地址 (統編有填時必填)', type: 'string' },
      // === 服務項目 ===
      { key: 'projectPlan', label: '陪跑方案選項', type: 'string' },
      { key: 'customPlanDetails', label: '客製方案說明 (僅企業客製方案)', type: 'string' },
      { key: 'customPlanPrice', label: '客製方案價格 (僅企業客製方案)', type: 'string' },
      { key: 'consultantTier', label: '顧問等級 (Lite/Pro/Enterprise)', type: 'string' },
      { key: 'consultantType', label: '顧問類型 (單次/月費)', type: 'string' },
      { key: 'consultantMonths', label: '顧問月數', type: 'number' },
      { key: 'consultantAddonRag', label: 'RAG 加購項目', type: 'string' },
      { key: 'trainingType', label: '訓練類型 (專案技術指導/企業教育訓練/教練指導)', type: 'string' },
      { key: 'trainingTier', label: '講師規格/課程等級', type: 'string' },
      { key: 'trainingHours', label: '預計次數', type: 'number' },
      { key: 'notes', label: '備註', type: 'string' },
      // === 價格資訊 ===
      { key: 'projectPlanPrice', label: '陪跑方案價格', type: 'number' },
      { key: 'consultantMonthlyFee', label: '顧問月費', type: 'number' },
      { key: 'ragPrice', label: 'RAG 加購價格', type: 'number' },
      { key: 'consultantPrice', label: '顧問總價 ((月費 + RAG) × 月數)', type: 'number' },
      { key: 'trainingPrice', label: '訓練課程總價', type: 'number' },
      { key: 'subtotal', label: '小計', type: 'number' },
      { key: 'discountAmount', label: '折扣金額', type: 'number' },
      { key: 'totalPrice', label: '最終總價', type: 'number' },
      { key: 'timestamp', label: '送出時間 (YYYY-MM-DD HH:MM)', type: 'string' },
    ],
  },
  // ============================================
  // 服務詢價與需求確認單
  // ============================================
  {
    id: 'service-inquiry',
    name: '服務詢價與需求確認單',
    displayName: '服務詢價單',
    description: '請勾選您的需求，我們將根據您的選擇提供專業的服務規劃',
    scenarioName: '企業陪跑教育訓練-詢價單',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4426243/edit',
    webhookUrl: 'https://hook.us1.make.com/h5s81lr2dgkbf8ese52sd83g3kik8war',
    path: 'service-inquiry',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '教學顧問' },
    webhookFields: [
      // === 客戶聯絡資訊 ===
      { key: 'company_name', label: '公司名稱', type: 'string' },
      { key: 'contact_person', label: '聯絡人姓名', type: 'string' },
      { key: 'contact_email', label: '聯絡 Email', type: 'string' },
      { key: 'contact_phone', label: '聯絡電話', type: 'string' },
      // === 發票資訊 ===
      { key: 'tax_id', label: '統一編號', type: 'string' },
      { key: 'invoice_title', label: '發票抬頭', type: 'string' },
      { key: 'company_address', label: '公司地址', type: 'string' },
      // === 陪跑與轉型方案 ===
      { key: 'transformation_package', label: '陪跑轉型方案', type: 'string' },
      { key: 'custom_description', label: '客製化需求說明', type: 'string' },
      // === 顧問服務 ===
      { key: 'consulting_plan', label: '顧問方案等級', type: 'string' },
      { key: 'consulting_type', label: '顧問類型', type: 'string' },
      { key: 'consulting_months', label: '服務月數', type: 'number' },
      { key: 'consulting_rag', label: 'RAG 知識庫', type: 'string' },
      { key: 'consulting_designated_name', label: '指定顧問姓名', type: 'string' },
      // === 技術指導 & 教育訓練 ===
      { key: 'training_category', label: '訓練類型', type: 'string' },
      { key: 'training_option', label: '講師規格/課程等級', type: 'string' },
      { key: 'training_sessions', label: '預計次數', type: 'number' },
      { key: 'training_designated_name', label: '指定講師/教練姓名', type: 'string' },
      // === 其他 ===
      { key: 'notes', label: '其他需求或備註', type: 'string' },
      { key: 'estimated_amount', label: '預估參考金額', type: 'number' },
      { key: 'has_custom_package', label: '包含客製方案', type: 'boolean' },
      { key: 'lovable表單', label: 'lovable表單', type: 'boolean' },
      { key: 'submittedAt', label: '提交時間', type: 'string' },
    ],
  },
  // ============================================
  // 學習滿意度與回饋調查表
  // ============================================
  {
    id: 'learning-satisfaction-survey',
    name: '學習滿意度與回饋調查表',
    displayName: '學習滿意度調查',
    description: '課程學習滿意度與回饋調查表',
    scenarioName: '[Smart4A教育學院] 學習滿意度與回饋調查表',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4540151/edit?folder=190351',
    webhookUrl: 'https://hook.us1.make.com/g37995dks29i97y14rb9hb34pmu3bobf',
    path: 'learning-satisfaction-survey',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '課程相關' },
    prefillParams: [
      { key: 'courseName', label: '課程名稱', description: '或使用 course_name' },
      { key: 'courseDate', label: '課程日期', description: '或使用 course_date' },
      { key: 'fullName', label: '姓名', description: '或使用 full_name 或 name' },
      { key: 'email', label: 'E-mail' },
    ],
    webhookFields: [
      { key: '課程名稱', label: '課程名稱', type: 'string' },
      { key: '課程日期', label: '課程日期', type: 'string' },
      { key: '姓名', label: '姓名', type: 'string' },
      { key: 'email', label: 'E-mail', type: 'string' },
      { key: '教學品質滿意度', label: '教學品質滿意度', type: 'number', description: '1-5 分' },
      { key: '課程時間安排滿意度', label: '課程時間安排滿意度', type: 'number', description: '1-5 分' },
      { key: '上課節奏滿意度', label: '上課節奏滿意度', type: 'number', description: '1-5 分' },
      { key: '課程內容幫助程度', label: '課程內容幫助程度', type: 'number', description: '1-5 分' },
      { key: '助教協助滿意度', label: '助教協助滿意度', type: 'number', description: '1-5 分' },
      { key: '課程心得', label: '課程心得', type: 'string' },
      { key: '未來學員俱樂部上課內容建議', label: '未來學員俱樂部上課內容建議', type: 'string' },
      { key: '期望與實際效果', label: '期望與實際效果', type: 'string', description: '符合/不符合' },
      { key: '願意推薦此課程', label: '願意推薦此課程', type: 'string', description: '願意/不願意' },
      { key: '其他建議', label: '其他建議', type: 'string' },
      { key: 'lovable表單', label: 'lovable表單', type: 'boolean' },
      { key: 'submittedAt', label: '提交時間', type: 'string' },
    ],
    options: {
      retrainingCourseDates: [
        {
          courseValue: 'design-flow-intro',
          courseName: '設計流程(入門)',
          webhookLabel: '設計流程(入門)',
          webhookDateKey: '入門課日期',
          isSingleDay: true,
          dates: [
            '2026/1/15',
            '2026/3/12',
            '2026/4/16',
            '2026/5/7',
            '2026/6/11',
            '2026/7/9',
            '2026/8/13',
            '2026/9/10',
            '2026/10/15',
            '2026/11/12',
            '2026/12/27'
          ]
        },
        {
          courseValue: 'work-flow-basic',
          courseName: '工作流程(初階)',
          webhookLabel: '工作流程(初階)',
          webhookDateKey: '初階課日期',
          isSingleDay: false,
          dates: [
            '2026/1/17-1/18',
            '2026/3/21-3/22',
            '2026/5/9-5/10',
            '2026/7/11-7/12',
            '2026/9/12-9/13',
            '2026/11/14-11/15'
          ]
        },
        {
          courseValue: 'thinking-flow-mid',
          courseName: '思維流程(中階)',
          webhookLabel: '思維流程(中階)',
          webhookDateKey: '中階課日期',
          isSingleDay: false,
          dates: [
            '2026/2/7-2/8',
            '2026/5/23-5/24',
            '2026/8/15-8/16',
            '2026/11/21-11/22'
          ]
        },
        {
          courseValue: 'interaction-flow-adv',
          courseName: '互動流程(高階)',
          webhookLabel: '互動流程(高階)',
          webhookDateKey: '高階課日期',
          isSingleDay: false,
          dates: [
            '2026/3/14-3/15',
            '2026/6/13-6/14',
            '2026/9/19-9/20',
            '2026/12/12-12/13'
          ]
        },
      ],
    },
    optionsInfo: {
      lineRange: '1145-1188',
      notes: [
        '課程選項與課程複訓報名表共用',
        '在 Dashboard 中可獨立設定日期',
        '日期可從 course-retraining 複製',
      ],
    },
  },
  // ============================================
  // 說啥記啥變更模式提詞 Prompt
  // ============================================
  {
    id: 'prompt-mode-change',
    name: '說啥記啥變更模式提詞 Prompt',
    displayName: '說啥記啥提詞設定',
    description: '您可以調整提示詞預設文字，使用自己喜愛的方式',
    scenarioName: '說啥記啥提詞 Prompt 修改-Lovable版',
    scenarioUrl: 'https://us1.make.com/230050/scenarios/4540263/edit',
    webhookUrl: 'https://hook.us1.make.com/66qezj6iusv1s2u5nmbt644l2i2s66ri',
    path: 'prompt-mode-change',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '產品相關' },
    prefillParams: [
      { key: 'PromptInfo', label: '規則描述', description: '生成內容的撰寫規則' },
      { key: 'PromptDesc', label: '注意事項', description: '提醒生成時該注意的事項' },
      { key: 'LINEID', label: 'LINE ID' },
      { key: 'SELECTMODE', label: '選擇模式' },
    ],
    webhookFields: [
      { key: 'PromptInfo', label: '規則描述', type: 'string', description: '生成內容的撰寫規則' },
      { key: 'PromptDesc', label: '注意事項', type: 'string', description: '提醒生成時該注意的事項' },
      { key: 'LINEID', label: 'LINE ID', type: 'string' },
      { key: 'SELECTMODE', label: '選擇模式', type: 'string' },
      { key: 'submittedAt', label: '提交時間', type: 'string', description: 'ISO 8601 格式' },
    ],
  },
  // ============================================
  // 產品管理 - 新增套件
  // ============================================
  {
    id: 'product-management',
    name: '自動化應用商城 — 新增套件產品',
    displayName: '新增套件產品',
    description: '新增自動化商城產品（APP 套件）',
    scenarioName: 'APP管理-00-01-新增套件-表單',
    scenarioUrl: '',
    webhookUrl: 'https://hook.us1.make.com/461us61vc7yspnpu119mg1t2ft2ja8er',
    path: 'product-management',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '自動化商城', attribute: '內部用' },
    options: {
      categories: [
        { value: 'CRM', label: 'CRM' },
        { value: 'ERP', label: 'ERP' },
        { value: 'HR', label: 'HR' },
        { value: '行銷', label: '行銷' },
        { value: '財務', label: '財務' },
        { value: '其他', label: '其他' },
      ] as any,
      creators: [
        { value: '丁禹勝', label: '丁禹勝' },
        { value: '張元俊', label: '張元俊' },
        { value: '廖辰豐', label: '廖辰豐' },
        { value: '曹逸湘', label: '曹逸湘' },
      ] as any,
      priceTiers: [
        { twd: 0, usd: 0 },
        { twd: 100, usd: 3.99 },
        { twd: 150, usd: 4.99 },
        { twd: 200, usd: 6.99 },
        { twd: 250, usd: 8.99 },
        { twd: 300, usd: 9.99 },
        { twd: 500, usd: 17.99 },
        { twd: 700, usd: 22.99 },
        { twd: 800, usd: 28.99 },
        { twd: 1000, usd: 39.99 },
      ] as any,
    } as any,
    webhookFields: [
      { key: 'appId', label: 'APP ID', type: 'string' },
      { key: 'appName', label: 'APP 名稱', type: 'string' },
      { key: 'category', label: '類別', type: 'string' },
      { key: 'monthlyPriceTwd', label: '方案月單價（台幣）', type: 'number' },
      { key: 'monthlyPriceUsd', label: '方案月單價（美金）', type: 'number' },
      { key: 'creator', label: 'APP 製作者', type: 'string' },
      { key: 'publishDate', label: '製作日期/上架日期', type: 'string' },
      { key: 'requiresOfficialApi', label: '是否需官方 API 授權', type: 'boolean' },
      { key: 'requiresApiTokenOauth', label: '是否額外申請 API Token 或 OAuth 2', type: 'boolean' },
      { key: 'installLink', label: '安裝連結', type: 'string' },
      { key: 'docLink', label: '說明資料連結', type: 'string' },
      { key: 'hasScenarioAttachment', label: '是否有附件場景', type: 'boolean' },
      { key: 'appImageBase64', label: 'APP 圖檔（Base64）', type: 'string' },
      { key: 'appImageFilename', label: 'APP 圖檔檔名', type: 'string' },
      { key: 'scenarioFileBase64', label: '附件場景檔案（Base64）', type: 'string' },
      { key: 'scenarioFilename', label: '附件場景檔名', type: 'string' },
    ],
  },
  // ============================================
  // 推薦連結申請表-套件商城
  // ============================================
  {
    id: 'referral-link-application',
    name: '自動化商城 — 推薦連結申請表',
    displayName: '推薦連結申請表',
    description: '套件商城推薦連結申請',
    scenarioName: 'APP管理-11-套件商城推薦碼',
    scenarioUrl: '',
    webhookUrl: 'https://hook.us1.make.com/3oobdwr77aokp9d24h5y4nqvxe5gc6ha',
    path: 'referral-link-application',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '自動化商城', attribute: '內部用' },
    options: {
      fillers: [
        { value: 'Elena', label: 'Elena' },
        { value: 'Joyce', label: 'Joyce' },
        { value: 'Jimbo', label: 'Jimbo' },
        { value: 'Rush', label: 'Rush' },
        { value: 'Silent', label: 'Silent' },
        { value: 'Vincent', label: 'Vincent' },
        { value: 'Zin', label: 'Zin' },
      ],
      identityTypes: [
        { value: '經銷商', label: '經銷商' },
        { value: '合作夥伴', label: '合作夥伴' },
        { value: '團隊成員', label: '團隊成員' },
      ],
      packages: [
        { value: 'LineRichMenu', label: 'LineRichMenu' },
        { value: 'LinePay', label: 'LinePay' },
        { value: 'DifyAPI', label: 'DifyAPI' },
        { value: '認證與編號生成器', label: '認證與編號生成器' },
        { value: 'Line Flex 名片樣板', label: 'Line Flex 名片樣板' },
        { value: 'Ragic Plus', label: 'Ragic Plus' },
        { value: '財政部電子發票', label: '財政部電子發票' },
        { value: 'AI Voice 優聲學', label: 'AI Voice 優聲學' },
        { value: 'LINE FLEX 會員卡掃碼系列', label: 'LINE FLEX 會員卡掃碼系列' },
        { value: 'Meeting Wizard', label: 'Meeting Wizard' },
        { value: 'Whimsical', label: 'Whimsical' },
        { value: '黑貓Pay金流', label: '黑貓Pay金流' },
        { value: '綠界金流支付', label: '綠界金流支付' },
        { value: '藍新金流支付', label: '藍新金流支付' },
        { value: 'Threads', label: 'Threads' },
        { value: 'MitakeSMS 三竹簡訊', label: 'MitakeSMS 三竹簡訊' },
        { value: 'Reurl 短網址產生器', label: 'Reurl 短網址產生器' },
        { value: 'VoAI 絕好聲創', label: 'VoAI 絕好聲創' },
        { value: 'CometAI Plus', label: 'CometAI Plus' },
        { value: 'Smart4A 應用工具', label: 'Smart4A 應用工具' },
      ],
    } as any,
    webhookFields: [
      { key: '填表人', label: '填表人', type: 'string' },
      { key: '申請人姓名/公司行號', label: '申請人姓名/公司行號', type: 'string' },
      { key: '申請人身份類別', label: '申請人身份類別', type: 'string' },
      { key: '是否為經銷商自用', label: '是否為經銷商自用', type: 'string' },
      { key: '套件選擇', label: '套件選擇', type: 'string', description: '逗號分隔' },
      { key: '套件選擇陣列', label: '套件選擇陣列', type: 'array' },
      { key: '是否直接將連結寄給申請人', label: '是否直接將連結寄給申請人', type: 'string' },
      { key: '申請人E-mail', label: '申請人 E-mail', type: 'string' },
      { key: '是否需要寄副本給填表人', label: '是否需要寄副本給填表人', type: 'string' },
    ],
  },
  // ============================================
  // 專案建置合約 — 製作合約
  // ============================================
  {
    id: 'project-contract',
    name: '製作合約 — 專案建置合約',
    displayName: '製作合約',
    description: '內部專案建置合約製作表單',
    scenarioName: '4A-12-專案合約製作',
    scenarioUrl: 'https://us1.make.com/230078/scenarios/4462197/edit',
    webhookUrl: 'https://hook.us1.make.com/n9332tost3f956whwo13q47rmph7z459',
    path: 'project-contract',
    hasSignature: false,
    isMultiStep: false,
    status: 'active',
    classification: { primaryCategory: '內部管理', attribute: '合約' },
    webhookFields: [
      { key: 'contract_company', label: '合約所屬公司', type: 'string' },
      { key: 'party_a_company', label: '甲方公司名稱', type: 'string' },
      { key: 'party_a_tax_id', label: '甲方統編', type: 'string' },
      { key: 'party_a_contact', label: '甲方負責人姓名', type: 'string' },
      { key: 'party_a_address', label: '甲方公司地址', type: 'string' },
      { key: 'party_a_phone', label: '甲方公司電話號碼', type: 'string' },
      { key: 'party_a_fax', label: '甲方公司傳真號碼', type: 'string' },
      { key: 'party_a_signer', label: '甲方簽約代表', type: 'string' },
      { key: 'contract_type', label: '合約類別', type: 'string' },
      { key: 'project_name', label: '專案名稱/合約標的', type: 'string' },
      { key: 'project_amount', label: '專案金額', type: 'string' },
      { key: 'amount_includes_tax', label: '專案金額是否含稅', type: 'string' },
      { key: 'estimated_work_days', label: '預估工作天數', type: 'string' },
      { key: 'project_content', label: '專案建置內容', type: 'string' },
      { key: 'free_packages', label: '免費套件', type: 'object' },
      { key: 'smart4a_packages', label: 'Smart4A開發套件', type: 'array' },
      { key: 'paid_packages', label: '已知額外付費項目', type: 'object' },
    ],
    options: {
      packages: [
        { value: 'LineOA', label: 'LineOA' },
        { value: 'Google Sheet', label: 'Google Sheet' },
        { value: 'Google Form', label: 'Google Form' },
        { value: '各社群發佈權限', label: '各社群發佈權限' },
      ],
    } as any,
  },
];

import { supabase } from "@/integrations/supabase/client";

// LocalStorage key for persisted form options (kept for backwards compatibility)
export const FORM_OPTIONS_STORAGE_KEY = 'makefan_form_options';

// Custom event name for form options updates
export const FORM_OPTIONS_UPDATED_EVENT = 'formOptionsUpdated';

// Get persisted options from localStorage (fallback)
export const getPersistedFormOptions = (formPath: string): FormOptionsConfig | null => {
  try {
    const stored = localStorage.getItem(FORM_OPTIONS_STORAGE_KEY);
    if (stored) {
      const allOptions = JSON.parse(stored);
      return allOptions[formPath] || null;
    }
  } catch (e) {
    console.error('Error reading persisted form options:', e);
  }
  return null;
};

// Save options to localStorage and dispatch update event (fallback)
export const persistFormOptions = (formPath: string, options: FormOptionsConfig): void => {
  try {
    const stored = localStorage.getItem(FORM_OPTIONS_STORAGE_KEY);
    const allOptions = stored ? JSON.parse(stored) : {};
    allOptions[formPath] = options;
    localStorage.setItem(FORM_OPTIONS_STORAGE_KEY, JSON.stringify(allOptions));
    
    // Dispatch custom event to notify other components
    const event = new CustomEvent(FORM_OPTIONS_UPDATED_EVENT, { 
      detail: { formPath, options } 
    });
    window.dispatchEvent(event);
  } catch (e) {
    console.error('Error persisting form options:', e);
  }
};

// Get form options from Supabase database
// Uses form_options table with key-value structure: (form_id, option_key, option_value)
// NOTE: form_id is the same string as formPath (e.g. "student-club") in this project.
export const getFormOptionsFromDB = async (formPath: string): Promise<FormOptionsConfig | null> => {
  try {
    // Avoid deep type instantiation from Supabase generics by keeping the query loosely typed.
    const { data, error } = await (supabase.from as any)('form_options')
        .select('option_key, option_value')
        .eq('form_id', formPath) as { data: Array<{ option_key: string; option_value: Json }> | null; error: any };

    if (error) {
      console.error('Error fetching form options from DB:', error);
      return null;
    }

    if (!data || data.length === 0) return null;

    const options: FormOptionsConfig = {};
    for (const row of data) {
      // option_value stores the value for the option_key
      (options as Record<string, any>)[row.option_key] = row.option_value as any;
    }

    return options;
  } catch (e) {
    console.error('Error in getFormOptionsFromDB:', e);
    return null;
  }
};

// Save form options to Supabase database
// Uses form_options table with key-value structure: (form_id, option_key, option_value)
export const saveFormOptionsToDB = async (formPath: string, options: FormOptionsConfig): Promise<boolean> => {
  try {
    const rows = Object.entries(options)
      .filter(([, v]) => v !== undefined)
      .map(([option_key, option_value]) => ({
        form_id: formPath,
        option_key,
        option_value: option_value as unknown as Json,
      }));

    if (rows.length === 0) return true;

    const { error } = await (
      supabase
        .from('form_options')
        .upsert(rows as any, { onConflict: 'form_id,option_key' }) as unknown as Promise<{ error: unknown }>
    );

    if (error) {
      console.error('Error saving form options:', error);
      return false;
    }

    // Dispatch custom event to notify other components
    const event = new CustomEvent(FORM_OPTIONS_UPDATED_EVENT, {
      detail: { formPath, options },
    });
    window.dispatchEvent(event);

    return true;
  } catch (e) {
    console.error('Error in saveFormOptionsToDB:', e);
    return false;
  }
};

/**
 * Sync a newly added product's appName to:
 * 1. referral-link-application form's `packages` options
 * 2. project-contract form's `smart4aPackages` options
 *
 * Fetches existing options, appends if not duplicate, saves back.
 */
export const syncProductToRelatedForms = async (appName: string): Promise<void> => {
  if (!appName?.trim()) return;
  const name = appName.trim();

  // --- Referral Link: packages ---
  try {
    const referralOpts = await getFormOptionsFromDB('referral-link-application');
    const currentPackages: FormOption[] = (referralOpts as any)?.packages || [];
    const alreadyExists = currentPackages.some(p => p.value === name || p.label === name);
    if (!alreadyExists) {
      const updated = [...currentPackages, { value: name, label: name }];
      await saveFormOptionsToDB('referral-link-application', { packages: updated } as any);
    }
  } catch (e) {
    console.error('syncProductToRelatedForms: referral-link-application sync failed', e);
  }

  // --- Project Contract: smart4aPackages ---
  try {
    const contractOpts = await getFormOptionsFromDB('project-contract');
    const currentSmart4a: FormOption[] = (contractOpts as any)?.smart4aPackages || [];
    const alreadyExists = currentSmart4a.some(p => p.value === name || p.label === name);
    if (!alreadyExists) {
      const updated = [...currentSmart4a, { value: name, label: name }];
      await saveFormOptionsToDB('project-contract', { smart4aPackages: updated } as any);
    }
  } catch (e) {
    console.error('syncProductToRelatedForms: project-contract sync failed', e);
  }
};

export const getFormByPath = (path: string): FormConfig | undefined => {
  const form = forms.find((form) => form.path === path);
  if (!form) return undefined;
  
  // Check for persisted options (localStorage fallback) and merge with defaults
  const persistedOptions = getPersistedFormOptions(path);
  if (persistedOptions) {
    return {
      ...form,
      options: {
        ...form.options,
        ...persistedOptions
      }
    };
  }
  
  return form;
};
