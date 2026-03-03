import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormPageTemplate, GlassInput, GlassSelect, GlassRadio, GlassButton } from './index';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, Clock, ChevronLeft, ChevronRight, Info, Check, AlertCircle } from 'lucide-react';
import { format, addDays, isWeekend } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// 場地照片匯入
import venue1 from '@/assets/venue/venue-1.jpg';
import venue2 from '@/assets/venue/venue-2.jpg';
import venue3 from '@/assets/venue/venue-3.jpg';
import venue4 from '@/assets/venue/venue-4.jpg';
import venue5 from '@/assets/venue/venue-5.jpg';
import venue6 from '@/assets/venue/venue-6.jpg';
import venue7 from '@/assets/venue/venue-7.jpg';
import venue8 from '@/assets/venue/venue-8.jpg';
import venueDescription from '@/assets/venue/venue-description.jpg';
import transportationInfo from '@/assets/venue/transportation-info.png';
import lineQrcode from '@/assets/venue/line-qrcode.png';

interface VenueRentalFormProps {
  onSubmit: (data: Record<string, any>) => Promise<void>;
  isSubmitting?: boolean;
}

// 時間選項 9:00 - 21:00 每半小時
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 9; hour <= 21; hour++) {
    options.push({ value: `${hour.toString().padStart(2, '0')}:00`, label: `${hour.toString().padStart(2, '0')}:00` });
    if (hour < 21) {
      options.push({ value: `${hour.toString().padStart(2, '0')}:30`, label: `${hour.toString().padStart(2, '0')}:30` });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

// 台灣國定假日 (2024-2026)
const taiwanHolidays = [
  // 2024
  '2024-01-01', '2024-02-08', '2024-02-09', '2024-02-10', '2024-02-11', '2024-02-12', '2024-02-13', '2024-02-14',
  '2024-02-28', '2024-04-04', '2024-04-05', '2024-05-01', '2024-06-10', '2024-09-17', '2024-10-10',
  // 2025
  '2025-01-01', '2025-01-27', '2025-01-28', '2025-01-29', '2025-01-30', '2025-01-31',
  '2025-02-28', '2025-04-03', '2025-04-04', '2025-05-01', '2025-05-30', '2025-05-31',
  '2025-10-10', '2025-10-11',
  // 2026
  '2026-01-01', '2026-01-02',                              // 元旦及彈性放假
  '2026-02-15', '2026-02-16', '2026-02-17', '2026-02-18',  // 農曆春節 (除夕~初三)
  '2026-02-19', '2026-02-20',                              // 春節假期延續
  '2026-02-27', '2026-02-28', '2026-03-01',                // 228連假
  '2026-04-03', '2026-04-04', '2026-04-05', '2026-04-06',  // 清明連假
  '2026-05-01', '2026-05-02', '2026-05-03',                // 勞動節連假
  '2026-06-19', '2026-06-20', '2026-06-21',                // 端午連假
  '2026-09-25', '2026-09-26', '2026-09-27', '2026-09-28',  // 教師節+中秋連假
  '2026-10-09', '2026-10-10', '2026-10-11',                // 國慶連假
  '2026-10-24', '2026-10-25', '2026-10-26',                // 光復節連假
  '2026-12-25', '2026-12-26', '2026-12-27',                // 行憲紀念日連假
];

const isHoliday = (date: Date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return taiwanHolidays.includes(dateStr) || isWeekend(date);
};

// 計算時間差（小時）
const calculateHours = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return Math.max(0, (endMinutes - startMinutes) / 60);
};

// 過濾結束時間選項
const getFilteredEndTimeOptions = (startTime: string) => {
  if (!startTime) return timeOptions;
  return timeOptions.filter(opt => opt.value > startTime);
};

// 場地圖片
const venueImages = [
  venue1,
  venue2,
  venue3,
  venue4,
  venue5,
  venue6,
  venue7,
  venue8,
];

const VenueRentalForm: React.FC<VenueRentalFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [searchParams] = useSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 表單狀態
  const [rentalDays, setRentalDays] = useState(searchParams.get('rentalDays') || '');
  const [rentalDate1, setRentalDate1] = useState<Date | undefined>();
  const [startTime1, setStartTime1] = useState('');
  const [endTime1, setEndTime1] = useState('');
  const [rentalDate2, setRentalDate2] = useState<Date | undefined>();
  const [startTime2, setStartTime2] = useState('');
  const [endTime2, setEndTime2] = useState('');
  const [eventTheme, setEventTheme] = useState(searchParams.get('eventTheme') || '');
  const [contactName, setContactName] = useState(searchParams.get('contactName') || '');
  const [contactPhone, setContactPhone] = useState(searchParams.get('contactPhone') || '');
  const [contactEmail, setContactEmail] = useState(searchParams.get('contactEmail') || '');
  const [invoiceType, setInvoiceType] = useState(searchParams.get('invoiceType') || '');
  const [invoiceTitle, setInvoiceTitle] = useState(searchParams.get('invoiceTitle') || '');
  const [invoiceTaxId, setInvoiceTaxId] = useState(searchParams.get('invoiceTaxId') || '');

  // 日曆 popover 狀態
  const [isCalendar1Open, setIsCalendar1Open] = useState(false);
  const [isCalendar2Open, setIsCalendar2Open] = useState(false);

  // 圖片輪播自動切換
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % venueImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 計算各項數值
  const calculations = useMemo(() => {
    const hours1 = calculateHours(startTime1, endTime1);
    const hours2 = rentalDays === '2天' ? calculateHours(startTime2, endTime2) : 0;
    
    // 單日超過8小時，優惠1小時
    const discount1 = hours1 > 8 ? 1 : 0;
    const discount2 = hours2 > 8 ? 1 : 0;
    const totalDiscount = discount1 + discount2;
    
    const totalHours = hours1 + hours2 - totalDiscount;
    
    // 計算費用
    let totalAmount = 0;
    if (rentalDate1 && hours1 > 0) {
      const rate1 = isHoliday(rentalDate1) ? 1500 : 1000;
      totalAmount += (hours1 - discount1) * rate1;
    }
    if (rentalDays === '2天' && rentalDate2 && hours2 > 0) {
      const rate2 = isHoliday(rentalDate2) ? 1500 : 1000;
      totalAmount += (hours2 - discount2) * rate2;
    }

    return {
      hours1,
      hours2,
      discount1,
      discount2,
      totalDiscount,
      totalHours,
      totalAmount,
      rate1: rentalDate1 ? (isHoliday(rentalDate1) ? 1500 : 1000) : 0,
      rate2: rentalDate2 ? (isHoliday(rentalDate2) ? 1500 : 1000) : 0,
    };
  }, [startTime1, endTime1, startTime2, endTime2, rentalDays, rentalDate1, rentalDate2]);

  const validateForm = () => {
    if (!rentalDays) {
      toast.error('請選擇租借天數');
      return false;
    }
    if (!rentalDate1) {
      toast.error('請選擇租借日期');
      return false;
    }
    if (!startTime1 || !endTime1) {
      toast.error('請選擇租借時間');
      return false;
    }
    if (calculations.hours1 > 0 && calculations.hours1 < 2) {
      toast.error('第一天租借時數至少需 2 小時');
      return false;
    }
    if (rentalDays === '2天') {
      if (!rentalDate2) {
        toast.error('請選擇第二天租借日期');
        return false;
      }
      if (!startTime2 || !endTime2) {
        toast.error('請選擇第二天租借時間');
        return false;
      }
      if (calculations.hours2 > 0 && calculations.hours2 < 2) {
        toast.error('第二天租借時數至少需 2 小時');
        return false;
      }
    }
    if (!eventTheme.trim()) {
      toast.error('請填寫活動/課程主題');
      return false;
    }
    if (!contactName.trim()) {
      toast.error('請填寫聯絡人姓名');
      return false;
    }
    if (!contactPhone.trim()) {
      toast.error('請填寫聯絡電話');
      return false;
    }
    if (!contactEmail.trim()) {
      toast.error('請填寫聯絡人 E-mail');
      return false;
    }
    if (!invoiceType) {
      toast.error('請選擇發票類型');
      return false;
    }
    if (invoiceType === '三聯發票') {
      if (!invoiceTitle.trim()) {
        toast.error('請填寫發票抬頭');
        return false;
      }
      if (!invoiceTaxId.trim()) {
        toast.error('請填寫發票統編');
        return false;
      }
    }
    return true;
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const handleSubmit = async () => {
    setShowConfirmDialog(false);

    const formData = {
      租借天數: rentalDays,
      租借日期1: rentalDate1 ? format(rentalDate1, 'yyyy-MM-dd') : '',
      租借起始時間1: startTime1,
      租借結束時間1: endTime1,
      租借日期2: rentalDays === '2天' && rentalDate2 ? format(rentalDate2, 'yyyy-MM-dd') : '',
      租借起始時間2: rentalDays === '2天' ? startTime2 : '',
      租借結束時間2: rentalDays === '2天' ? endTime2 : '',
      優惠時數: calculations.totalDiscount,
      租借時間總計: calculations.totalHours,
      活動課程主題: eventTheme,
      聯絡人姓名: contactName,
      聯絡電話: contactPhone,
      聯絡人Email: contactEmail,
      總金額: calculations.totalAmount,
      發票選擇: invoiceType,
      發票抬頭: invoiceType === '三聯發票' ? invoiceTitle : '',
      發票統編: invoiceType === '三聯發票' ? invoiceTaxId : '',
      lovable表單: true,
    };

    await onSubmit(formData);
  };

  const minDate = addDays(new Date(), 1);

  // 費用說明文字
  const getPriceBreakdown = () => {
    const lines = [];
    if (rentalDate1 && calculations.hours1 > 0) {
      const dayType1 = isHoliday(rentalDate1) ? '假日' : '平日';
      const actualHours1 = calculations.hours1 - calculations.discount1;
      lines.push(`${format(rentalDate1, 'MM/dd')} (${dayType1}): ${actualHours1}小時 × $${calculations.rate1} = $${actualHours1 * calculations.rate1}`);
      if (calculations.discount1 > 0) {
        lines.push(`  └ 單日超過8小時，優惠1小時`);
      }
    }
    if (rentalDays === '2天' && rentalDate2 && calculations.hours2 > 0) {
      const dayType2 = isHoliday(rentalDate2) ? '假日' : '平日';
      const actualHours2 = calculations.hours2 - calculations.discount2;
      lines.push(`${format(rentalDate2, 'MM/dd')} (${dayType2}): ${actualHours2}小時 × $${calculations.rate2} = $${actualHours2 * calculations.rate2}`);
      if (calculations.discount2 > 0) {
        lines.push(`  └ 單日超過8小時，優惠1小時`);
      }
    }
    return lines;
  };

  return (
    <>
      <form onSubmit={handlePreSubmit} className="space-y-8">
        {/* 1. 圖片輪播區 */}
        <section className="space-y-4">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
            <img
              src={venueImages[currentImageIndex]}
              alt={`場地照片 ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + venueImages.length) % venueImages.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % venueImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {venueImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {venueImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  "flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                  idx === currentImageIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt={`縮圖 ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* 2. 場地說明圖檔 */}
        <section className="rounded-xl overflow-hidden">
          <img 
            src={venueDescription} 
            alt="SMART4A 台北交流中心場地說明" 
            className="w-full h-auto rounded-xl"
          />
        </section>

        {/* 3. Google Map 嵌入 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            交流中心位置
          </h3>
          <div className="rounded-xl overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d903.6771612869701!2d121.52209936962128!3d25.044380299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a970b379e015%3A0x3d0c1d4e5f6a7b8c!2zMTAw5Y-w5YyX5biC5Lit5q2j5Y2A5b-g5a2d5p2x6Lev5LiA5q61NzbomZ8!5e0!3m2!1szh-TW!2stw!4v1703123456789!5m2!1szh-TW!2stw"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SMART4A 台北交流中心位置"
            />
          </div>
          <p className="text-muted-foreground text-sm">
            📍 台北市中正區忠孝東路一段76號
          </p>
        </section>

        {/* 4. 交通資訊 */}
        <section className="rounded-xl overflow-hidden">
          <img 
            src={transportationInfo} 
            alt="交通資訊 - 捷運、公車、停車場資訊" 
            className="w-full h-auto rounded-xl"
          />
        </section>

        {/* 5. 場地使用規範 */}
        <section className="p-6 rounded-xl bg-muted/50 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            場地使用規範
          </h3>
          <ol className="text-foreground/80 text-sm space-y-2 list-decimal list-inside">
            <li>場地租借時段包括進場布置與活動清場時間，請依約定時間準時進出場地。</li>
            <li>場地內禁止擅自移動或拆卸設施(包含桌子)，如需調整，請提前聯繫工作人員。</li>
            <li>使用者須保持場地整潔，活動結束後需歸還場地至原狀。</li>
            <li>若場地設施因使用不當而損壞，需照價賠償。</li>
            <li>場地內禁止吸菸、使用明火、或進行任何可能造成危險的行為。</li>
            <li>場地禁止攜帶寵物進入。</li>
            <li>嚴禁吸菸、毒品等違反法令行為，使用場地過程中，若有任何違法行為，使用者須自行承擔法律責任。</li>
          </ol>
        </section>

        {/* 6. 可租借日期 - Google 行事曆嵌入區 */}
        <section className="p-6 rounded-xl bg-muted/50 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            可租借日期
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            請參考以下行事曆查看可租借時段（灰色時段為已預約）
          </p>
          <div className="rounded-lg overflow-hidden border border-border">
            <iframe 
              src="https://calendar.google.com/calendar/embed?src=c_3f4a7f1eae094bebd6ce984968972afa2fc6ba99c93dfd0a6ce1b97e85ceebcc%40group.calendar.google.com&ctz=Asia%2FTaipei" 
              style={{ border: 0 }} 
              width="100%" 
              height="450" 
              frameBorder="0" 
              scrolling="no"
              title="可租借日期行事曆"
            />
          </div>
        </section>

        {/* 表單欄位區 */}
        <section className="space-y-6 p-6 rounded-xl bg-muted/50 border border-border">
          <h3 className="text-lg font-semibold text-foreground">租借資訊</h3>

          {/* 7. 租借天數 */}
          <div className="space-y-2">
            <GlassSelect
              label="租借天數"
              required
              value={rentalDays}
              onChange={(e) => {
                setRentalDays(e.target.value);
                if (e.target.value === '1天') {
                  setRentalDate2(undefined);
                  setStartTime2('');
                  setEndTime2('');
                }
              }}
              options={[
                { value: '', label: '請選擇' },
                { value: '1天', label: '1天' },
                { value: '2天', label: '2天' },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              ※ 租借三天以上請直接 email 至：<a href="mailto:joyce@fans.tw" className="text-primary hover:underline">joyce@fans.tw</a>
            </p>
          </div>

          {/* 8-10. 第一天租借資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground/70">
                租借日期 <span className="text-destructive ml-0.5">*</span>
              </label>
              <Popover open={isCalendar1Open} onOpenChange={setIsCalendar1Open}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
                      !rentalDate1 && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rentalDate1 ? format(rentalDate1, 'yyyy/MM/dd', { locale: zhTW }) : '選擇日期'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={rentalDate1}
                    onSelect={(date) => {
                      setRentalDate1(date);
                      setIsCalendar1Open(false);
                    }}
                    disabled={(date) => date < minDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <GlassSelect
              label="起始時間"
              required
              value={startTime1}
              onChange={(e) => {
                setStartTime1(e.target.value);
                if (endTime1 && e.target.value >= endTime1) {
                  setEndTime1('');
                }
              }}
              options={[{ value: '', label: '選擇時間' }, ...timeOptions]}
            />
            <GlassSelect
              label="結束時間"
              required
              value={endTime1}
              onChange={(e) => setEndTime1(e.target.value)}
              options={[{ value: '', label: '選擇時間' }, ...getFilteredEndTimeOptions(startTime1)]}
            />
          </div>

          {/* 11-13. 第二天租借資訊（條件顯示） */}
          {rentalDays === '2天' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4 border-t border-border">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground/70">
                  租借日期 2 <span className="text-destructive ml-0.5">*</span>
                </label>
                <Popover open={isCalendar2Open} onOpenChange={setIsCalendar2Open}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !rentalDate2 && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {rentalDate2 ? format(rentalDate2, 'yyyy/MM/dd', { locale: zhTW }) : '選擇日期'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={rentalDate2}
                      onSelect={(date) => {
                        setRentalDate2(date);
                        setIsCalendar2Open(false);
                      }}
                      disabled={(date) => date < minDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <GlassSelect
                label="起始時間 2"
                required
                value={startTime2}
                onChange={(e) => {
                  setStartTime2(e.target.value);
                  if (endTime2 && e.target.value >= endTime2) {
                    setEndTime2('');
                  }
                }}
                options={[{ value: '', label: '選擇時間' }, ...timeOptions]}
              />
              <GlassSelect
                label="結束時間 2"
                required
                value={endTime2}
                onChange={(e) => setEndTime2(e.target.value)}
                options={[{ value: '', label: '選擇時間' }, ...getFilteredEndTimeOptions(startTime2)]}
              />
            </div>
          )}

          {/* 14-15. 優惠時數與總計 */}
          {(calculations.hours1 > 0 || calculations.hours2 > 0) && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">優惠時數</span>
                <span className="text-foreground font-medium">{calculations.totalDiscount} 小時</span>
              </div>
              {calculations.totalDiscount > 0 && (
                <p className="text-xs text-primary">
                  ※ 單日租借時間超過8小時，優惠1小時用餐時間不計費
                </p>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-foreground/70">租借時間總計</span>
                <span className="text-foreground font-bold text-lg">{calculations.totalHours} 小時</span>
              </div>
            </div>
          )}
        </section>

        {/* 聯絡資訊區 */}
        <section className="space-y-6 p-6 rounded-xl bg-muted/50 border border-border">
          <h3 className="text-lg font-semibold text-foreground">活動與聯絡資訊</h3>

          {/* 16. 活動主題 */}
          <GlassInput
            label="本次租借所舉辦的活動/課程主題"
            required
            value={eventTheme}
            onChange={(e) => setEventTheme(e.target.value)}
            placeholder="請輸入活動或課程名稱"
          />

          {/* 17-19. 聯絡資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput
              label="聯絡人姓名"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="請輸入姓名"
            />
            <GlassInput
              label="聯絡電話"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="請輸入電話"
            />
          </div>
          <GlassInput
            label="聯絡人 E-mail"
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="請輸入 E-mail"
          />
        </section>

        {/* 20. 費用計算區 */}
        {/* 最少 2 小時提醒 */}
        {((calculations.hours1 > 0 && calculations.hours1 < 2) || (rentalDays === '2天' && calculations.hours2 > 0 && calculations.hours2 < 2)) && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm font-medium text-destructive">
              租借時數至少需 2 小時，請調整您的租借時間。
            </p>
          </div>
        )}

        {calculations.totalAmount > 0 && (
          <section className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              費用計算
            </h3>
            <div className="space-y-2 text-sm text-foreground/80">
              <p className="text-xs text-muted-foreground mb-3">
                平日（週一至週五）：$1,000/小時 ｜ 假日（週六、週日及國定假日）：$1,500/小時
              </p>
              {getPriceBreakdown().map((line, idx) => (
                <p key={idx} className={line.includes('└') ? 'pl-4 text-primary text-xs' : ''}>
                  {line}
                </p>
              ))}
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
                <span className="text-foreground font-medium">總金額</span>
                <span className="text-2xl font-bold text-primary">
                  NT$ {calculations.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* 21-23. 發票資訊 */}
        <section className="space-y-6 p-6 rounded-xl bg-muted/50 border border-border">
          <h3 className="text-lg font-semibold text-foreground">發票資訊</h3>

          <GlassRadio
            label="發票選擇"
            name="invoiceType"
            required
            value={invoiceType}
            onChange={(value) => {
              setInvoiceType(value);
              if (value === '二聯發票') {
                setInvoiceTitle('');
                setInvoiceTaxId('');
              }
            }}
            options={[
              { value: '二聯發票', label: '二聯發票' },
              { value: '三聯發票', label: '三聯發票' },
            ]}
          />

          {invoiceType === '三聯發票' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <GlassInput
                label="發票抬頭"
                required
                value={invoiceTitle}
                onChange={(e) => setInvoiceTitle(e.target.value)}
                placeholder="請輸入公司名稱"
              />
              <GlassInput
                label="發票統編"
                required
                value={invoiceTaxId}
                onChange={(e) => setInvoiceTaxId(e.target.value)}
                placeholder="請輸入統一編號"
              />
            </div>
          )}
        </section>

        {/* LINE 官方帳號資訊 */}
        <section className="p-6 rounded-xl bg-muted/50 border border-border text-center space-y-4">
          <p className="text-foreground/90 text-sm">
            感謝您的填寫，我們稍後將寄送報價單至您的信箱，再請查收，謝謝。
          </p>
          <p className="text-foreground/90 text-sm">
            在您填寫完表單後，請加入Smart4A台北交流中心 LINE 官方帳號，以利我們後續服務您，謝謝。
          </p>
          <div className="space-y-2">
            <p className="text-foreground text-sm">
              官方帳號ID：<span className="font-semibold text-primary">@318nuarv</span>
            </p>
            <p className="text-foreground text-sm">
              官方帳號網址：
              <a 
                href="https://lin.ee/zUqpVfB" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                https://lin.ee/zUqpVfB
              </a>
            </p>
          </div>
          <p className="text-foreground/90 text-sm">或掃描以下QRcode加入官方帳號。</p>
          <div className="flex justify-center">
            <img 
              src={lineQrcode} 
              alt="LINE 官方帳號 QRcode" 
              className="w-40 h-40 object-contain"
            />
          </div>
        </section>

        {/* 提交按鈕 */}
        <div className="flex justify-center pt-4">
          <GlassButton
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto min-w-[200px]"
          >
            {isSubmitting ? '提交中...' : '確認送出申請'}
          </GlassButton>
        </div>
      </form>

      {/* 確認對話框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertCircle className="w-5 h-5 text-primary" />
              確認申請資料
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">租借天數</span>
                <span className="col-span-2 text-foreground">{rentalDays}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">租借日期 1</span>
                <span className="col-span-2 text-foreground">
                  {rentalDate1 ? format(rentalDate1, 'yyyy/MM/dd') : '-'} {startTime1} - {endTime1}
                </span>
              </div>
              {rentalDays === '2天' && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">租借日期 2</span>
                  <span className="col-span-2 text-foreground">
                    {rentalDate2 ? format(rentalDate2, 'yyyy/MM/dd') : '-'} {startTime2} - {endTime2}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">優惠時數</span>
                <span className="col-span-2 text-foreground">{calculations.totalDiscount} 小時</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">租借總時數</span>
                <span className="col-span-2 text-foreground">{calculations.totalHours} 小時</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">活動主題</span>
                <span className="col-span-2 text-foreground">{eventTheme}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">聯絡人</span>
                <span className="col-span-2 text-foreground">{contactName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">聯絡電話</span>
                <span className="col-span-2 text-foreground">{contactPhone}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">E-mail</span>
                <span className="col-span-2 text-foreground">{contactEmail}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                <span className="text-muted-foreground">總金額</span>
                <span className="col-span-2 text-primary font-bold text-lg">
                  NT$ {calculations.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">發票類型</span>
                <span className="col-span-2 text-foreground">{invoiceType}</span>
              </div>
              {invoiceType === '三聯發票' && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">發票抬頭</span>
                    <span className="col-span-2 text-foreground">{invoiceTitle}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">發票統編</span>
                    <span className="col-span-2 text-foreground">{invoiceTaxId}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1"
            >
              返回修改
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Check className="w-4 h-4 mr-2" />
              確認送出
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VenueRentalForm;
