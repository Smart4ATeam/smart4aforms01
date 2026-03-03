import React, { useState, useMemo, useEffect } from 'react';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import GlassRadio from './GlassRadio';
import ConditionalField from './ConditionalField';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  AlertCircle,
  Send,
  RotateCcw
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { getFormByPath, FormOption, FormOptionsConfig, FORM_OPTIONS_UPDATED_EVENT, FORM_OPTIONS_STORAGE_KEY, getFormOptionsFromDB } from '@/data/forms';

interface StudentClubFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

// Default course dates (fallback)
const DEFAULT_COURSE_DATES: FormOption[] = [
  { value: '2026/01/14', label: '2026/01/14' },
  { value: '2026/01/28', label: '2026/01/28' },
  { value: '2026/02/11', label: '2026/02/11' },
  { value: '2026/02/25', label: '2026/02/25' },
];

// Helper function to check if a date has passed
const isDatePassed = (dateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [year, month, day] = dateStr.split('/').map(Number);
  const courseDate = new Date(year, month - 1, day);
  
  return courseDate <= today;
};

const PAYMENT_OPTIONS = [
  { value: 'credit-card', label: '信用卡（可分期付款 - 中國信託 / 台新銀行 / 玉山銀行）' },
  { value: 'atm', label: 'ATM轉帳' },
  { value: 'ibon', label: 'ibon' },
];

const INVOICE_OPTIONS = [
  { value: 'two-copy', label: '二聯式' },
  { value: 'three-copy', label: '三聯式' },
];

type VerificationStatus = 'idle' | 'loading' | 'success_sufficient' | 'success_insufficient' | 'not_found_query' | 'not_found_verify';

const StudentClubForm: React.FC<StudentClubFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  // Course dates from config (dynamically loaded)
  const [courseDateOptions, setCourseDateOptions] = useState<FormOption[]>(DEFAULT_COURSE_DATES);

  // Load course dates from Supabase on mount and listen for updates
  useEffect(() => {
    const loadCourseDates = async () => {
      // Try to load from Supabase first
      const dbOptions = await getFormOptionsFromDB('student-club');
      
      if (dbOptions?.courseDates && dbOptions.courseDates.length > 0) {
        setCourseDateOptions(dbOptions.courseDates);
        return;
      }
      
      // Fall back to localStorage/config
      const formConfig = getFormByPath('student-club');
      if (formConfig?.options?.courseDates && formConfig.options.courseDates.length > 0) {
        setCourseDateOptions(formConfig.options.courseDates);
      }
    };

    // Initial load
    loadCourseDates();

    // Listen for custom event (same tab updates)
    const handleOptionsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ formPath: string; options: FormOptionsConfig }>;
      if (customEvent.detail.formPath === 'student-club' && customEvent.detail.options?.courseDates) {
        setCourseDateOptions(customEvent.detail.options.courseDates);
      }
    };

    // Listen for storage event (cross-tab updates)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === FORM_OPTIONS_STORAGE_KEY) {
        loadCourseDates();
      }
    };

    window.addEventListener(FORM_OPTIONS_UPDATED_EVENT, handleOptionsUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener(FORM_OPTIONS_UPDATED_EVENT, handleOptionsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Form state
  const [courseDate, setCourseDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isStudent, setIsStudent] = useState<string>('');
  const [studentId, setStudentId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [invoiceType, setInvoiceType] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [taxId, setTaxId] = useState('');
  
  // Verification state
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [studentPoints, setStudentPoints] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Get available course dates (filter out passed dates)
  const availableDates = useMemo(() => {
    return courseDateOptions.filter(opt => !isDatePassed(opt.value));
  }, [courseDateOptions]);

  // Check if points are sufficient (status is success_sufficient means free)
  const isFreeWithPoints = verificationStatus === 'success_sufficient';
  
  // Determine if payment fields should be shown
  const showPaymentFields = isStudent === 'no' || 
    (isStudent === 'yes' && (verificationStatus === 'not_found_query' || verificationStatus === 'not_found_verify' || verificationStatus === 'success_insufficient'));

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Handle student lookup via webhook
  const handleStudentLookup = async () => {
    if (!fullName.trim() || !email.trim()) {
      setErrors(prev => ({
        ...prev,
        studentId: '請先填寫姓名和 E-mail 才能查詢'
      }));
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('loading');
    clearError('studentId');

    try {
      const response = await fetch('https://hook.us1.make.com/b2nfqvshb5m24m146mcez88i9ufoilnl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          姓名: fullName,
          'E-mail': email,
          功能: '查詢'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Expected response format:
        // 無資料: { "結果": "無資料" }
        // 有資料: { "結果": "有資料", "學員編號": "xxx", "狀態": "點數足夠" or "點數不足", "剩餘點數": 100 }
        
        if (data.結果 === '無資料') {
          setVerificationStatus('not_found_query');
          setStudentPoints(null);
        } else if (data.結果 === '有資料' && data.學員編號) {
          setStudentId(data.學員編號);
          const points = data.剩餘點數 || 0;
          setStudentPoints(points);
          
          if (data.狀態 === '點數足夠') {
            setVerificationStatus('success_sufficient');
          } else {
            setVerificationStatus('success_insufficient');
          }
        } else {
          setVerificationStatus('not_found_query');
          setStudentPoints(null);
        }
      } else {
        setVerificationStatus('not_found_query');
        setStudentPoints(null);
      }
    } catch (error) {
      console.error('Lookup error:', error);
      setVerificationStatus('not_found_query');
      setStudentPoints(null);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle student verification via webhook
  const handleStudentVerify = async () => {
    if (!fullName.trim() || !email.trim() || !studentId.trim()) {
      setErrors(prev => ({
        ...prev,
        studentId: '請先填寫姓名、E-mail 和學員編號'
      }));
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('loading');
    clearError('studentId');

    try {
      const response = await fetch('https://hook.us1.make.com/b2nfqvshb5m24m146mcez88i9ufoilnl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          姓名: fullName,
          'E-mail': email,
          學員編號: studentId,
          功能: '驗證'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Expected response format:
        // 無資料: { "結果": "無資料" }
        // 有資料: { "結果": "有資料", "學員編號": "xxx", "狀態": "點數足夠" or "點數不足", "剩餘點數": 100 }
        
        if (data.結果 === '無資料') {
          setVerificationStatus('not_found_verify');
          setStudentPoints(null);
        } else if (data.結果 === '有資料') {
          const points = data.剩餘點數 || 0;
          setStudentPoints(points);
          
          if (data.狀態 === '點數足夠') {
            setVerificationStatus('success_sufficient');
          } else {
            setVerificationStatus('success_insufficient');
          }
        } else {
          setVerificationStatus('not_found_verify');
          setStudentPoints(null);
        }
      } else {
        setVerificationStatus('not_found_verify');
        setStudentPoints(null);
      }
    } catch (error) {
      console.error('Verify error:', error);
      setVerificationStatus('not_found_verify');
      setStudentPoints(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!courseDate) {
      newErrors.courseDate = '請選擇課程日期';
    }

    if (!fullName.trim()) {
      newErrors.fullName = '請輸入姓名';
    }

    if (!phone.trim()) {
      newErrors.phone = '請輸入手機號碼';
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = '手機號碼只能輸入數字';
    }

    if (!email.trim()) {
      newErrors.email = '請輸入 E-mail';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '請輸入有效的 E-mail 格式';
    }

    if (!isStudent) {
      newErrors.isStudent = '請選擇是否為學員';
    }

    // Only validate payment fields if needed
    if (showPaymentFields) {
      if (!paymentMethod) {
        newErrors.paymentMethod = '請選擇付款方式';
      }

      if (!invoiceType) {
        newErrors.invoiceType = '請選擇發票類型';
      }

      if (invoiceType === 'three-copy') {
        if (!invoiceTitle.trim()) {
          newErrors.invoiceTitle = '請輸入發票抬頭';
        }
        if (!taxId.trim()) {
          newErrors.taxId = '請輸入統一編號';
        }
      }
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

  const handleSubmit = () => {
    setShowConfirmDialog(false);

    const selectedPayment = PAYMENT_OPTIONS.find(p => p.value === paymentMethod);
    const selectedInvoice = INVOICE_OPTIONS.find(i => i.value === invoiceType);

    const formData: Record<string, any> = {
      課程日期: courseDate,
      姓名: fullName,
      手機號碼: phone,
      'E-mail': email,
      是否為學員: isStudent === 'yes' ? '是' : '否',
      學員編號: isStudent === 'yes' ? studentId : '',
      點數狀態: isFreeWithPoints ? '點數足夠' : (verificationStatus === 'success_insufficient' ? '點數不足' : ''),
      金額: isFreeWithPoints ? 0 : 800,
      付款方式: showPaymentFields ? (selectedPayment?.label || '') : '學習點數折抵',
      發票類型: showPaymentFields ? (selectedInvoice?.label || '') : '',
      發票抬頭: invoiceType === 'three-copy' ? invoiceTitle : '',
      統一編號: invoiceType === 'three-copy' ? taxId : '',
      lovable表單: true,
      submittedAt: new Date().toISOString(),
    };

    onSubmit(formData);
  };

  // Reset student verification when switching to non-student
  const handleIsStudentChange = (value: string) => {
    setIsStudent(value);
    clearError('isStudent');
    if (value === 'no') {
      setStudentId('');
      setVerificationStatus('idle');
      setStudentPoints(null);
    }
  };

  // Get verification status display
  // Reset entire form
  const handleClearForm = () => {
    setCourseDate('');
    setFullName('');
    setPhone('');
    setEmail('');
    setIsStudent('');
    setStudentId('');
    setPaymentMethod('');
    setInvoiceType('');
    setInvoiceTitle('');
    setTaxId('');
    setVerificationStatus('idle');
    setStudentPoints(null);
    setErrors({});
  };

  const getVerificationStatusDisplay = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>查詢中...</span>
          </div>
        );
      case 'success_sufficient':
        return (
          <div className="p-4 rounded-lg bg-green-900/60 border border-green-500/50 space-y-2">
            <div className="flex items-center gap-2 text-green-300">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">驗證成功！點數足夠</span>
            </div>
            <p className="text-sm text-green-100">
              目前點數：{studentPoints} 點，本次課程將扣除 50 點，無需另行付款。
            </p>
          </div>
        );
      case 'success_insufficient':
        return (
          <div className="p-4 rounded-lg bg-yellow-900/60 border border-yellow-500/50 space-y-2">
            <div className="flex items-center gap-2 text-yellow-300">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">驗證成功，但點數不足</span>
            </div>
            <p className="text-sm text-yellow-100">
              目前點數：{studentPoints} 點，需達 50 點才可折抵，請以現金方式報名。
            </p>
          </div>
        );
      case 'not_found_query':
        return (
          <div className="p-4 rounded-lg bg-red-900/60 border border-red-500/50 space-y-2">
            <div className="flex items-center gap-2 text-red-300">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">查無資料</span>
            </div>
            <p className="text-sm text-red-100">
              找不到對應的學員資料，請確認姓名與 E-mail 是否與當初報名 Workshop 相同，或以一般身分報名學員俱樂部。
            </p>
          </div>
        );
      case 'not_found_verify':
        return (
          <div className="p-4 rounded-lg bg-red-900/60 border border-red-500/50 space-y-2">
            <div className="flex items-center gap-2 text-red-300">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">查無資料</span>
            </div>
            <p className="text-sm text-red-100">
              資料庫中無此學員編號，請重新確認，或按查詢按鈕透過姓名與 E-mail 查詢。（請輸入當初報名 Workshop 時的姓名與 E-mail）
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const isVerificationLocked = verificationStatus === 'success_sufficient' || verificationStatus === 'success_insufficient';

  return (
    <>
      <form onSubmit={handlePreSubmit} className="space-y-6">
        {/* 說明區域 */}
        <GlassCard className="space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 mb-2">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">學員俱樂部</h2>
          </div>
          
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-foreground/90 leading-relaxed">
                課程設計淺顯易懂、貼近工作情境，不論你是初學者還是進階使用者，都能輕鬆上手、有所收穫！
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
              <p className="text-foreground/90 leading-relaxed">
                未上過課程的朋友也非常適合參加，從零開始建立技術基礎，循序漸進養成數位力！
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/15 to-transparent border border-primary/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-md shadow-primary/20 shrink-0">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-primary/70">時間</span>
                <span className="text-foreground font-bold">週三 19:30 - 21:00</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 to-transparent border border-emerald-500/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/20 shrink-0">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-emerald-400/70">費用</span>
                <span className="text-foreground font-bold">800 元</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-rose-500/15 to-transparent border border-rose-500/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 shadow-md shadow-rose-500/20 shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-rose-400/70">地點</span>
                <span className="text-foreground font-bold">台北市中正區忠孝東路一段76號3樓之1</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              參加方式
            </h3>
            <div className="space-y-2 text-foreground/80 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-primary">☛</span>
                <span>未參加過Workshop活動的同學可作為基礎學習的入門途徑，提供更多與人接觸和學習的機會。</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">☛</span>
                <span>凡參加過Workshop活動（基礎、中階、高階）的學員，可用學習點數折抵(每次50點)來免費參與課程，但亦須填寫表單報名呦。</span>
              </p>
            </div>
          </div>
        </GlassCard>

        {/* 報名資訊區塊 */}
        <GlassCard className="space-y-6">
          <h2 className="form-section-title">報名資訊</h2>

          <GlassSelect
            label="課程日期"
            name="courseDate"
            placeholder="請選擇課程日期"
            options={availableDates.map(opt => ({ value: opt.value, label: opt.label }))}
            value={courseDate}
            onChange={(e) => {
              setCourseDate(e.target.value);
              clearError('courseDate');
            }}
            required
            error={errors.courseDate}
          />

          <GlassInput
            label="姓名"
            name="fullName"
            placeholder="請輸入姓名"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError('fullName');
            }}
            required
            error={errors.fullName}
          />

          <div className="space-y-1">
            <GlassInput
              label="手機號碼"
              name="phone"
              type="tel"
              placeholder="請輸入手機號碼"
              value={phone}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                setPhone(value);
                clearError('phone');
              }}
              required
              error={errors.phone}
            />
            <p className="text-xs text-muted-foreground">請務必填寫正確手機號碼，以便發送付款簡訊</p>
          </div>

          <div className="space-y-1">
            <GlassInput
              label="E-mail"
              name="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError('email');
              }}
              required
              error={errors.email}
            />
            <p className="text-xs text-muted-foreground">如有報名過課程，請使用當時報名課程使用之郵件</p>
          </div>
        </GlassCard>

        {/* 學員資訊區塊 */}
        <GlassCard className="space-y-6">
          <h2 className="form-section-title">學員資訊</h2>

          <GlassRadio
            name="isStudent"
            label="是否為學員"
            options={[
              { value: 'yes', label: '是' },
              { value: 'no', label: '否' },
            ]}
            value={isStudent}
            onChange={handleIsStudentChange}
            required
            error={errors.isStudent}
          />

          <ConditionalField show={isStudent === 'yes'}>
            <div className="space-y-4 pl-4 border-l-2 border-primary/30">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground/80">
                  學員編號
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => {
                        setStudentId(e.target.value);
                        clearError('studentId');
                      }}
                      disabled={isVerificationLocked}
                      className="glass-input w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="輸入學員編號按下【驗證】按鈕，或者點擊查詢"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleStudentLookup}
                    disabled={isVerifying || isVerificationLocked}
                    className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>查詢</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStudentVerify}
                    disabled={isVerifying || isVerificationLocked || !studentId.trim()}
                    className="px-4 py-2 rounded-lg bg-emerald-600 border border-emerald-500 text-white font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>驗證</span>
                  </button>
                </div>
                {errors.studentId && (
                  <p className="text-sm text-destructive">{errors.studentId}</p>
                )}
              </div>

              {getVerificationStatusDisplay()}
            </div>
          </ConditionalField>
        </GlassCard>

        {/* 付款資訊區塊 - 只在需要付款時顯示 */}
        <ConditionalField show={showPaymentFields}>
          <GlassCard className="space-y-6">
            <h2 className="form-section-title">付款資訊</h2>

            {/* 金額顯示 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">
                金額
              </label>
              <div className="glass-input bg-white/5 cursor-not-allowed">
                <span className="text-foreground font-medium">NT$ 800</span>
              </div>
            </div>

            <GlassSelect
              label="付款方式"
              name="paymentMethod"
              placeholder="請選擇付款方式"
              options={PAYMENT_OPTIONS}
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                clearError('paymentMethod');
              }}
              required
              error={errors.paymentMethod}
            />

            <GlassSelect
              label="發票類型"
              name="invoiceType"
              placeholder="請選擇發票類型"
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
              required
              error={errors.invoiceType}
            />

            <ConditionalField show={invoiceType === 'three-copy'}>
              <div className="space-y-4 pl-4 border-l-2 border-primary/30">
                <GlassInput
                  label="發票抬頭"
                  name="invoiceTitle"
                  placeholder="請輸入發票抬頭"
                  value={invoiceTitle}
                  onChange={(e) => {
                    setInvoiceTitle(e.target.value);
                    clearError('invoiceTitle');
                  }}
                  required
                  error={errors.invoiceTitle}
                />
                <GlassInput
                  label="統一編號"
                  name="taxId"
                  placeholder="請輸入統一編號"
                  value={taxId}
                  onChange={(e) => {
                    setTaxId(e.target.value);
                    clearError('taxId');
                  }}
                  required
                  error={errors.taxId}
                />
              </div>
            </ConditionalField>
          </GlassCard>
        </ConditionalField>

        {/* 點數折抵成功提示 */}
        <ConditionalField show={isFreeWithPoints}>
          <GlassCard className="bg-green-500/10 border-green-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
              <div>
                <p className="font-medium text-green-400">點數折抵報名</p>
                <p className="text-sm text-green-300/80">本次報名將使用 50 點學習點數，無需另行付款。</p>
              </div>
            </div>
          </GlassCard>
        </ConditionalField>

        {/* 按鈕區域 */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleClearForm}
            className="flex-1 px-4 py-3 rounded-lg border border-white/20 text-foreground hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            清除重填
          </button>
          <GlassButton
            type="submit"
            variant="gradient"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="flex-1"
          >
            <Send className="w-5 h-5 mr-2" />
            送出申請
          </GlassButton>
        </div>
      </form>

      {/* 確認對話框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              確認報名資料
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-muted-foreground">課程日期</span>
                <span className="text-foreground font-medium">{courseDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-muted-foreground">姓名</span>
                <span className="text-foreground font-medium">{fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-muted-foreground">手機號碼</span>
                <span className="text-foreground font-medium">{phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-muted-foreground">E-mail</span>
                <span className="text-foreground font-medium">{email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-muted-foreground">是否為學員</span>
                <span className="text-foreground font-medium">{isStudent === 'yes' ? '是' : '否'}</span>
              </div>
              {isStudent === 'yes' && studentId && (
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-muted-foreground">學員編號</span>
                  <span className="text-foreground font-medium">{studentId}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-muted-foreground">金額</span>
                <span className={`font-medium ${isFreeWithPoints ? 'text-green-400' : 'text-foreground'}`}>
                  {isFreeWithPoints ? '點數折抵（免費）' : 'NT$ 800'}
                </span>
              </div>
              {showPaymentFields && (
                <>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-muted-foreground">付款方式</span>
                    <span className="text-foreground font-medium">
                      {PAYMENT_OPTIONS.find(p => p.value === paymentMethod)?.label || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-muted-foreground">發票類型</span>
                    <span className="text-foreground font-medium">
                      {INVOICE_OPTIONS.find(i => i.value === invoiceType)?.label || '-'}
                    </span>
                  </div>
                  {invoiceType === 'three-copy' && (
                    <>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-muted-foreground">發票抬頭</span>
                        <span className="text-foreground font-medium">{invoiceTitle}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-muted-foreground">統一編號</span>
                        <span className="text-foreground font-medium">{taxId}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-foreground hover:bg-white/10 transition-colors"
            >
              返回修改
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              確認送出
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentClubForm;
