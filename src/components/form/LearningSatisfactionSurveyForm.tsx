import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassTextarea from './GlassTextarea';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import { Send, ArrowRight, ArrowLeft, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getFormOptionsFromDB, getPersistedFormOptions, RetrainingCourseDateOption, FORM_OPTIONS_UPDATED_EVENT } from '@/data/forms';

interface LearningSatisfactionSurveyFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

// Helper function to check if a date has passed
const isDatePassed = (dateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
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
];

const SATISFACTION_OPTIONS = [
  { value: '1', label: '1 - 非常不滿意' },
  { value: '2', label: '2 - 不滿意' },
  { value: '3', label: '3 - 普通' },
  { value: '4', label: '4 - 滿意' },
  { value: '5', label: '5 - 非常滿意' },
];

const EXPECTATION_OPTIONS = [
  { value: '符合', label: '符合' },
  { value: '不符合', label: '不符合' },
];

const RECOMMEND_OPTIONS = [
  { value: '願意', label: '願意' },
  { value: '不願意', label: '不願意' },
];

// Rating component for satisfaction questions
const SatisfactionRating: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}> = ({ label, value, onChange, required, error }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground/80">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(String(num))}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all duration-200 ${
              value === String(num)
                ? 'border-primary/50 bg-primary/20 text-primary'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 text-foreground/70'
            }`}
          >
            <Star className={`w-4 h-4 ${value === String(num) ? 'fill-primary' : ''}`} />
            <span className="font-medium">{num}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">1 = 非常不滿意，5 = 非常滿意</p>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export const LearningSatisfactionSurveyForm: React.FC<LearningSatisfactionSurveyFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [searchParams] = useSearchParams();
  const [courseOptions, setCourseOptions] = useState<RetrainingCourseDateOption[]>(DEFAULT_COURSE_OPTIONS);
  const [currentStep, setCurrentStep] = useState<'form' | 'confirm'>('form');
  
  // Form fields
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  // Satisfaction ratings
  const [teachingQuality, setTeachingQuality] = useState('');
  const [timeArrangement, setTimeArrangement] = useState('');
  const [learningPace, setLearningPace] = useState('');
  const [contentHelpfulness, setContentHelpfulness] = useState('');
  const [taAssistance, setTaAssistance] = useState('');
  
  // Text feedback
  const [courseFeedback, setCourseFeedback] = useState('');
  const [futureContentWishes, setFutureContentWishes] = useState('');
  const [expectationMet, setExpectationMet] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState('');
  const [otherSuggestions, setOtherSuggestions] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load course options from DB
  useEffect(() => {
    const loadOptions = async () => {
      // Use same options as course-retraining form
      const dbOptions = await getFormOptionsFromDB('learning-satisfaction-survey');
      if (dbOptions?.retrainingCourseDates) {
        setCourseOptions(dbOptions.retrainingCourseDates as RetrainingCourseDateOption[]);
      } else {
        // Try course-retraining options as fallback
        const retrainingOptions = await getFormOptionsFromDB('course-retraining');
        if (retrainingOptions?.retrainingCourseDates) {
          // Remove " - 複訓" suffix for survey form
          const surveyOptions = (retrainingOptions.retrainingCourseDates as RetrainingCourseDateOption[]).map(opt => ({
            ...opt,
            courseName: opt.courseName.replace(' - 複訓', ''),
            webhookLabel: opt.webhookLabel.replace(' - 複訓', ''),
          }));
          setCourseOptions(surveyOptions);
        } else {
          const localOptions = getPersistedFormOptions('course-retraining');
          if (localOptions?.retrainingCourseDates) {
            const surveyOptions = (localOptions.retrainingCourseDates as RetrainingCourseDateOption[]).map(opt => ({
              ...opt,
              courseName: opt.courseName.replace(' - 複訓', ''),
              webhookLabel: opt.webhookLabel.replace(' - 複訓', ''),
            }));
            setCourseOptions(surveyOptions);
          }
        }
      }
    };
    loadOptions();

    const handleOptionsUpdate = (event: CustomEvent) => {
      if (event.detail?.formPath === 'learning-satisfaction-survey' && event.detail?.options?.retrainingCourseDates) {
        setCourseOptions(event.detail.options.retrainingCourseDates as RetrainingCourseDateOption[]);
      }
    };
    window.addEventListener(FORM_OPTIONS_UPDATED_EVENT, handleOptionsUpdate as EventListener);
    return () => window.removeEventListener(FORM_OPTIONS_UPDATED_EVENT, handleOptionsUpdate as EventListener);
  }, []);

  // URL parameter prefill
  useEffect(() => {
    const courseName = searchParams.get('courseName') || searchParams.get('course_name');
    const courseDate = searchParams.get('courseDate') || searchParams.get('course_date');
    const name = searchParams.get('fullName') || searchParams.get('full_name') || searchParams.get('name');
    const emailParam = searchParams.get('email');

    if (courseName) {
      const matchingCourse = courseOptions.find(c => 
        c.courseName === courseName || c.courseValue === courseName
      );
      if (matchingCourse) {
        setSelectedCourse(matchingCourse.courseValue);
      }
    }
    if (courseDate) setSelectedDate(courseDate);
    if (name) setFullName(name);
    if (emailParam) setEmail(emailParam);
  }, [searchParams, courseOptions]);

  // Get selected course data
  const selectedCourseData = courseOptions.find(c => c.courseValue === selectedCourse);
  
  // Get all dates (past and future) for the survey - no filtering needed
  const availableDates = selectedCourseData?.dates || [];

  // Reset selected date when course changes
  useEffect(() => {
    setSelectedDate('');
  }, [selectedCourse]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCourse) newErrors.course = '請選擇課程';
    if (!selectedDate) newErrors.date = '請選擇課程日期';
    if (!fullName.trim()) newErrors.fullName = '請輸入姓名';
    if (!email.trim()) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }
    
    // Satisfaction ratings
    if (!teachingQuality) newErrors.teachingQuality = '請評分教學品質滿意度';
    if (!timeArrangement) newErrors.timeArrangement = '請評分時間安排滿意度';
    if (!learningPace) newErrors.learningPace = '請評分上課節奏滿意度';
    if (!contentHelpfulness) newErrors.contentHelpfulness = '請評分課程內容幫助程度';
    if (!taAssistance) newErrors.taAssistance = '請評分助教協助滿意度';
    
    // Required selections
    if (!expectationMet) newErrors.expectationMet = '請選擇期望與實際效果';
    if (!wouldRecommend) newErrors.wouldRecommend = '請選擇是否願意推薦';

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

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep('confirm');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmSubmit = async () => {
    const selectedCourseOption = courseOptions.find(c => c.courseValue === selectedCourse);

    const webhookData: Record<string, any> = {
      課程名稱: selectedCourseOption?.webhookLabel || '',
      課程日期: selectedDate,
      姓名: fullName,
      email: email,
      教學品質滿意度: parseInt(teachingQuality),
      課程時間安排滿意度: parseInt(timeArrangement),
      上課節奏滿意度: parseInt(learningPace),
      課程內容幫助程度: parseInt(contentHelpfulness),
      助教協助滿意度: parseInt(taAssistance),
      課程心得: courseFeedback || '',
      未來學員俱樂部上課內容建議: futureContentWishes || '',
      期望與實際效果: expectationMet,
      願意推薦此課程: wouldRecommend,
      其他建議: otherSuggestions || '',
      lovable表單: true,
      submittedAt: new Date().toISOString(),
    };

    // Save to Supabase
    try {
      await (supabase.from as any)('learning_satisfaction_surveys').insert({
        course_name: selectedCourseOption?.webhookLabel || '',
        course_date: selectedDate,
        full_name: fullName,
        email: email,
        teaching_quality: parseInt(teachingQuality),
        time_arrangement: parseInt(timeArrangement),
        learning_pace: parseInt(learningPace),
        content_helpfulness: parseInt(contentHelpfulness),
        ta_assistance: parseInt(taAssistance),
        course_feedback: courseFeedback || null,
        future_content_wishes: futureContentWishes || null,
        expectation_met: expectationMet,
        would_recommend: wouldRecommend,
        other_suggestions: otherSuggestions || null,
      });
    } catch (error) {
      console.error('Error saving to database:', error);
    }

    onSubmit(webhookData);
  };

  // Confirmation step
  if (currentStep === 'confirm') {
    const selectedCourseOption = courseOptions.find(c => c.courseValue === selectedCourse);
    
    const getSatisfactionLabel = (value: string) => {
      const labels: Record<string, string> = {
        '1': '1 - 非常不滿意',
        '2': '2 - 不滿意',
        '3': '3 - 普通',
        '4': '4 - 滿意',
        '5': '5 - 非常滿意',
      };
      return labels[value] || value;
    };

    return (
      <div className="space-y-6">
        <GlassCard className="space-y-4">
          <h2 className="form-section-title">確認提交資料</h2>
          <p className="text-sm text-muted-foreground mb-4">請確認以下資料無誤後再送出</p>
          
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground">課程名稱</p>
                <p className="text-foreground font-medium">{selectedCourseOption?.webhookLabel}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">課程日期</p>
                <p className="text-foreground font-medium">{selectedDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">姓名</p>
                <p className="text-foreground font-medium">{fullName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">E-mail</p>
                <p className="text-foreground font-medium">{email}</p>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mt-4">
              <h3 className="font-medium text-foreground mb-3">滿意度評分</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground">教學品質滿意度</p>
                  <p className="text-foreground font-medium">{getSatisfactionLabel(teachingQuality)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">課程時間安排</p>
                  <p className="text-foreground font-medium">{getSatisfactionLabel(timeArrangement)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">上課節奏</p>
                  <p className="text-foreground font-medium">{getSatisfactionLabel(learningPace)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">課程內容幫助程度</p>
                  <p className="text-foreground font-medium">{getSatisfactionLabel(contentHelpfulness)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">助教協助滿意度</p>
                  <p className="text-foreground font-medium">{getSatisfactionLabel(taAssistance)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-4">
              <h3 className="font-medium text-foreground mb-3">回饋內容</h3>
              <div className="space-y-3">
                {courseFeedback && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground">課程心得</p>
                    <p className="text-foreground whitespace-pre-wrap">{courseFeedback}</p>
                  </div>
                )}
                {futureContentWishes && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground">未來學員俱樂部上課內容建議</p>
                    <p className="text-foreground">{futureContentWishes}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">期望與實際效果</p>
                    <p className="text-foreground font-medium">{expectationMet}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">願意推薦此課程</p>
                    <p className="text-foreground font-medium">{wouldRecommend}</p>
                  </div>
                </div>
                {otherSuggestions && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground">其他建議</p>
                    <p className="text-foreground whitespace-pre-wrap">{otherSuggestions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="flex gap-4">
          <GlassButton
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回修改
          </GlassButton>
          <GlassButton
            type="button"
            variant="gradient"
            onClick={handleConfirmSubmit}
            loading={isSubmitting}
            className="flex-1"
          >
            <Send className="w-4 h-4 mr-2" />
            確認送出
          </GlassButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
      {/* Introduction */}
      <GlassCard className="space-y-4">
        <p className="text-foreground/90 leading-relaxed">
          感謝您的參與，希望課程中您有得到很好的體驗，也先為自己的超前努力掌聲鼓勵鼓勵！
        </p>
        <p className="text-foreground/90 leading-relaxed">
          為了讓禹動科技能夠不斷精進，請您花幾分鐘填寫以下問卷，感謝您的支持，謝謝！
        </p>
      </GlassCard>

      {/* Basic Info */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">基本資料</h2>

        {/* Course Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground/80 mb-3">
            課程名稱 <span className="text-destructive">*</span>
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
                
                {/* Date dropdown */}
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

        <GlassInput
          label="姓名"
          name="fullName"
          placeholder="請輸入您的姓名"
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
            label="E-mail"
            name="email"
            type="email"
            placeholder="請輸入您的電子郵件"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError('email');
            }}
            required
            error={errors.email}
          />
          <p className="text-xs text-muted-foreground">
            如您已有報名課程，請填寫與課程報名時相同的E-mail
          </p>
        </div>
      </GlassCard>

      {/* Satisfaction Survey */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">滿意度調查</h2>

        <SatisfactionRating
          label="教學品質滿意度"
          value={teachingQuality}
          onChange={(v) => { setTeachingQuality(v); clearError('teachingQuality'); }}
          required
          error={errors.teachingQuality}
        />

        <SatisfactionRating
          label="課程的時間安排是否合適"
          value={timeArrangement}
          onChange={(v) => { setTimeArrangement(v); clearError('timeArrangement'); }}
          required
          error={errors.timeArrangement}
        />

        <SatisfactionRating
          label="上課節奏是否讓您能夠跟上"
          value={learningPace}
          onChange={(v) => { setLearningPace(v); clearError('learningPace'); }}
          required
          error={errors.learningPace}
        />

        <SatisfactionRating
          label="課程內容對於您理解自動化概念是否有幫助"
          value={contentHelpfulness}
          onChange={(v) => { setContentHelpfulness(v); clearError('contentHelpfulness'); }}
          required
          error={errors.contentHelpfulness}
        />

        <SatisfactionRating
          label="助教協助滿意度"
          value={taAssistance}
          onChange={(v) => { setTaAssistance(v); clearError('taAssistance'); }}
          required
          error={errors.taAssistance}
        />
      </GlassCard>

      {/* Feedback Section */}
      <GlassCard className="space-y-6">
        <h2 className="form-section-title">回饋與建議</h2>

        <GlassTextarea
          label="請分享您對本次課程的心得"
          name="courseFeedback"
          placeholder="請詳細分享您的課程心得..."
          value={courseFeedback}
          onChange={(e) => setCourseFeedback(e.target.value)}
          rows={4}
        />

        <GlassInput
          label="您希望未來學員俱樂部的上課內容？"
          name="futureContentWishes"
          placeholder="請輸入您的建議"
          value={futureContentWishes}
          onChange={(e) => setFutureContentWishes(e.target.value)}
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground/80">
            本次課程的期望與實際效果 <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-4">
            {EXPECTATION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  expectationMet === option.value
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="expectationMet"
                  value={option.value}
                  checked={expectationMet === option.value}
                  onChange={(e) => {
                    setExpectationMet(e.target.value);
                    clearError('expectationMet');
                  }}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.expectationMet && (
            <p className="text-sm text-destructive">{errors.expectationMet}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground/80">
            您願意推薦此課程給其他人嗎 <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-4">
            {RECOMMEND_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  wouldRecommend === option.value
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="wouldRecommend"
                  value={option.value}
                  checked={wouldRecommend === option.value}
                  onChange={(e) => {
                    setWouldRecommend(e.target.value);
                    clearError('wouldRecommend');
                  }}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.wouldRecommend && (
            <p className="text-sm text-destructive">{errors.wouldRecommend}</p>
          )}
        </div>

        <GlassTextarea
          label="其他建議"
          name="otherSuggestions"
          placeholder="如有其他建議，請在此填寫..."
          value={otherSuggestions}
          onChange={(e) => setOtherSuggestions(e.target.value)}
          rows={4}
        />
      </GlassCard>

      {/* Submit Button */}
      <GlassButton
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
      >
        <ArrowRight className="w-4 h-4 mr-2" />
        下一步：確認資料
      </GlassButton>
    </form>
  );
};

export default LearningSatisfactionSurveyForm;
