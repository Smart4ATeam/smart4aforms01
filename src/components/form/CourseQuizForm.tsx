import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassRadio from './GlassRadio';
import GlassButton from './GlassButton';
import GlassCard from '@/components/GlassCard';
import { courseQuizzes, CourseQuiz, QuizQuestion } from '@/data/quizQuestions';
import { getFormOptionsFromDB, getPersistedFormOptions, QuizCourseDateOption } from '@/data/forms';
import { ChevronLeft, ChevronRight, Check, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const emailSchema = z.string().trim().email({ message: '請輸入有效的電子郵件格式' }).max(255, { message: '電子郵件長度不可超過 255 字元' });

interface CourseQuizFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting: boolean;
}

type FormStep = 'info' | 'quiz' | 'confirm' | 'result';

interface QuizAnswers {
  [questionId: number]: 'A' | 'B' | 'C' | 'D';
}

// 預設課程日期對照表（作為 fallback）
const DEFAULT_COURSE_DATE_OPTIONS: Record<string, string[]> = {
  '設計流程（入門）': [
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
    '2026/12/17',
  ],
  '工作流程（基礎）': [
    '2026/1/17-1/18',
    '2026/3/14-3/15',
    '2026/5/9-5/10',
    '2026/7/11-7/12',
    '2026/9/12-9/13',
    '2026/11/14-11/15',
  ],
  '思維流程（中階）': [
    '2026/2/7-2/8',
    '2026/5/23-5/24',
    '2026/8/15-8/16',
    '2026/11/21-11/22',
  ],
  '互動流程（高階）': [
    '2026/3/21-3/22',
    '2026/6/12-6/14',
    '2026/9/19-9/20',
    '2026/12/12-12/13',
  ],
};

const CourseQuizForm: React.FC<CourseQuizFormProps> = ({ onSubmit, isSubmitting }) => {
  const [searchParams] = useSearchParams();
  
  // 動態課程日期選項
  const [courseDateOptions, setCourseDateOptions] = useState<Record<string, string[]>>(DEFAULT_COURSE_DATE_OPTIONS);
  
  // 從資料庫載入課程日期選項
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const dbOptions = await getFormOptionsFromDB('course-quiz');
        const localOptions = getPersistedFormOptions('course-quiz');
        const options = dbOptions || localOptions;
        
        if (options?.quizCourseDates) {
          const newDateOptions: Record<string, string[]> = {};
          (options.quizCourseDates as QuizCourseDateOption[]).forEach(item => {
            newDateOptions[item.courseName] = item.dates;
          });
          setCourseDateOptions(newDateOptions);
        }
      } catch (e) {
        console.error('Failed to load quiz course date options:', e);
      }
    };
    loadOptions();
  }, []);
  
  // Form state
  const [step, setStep] = useState<FormStep>('info');
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseDate, setCourseDate] = useState(searchParams.get('courseDate') || '');
  const [completionDate, setCompletionDate] = useState(() => {
    const param = searchParams.get('completionDate');
    if (param) return param;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  });
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  // Get selected course quiz data
  const selectedQuiz: CourseQuiz | undefined = useMemo(() => {
    return courseQuizzes.find((q) => q.name === selectedCourse);
  }, [selectedCourse]);

  const questions: QuizQuestion[] = selectedQuiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // 取得目前課程對應的日期選項
  const currentCourseDateOptions = useMemo(() => {
    if (!selectedCourse) return [];
    return courseDateOptions[selectedCourse] || [];
  }, [selectedCourse, courseDateOptions]);

  // 當課程改變時，清空已選的課程日期
  useEffect(() => {
    setCourseDate('');
  }, [selectedCourse]);

  // Calculate score
  const calculateScore = (): { score: number; total: number; correct: number } => {
    if (!selectedQuiz) return { score: 0, total: 0, correct: 0 };
    
    let correct = 0;
    selectedQuiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    return {
      score: correct * selectedQuiz.pointsPerQuestion,
      total: selectedQuiz.totalPoints,
      correct,
    };
  };

  // Validation
  const validateInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!studentName.trim()) {
      newErrors.studentName = '請輸入學員姓名';
    }
    if (!email.trim()) {
      newErrors.email = '請輸入電子郵件信箱';
    } else {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        newErrors.email = emailResult.error.errors[0]?.message || '請輸入有效的電子郵件格式';
      }
    }
    if (!confirmEmail.trim()) {
      newErrors.confirmEmail = '請再次輸入電子郵件信箱';
    } else if (confirmEmail !== email) {
      newErrors.confirmEmail = '兩次輸入的電子郵件不一致';
    }
    if (!selectedCourse) {
      newErrors.selectedCourse = '請選擇課程';
    }
    if (!courseDate.trim()) {
      newErrors.courseDate = '請輸入課程日期';
    }
    if (!completionDate.trim()) {
      newErrors.completionDate = '請輸入完訓日期';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuiz = (): boolean => {
    // Check if all questions are answered
    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setSubmitError(`還有 ${unanswered.length} 題尚未作答，請完成所有題目後再提交`);
      return false;
    }
    setSubmitError('');
    return true;
  };

  // Handlers
  const handleNextFromInfo = () => {
    if (validateInfo()) {
      setStep('quiz');
      setCurrentQuestionIndex(0);
    }
  };

  const handleAnswer = (questionId: number, answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleGoToConfirm = () => {
    if (validateQuiz()) {
      setStep('confirm');
    }
  };

  const handleBackToQuiz = () => {
    setStep('quiz');
  };

  const handleBackToInfo = () => {
    setStep('info');
  };

  const handleFinalSubmit = async () => {
    if (!selectedQuiz) return;
    
    const { score, total, correct } = calculateScore();
    const now = new Date();
    
    // Build flattened answer fields (q1_question, q1_answer, q1_correct, etc.)
    const answerFields: Record<string, string | boolean> = {};
    selectedQuiz.questions.forEach((q, index) => {
      const qNum = index + 1;
      const selectedAnswer = answers[q.id];
      const selectedOption = q.options.find((opt) => opt.key === selectedAnswer);
      
      answerFields[`q${qNum}_question`] = q.question;
      answerFields[`q${qNum}_answer`] = selectedOption?.text || '';
      answerFields[`q${qNum}_correct`] = selectedAnswer === q.correctAnswer;
    });

    const payload = {
      student_name: studentName,
      email: email,
      course_name: selectedCourse,
      course_date: courseDate,
      completion_date: completionDate,
      submitted_at: now.toISOString(),
      total_score: score,
      max_score: total,
      correct_count: correct,
      question_count: selectedQuiz.questions.length,
      ...answerFields,
    };

    await onSubmit(payload);
    setStep('result');
  };

  // Progress calculation
  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // Render info step
  const renderInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="form-section-title !text-center !after:left-1/2 !after:-translate-x-1/2 text-xl">訓後測驗</h2>
        <p className="text-xs text-muted-foreground">請先填寫基本資訊，再進行測驗</p>
      </div>

      {/* 課程選擇區塊 */}
      <div className="space-y-4">
        <GlassSelect
          label="選擇課程"
          name="selectedCourse"
          placeholder="請選擇您完成的課程"
          options={courseQuizzes.map((quiz) => ({
            value: quiz.name,
            label: quiz.name,
          }))}
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          required
          error={errors.selectedCourse}
        />

        {selectedQuiz && (
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm text-muted-foreground mb-2">{selectedQuiz.subtitle}</p>
            <p className="text-foreground/80 text-sm">{selectedQuiz.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassSelect
            label="課程日期"
            name="courseDate"
            placeholder={selectedCourse ? "請選擇課程日期" : "請先選擇課程"}
            options={currentCourseDateOptions.map((date) => ({
              value: date,
              label: date,
            }))}
            value={courseDate}
            onChange={(e) => setCourseDate(e.target.value)}
            required
            error={errors.courseDate}
            disabled={!selectedCourse}
          />

          <GlassInput
            label="完訓日期"
            name="completionDate"
            placeholder="例如：2025/01/24"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            required
            error={errors.completionDate}
          />
        </div>
      </div>

      {/* 學員資訊區塊 */}
      <div className="space-y-4">
        <GlassInput
          label="學員姓名"
          name="studentName"
          placeholder="請輸入您的姓名"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
          error={errors.studentName}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassInput
            label="電子郵件信箱"
            name="email"
            type="email"
            placeholder="請輸入您的電子郵件"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={errors.email}
          />

          <GlassInput
            label="確認電子郵件信箱"
            name="confirmEmail"
            type="email"
            placeholder="請再次輸入您的電子郵件"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
            error={errors.confirmEmail}
          />
        </div>
      </div>

      <div className="pt-4">
        <GlassButton
          type="button"
          onClick={handleNextFromInfo}
          className="w-full"
        >
          開始測驗
          <ChevronRight className="w-4 h-4 ml-2" />
        </GlassButton>
      </div>
    </div>
  );

  // Render quiz step
  const renderQuizStep = () => {
    if (!currentQuestion || !selectedQuiz) return null;

    return (
      <div className="space-y-6">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{selectedQuiz.name}</span>
            <span>
              {answeredCount} / {questions.length} 題已作答
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={cn(
                'w-10 h-10 rounded-lg text-sm font-medium transition-all',
                idx === currentQuestionIndex
                  ? 'bg-primary text-primary-foreground'
                  : answers[q.id]
                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Current question */}
        <div className="p-5 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-base font-medium text-foreground mb-5">
            <span className="text-primary mr-2">第 {currentQuestionIndex + 1} 題</span>
            {currentQuestion.question}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswer(currentQuestion.id, option.key)}
                className={cn(
                  'w-full p-4 rounded-lg text-left transition-all border',
                  answers[currentQuestion.id] === option.key
                    ? 'bg-primary/10 border-primary text-foreground'
                    : 'bg-background border-border text-foreground/80 hover:bg-muted/50 hover:border-border/80'
                )}
              >
                <span className="font-semibold mr-3">{option.key}.</span>
                {option.text}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          <GlassButton
            type="button"
            variant="outline"
            onClick={currentQuestionIndex === 0 ? handleBackToInfo : handlePrevQuestion}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {currentQuestionIndex === 0 ? '返回' : '上一題'}
          </GlassButton>

          {currentQuestionIndex === questions.length - 1 ? (
            <GlassButton
              type="button"
              onClick={handleGoToConfirm}
              className="flex-1"
            >
              確認送出
              <Check className="w-4 h-4 ml-2" />
            </GlassButton>
          ) : (
            <GlassButton
              type="button"
              onClick={handleNextQuestion}
              className="flex-1"
            >
              下一題
              <ChevronRight className="w-4 h-4 ml-2" />
            </GlassButton>
          )}
        </div>

        {submitError && (
          <div className="p-4 rounded-xl bg-destructive/20 border border-destructive/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-destructive text-sm">{submitError}</p>
          </div>
        )}
      </div>
    );
  };

  // Render confirm step
  const renderConfirmStep = () => {
    if (!selectedQuiz) return null;

    const { score, total } = calculateScore();

    return (
      <div className="space-y-6">
      <div className="text-center mb-6">
          <h2 className="form-section-title !text-center !after:left-1/2 !after:-translate-x-1/2 text-xl">確認您的答案</h2>
          <p className="text-xs text-muted-foreground">請確認以下資訊無誤後，再送出測驗</p>
        </div>

        {/* Basic info summary */}
        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <span className="confirmation-card-number">1</span>
            <span>基本資訊</span>
          </div>
          <div className="confirmation-card-content">
            <div className="confirmation-item">
              <span className="confirmation-label">學員姓名</span>
              <span className="confirmation-value">{studentName}</span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">電子郵件</span>
              <span className="confirmation-value">{email}</span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">課程名稱</span>
              <span className="confirmation-value">{selectedCourse}</span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">課程日期</span>
              <span className="confirmation-value">{courseDate}</span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">完訓日期</span>
              <span className="confirmation-value">{completionDate}</span>
            </div>
          </div>
        </div>

        {/* Answers summary */}
        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <span className="confirmation-card-number">2</span>
            <span>作答內容</span>
          </div>
          <div className="confirmation-card-content max-h-[400px] overflow-y-auto">
            {selectedQuiz.questions.map((q, idx) => {
              const selectedAnswer = answers[q.id];
              const selectedOption = q.options.find((opt) => opt.key === selectedAnswer);
              
              return (
                <div key={q.id} className="p-3 rounded-md bg-muted/30 border border-border/30 mb-2 last:mb-0">
                  <p className="text-xs text-foreground/80 mb-1">
                    <span className="text-primary font-medium">第 {idx + 1} 題：</span>
                    {q.question}
                  </p>
                  <p className="text-xs text-foreground">
                    <span className="text-muted-foreground">您的答案：</span>
                    <span className="ml-1 text-primary">
                      {selectedAnswer}. {selectedOption?.text}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <GlassButton
            type="button"
            variant="outline"
            onClick={handleBackToQuiz}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            返回修改
          </GlassButton>
          <GlassButton
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '送出中...' : '確認送出'}
            <Check className="w-4 h-4 ml-2" />
          </GlassButton>
        </div>
      </div>
    );
  };

  // Render result step
  const renderResultStep = () => {
    if (!selectedQuiz) return null;

    const { score, total, correct } = calculateScore();
    const accuracy = ((correct / selectedQuiz.questions.length) * 100).toFixed(1);
    const isPassed = score >= 80; // 80 points to pass

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="form-section-title !text-center !after:left-1/2 !after:-translate-x-1/2 text-xl">測驗結果</h2>
          <p className="text-sm text-muted-foreground">感謝您完成測驗，以下是您的成績</p>
        </div>

        {/* Score Card */}
        <div className={cn(
          "p-6 rounded-xl border-2 text-center",
          isPassed 
            ? "bg-green-500/10 border-green-500/30" 
            : "bg-amber-500/10 border-amber-500/30"
        )}>
          <div className="mb-4">
            <span className={cn(
              "text-5xl font-bold",
              isPassed ? "text-green-500" : "text-amber-500"
            )}>
              {score}
            </span>
            <span className="text-xl text-muted-foreground"> / {total} 分</span>
          </div>
          
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">答對題數</p>
              <p className="text-lg font-semibold text-foreground">{correct} / {selectedQuiz.questions.length} 題</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">正確率</p>
              <p className="text-lg font-semibold text-foreground">{accuracy}%</p>
            </div>
          </div>
          
          <div className={cn(
            "mt-4 inline-block px-4 py-1.5 rounded-full text-sm font-medium",
            isPassed 
              ? "bg-green-500/20 text-green-600 dark:text-green-400" 
              : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
          )}>
            {isPassed ? '🎉 測驗通過' : '💪 再接再厲'}
          </div>
          
          {isPassed && (
            <p className="mt-4 text-sm text-green-600 dark:text-green-400">
              ✉️ 您的訓後證明稍後將會寄到您的信箱
            </p>
          )}
        </div>

        {/* Answers Detail */}
        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <span className="confirmation-card-number">📝</span>
            <span>答題詳情</span>
          </div>
          <div className="confirmation-card-content max-h-[400px] overflow-y-auto">
            {selectedQuiz.questions.map((q, idx) => {
              const selectedAnswer = answers[q.id];
              const selectedOption = q.options.find((opt) => opt.key === selectedAnswer);
              const correctOption = q.options.find((opt) => opt.key === q.correctAnswer);
              const isCorrect = selectedAnswer === q.correctAnswer;

              return (
                <div 
                  key={q.id} 
                  className={cn(
                    "p-4 rounded-lg border mb-3 last:mb-0",
                    isCorrect 
                      ? "bg-green-500/5 border-green-500/20" 
                      : "bg-red-500/5 border-red-500/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      isCorrect 
                        ? "bg-green-500/20 text-green-600 dark:text-green-400" 
                        : "bg-red-500/20 text-red-600 dark:text-red-400"
                    )}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-2">
                        <span className="text-primary">第 {idx + 1} 題：</span>
                        {q.question}
                      </p>
                      
                      <div className="space-y-1.5 text-sm">
                        <p className="flex items-start gap-2">
                          <span className="text-muted-foreground flex-shrink-0">您的答案：</span>
                          <span className={cn(
                            "font-medium",
                            isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          )}>
                            {selectedAnswer}. {selectedOption?.text}
                          </span>
                        </p>
                        
                        {!isCorrect && (
                          <p className="flex items-start gap-2">
                            <span className="text-muted-foreground flex-shrink-0">正確答案：</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {q.correctAnswer}. {correctOption?.text}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <a href="/" className="inline-block">
            <GlassButton variant="outline">
              返回首頁
            </GlassButton>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {step === 'info' && renderInfoStep()}
      {step === 'quiz' && renderQuizStep()}
      {step === 'confirm' && renderConfirmStep()}
      {step === 'result' && renderResultStep()}
    </div>
  );
};

export default CourseQuizForm;
