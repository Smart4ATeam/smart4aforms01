import React, { useState, useEffect } from 'react';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import ConditionalField from './ConditionalField';
import { AlertTriangle, Send } from 'lucide-react';
import { getFormOptionsFromDB, getPersistedFormOptions, RetrainingCourseDateOption, FORM_OPTIONS_UPDATED_EVENT } from '@/data/forms';

interface CourseRetrainingFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

// Helper function to check if a date has passed (based on first day of the date range)
// Supports both YYYY/MM/DD and YYYY/M/D formats
const isDatePassed = (dateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Extract the first date from the string (e.g., "2026/01/17-01/18" or "2026/1/17-1/18" -> "2026/01/17" or "2026/1/17")
  const firstDateStr = dateStr.split('-')[0];
  const [year, month, day] = firstDateStr.split('/').map(Number);
  if (!year || !month || !day) return false;
  const courseDate = new Date(year, month - 1, day);
  
  return courseDate <= today;
};

// Default course options (fallback when no DB data)
const DEFAULT_COURSE_OPTIONS: RetrainingCourseDateOption[] = [
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
  },
];

const ATTENDANCE_OPTIONS = [
  { value: 'day1-only', label: '只上第一天' },
  { value: 'day2-only', label: '只上第二天' },
  { value: 'both-days', label: '兩天都上' },
];

const PAYMENT_OPTIONS = [
  { value: 'credit-card', label: '信用卡（可分期付款 - 中國信託 / 台新銀行 / 玉山銀行）' },
  { value: 'atm', label: 'ATM轉帳' },
  { value: 'ibon', label: 'ibon' },
];

const INVOICE_OPTIONS = [
  { value: 'two-copy', label: '二聯式' },
  { value: 'three-copy', label: '三聯式' },
];

export const CourseRetrainingForm: React.FC<CourseRetrainingFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [courseOptions, setCourseOptions] = useState<RetrainingCourseDateOption[]>(DEFAULT_COURSE_OPTIONS);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [attendanceDays, setAttendanceDays] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [invoiceType, setInvoiceType] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [taxId, setTaxId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load course options from DB or localStorage
  useEffect(() => {
    const loadOptions = async () => {
      const dbOptions = await getFormOptionsFromDB('course-retraining');
      if (dbOptions?.retrainingCourseDates) {
        setCourseOptions(dbOptions.retrainingCourseDates as RetrainingCourseDateOption[]);
      } else {
        const localOptions = getPersistedFormOptions('course-retraining');
        if (localOptions?.retrainingCourseDates) {
          setCourseOptions(localOptions.retrainingCourseDates as RetrainingCourseDateOption[]);
        }
      }
    };
    loadOptions();

    // Listen for updates from Dashboard
    const handleOptionsUpdate = (event: CustomEvent) => {
      if (event.detail?.formPath === 'course-retraining' && event.detail?.options?.retrainingCourseDates) {
        setCourseOptions(event.detail.options.retrainingCourseDates as RetrainingCourseDateOption[]);
      }
    };
    window.addEventListener(FORM_OPTIONS_UPDATED_EVENT, handleOptionsUpdate as EventListener);
    return () => window.removeEventListener(FORM_OPTIONS_UPDATED_EVENT, handleOptionsUpdate as EventListener);
  }, []);

  // Get selected course data
  const selectedCourseData = courseOptions.find(c => c.courseValue === selectedCourse);
  
  // Filter out dates that have passed
  const availableDates = (selectedCourseData?.dates || []).filter(date => !isDatePassed(date));

  // Check if the selected course is a single-day course (設計流程)
  const isSingleDayCourse = selectedCourseData?.isSingleDay || false;

  // Reset selected date and attendance when course changes
  useEffect(() => {
    setSelectedDate('');
    // Auto-set attendance to day1-only for single day courses
    if (selectedCourseData?.isSingleDay) {
      setAttendanceDays('day1-only');
    } else {
      setAttendanceDays('');
    }
  }, [selectedCourse, selectedCourseData?.isSingleDay]);

  // Calculate total amount based on attendance
  const totalAmount = attendanceDays === 'both-days' ? 1000 : (attendanceDays ? 500 : 0);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCourse) {
      newErrors.course = '請選擇課程';
    }

    if (!selectedDate) {
      newErrors.date = '請選擇課程日期';
    }

    if (!attendanceDays) {
      newErrors.attendance = '請選擇上課天數';
    }

    if (!fullName.trim()) {
      newErrors.fullName = '請輸入姓名';
    }

    if (!phone.trim()) {
      newErrors.phone = '請輸入手機號碼';
    }

    if (!email.trim()) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = '請選擇付款方式';
    }

    if (!invoiceType) {
      newErrors.invoiceType = '請選擇發票形式';
    }

    if (invoiceType === 'three-copy') {
      if (!invoiceTitle.trim()) {
        newErrors.invoiceTitle = '請輸入發票抬頭';
      }
      if (!taxId.trim()) {
        newErrors.taxId = '請輸入統一編號';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const selectedCourseOption = courseOptions.find(c => c.courseValue === selectedCourse);
    const selectedAttendanceOption = ATTENDANCE_OPTIONS.find(a => a.value === attendanceDays);
    const selectedPaymentOption = PAYMENT_OPTIONS.find(p => p.value === paymentMethod);
    const selectedInvoiceOption = INVOICE_OPTIONS.find(i => i.value === invoiceType);

    // Build webhook data with separate date fields
    const webhookData: Record<string, any> = {
      課程名稱: selectedCourseOption?.webhookLabel || '',
      入門課日期: '',
      初階課日期: '',
      中階課日期: '',
      高階課日期: '',
      上課天數: selectedAttendanceOption?.label || '',
      姓名: fullName,
      手機號碼: phone,
      電子郵件: email,
      總金額: totalAmount,
      付款方式: selectedPaymentOption?.label || '',
      發票形式: selectedInvoiceOption?.label || '',
      lovable表單: true,
      submittedAt: new Date().toISOString(),
    };

    // Set the appropriate date field based on selected course
    if (selectedCourseOption) {
      webhookData[selectedCourseOption.webhookDateKey] = selectedDate;
    }

    // Add invoice details if 三聯式
    if (invoiceType === 'three-copy') {
      webhookData['發票抬頭'] = invoiceTitle;
      webhookData['統一編號'] = taxId;
    }

    onSubmit(webhookData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 課程選擇區塊 */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">課程選擇</h2>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground/80 mb-3">
            選擇課程 <span className="text-destructive">*</span>
          </label>
          <div className="space-y-3">
            {courseOptions.map((course) => (
              <div key={course.courseValue} className="space-y-2">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedCourse === course.courseValue
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="course"
                    value={course.courseValue}
                    checked={selectedCourse === course.courseValue}
                    onChange={(e) => {
                      setSelectedCourse(e.target.value);
                      clearError('course');
                      clearError('date');
                    }}
                    className="mt-1 w-4 h-4 accent-primary"
                  />
                  <span className="text-foreground font-medium">{course.courseName}</span>
                </label>
                
                {/* Date dropdown - show when this course is selected */}
                {selectedCourse === course.courseValue && (
                  <div className="ml-7 mt-2">
                    <GlassSelect
                      name={`date-${course.courseValue}`}
                      placeholder="請選擇日期"
                      options={availableDates.map(date => ({ value: date, label: date }))}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        clearError('date');
                      }}
                      error={errors.date}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.course && (
            <p className="text-sm text-destructive mt-1">{errors.course}</p>
          )}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground/80 mb-3">
            上課天數 <span className="text-destructive">*</span>
          </label>
          <div className="space-y-3">
            {ATTENDANCE_OPTIONS.map((option) => {
              // For single-day courses, only show "只上第一天" option
              if (isSingleDayCourse && option.value !== 'day1-only') {
                return null;
              }
              
              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    attendanceDays === option.value
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  } ${isSingleDayCourse && option.value === 'day1-only' ? 'cursor-default' : ''}`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value={option.value}
                    checked={attendanceDays === option.value}
                    onChange={(e) => {
                      if (!isSingleDayCourse || option.value === 'day1-only') {
                        setAttendanceDays(e.target.value);
                        clearError('attendance');
                      }
                    }}
                    disabled={isSingleDayCourse && option.value === 'day1-only'}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-foreground">{option.label}</span>
                </label>
              );
            })}
          </div>
          {isSingleDayCourse && (
            <p className="text-xs text-muted-foreground">設計流程(入門)課程為單日課程</p>
          )}
          {errors.attendance && (
            <p className="text-sm text-destructive mt-1">{errors.attendance}</p>
          )}
        </div>
      </GlassCard>

      {/* 報名資訊區塊 */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">報名資訊</h2>

        <div className="space-y-1">
          <GlassInput
            label="姓名"
            name="fullName"
            placeholder="請輸入完整姓名"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError('fullName');
            }}
            required
            error={errors.fullName}
          />
          <div className="notice-box notice-box-warning mt-2">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <p>如欲申請政府補助請務必填寫完整中文姓名</p>
          </div>
        </div>

        <div className="space-y-1">
          <GlassInput
            label="手機號碼"
            name="phone"
            type="tel"
            placeholder="請輸入手機號碼"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearError('phone');
            }}
            required
            error={errors.phone}
          />
          <p className="text-xs text-muted-foreground">請務必填寫正確手機號碼，將會收到付款簡訊</p>
        </div>

        <div className="space-y-1">
          <GlassInput
            label="電子郵件"
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
          <p className="text-xs text-muted-foreground">付款連結及發票將自動經送至此email</p>
        </div>

        {/* 總金額 - 唯讀 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80">
            總金額
          </label>
          <div className="glass-input bg-white/5 cursor-not-allowed">
            <span className="text-foreground font-medium">
              NT$ {totalAmount}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {attendanceDays === 'both-days' ? '兩天都上 = NT$ 1,000' : 
             attendanceDays ? '單天 = NT$ 500' : '請先選擇上課天數'}
          </p>
        </div>
      </GlassCard>

      {/* 付款資訊區塊 */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">付款資訊</h2>

        <div className="space-y-1">
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
          <p className="text-xs text-muted-foreground">付款金額加總達2萬元，請選擇用卡</p>
        </div>

        <GlassSelect
          label="發票形式"
          name="invoiceType"
          placeholder="請選擇發票形式"
          options={INVOICE_OPTIONS}
          value={invoiceType}
          onChange={(e) => {
            setInvoiceType(e.target.value);
            clearError('invoiceType');
            // Clear invoice-related fields when switching
            if (e.target.value !== 'three-copy') {
              setInvoiceTitle('');
              setTaxId('');
            }
          }}
          required
          error={errors.invoiceType}
        />

        {/* 三聯式發票額外欄位 */}
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

      {/* 提交按鈕 */}
      <div className="flex justify-center">
        <GlassButton
          type="submit"
          variant="gradient"
          loading={isSubmitting}
          className="min-w-[200px]"
        >
          <Send className="w-4 h-4" />
          送出報名
        </GlassButton>
      </div>
    </form>
  );
};

export default CourseRetrainingForm;
