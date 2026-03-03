import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormPageTemplate, GlassInput, GlassSelect, GlassCheckbox, GlassRadio, GlassButton } from './index';
import { Calendar, MapPin, Clock, Users, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getPersistedFormOptions, getFormOptionsFromDB, FORM_OPTIONS_UPDATED_EVENT, FormOption } from '@/data/forms';

interface TuesdayMeetupFormProps {
  onSubmit: (data: Record<string, any>) => Promise<void>;
  isSubmitting?: boolean;
}

// 活動日期選項 - 自動過濾過期日期
const getEventDateOptions = (eventDates?: FormOption[]) => {
  const allDates = eventDates || [
    { value: '2026/01/06', label: '2026/01/06 (二)' },
    { value: '2026/02/03', label: '2026/02/03 (二)' },
    { value: '2026/03/10', label: '2026/03/10 (二)' },
    { value: '2026/04/14', label: '2026/04/14 (二)' },
  ];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return allDates.filter(date => {
    const [year, month, day] = date.value.split('/').map(Number);
    const eventDate = new Date(year, month - 1, day);
    return eventDate >= today;
  });
};

// 參加目的選項
const purposeOptions = [
  { value: 'knowledge-practice', label: '網絡的知識轉化為具體實作' },
  { value: 'networking', label: '認識更多也在做自動化的學員，互相交流經驗' },
  { value: 'get-advice', label: '針對我自己的應用情境，取得具體建議' },
  { value: 'learn-tools', label: '更深入了解 MCP / Make / n8n 等工具的實際搭配' },
  { value: 'advanced-courses', label: '了解學員俱樂部後續的進階課程與資源' },
];

// 如何得知選項
const sourceOptions = [
  { value: 'official-fanpage', label: '看到官方粉絲團或社團' },
  { value: 'line-discord', label: '看到官方 LINE 或 Discord 分享' },
  { value: 'friend-invite', label: '朋友將帶我一同前往' },
];

const TuesdayMeetupForm: React.FC<TuesdayMeetupFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [searchParams] = useSearchParams();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 表單狀態
  const [eventDate, setEventDate] = useState(searchParams.get('eventDate') || '');
  const [fullName, setFullName] = useState(searchParams.get('fullName') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [purposes, setPurposes] = useState<string[]>([]);
  const [purposeOther, setPurposeOther] = useState('');
  const [source, setSource] = useState('');
  const [sourceOther, setSourceOther] = useState('');

  // 動態載入活動日期選項
  const [eventDatesFromDB, setEventDatesFromDB] = useState<FormOption[] | undefined>(undefined);
  
  useEffect(() => {
    const loadOptions = async () => {
      // Try to load from Supabase first
      const dbOptions = await getFormOptionsFromDB('tuesday-meetup');
      if (dbOptions?.eventDates) {
        setEventDatesFromDB(dbOptions.eventDates);
        return;
      }
      
      // Fall back to localStorage
      const persistedOptions = getPersistedFormOptions('tuesday-meetup');
      if (persistedOptions?.eventDates) {
        setEventDatesFromDB(persistedOptions.eventDates);
      }
    };
    
    loadOptions();
    
    // Listen for updates
    const handleOptionsUpdate = (event: CustomEvent) => {
      if (event.detail.formPath === 'tuesday-meetup' && event.detail.options?.eventDates) {
        setEventDatesFromDB(event.detail.options.eventDates);
      }
    };
    
    window.addEventListener(FORM_OPTIONS_UPDATED_EVENT, handleOptionsUpdate as EventListener);
    return () => {
      window.removeEventListener(FORM_OPTIONS_UPDATED_EVENT, handleOptionsUpdate as EventListener);
    };
  }, []);

  // 可用日期選項
  const eventDateOptions = useMemo(() => getEventDateOptions(eventDatesFromDB), [eventDatesFromDB]);

  // 驗證 email 格式
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 驗證手機格式（只允許數字）
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone(value);
  };

  // 處理參加目的多選
  const handlePurposeChange = (value: string, checked: boolean) => {
    if (checked) {
      setPurposes([...purposes, value]);
    } else {
      setPurposes(purposes.filter(p => p !== value));
    }
  };

  const validateForm = () => {
    if (!eventDate) {
      toast.error('請選擇活動日期');
      return false;
    }
    if (!fullName.trim()) {
      toast.error('請填寫姓名');
      return false;
    }
    if (!phone.trim()) {
      toast.error('請填寫手機號碼');
      return false;
    }
    if (!/^\d+$/.test(phone)) {
      toast.error('手機號碼只能填寫數字');
      return false;
    }
    if (!email.trim()) {
      toast.error('請填寫 E-mail');
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error('請填寫正確的 E-mail 格式');
      return false;
    }
    if (purposes.length === 0 && !purposeOther.trim()) {
      toast.error('請至少選擇一項參加目的');
      return false;
    }
    if (!source && !sourceOther.trim()) {
      toast.error('請選擇您如何得知本活動');
      return false;
    }
    return true;
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  // 產生訂單編號：年月日時分秒 + 2位亂數
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

  const handleSubmit = async () => {
    setShowConfirmDialog(false);

    // 組合參加目的
    const purposeLabels = purposes.map(p => 
      purposeOptions.find(opt => opt.value === p)?.label || p
    );
    if (purposeOther.trim()) {
      purposeLabels.push(`其他：${purposeOther}`);
    }

    // 組合如何得知
    let sourceLabel = sourceOptions.find(opt => opt.value === source)?.label || '';
    if (sourceOther.trim()) {
      sourceLabel = `其他：${sourceOther}`;
    }

    const formData = {
      訂單編號: generateOrderNumber(),
      活動日期: eventDate,
      姓名: fullName,
      手機號碼: phone,
      Email: email,
      參加目的: purposeLabels.join('、'),
      如何得知本活動: sourceLabel,
      lovable表單: true,
      submittedAt: new Date().toISOString(),
    };

    await onSubmit(formData);
  };

  // 清除重填
  const handleClear = () => {
    setEventDate('');
    setFullName('');
    setPhone('');
    setEmail('');
    setPurposes([]);
    setPurposeOther('');
    setSource('');
    setSourceOther('');
  };

  return (
    <>
      <form onSubmit={handlePreSubmit} className="space-y-8">
        {/* 活動資訊說明區 */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                週二線下交流會
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">活動時間</h3>
                  <p className="text-muted-foreground text-sm">每月一次，週二 19:00 - 21:00</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">活動地點</h3>
                  <p className="text-muted-foreground text-sm">
                    台北市中正區忠孝東路一段76號3樓之1
                    <br />
                    <span className="text-xs text-primary/80">（善導寺3號出口）</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 表單欄位區 */}
        <section className="space-y-6 p-6 rounded-xl bg-muted/50 border border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            報名資訊
          </h3>

          {/* 1. 活動日期 */}
          <GlassSelect
            label="活動日期"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            options={[
              { value: '', label: '請選擇活動日期' },
              ...eventDateOptions,
            ]}
          />

          {/* 2. 姓名 */}
          <GlassInput
            label="姓名"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="請填寫您的姓名"
          />

          {/* 3. 手機號碼 */}
          <GlassInput
            label="手機號碼"
            required
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="請填寫手機號碼（僅限數字）"
          />

          {/* 4. E-mail */}
          <GlassInput
            label="E-mail"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="請填寫您的 E-mail"
          />

          {/* 5. 參加目的 (複選) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              參加目的 <span className="text-destructive">*</span>
              <span className="text-muted-foreground text-xs ml-2">（可複選）</span>
            </label>
            <div className="space-y-2">
              {purposeOptions.map((option) => (
                <GlassCheckbox
                  key={option.value}
                  label={option.label}
                  checked={purposes.includes(option.value)}
                  onChange={(e) => handlePurposeChange(option.value, e.target.checked)}
                />
              ))}
              <div className="flex items-start gap-3 pt-2">
                <GlassCheckbox
                  label="其他"
                  checked={!!purposeOther.trim()}
                  onChange={(e) => {
                    if (!e.target.checked) setPurposeOther('');
                  }}
                />
                <input
                  type="text"
                  value={purposeOther}
                  onChange={(e) => setPurposeOther(e.target.value)}
                  placeholder="請說明"
                  className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* 6. 您如何得知本活動 (單選) */}
          <div className="space-y-3">
            <GlassRadio
              name="source"
              label="您如何得知本活動"
              required
              options={sourceOptions}
              value={sourceOther.trim() ? '' : source}
              onChange={(val) => {
                setSource(val);
                setSourceOther('');
              }}
            />
            <div className="flex items-start gap-3 pl-6">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="source"
                    checked={!!sourceOther.trim()}
                    onChange={() => setSource('')}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 rounded-full border border-border bg-background/50 backdrop-blur-sm transition-all duration-200 peer-checked:border-primary peer-focus:ring-2 peer-focus:ring-primary/50 group-hover:border-primary/50">
                    <div className="w-2 h-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity peer-checked:opacity-100" />
                </div>
                <span className="text-xs text-foreground/70">其他</span>
              </label>
              <input
                type="text"
                value={sourceOther}
                onChange={(e) => {
                  setSourceOther(e.target.value);
                  if (e.target.value.trim()) setSource('');
                }}
                placeholder="請說明"
                className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </section>

        {/* 按鈕區 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <GlassButton
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '送出中...' : '確認報名'}
          </GlassButton>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="sm:w-auto"
          >
            清除重填
          </Button>
        </div>
      </form>

      {/* 確認對話框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Check className="w-5 h-5 text-primary" />
              確認報名資料
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">活動日期</span>
                <span className="text-foreground font-medium">{eventDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">姓名</span>
                <span className="text-foreground font-medium">{fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">手機號碼</span>
                <span className="text-foreground font-medium">{phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">E-mail</span>
                <span className="text-foreground font-medium">{email}</span>
              </div>
              <div className="py-2 border-b border-border">
                <span className="text-muted-foreground block mb-2">參加目的</span>
                <div className="text-foreground text-xs space-y-1">
                  {purposes.map(p => (
                    <div key={p} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-primary" />
                      {purposeOptions.find(opt => opt.value === p)?.label}
                    </div>
                  ))}
                  {purposeOther.trim() && (
                    <div className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-primary" />
                      其他：{purposeOther}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">如何得知本活動</span>
                <span className="text-foreground font-medium text-right max-w-[60%]">
                  {sourceOther.trim() 
                    ? `其他：${sourceOther}` 
                    : sourceOptions.find(opt => opt.value === source)?.label}
                </span>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                <p className="text-xs text-foreground/80">
                  請確認以上資料無誤，送出後將無法修改。
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
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

export default TuesdayMeetupForm;
