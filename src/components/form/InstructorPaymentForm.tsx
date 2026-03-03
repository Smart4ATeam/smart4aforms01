import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import ConditionalField from './ConditionalField';
import { Send, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InstructorPaymentFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

// 身分選項
const ROLE_OPTIONS = [
  { value: 'instructor', label: '講師' },
  { value: 'assistant', label: '助教' },
];

// 活動分類選項
const ACTIVITY_CATEGORY_OPTIONS = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'student-club', label: '學員俱樂部' },
  { value: 'enterprise-non-designated', label: '企業內訓(非指定講師)' },
  { value: 'enterprise-designated', label: '企業內訓(指定講師)' },
];

// 活動天數選項
const ACTIVITY_DAYS_OPTIONS = [
  { value: '1', label: '1天' },
  { value: '2', label: '2天' },
];

// 生成時間選項 (08:00 - 22:00, 每半小時)
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 8; hour <= 22; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    options.push({ value: `${hourStr}:00`, label: `${hourStr}:00` });
    if (hour < 22) {
      options.push({ value: `${hourStr}:30`, label: `${hourStr}:30` });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

// 時間轉分鐘數
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// 計算時數
const calculateHours = (startTime: string, endTime: string): number => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  return (endMinutes - startMinutes) / 60;
};

export const InstructorPaymentForm: React.FC<InstructorPaymentFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [searchParams] = useSearchParams();

  // Get URL parameters for pre-filling
  const urlParams = useMemo(() => ({
    fullName: searchParams.get('fullName') || searchParams.get('姓名') || '',
    phone: searchParams.get('phone') || searchParams.get('聯絡電話') || '',
    address: searchParams.get('address') || searchParams.get('地址') || '',
    email: searchParams.get('email') || searchParams.get('E-mail') || '',
    role: searchParams.get('role') || searchParams.get('參與活動身分') || '',
    activityCategory: searchParams.get('activityCategory') || searchParams.get('參與活動分類') || '',
    activityDays: searchParams.get('activityDays') || searchParams.get('參與活動天數') || '',
  }), [searchParams]);

  // Map role label to value
  const getRoleValue = (roleParam: string): string => {
    if (!roleParam) return '';
    const found = ROLE_OPTIONS.find(r => r.value === roleParam || r.label === roleParam);
    return found?.value || '';
  };

  // Map category label to value
  const getCategoryValue = (categoryParam: string): string => {
    if (!categoryParam) return '';
    const found = ACTIVITY_CATEGORY_OPTIONS.find(c => c.value === categoryParam || c.label === categoryParam);
    return found?.value || '';
  };

  // Map days label to value
  const getDaysValue = (daysParam: string): string => {
    if (!daysParam) return '';
    if (daysParam === '1' || daysParam === '1天') return '1';
    if (daysParam === '2' || daysParam === '2天') return '2';
    return '';
  };

  const [fullName, setFullName] = useState(urlParams.fullName);
  const [phone, setPhone] = useState(urlParams.phone);
  const [address, setAddress] = useState(urlParams.address);
  const [email, setEmail] = useState(urlParams.email);
  const [role, setRole] = useState(getRoleValue(urlParams.role));
  const [activityCategory, setActivityCategory] = useState(getCategoryValue(urlParams.activityCategory));
  const [activityDays, setActivityDays] = useState(getDaysValue(urlParams.activityDays));
  
  // Day 1
  const [date1, setDate1] = useState<Date | undefined>(undefined);
  const [startTime1, setStartTime1] = useState('');
  const [endTime1, setEndTime1] = useState('');
  
  // Day 2
  const [date2, setDate2] = useState<Date | undefined>(undefined);
  const [startTime2, setStartTime2] = useState('');
  const [endTime2, setEndTime2] = useState('');
  
  const [breakHours, setBreakHours] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 驗證結束時間是否大於開始時間
  const isEndTimeValid = (start: string, end: string): boolean => {
    if (!start || !end) return true;
    return timeToMinutes(end) > timeToMinutes(start);
  };

  // 計算合計時數
  const totalHours = useMemo(() => {
    let total = 0;
    
    // Day 1
    if (startTime1 && endTime1 && isEndTimeValid(startTime1, endTime1)) {
      total += calculateHours(startTime1, endTime1);
    }
    
    // Day 2 (if applicable)
    if (activityDays === '2' && startTime2 && endTime2 && isEndTimeValid(startTime2, endTime2)) {
      total += calculateHours(startTime2, endTime2);
    }
    
    // Subtract break hours
    const breakTime = parseFloat(breakHours) || 0;
    total -= breakTime;
    
    return Math.max(0, total);
  }, [startTime1, endTime1, startTime2, endTime2, activityDays, breakHours]);

  // Reset Day 2 fields when switching to 1 day
  useEffect(() => {
    if (activityDays === '1') {
      setDate2(undefined);
      setStartTime2('');
      setEndTime2('');
    }
  }, [activityDays]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = '請輸入姓名';
    }

    if (!phone.trim()) {
      newErrors.phone = '請輸入聯絡電話';
    }

    if (!address.trim()) {
      newErrors.address = '請輸入地址';
    }

    if (!email.trim()) {
      newErrors.email = '請輸入 E-mail';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }

    if (!role) {
      newErrors.role = '請選擇參與活動身分';
    }

    if (!activityCategory) {
      newErrors.activityCategory = '請選擇參與活動分類';
    }

    if (!activityDays) {
      newErrors.activityDays = '請選擇參與活動天數';
    }

    // Day 1 validation
    if (!date1) {
      newErrors.date1 = '請選擇活動日期1';
    }

    if (!startTime1) {
      newErrors.startTime1 = '請選擇開始時間';
    }

    if (!endTime1) {
      newErrors.endTime1 = '請選擇結束時間';
    }

    if (startTime1 && endTime1 && !isEndTimeValid(startTime1, endTime1)) {
      newErrors.endTime1 = '結束時間必須大於開始時間';
    }

    // Day 2 validation (if 2 days)
    if (activityDays === '2') {
      if (!date2) {
        newErrors.date2 = '請選擇活動日期2';
      }

      if (!startTime2) {
        newErrors.startTime2 = '請選擇開始時間';
      }

      if (!endTime2) {
        newErrors.endTime2 = '請選擇結束時間';
      }

      if (startTime2 && endTime2 && !isEndTimeValid(startTime2, endTime2)) {
        newErrors.endTime2 = '結束時間必須大於開始時間';
      }
    }

    if (!breakHours.trim()) {
      newErrors.breakHours = '請輸入休息時間';
    } else if (isNaN(parseFloat(breakHours)) || parseFloat(breakHours) < 0) {
      newErrors.breakHours = '請輸入有效的數字';
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

    const selectedRoleOption = ROLE_OPTIONS.find(r => r.value === role);
    const selectedCategoryOption = ACTIVITY_CATEGORY_OPTIONS.find(c => c.value === activityCategory);
    const selectedDaysOption = ACTIVITY_DAYS_OPTIONS.find(d => d.value === activityDays);

    const webhookData: Record<string, any> = {
      姓名: fullName,
      聯絡電話: phone,
      地址: address,
      'E-mail': email,
      參與活動身分: selectedRoleOption?.label || '',
      參與活動分類: selectedCategoryOption?.label || '',
      參與活動天數: selectedDaysOption?.label || '',
      活動日期1: date1 ? format(date1, 'yyyy/MM/dd') : '',
      '活動日期1開始時間': startTime1,
      '活動日期1結束時間': endTime1,
      '休息時間(小時)': parseFloat(breakHours) || 0,
      合計時數: totalHours,
      lovable表單: true,
      submittedAt: new Date().toISOString(),
    };

    // Add Day 2 fields if applicable
    if (activityDays === '2') {
      webhookData['活動日期2'] = date2 ? format(date2, 'yyyy/MM/dd') : '';
      webhookData['活動日期2開始時間'] = startTime2;
      webhookData['活動日期2結束時間'] = endTime2;
    }

    onSubmit(webhookData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本資料區塊 */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">基本資料</h2>

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

        <GlassInput
          label="聯絡電話"
          name="phone"
          type="tel"
          placeholder="請輸入聯絡電話"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearError('phone');
          }}
          required
          error={errors.phone}
        />

        <GlassInput
          label="地址"
          name="address"
          placeholder="請輸入地址"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            clearError('address');
          }}
          required
          error={errors.address}
        />

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
      </GlassCard>

      {/* 活動資訊區塊 */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">活動資訊</h2>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground/80 mb-3">
            參與活動身分 <span className="text-destructive">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-3">不同身分請分開填表</p>
          <div className="space-y-3">
            {ROLE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  role === option.value
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={(e) => {
                    setRole(e.target.value);
                    clearError('role');
                  }}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.role && (
            <p className="text-sm text-destructive mt-1">{errors.role}</p>
          )}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground/80 mb-3">
            參與活動分類 <span className="text-destructive">*</span>
          </label>
          <div className="space-y-3">
            {ACTIVITY_CATEGORY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  activityCategory === option.value
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="activityCategory"
                  value={option.value}
                  checked={activityCategory === option.value}
                  onChange={(e) => {
                    setActivityCategory(e.target.value);
                    clearError('activityCategory');
                  }}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.activityCategory && (
            <p className="text-sm text-destructive mt-1">{errors.activityCategory}</p>
          )}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground/80 mb-3">
            參與活動天數 <span className="text-destructive">*</span>
          </label>
          <div className="space-y-3">
            {ACTIVITY_DAYS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  activityDays === option.value
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="activityDays"
                  value={option.value}
                  checked={activityDays === option.value}
                  onChange={(e) => {
                    setActivityDays(e.target.value);
                    clearError('activityDays');
                  }}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.activityDays && (
            <p className="text-sm text-destructive mt-1">{errors.activityDays}</p>
          )}
        </div>
      </GlassCard>

      {/* 活動時間區塊 - Day 1 */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">活動日期1</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80">
            日期 <span className="text-destructive">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal glass-input",
                  !date1 && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date1 ? format(date1, "yyyy/MM/dd") : <span>請選擇日期</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background border border-border z-50" align="start">
              <CalendarComponent
                mode="single"
                selected={date1}
                onSelect={(date) => {
                  setDate1(date);
                  clearError('date1');
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {errors.date1 && (
            <p className="text-sm text-destructive mt-1">{errors.date1}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <GlassSelect
            label="開始時間"
            name="startTime1"
            placeholder="選擇時間"
            options={TIME_OPTIONS}
            value={startTime1}
            onChange={(e) => {
              setStartTime1(e.target.value);
              clearError('startTime1');
            }}
            required
            error={errors.startTime1}
          />
          <GlassSelect
            label="結束時間"
            name="endTime1"
            placeholder="選擇時間"
            options={TIME_OPTIONS}
            value={endTime1}
            onChange={(e) => {
              setEndTime1(e.target.value);
              clearError('endTime1');
            }}
            required
            error={errors.endTime1}
          />
        </div>
      </GlassCard>

      {/* 活動時間區塊 - Day 2 (條件顯示) */}
      <ConditionalField show={activityDays === '2'}>
        <GlassCard className="space-y-6">
          <h2 className="form-section-title">活動日期2</h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">
              日期 <span className="text-destructive">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal glass-input",
                    !date2 && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date2 ? format(date2, "yyyy/MM/dd") : <span>請選擇日期</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background border border-border z-50" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date2}
                  onSelect={(date) => {
                    setDate2(date);
                    clearError('date2');
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {errors.date2 && (
              <p className="text-sm text-destructive mt-1">{errors.date2}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <GlassSelect
              label="開始時間"
              name="startTime2"
              placeholder="選擇時間"
              options={TIME_OPTIONS}
              value={startTime2}
              onChange={(e) => {
                setStartTime2(e.target.value);
                clearError('startTime2');
              }}
              required
              error={errors.startTime2}
            />
            <GlassSelect
              label="結束時間"
              name="endTime2"
              placeholder="選擇時間"
              options={TIME_OPTIONS}
              value={endTime2}
              onChange={(e) => {
                setEndTime2(e.target.value);
                clearError('endTime2');
              }}
              required
              error={errors.endTime2}
            />
          </div>
        </GlassCard>
      </ConditionalField>

      {/* 時數計算區塊 */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">時數計算</h2>

        <GlassInput
          label="休息時間(小時)"
          name="breakHours"
          type="number"
          placeholder="請輸入休息時間"
          value={breakHours}
          onChange={(e) => {
            setBreakHours(e.target.value);
            clearError('breakHours');
          }}
          required
          error={errors.breakHours}
          min="0"
          step="0.5"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80">
            合計時數
          </label>
          <div className="glass-input bg-white/5 cursor-not-allowed">
            <span className="text-foreground font-medium">
              {totalHours.toFixed(1)} 小時
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            自動計算：活動時間 - 休息時間
          </p>
        </div>
      </GlassCard>

      {/* 提交按鈕 */}
      <GlassButton
        type="submit"
        variant="gradient"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        <Send className="w-5 h-5 mr-2" />
        送出申請
      </GlassButton>
    </form>
  );
};

export default InstructorPaymentForm;
