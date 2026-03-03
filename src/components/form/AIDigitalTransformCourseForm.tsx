import React, { useState, useMemo } from 'react';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassTextarea from './GlassTextarea';
import GlassCheckbox from './GlassCheckbox';
import GlassRadio from './GlassRadio';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import ConditionalField from './ConditionalField';
import { Send, Sparkles, Clock, MapPin, Award, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import instructorImage from '@/assets/instructor-stanley.jpg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIDigitalTransformCourseFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

// 課程選項
const COURSE_OPTIONS = [
  { value: 'ai-evolution-2026-full', label: 'AI進化術-智慧⾏銷客⼾體驗2026全實體升級版' },
  { value: 'ai-evolution-2026-hybrid', label: 'AI進化術-智慧⾏銷客⼾體驗2026升級版' },
];

// 場次選項
const SESSION_OPTIONS = [
  { value: '2026-01-14-21', label: '一月班：1/14(三)、1/21(三)' },
  { value: 'wait-next', label: '待新的開課時段' },
  { value: 'enterprise-5plus', label: '企業包班需求，五人以上' },
];

// 參加類型選項
const PARTICIPATION_OPTIONS = [
  { value: 'first-time', label: '首次參加 (雙日) NTD 10,000', price: 10000 },
  { value: 'retraining-single', label: '複訓(單日) NTD 2,500', price: 2500 },
  { value: 'retraining-double', label: '複訓(雙日) NTD 5,000', price: 5000 },
];

// 希望獲得選項
const GOAL_OPTIONS = [
  { value: 'ai-tools', label: '學到 AI 工具實務操作' },
  { value: 'ai-automation', label: '學會打造 AI 自動流程' },
  { value: 'ai-cases', label: '看更多 AI 真實案例' },
  { value: 'efficiency', label: '提升工作效率、降本增益' },
];

// AI 程度選項
const AI_LEVEL_OPTIONS = [
  { value: 'none', label: '完全不熟' },
  { value: 'basic', label: '只會用 ChatGPT 聊天' },
  { value: 'intermediate', label: '已會操作多種 AI 工具' },
  { value: 'advanced', label: '有參與 AI 專案／開發經驗' },
];

// 付款方式選項
const PAYMENT_OPTIONS_FULL = [
  { value: 'credit-card', label: '信用卡' },
  { value: 'atm', label: 'ATM轉帳' },
];

const PAYMENT_OPTIONS_CREDIT_ONLY = [
  { value: 'credit-card', label: '信用卡' },
];

// 發票選項
const INVOICE_OPTIONS = [
  { value: 'two-copy', label: '二聯式' },
  { value: 'three-copy', label: '三聯式' },
];

const AIDigitalTransformCourseForm: React.FC<AIDigitalTransformCourseFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 表單欄位
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [participationType, setParticipationType] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [aiLevel, setAiLevel] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [lineId, setLineId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [referrer, setReferrer] = useState('');
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [invoiceType, setInvoiceType] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [taxId, setTaxId] = useState('');
  const [subsidyTaxId, setSubsidyTaxId] = useState('');
  const [notes, setNotes] = useState('');

  // 計算總金額
  const totalAmount = useMemo(() => {
    const selectedParticipation = PARTICIPATION_OPTIONS.find(p => p.value === participationType);
    if (!selectedParticipation) return 0;
    return selectedParticipation.price * attendeeCount;
  }, [participationType, attendeeCount]);

  // 根據金額決定付款選項（超過 30000 只顯示信用卡）
  const paymentOptions = useMemo(() => {
    return totalAmount > 30000 ? PAYMENT_OPTIONS_CREDIT_ONLY : PAYMENT_OPTIONS_FULL;
  }, [totalAmount]);

  // 判斷是否需要顯示付款相關欄位（待新的開課時段或企業包班不顯示）
  const shouldShowPaymentFields = useMemo(() => {
    return selectedSession !== 'wait-next' && selectedSession !== 'enterprise-5plus';
  }, [selectedSession]);

  // 處理目標多選
  const handleGoalChange = (value: string, checked: boolean) => {
    if (checked) {
      setGoals([...goals, value]);
    } else {
      setGoals(goals.filter(g => g !== value));
    }
    if (errors.goals) {
      setErrors(prev => ({ ...prev, goals: '' }));
    }
  };

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCourse) newErrors.course = '請選擇課程';
    if (!selectedSession) newErrors.session = '請選擇報名場次';
    
    // 只有在需要顯示付款欄位時才驗證這些欄位
    if (shouldShowPaymentFields) {
      if (!participationType) newErrors.participation = '請選擇參加類型';
      if (!paymentMethod) newErrors.paymentMethod = '請選擇付款方式';
      if (!invoiceType) newErrors.invoiceType = '請選擇發票聯式';
      if (invoiceType === 'three-copy') {
        if (!invoiceTitle.trim()) newErrors.invoiceTitle = '請輸入發票抬頭';
        if (!taxId.trim()) newErrors.taxId = '請輸入發票統編';
      }
      if (attendeeCount < 1) newErrors.attendeeCount = '報名人數至少為 1';
    }
    
    if (goals.length === 0) newErrors.goals = '請至少選擇一項';
    if (!aiLevel) newErrors.aiLevel = '請選擇 AI 程度';
    if (!fullName.trim()) newErrors.fullName = '請輸入姓名';
    if (!phone.trim()) newErrors.phone = '請輸入聯絡電話';
    if (!email.trim()) {
      newErrors.email = '請輸入 E-mail';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '請輸入有效的 E-mail 格式';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  // 生成訂單編號：年月日時分秒 + 2位亂數
  const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}${random}`;
  };

  const handleSubmit = () => {
    setShowConfirmDialog(false);

    const orderNumber = generateOrderNumber();
    const selectedCourseLabel = COURSE_OPTIONS.find(c => c.value === selectedCourse)?.label || '';
    const selectedSessionLabel = SESSION_OPTIONS.find(s => s.value === selectedSession)?.label || '';
    const selectedParticipationLabel = PARTICIPATION_OPTIONS.find(p => p.value === participationType)?.label || '';
    const goalsLabels = goals.map(g => GOAL_OPTIONS.find(opt => opt.value === g)?.label || g).join('、');
    const aiLevelLabel = AI_LEVEL_OPTIONS.find(a => a.value === aiLevel)?.label || '';
    const paymentLabel = PAYMENT_OPTIONS_FULL.find(p => p.value === paymentMethod)?.label || '';
    const invoiceLabel = INVOICE_OPTIONS.find(i => i.value === invoiceType)?.label || '';

    const formData = {
      訂單編號: orderNumber,
      課程名稱: selectedCourseLabel,
      報名場次: selectedSessionLabel,
      參加類型: selectedParticipationLabel,
      希望獲得: goalsLabels,
      AI程度: aiLevelLabel,
      姓名: fullName,
      聯絡電話: phone,
      Email: email,
      LINE帳號: lineId,
      公司團隊名稱: companyName,
      職位: jobTitle,
      推薦人: referrer,
      報名人數: attendeeCount,
      課程總金額: totalAmount,
      付款方式: paymentLabel,
      發票聯式: invoiceLabel,
      發票抬頭: invoiceType === 'three-copy' ? invoiceTitle : '',
      發票統編: invoiceType === 'three-copy' ? taxId : '',
      補助專案統編: subsidyTaxId,
      其他備註: notes,
      lovable表單: true,
      submittedAt: new Date().toISOString(),
    };

    onSubmit(formData);
  };

  return (
    <>
      <form onSubmit={handlePreSubmit} className="space-y-8">
        {/* 課程介紹區塊 */}
        <GlassCard className="space-y-6 overflow-hidden">
          {/* 課程標題區 */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
            <div className="relative flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">AI進化術-智慧行銷客戶體驗升級</h2>
            </div>
          </div>

          {/* 課程痛點與解決方案 */}
          <div className="space-y-4 text-foreground/90">
            <p className="text-sm leading-relaxed">
              您還在自己慢慢寫文案、做簡報、處理行政嗎？<br />
              要提醒您，您的競爭對手，早就用 AI 提升效率、搶佔市場優勢了！
            </p>
            <p className="text-sm leading-relaxed">
              這堂<span className="text-primary font-semibold">服務業專屬 AI 實戰課程</span>，
              將帶領您快速掌握 ChatGPT、Gemini、Felo、NotebookLM 等主流工具，
              打造行銷、行政、客服的一站式 AI 解決方案。
            </p>
            <p className="text-sm font-semibold text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              不需要程式背景，也能輕鬆上手！
            </p>
          </div>

          {/* 課程亮點 */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              課程亮點
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-background/50 border border-border/50">
                <span className="text-primary">✲</span>
                <span><strong>忙到沒時間睡覺？</strong> → AI 幫您 縮短 50% 文案與設計產出時間！</span>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-background/50 border border-border/50">
                <span className="text-primary">✲</span>
                <span><strong>行政繁瑣？</strong> → 自動化 AI 助理，替您處理客服回覆、文件生成！</span>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-background/50 border border-border/50">
                <span className="text-primary">✲</span>
                <span><strong>知識傳承困難？</strong> → NotebookLM 幫您打造專屬知識庫，團隊不再重複摸索！</span>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-background/50 border border-border/50">
                <span className="text-primary">✲</span>
                <span><strong>競爭太激烈？</strong> → 打造專屬 GPTs/GEM 助理，創造差異化優勢！</span>
              </div>
            </div>
          </div>

          {/* 您將學會 */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              您將學會
            </h3>
            <ul className="space-y-1.5 text-sm text-foreground/90">
              <li className="flex items-center gap-2"><span className="text-primary">▶</span> AI 工具概覽與提示詞設計技巧</li>
              <li className="flex items-center gap-2"><span className="text-primary">▶</span> 行銷文案應用：宣傳文案、公文、翻譯、問卷整理</li>
              <li className="flex items-center gap-2"><span className="text-primary">▶</span> 視覺與簡報生成：圖像設計、簡報、形象網站製作</li>
              <li className="flex items-center gap-2"><span className="text-primary">▶</span> ChatGPT 與 Gemini 的高階應用與實戰技巧</li>
              <li className="flex items-center gap-2"><span className="text-primary">▶</span> NotebookLM 知識庫建置與資訊彙整</li>
              <li className="flex items-center gap-2"><span className="text-primary">▶</span> 打造專屬 AI 助理（GPTs/GEM）與客服自動化（Line AI 助理）</li>
            </ul>
          </div>

          {/* 課程效益 */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              課程效益
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span><strong>行銷效率提升：</strong>產出速度快 2 倍，節省數十萬設計成本！</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span><strong>營運效率提升：</strong>降低行政與客服人力支出！</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span><strong>顧客體驗升級：</strong>AI 助理 24/7 即時回覆，提升專業度！</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span><strong>團隊競爭力提升：</strong>掌握 AI 工具應用，打造數位轉型優勢！</span>
              </div>
            </div>
          </div>

          {/* 課程細節 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">課程時長</h4>
                <p className="text-xs text-muted-foreground">實體12小時 or 實體6小時+線上6小時</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">上課地點</h4>
                <p className="text-xs text-muted-foreground">台北市善導寺捷運站附近<br />外縣市者可特殊安排</p>
              </div>
            </div>
          </div>

          {/* 價格資訊 */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <h4 className="font-semibold text-foreground mb-2">💰 投資自己、也投資組織營運</h4>
            <div className="space-y-1 text-sm">
              <p><strong>首訓價：</strong>NTD 10,000（雙日班）</p>
              <p><strong>複訓價：</strong>NTD 2,500（單日）/ NTD 5,000（雙日班）</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">👉 限時優惠，名額有限！馬上報名，搶先升級您的 AI 戰力！</p>
            <p className="text-xs text-primary mt-2 font-medium">本課程適用經濟部30人以下數位轉型補助</p>
          </div>

          {/* 講師資訊 */}
          <div className="p-4 rounded-xl bg-background/50 border border-border/50 overflow-hidden">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-primary" />
              課程講師
            </h3>
            <img 
              src={instructorImage} 
              alt="史大 Stanley | 數位轉型策略顧問" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </GlassCard>

        {/* 課程選擇區塊 */}
        <GlassCard className="space-y-6">
          <h2 className="form-section-title">課程選擇</h2>

          {/* 1. 課程選擇 */}
          <GlassSelect
            label="請選擇您本次報名的課程"
            name="course"
            required
            placeholder="請選擇課程"
            options={COURSE_OPTIONS}
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              clearError('course');
            }}
            error={errors.course}
          />

          {/* 2. 場次選擇 */}
          <GlassSelect
            label="請選擇報名場次"
            name="session"
            required
            placeholder="請選擇場次"
            options={SESSION_OPTIONS}
            value={selectedSession}
            onChange={(e) => {
              setSelectedSession(e.target.value);
              clearError('session');
            }}
            error={errors.session}
          />

          {/* 3. 參加類型 */}
          <ConditionalField show={shouldShowPaymentFields}>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground/80">
                您本次參加的是 <span className="text-destructive">*</span>
              </label>
              <div className="space-y-2">
                {PARTICIPATION_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      participationType === option.value
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="participation"
                      value={option.value}
                      checked={participationType === option.value}
                      onChange={(e) => {
                        setParticipationType(e.target.value);
                        clearError('participation');
                      }}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-foreground">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.participation && (
                <p className="text-sm text-destructive">{errors.participation}</p>
              )}
            </div>
          </ConditionalField>

          {/* 4. 希望獲得 (複選) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground/80">
              你參加這門課最希望獲得什麼？ <span className="text-destructive">*</span>
              <span className="text-xs text-muted-foreground ml-2">(可複選)</span>
            </label>
            <div className="space-y-2">
              {GOAL_OPTIONS.map((option) => (
                <GlassCheckbox
                  key={option.value}
                  label={option.label}
                  checked={goals.includes(option.value)}
                  onChange={(e) => handleGoalChange(option.value, e.target.checked)}
                />
              ))}
            </div>
            {errors.goals && (
              <p className="text-sm text-destructive">{errors.goals}</p>
            )}
          </div>

          {/* 5. AI 程度 */}
          <GlassRadio
            name="aiLevel"
            label="你對 AI 的自評程度是？"
            required
            options={AI_LEVEL_OPTIONS}
            value={aiLevel}
            onChange={(val) => {
              setAiLevel(val);
              clearError('aiLevel');
            }}
            error={errors.aiLevel}
          />
        </GlassCard>

        {/* 報名資訊區塊 */}
        <GlassCard className="space-y-6">
          <h2 className="form-section-title">報名資訊</h2>

          {/* 6. 姓名 */}
          <GlassInput
            label="姓名"
            name="fullName"
            required
            placeholder="請輸入您的姓名"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError('fullName');
            }}
            error={errors.fullName}
          />

          {/* 7. 聯絡電話 */}
          <GlassInput
            label="聯絡電話"
            name="phone"
            type="tel"
            required
            placeholder="請輸入聯絡電話"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearError('phone');
            }}
            error={errors.phone}
          />

          {/* 8. E-mail */}
          <GlassInput
            label="E-mail"
            name="email"
            type="email"
            required
            placeholder="example@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError('email');
            }}
            error={errors.email}
          />

          {/* 9. LINE 帳號 */}
          <GlassInput
            label="LINE帳號"
            name="lineId"
            placeholder="請輸入您的 LINE ID"
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
          />

          {/* 10. 公司/團隊名稱 */}
          <GlassInput
            label="公司/團隊名稱"
            name="companyName"
            placeholder="請輸入公司或團隊名稱"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          {/* 11. 職位 */}
          <GlassInput
            label="職位"
            name="jobTitle"
            placeholder="請輸入您的職位"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />

          {/* 12. 推薦人 */}
          <GlassInput
            label="推薦人"
            name="referrer"
            placeholder="若有推薦人請填寫"
            value={referrer}
            onChange={(e) => setReferrer(e.target.value)}
          />

          {/* 13. 報名人數 */}
          <GlassInput
            label="報名人數"
            name="attendeeCount"
            type="number"
            required
            min={1}
            placeholder="請輸入報名人數"
            value={attendeeCount.toString()}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              setAttendeeCount(val < 1 ? 1 : val);
              clearError('attendeeCount');
            }}
            error={errors.attendeeCount}
          />

          {/* 14. 課程總金額 (唯讀) */}
          <ConditionalField show={shouldShowPaymentFields}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">
                課程總金額
              </label>
              <div className="glass-input bg-white/5 cursor-not-allowed">
                <span className="text-foreground font-medium">
                  NT$ {totalAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {participationType ? `${PARTICIPATION_OPTIONS.find(p => p.value === participationType)?.label} × ${attendeeCount} 人` : '請先選擇參加類型'}
              </p>
            </div>
          </ConditionalField>
        </GlassCard>

        {/* 付款資訊區塊 */}
        <ConditionalField show={shouldShowPaymentFields}>
          <GlassCard className="space-y-6">
            <h2 className="form-section-title">付款資訊</h2>

            {/* 15. 付款方式 */}
            <GlassSelect
              label="請選擇付款方式"
              name="paymentMethod"
              required
              placeholder="請選擇付款方式"
              options={paymentOptions}
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                clearError('paymentMethod');
              }}
              error={errors.paymentMethod}
            />

            {/* 16. 發票聯式 */}
            <GlassSelect
              label="您的發票聯式"
              name="invoiceType"
              required
              placeholder="請選擇發票聯式"
              options={INVOICE_OPTIONS}
              value={invoiceType}
              onChange={(e) => {
                setInvoiceType(e.target.value);
                clearError('invoiceType');
                if (e.target.value !== 'three-copy') {
                  setInvoiceTitle('');
                  setTaxId('');
                }
              }}
              error={errors.invoiceType}
            />

            {/* 17 & 18. 三聯式額外欄位 */}
            <ConditionalField show={invoiceType === 'three-copy'}>
              <div className="space-y-4 pl-4 border-l-2 border-primary/30">
                <GlassInput
                  label="發票抬頭"
                  name="invoiceTitle"
                  required
                  placeholder="請輸入發票抬頭"
                  value={invoiceTitle}
                  onChange={(e) => {
                    setInvoiceTitle(e.target.value);
                    clearError('invoiceTitle');
                  }}
                  error={errors.invoiceTitle}
                />
                <GlassInput
                  label="發票統編"
                  name="taxId"
                  required
                  placeholder="請輸入統一編號"
                  value={taxId}
                  onChange={(e) => {
                    setTaxId(e.target.value);
                    clearError('taxId');
                  }}
                  error={errors.taxId}
                />
              </div>
            </ConditionalField>

          {/* 19. 補助專案統編 */}
          <GlassInput
            label="本課程適用經濟部數位轉型補助專案，若有需要請留下統編由專人與您聯繫"
            name="subsidyTaxId"
            placeholder="請輸入統一編號（選填）"
            value={subsidyTaxId}
            onChange={(e) => setSubsidyTaxId(e.target.value)}
          />

            {/* 20. 其他備註 */}
            <GlassTextarea
              label="其他備註"
              name="notes"
              placeholder="如有其他需求或問題，請在此填寫"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </GlassCard>
        </ConditionalField>

        {/* 提醒文字 */}
        <div className="notice-box notice-box-warning">
          <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-sm">
            ★填表送出後，會寄送刷卡連結給您，提醒您，連結有時效性，若超過時間需重新填表報名，謝謝！
          </p>
        </div>

        {/* 提交按鈕 */}
        <div className="flex justify-center">
          <GlassButton
            type="submit"
            variant="gradient"
            loading={isSubmitting}
            className="min-w-[200px]"
          >
            <Send className="w-4 h-4" />
            確認報名
          </GlassButton>
        </div>
      </form>

      {/* 確認對話框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <CheckCircle className="w-5 h-5 text-primary" />
              確認報名資料
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[50vh] pr-4">
            <div className="space-y-3 text-sm py-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">課程名稱</span>
                <span className="text-foreground font-medium text-right max-w-[60%]">
                  {COURSE_OPTIONS.find(c => c.value === selectedCourse)?.label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">報名場次</span>
                <span className="text-foreground font-medium">
                  {SESSION_OPTIONS.find(s => s.value === selectedSession)?.label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">參加類型</span>
                <span className="text-foreground font-medium">
                  {PARTICIPATION_OPTIONS.find(p => p.value === participationType)?.label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">姓名</span>
                <span className="text-foreground font-medium">{fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">聯絡電話</span>
                <span className="text-foreground font-medium">{phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">E-mail</span>
                <span className="text-foreground font-medium">{email}</span>
              </div>
              {lineId && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">LINE帳號</span>
                  <span className="text-foreground font-medium">{lineId}</span>
                </div>
              )}
              {companyName && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">公司/團隊</span>
                  <span className="text-foreground font-medium">{companyName}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">報名人數</span>
                <span className="text-foreground font-medium">{attendeeCount} 人</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">課程總金額</span>
                <span className="text-foreground font-bold text-primary">NT$ {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">付款方式</span>
                <span className="text-foreground font-medium">
                  {PAYMENT_OPTIONS_FULL.find(p => p.value === paymentMethod)?.label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">發票聯式</span>
                <span className="text-foreground font-medium">
                  {INVOICE_OPTIONS.find(i => i.value === invoiceType)?.label}
                </span>
              </div>
              {invoiceType === 'three-copy' && (
                <>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">發票抬頭</span>
                    <span className="text-foreground font-medium">{invoiceTitle}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">發票統編</span>
                    <span className="text-foreground font-medium">{taxId}</span>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              返回修改
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? '送出中...' : '確認送出'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIDigitalTransformCourseForm;
