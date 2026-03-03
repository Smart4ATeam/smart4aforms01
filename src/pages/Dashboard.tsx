import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import ParticleBackground from '@/components/ParticleBackground';
import GlassCard from '@/components/GlassCard';
import { GlassInput, GlassButton, FormClassificationBadge } from '@/components/form';
import { forms, FormConfig, FormOption, persistFormOptions, getPersistedFormOptions, saveFormOptionsToDB, getFormOptionsFromDB, QuizCourseDateOption, RetrainingCourseDateOption, PrimaryCategory } from '@/data/forms';
import {
  Search,
  ExternalLink,
  Link2,
  PenTool,
  Layers,
  LogOut,
  Copy,
  Check,
  Settings2,
  Code,
  Database,
  ChevronDown,
  ArrowUp,
  Eye,
  Filter,
  User,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import makefanLogo from '@/assets/makefan-logo.png';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

type DialogType = 'prefill' | 'options' | 'webhook' | 'submissions';

interface SubmissionData {
  id: string;
  course_date: string;
  full_name: string;
  phone: string;
  email: string;
  is_student: boolean;
  student_id: string | null;
  points_status: string | null;
  amount: number;
  payment_method: string | null;
  invoice_type: string | null;
  invoice_title: string | null;
  tax_id: string | null;
  created_at: string | null;
}

interface CourseRetrainingSubmission {
  id: string;
  course_name: string;
  course_date: string;
  attendance_days: string;
  full_name: string;
  phone: string;
  email: string;
  amount: number;
  payment_method: string | null;
  invoice_type: string | null;
  invoice_title: string | null;
  tax_id: string | null;
  created_at: string | null;
}

interface TuesdayMeetupSubmission {
  id: string;
  event_date: string;
  full_name: string;
  phone: string;
  email: string;
  purposes: string | null;
  source: string | null;
  order_number: string | null;
  created_at: string | null;
}

interface VenueRentalSubmission {
  id: string;
  rental_days: string;
  rental_date1: string;
  start_time1: string;
  end_time1: string;
  rental_date2: string | null;
  start_time2: string | null;
  end_time2: string | null;
  discount_hours: number;
  total_hours: number;
  event_theme: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  total_amount: number;
  invoice_type: string | null;
  invoice_title: string | null;
  invoice_tax_id: string | null;
  created_at: string | null;
}

interface AutomationMarketplaceSubmission {
  id: string;
  name_or_company: string;
  email: string;
  phone: string | null;
  postal_code: string | null;
  address: string | null;
  make_organization_id: string | null;
  automation_module: string;
  plan: string;
  purchase_months: string | null;
  unit_price: number | null;
  total_cost: number;
  currency: string;
  activation_date: string | null;
  payment_method: string | null;
  invoice_type: string | null;
  invoice_title: string | null;
  tax_id: string | null;
  lovable_email: string | null;
  original_order_number: string | null;
  created_at: string | null;
}

interface AutomationMarketplaceENSubmission {
  id: string;
  name_or_company: string;
  email: string;
  phone: string | null;
  country: string | null;
  make_organization_id: string | null;
  automation_module: string;
  plan: string;
  purchase_months: string | null;
  unit_price: number | null;
  total_cost: number;
  currency: string;
  activation_date: string | null;
  payment_method: string | null;
  lovable_email: string | null;
  original_order_number: string | null;
  created_at: string | null;
}

interface TemplateStoreSubmission {
  id: string;
  name_or_company: string;
  email: string;
  phone: string | null;
  postal_code: string | null;
  address: string | null;
  template: string;
  template_id: string | null;
  price: number;
  currency: string;
  payment_method: string | null;
  invoice_type: string | null;
  invoice_title: string | null;
  tax_id: string | null;
  created_at: string | null;
}

interface TemplateStoreENSubmission {
  id: string;
  name_or_company: string;
  email: string;
  phone: string | null;
  country: string | null;
  template: string;
  template_id: string | null;
  price: number;
  currency: string;
  payment_method: string | null;
  created_at: string | null;
}

interface StudentProductClaimSubmission {
  id: string;
  name_or_company: string;
  student_id: string | null;
  email: string;
  make_organization_id: string;
  packages: string | null;
  template: string | null;
  claim_items: any;
  created_at: string | null;
}

interface InstructorPaymentSubmission {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  email: string;
  role: string;
  activity_category: string;
  activity_days: string;
  activity_date1: string;
  start_time1: string;
  end_time1: string;
  activity_date2: string | null;
  start_time2: string | null;
  end_time2: string | null;
  break_hours: number;
  total_hours: number;
  created_at: string | null;
}

interface LearningVideoConfidentialitySubmission {
  id: string;
  full_name: string;
  national_id: string;
  email: string;
  phone: string | null;
  signing_date: string;
  created_at: string | null;
}

interface ConsultingServiceSubmission {
  id: string;
  customer_name_company: string;
  email: string;
  mobile: string;
  service_category: string;
  training_level: string | null;
  coaching_mode: string | null;
  consulting_plan: string | null;
  pricing_tier: string | null;
  units: number;
  sessions: number;
  months: number;
  rag_addon: boolean;
  specified_person: string | null;
  preferred_time_slots: string | null;
  payment_method: string | null;
  invoice_type: string | null;
  total_price: number;
  created_at: string | null;
}

interface CourseQuizSubmission {
  id: string;
  student_name: string;
  email: string;
  course_name: string;
  course_date: string;
  completion_date: string;
  submitted_at: string;
  total_score: number;
  max_score: number;
  correct_count: number;
  question_count: number;
  answers: any;
  created_at: string | null;
}

interface RevenueSharingRecipientSubmission {
  id: string;
  recipient_type: string;
  company_name: string | null;
  company_tax_id: string | null;
  company_contact_name: string | null;
  company_address: string | null;
  recipient_name: string | null;
  recipient_id_number: string | null;
  recipient_address: string | null;
  email: string;
  phone: string;
  bank_name: string;
  bank_code: string;
  branch_name: string;
  branch_code: string;
  account_number: string;
  created_at: string | null;
}

interface PaymentNotificationSubmission {
  id: string;
  order_number: string | null;
  name_or_company: string;
  email: string;
  phone: string | null;
  product_service: string;
  payment_amount: number;
  payment_date: string;
  bank_last_5_digits: string;
  payment_proof_filename: string | null;
  notes: string | null;
  created_at: string | null;
}

interface AIDigitalTransformCourseSubmission {
  id: string;
  course_name: string;
  session: string;
  participation_type: string;
  goals: string | null;
  ai_level: string;
  full_name: string;
  phone: string;
  email: string;
  line_id: string | null;
  company_name: string | null;
  job_title: string | null;
  referrer: string | null;
  attendee_count: number;
  total_amount: number;
  payment_method: string;
  invoice_type: string;
  invoice_title: string | null;
  tax_id: string | null;
  subsidy_tax_id: string | null;
  notes: string | null;
  created_at: string | null;
}

interface Smart4AMemberSubmission {
  id: string;
  submission_id: string | null;
  full_name: string;
  phone: string;
  email: string;
  postal_code: string | null;
  address: string | null;
  line_id: string | null;
  referral_code: string | null;
  make_organization_id: string | null;
  created_at: string | null;
}

interface QuotationSubmission {
  id: string;
  issuer_name: string;
  issuer_email: string;
  quotation_date: string;
  inquiry_number: string | null;
  company_name: string;
  contact_person: string;
  invoice_title: string | null;
  tax_id: string | null;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string | null;
  transformation_packages: string | null;
  consulting_plan: string | null;
  consulting_months: number | null;
  consulting_designated_name: string | null;
  // 扁平化的訓練欄位
  training_category: string | null;
  training_category_label: string | null;
  training_option: string | null;
  training_option_label: string | null;
  training_sessions: number | null;
  training_hours_per_session: number | null;
  training_designated_name: string | null;
  subtotal: number;
  discount_amount: number | null;
  discount_reason: string | null;
  total_amount: number;
  created_at: string | null;
}

interface ProductManagementSubmission {
  id: string;
  app_id: string;
  app_name: string;
  category: string;
  monthly_price_twd: number;
  monthly_price_usd: number;
  creator: string;
  publish_date: string;
  requires_official_api: boolean;
  requires_api_token_oauth: boolean;
  install_link: string;
  doc_link: string | null;
  has_scenario_attachment: boolean;
  app_image_filename: string | null;
  scenario_attachment_filename: string | null;
  created_at: string | null;
}

interface ServiceInquirySubmission {
  id: string;
  company_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  tax_id: string | null;
  invoice_title: string | null;
  company_address: string | null;
  transformation_package: string | null;
  custom_description: string | null;
  consulting_plan: string | null;
  consulting_type: string | null;
  consulting_months: number | null;
  consulting_rag: string | null;
  consulting_designated_name: string | null;
  training_category: string | null;
  training_option: string | null;
  training_sessions: number | null;
  training_designated_name: string | null;
  notes: string | null;
  estimated_amount: number;
  created_at: string | null;
}


interface ReferralLinkSubmission {
  id: string;
  filler: string;
  applicant_name: string;
  identity_type: string;
  is_dealer_self_use: string;
  selected_packages: string;
  send_directly: string;
  applicant_email: string | null;
  send_copy_to_filler: string;
  created_at: string | null;
}


interface ProjectContractSubmission {
  id: string;
  contract_company: string;
  party_a_company: string;
  party_a_tax_id: string;
  party_a_contact: string;
  party_a_address: string;
  party_a_phone: string;
  party_a_fax: string | null;
  party_a_signer: string | null;
  contract_type: string;
  project_name: string;
  project_amount: string;
  amount_includes_tax: string;
  estimated_work_days: string;
  project_content: string;
  free_packages: any;
  smart4a_packages: any;
  paid_packages: any;
  created_at: string | null;
}

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PrimaryCategory | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<FormConfig | null>(null);
  const [dialogType, setDialogType] = useState<DialogType>('prefill');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [editableCourseDates, setEditableCourseDates] = useState('');
  const [editableEventDates, setEditableEventDates] = useState('');
  const [editableQuizCourseDates, setEditableQuizCourseDates] = useState<Record<string, string>>({});
  const [editableRetrainingCourseDates, setEditableRetrainingCourseDates] = useState<Record<string, string>>({});
   const [editablePackages, setEditablePackages] = useState('');
  const [editableTemplates, setEditableTemplates] = useState('');
  const [editableCategories, setEditableCategories] = useState('');
  const [editableCreators, setEditableCreators] = useState('');
  const [editablePriceTiers, setEditablePriceTiers] = useState('');
  const [editableFillers, setEditableFillers] = useState('');
  const [editableIdentityTypes, setEditableIdentityTypes] = useState('');
  const [editableReferralPackages, setEditableReferralPackages] = useState('');
  const [formsState, setFormsState] = useState<FormConfig[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [courseRetrainingSubmissions, setCourseRetrainingSubmissions] = useState<CourseRetrainingSubmission[]>([]);
  const [tuesdayMeetupSubmissions, setTuesdayMeetupSubmissions] = useState<TuesdayMeetupSubmission[]>([]);
  const [venueRentalSubmissions, setVenueRentalSubmissions] = useState<VenueRentalSubmission[]>([]);
  const [automationMarketplaceSubmissions, setAutomationMarketplaceSubmissions] = useState<AutomationMarketplaceSubmission[]>([]);
  const [automationMarketplaceENSubmissions, setAutomationMarketplaceENSubmissions] = useState<AutomationMarketplaceENSubmission[]>([]);
  const [templateStoreSubmissions, setTemplateStoreSubmissions] = useState<TemplateStoreSubmission[]>([]);
  const [templateStoreENSubmissions, setTemplateStoreENSubmissions] = useState<TemplateStoreENSubmission[]>([]);
  const [studentProductClaimSubmissions, setStudentProductClaimSubmissions] = useState<StudentProductClaimSubmission[]>([]);
  const [instructorPaymentSubmissions, setInstructorPaymentSubmissions] = useState<InstructorPaymentSubmission[]>([]);
  const [learningVideoConfidentialitySubmissions, setLearningVideoConfidentialitySubmissions] = useState<LearningVideoConfidentialitySubmission[]>([]);
  const [consultingServiceSubmissions, setConsultingServiceSubmissions] = useState<ConsultingServiceSubmission[]>([]);
  const [courseQuizSubmissions, setCourseQuizSubmissions] = useState<CourseQuizSubmission[]>([]);
  const [revenueSharingRecipientSubmissions, setRevenueSharingRecipientSubmissions] = useState<RevenueSharingRecipientSubmission[]>([]);
  const [paymentNotificationSubmissions, setPaymentNotificationSubmissions] = useState<PaymentNotificationSubmission[]>([]);
  const [aiDigitalTransformCourseSubmissions, setAIDigitalTransformCourseSubmissions] = useState<AIDigitalTransformCourseSubmission[]>([]);
  const [smart4aMemberSubmissions, setSmart4aMemberSubmissions] = useState<Smart4AMemberSubmission[]>([]);
  const [quotationSubmissions, setQuotationSubmissions] = useState<QuotationSubmission[]>([]);
  const [serviceInquirySubmissions, setServiceInquirySubmissions] = useState<ServiceInquirySubmission[]>([]);
  const [productManagementSubmissions, setProductManagementSubmissions] = useState<ProductManagementSubmission[]>([]);
  const [referralLinkSubmissions, setReferralLinkSubmissions] = useState<ReferralLinkSubmission[]>([]);
  const [projectContractSubmissions, setProjectContractSubmissions] = useState<ProjectContractSubmission[]>([]);
  const [editableFreePackages, setEditableFreePackages] = useState('');
  const [editableSmart4aPackages, setEditableSmart4aPackages] = useState('');
  const [editablePaidPackages, setEditablePaidPackages] = useState('');
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const navigate = useNavigate();

  // Initialize forms state with options from Supabase
  useEffect(() => {
    const loadFormOptions = async () => {
      // Try to load from Supabase first
      const dbOptionsStudentClub = await getFormOptionsFromDB('student-club');
      const dbOptionsTuesdayMeetup = await getFormOptionsFromDB('tuesday-meetup');
      const dbOptionsCourseQuiz = await getFormOptionsFromDB('course-quiz');
      const dbOptionsCourseRetraining = await getFormOptionsFromDB('course-retraining');
      const dbOptionsStudentProductClaim = await getFormOptionsFromDB('student-product-claim');
      const dbOptionsProductManagement = await getFormOptionsFromDB('product-management');
      const dbOptionsReferralLink = await getFormOptionsFromDB('referral-link-application');
      
      const initializedForms = forms.map(form => {
        if (form.path === 'student-club') {
          // Use Supabase data if available, otherwise fall back to localStorage
          const options = dbOptionsStudentClub || getPersistedFormOptions('student-club');
          if (options?.courseDates) {
            return {
              ...form,
              options: {
                ...form.options,
                courseDates: options.courseDates
              }
            };
          }
        }
        if (form.path === 'tuesday-meetup') {
          // Use Supabase data if available, otherwise fall back to localStorage
          const options = dbOptionsTuesdayMeetup || getPersistedFormOptions('tuesday-meetup');
          if (options?.eventDates) {
            return {
              ...form,
              options: {
                ...form.options,
                eventDates: options.eventDates
              }
            };
          }
        }
        if (form.path === 'course-quiz') {
          // Use Supabase data if available, otherwise fall back to localStorage
          const options = dbOptionsCourseQuiz || getPersistedFormOptions('course-quiz');
          if (options?.quizCourseDates) {
            return {
              ...form,
              options: {
                ...form.options,
                quizCourseDates: options.quizCourseDates as QuizCourseDateOption[]
              }
            };
          }
        }
        if (form.path === 'course-retraining') {
          // Use Supabase data if available, otherwise fall back to localStorage
          const options = dbOptionsCourseRetraining || getPersistedFormOptions('course-retraining');
          if (options?.retrainingCourseDates) {
            return {
              ...form,
              options: {
                ...form.options,
                retrainingCourseDates: options.retrainingCourseDates as RetrainingCourseDateOption[]
              }
            };
          }
        }
        if (form.path === 'student-product-claim') {
          const options = dbOptionsStudentProductClaim || getPersistedFormOptions('student-product-claim');
          if (options?.packages || options?.templates) {
            return {
              ...form,
              options: {
                ...form.options,
                ...(options.packages && { packages: options.packages }),
                ...(options.templates && { templates: options.templates }),
              }
            };
          }
        }
        if (form.path === 'product-management') {
          const options = dbOptionsProductManagement || getPersistedFormOptions('product-management');
          if (options?.categories || options?.creators) {
            return {
              ...form,
              options: {
                ...form.options,
                ...(options.categories && { categories: options.categories }),
                ...(options.creators && { creators: options.creators }),
              }
            };
          }
        }
        if (form.path === 'referral-link-application') {
          const options = dbOptionsReferralLink || getPersistedFormOptions('referral-link-application');
          if (options?.fillers || options?.identityTypes || options?.packages) {
            return {
              ...form,
              options: {
                ...form.options,
                ...(options.fillers && { fillers: options.fillers }),
                ...(options.identityTypes && { identityTypes: options.identityTypes }),
                ...(options.packages && { packages: options.packages }),
              }
            };
          }
        }
        return form;
      });
      setFormsState(initializedForms);
    };
    
    loadFormOptions();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user.email?.endsWith('@fans.tw')) {
        navigate('/');
      } else {
        setUserAvatarUrl(session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null);
        setUserEmail(session.user.email || null);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const filteredForms = formsState.filter(
    (form) => {
      // 文字搜尋篩選
      const matchesSearch = 
        (form.displayName || form.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.scenarioName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 分類篩選
      const matchesCategory = 
        selectedCategory === 'all' || 
        form.classification?.primaryCategory === selectedCategory;
      
      return matchesSearch && matchesCategory;
    }
  );

  // 分類選項
  const categoryOptions: { value: PrimaryCategory | 'all'; label: string; count: number }[] = [
    { value: 'all', label: '全部', count: formsState.length },
    { value: '自動化商城', label: '自動化商城', count: formsState.filter(f => f.classification?.primaryCategory === '自動化商城').length },
    { value: '課程相關', label: '課程相關', count: formsState.filter(f => f.classification?.primaryCategory === '課程相關').length },
    { value: '內部管理', label: '內部管理', count: formsState.filter(f => f.classification?.primaryCategory === '內部管理').length },
    { value: '教學顧問', label: '教學顧問', count: formsState.filter(f => f.classification?.primaryCategory === '教學顧問').length },
    { value: '外部合作', label: '外部合作', count: formsState.filter(f => f.classification?.primaryCategory === '外部合作').length },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle opening options dialog - initialize editable content
  const handleOpenOptionsDialog = async (form: FormConfig) => {
    setSelectedForm(form);
    setDialogType('options');
    
    // If student-club form, initialize editable dates
    if (form.path === 'student-club' && form.options?.courseDates) {
      setEditableCourseDates(form.options.courseDates.map(opt => opt.value).join('\n'));
    }
    // If tuesday-meetup form, initialize editable dates
    if (form.path === 'tuesday-meetup' && form.options?.eventDates) {
      setEditableEventDates(form.options.eventDates.map(opt => opt.value).join('\n'));
    }
    // If course-quiz form, initialize editable quiz course dates
    if (form.path === 'course-quiz' && form.options?.quizCourseDates) {
      const quizDatesMap: Record<string, string> = {};
      (form.options.quizCourseDates as QuizCourseDateOption[]).forEach(item => {
        quizDatesMap[item.courseName] = item.dates.join('\n');
      });
      setEditableQuizCourseDates(quizDatesMap);
    }
    // If course-retraining form, initialize editable retraining course dates
    if (form.path === 'course-retraining' && form.options?.retrainingCourseDates) {
      const retrainingDatesMap: Record<string, string> = {};
      (form.options.retrainingCourseDates as RetrainingCourseDateOption[]).forEach(item => {
        retrainingDatesMap[item.courseValue] = item.dates.join('\n');
      });
      setEditableRetrainingCourseDates(retrainingDatesMap);
    }
    // If student-product-claim form, initialize editable packages/templates
    if (form.path === 'student-product-claim') {
      if (form.options?.packages) {
        setEditablePackages(form.options.packages.map(p => `${p.value}|${p.label}`).join('\n'));
      }
      if (form.options?.templates) {
        setEditableTemplates(form.options.templates.map(t => `${t.value}|${t.label}`).join('\n'));
      }
    }
    // If product-management form, initialize editable categories/creators
    if (form.path === 'product-management') {
      if (form.options?.categories) {
        setEditableCategories((form.options.categories as any[]).map((c: any) => c.label).join('\n'));
      }
      if (form.options?.creators) {
        setEditableCreators((form.options.creators as any[]).map((c: any) => c.label).join('\n'));
      }
      if ((form.options as any)?.priceTiers) {
        setEditablePriceTiers((form.options as any).priceTiers.map((p: any) => `${p.twd}|${p.usd}`).join('\n'));
      }
    }
    // If referral-link-application form, initialize editable fillers/identityTypes/packages
    if (form.path === 'referral-link-application') {
      if ((form.options as any)?.fillers) {
        setEditableFillers(((form.options as any).fillers as any[]).map((f: any) => f.label).join('\n'));
      }
      if ((form.options as any)?.identityTypes) {
        setEditableIdentityTypes(((form.options as any).identityTypes as any[]).map((t: any) => t.label).join('\n'));
      }
      if (form.options?.packages) {
        setEditableReferralPackages(form.options.packages.map(p => p.label).join('\n'));
      }
    }
    // If project-contract form, initialize editable package lists
    if (form.path === 'project-contract') {
      const dbOpts = await getFormOptionsFromDB('project-contract');
      const opts = dbOpts || getPersistedFormOptions('project-contract');
      const freeDefaults = ['LineOA', 'Google Sheet', 'Google Form', '各社群發佈權限'];
      const smart4aDefaults = ['LineRichMenu', 'LinePay', 'DifyAPI', '認證與編號生成器', 'Line Flex 名片樣板', 'Ragic Plus', '財政部電子發票', 'AI Voice 優聲學', 'LINE FLEX 會員卡掃碼系列', 'Meeting Wizard', 'Whimsical', '黑貓Pay金流', '綠界金流支付', '藍新金流支付', 'Threads', 'MitakeSMS 三竹簡訊'];
      const paidDefaults = ['LineOA', 'MAKE', 'Jotform', 'OpenAI / Deepseek / etc', 'Google Workspace', 'Ragic', 'OCR', '短網址'];
      
      if (opts && (opts as any).freePackages) {
        setEditableFreePackages(((opts as any).freePackages as any[]).map((p: any) => p.label || p).join('\n'));
      } else {
        setEditableFreePackages(freeDefaults.join('\n'));
      }
      if (opts && (opts as any).smart4aPackages) {
        setEditableSmart4aPackages(((opts as any).smart4aPackages as any[]).map((p: any) => p.label || p).join('\n'));
      } else {
        setEditableSmart4aPackages(smart4aDefaults.join('\n'));
      }
      if (opts && (opts as any).paidPackages) {
        setEditablePaidPackages(((opts as any).paidPackages as any[]).map((p: any) => p.label || p).join('\n'));
      } else {
        setEditablePaidPackages(paidDefaults.join('\n'));
      }
    }
  };

  // Handle opening submissions dialog
  const handleOpenSubmissionsDialog = async (form: FormConfig) => {
    setSelectedForm(form);
    setDialogType('submissions');
    setLoadingSubmissions(true);
    setSubmissions([]);
    setCourseRetrainingSubmissions([]);
    setTuesdayMeetupSubmissions([]);
    setVenueRentalSubmissions([]);
    setAutomationMarketplaceSubmissions([]);
    setAutomationMarketplaceENSubmissions([]);
    setTemplateStoreSubmissions([]);
    setTemplateStoreENSubmissions([]);
    setStudentProductClaimSubmissions([]);
    setInstructorPaymentSubmissions([]);
    setLearningVideoConfidentialitySubmissions([]);
    setConsultingServiceSubmissions([]);
    setCourseQuizSubmissions([]);
    setRevenueSharingRecipientSubmissions([]);
    setPaymentNotificationSubmissions([]);
    setAIDigitalTransformCourseSubmissions([]);
    setSmart4aMemberSubmissions([]);
    setQuotationSubmissions([]);
    setServiceInquirySubmissions([]);
    setProductManagementSubmissions([]);
    setReferralLinkSubmissions([]);
    setProjectContractSubmissions([]);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';
      const response = await fetch(
        `https://wmcqexmhcfprpifbiyrj.supabase.co/functions/v1/get-form-submissions?form=${form.path}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const result = await response.json();
      if (result.data) {
        if (form.path === 'student-club') {
          setSubmissions(result.data);
        } else if (form.path === 'course-retraining') {
          setCourseRetrainingSubmissions(result.data);
        } else if (form.path === 'tuesday-meetup') {
          setTuesdayMeetupSubmissions(result.data);
        } else if (form.path === 'venue-rental') {
          setVenueRentalSubmissions(result.data);
        } else if (form.path === 'automation-marketplace') {
          setAutomationMarketplaceSubmissions(result.data);
        } else if (form.path === 'automation-marketplace-en') {
          setAutomationMarketplaceENSubmissions(result.data);
        } else if (form.path === 'template-store') {
          setTemplateStoreSubmissions(result.data);
        } else if (form.path === 'template-store-en') {
          setTemplateStoreENSubmissions(result.data);
        } else if (form.path === 'student-product-claim') {
          setStudentProductClaimSubmissions(result.data);
        } else if (form.path === 'instructor-payment') {
          setInstructorPaymentSubmissions(result.data);
        } else if (form.path === 'learning-video-confidentiality') {
          setLearningVideoConfidentialitySubmissions(result.data);
        } else if (form.path === 'consulting-service') {
          setConsultingServiceSubmissions(result.data);
        } else if (form.path === 'course-quiz') {
          setCourseQuizSubmissions(result.data);
        } else if (form.path === 'revenue-sharing-recipient') {
          setRevenueSharingRecipientSubmissions(result.data);
        } else if (form.path === 'payment-notification') {
          setPaymentNotificationSubmissions(result.data);
        } else if (form.path === 'ai-digital-transform-course') {
          setAIDigitalTransformCourseSubmissions(result.data);
        } else if (form.path === 'smart4a-member') {
          setSmart4aMemberSubmissions(result.data);
        } else if (form.path === 'quotation') {
          setQuotationSubmissions(result.data);
        } else if (form.path === 'service-inquiry') {
          setServiceInquirySubmissions(result.data);
        } else if (form.path === 'product-management') {
          setProductManagementSubmissions(result.data);
        } else if (form.path === 'referral-link-application') {
          setReferralLinkSubmissions(result.data);
        } else if (form.path === 'project-contract') {
          setProjectContractSubmissions(result.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      toast({
        title: "載入失敗",
        description: "無法取得報名資料",
        variant: "destructive"
      });
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // State for save loading
  const [isSaving, setIsSaving] = useState(false);

  // Save course dates for student-club form
  const handleSaveCourseDates = async () => {
    if (!selectedForm || selectedForm.path !== 'student-club') return;
    
    setIsSaving(true);
    
    const lines = editableCourseDates.split('\n').filter(line => line.trim());
    const newCourseDates = lines.map(line => ({
      value: line.trim(),
      label: line.trim()
    }));
    
    // Save to Supabase
    const success = await saveFormOptionsToDB('student-club', { courseDates: newCourseDates });
    
    if (success) {
      // Update the forms array in state
      setFormsState(prev => prev.map(form => {
        if (form.path === 'student-club') {
          return {
            ...form,
            options: {
              ...form.options,
              courseDates: newCourseDates
            }
          };
        }
        return form;
      }));
      
      // Also persist to localStorage as backup
      persistFormOptions('student-club', { courseDates: newCourseDates });
      
      toast({
        title: "儲存成功",
        description: "學員俱樂部日期已同步到 Supabase",
      });
    } else {
      // Save to localStorage as fallback
      persistFormOptions('student-club', { courseDates: newCourseDates });
      toast({
        title: "儲存失敗",
        description: "無法儲存到 Supabase，已暫存到本機",
        variant: "destructive",
      });
    }
    
    setIsSaving(false);
    setSelectedForm(null);
  };

  // Save event dates for tuesday-meetup form
  const handleSaveEventDates = async () => {
    if (!selectedForm || selectedForm.path !== 'tuesday-meetup') return;
    
    setIsSaving(true);
    
    const lines = editableEventDates.split('\n').filter(line => line.trim());
    const newEventDates = lines.map(line => ({
      value: line.trim(),
      label: `${line.trim()} (二)`
    }));
    
    // Save to Supabase
    const success = await saveFormOptionsToDB('tuesday-meetup', { eventDates: newEventDates });
    
    if (success) {
      // Update the forms array in state
      setFormsState(prev => prev.map(form => {
        if (form.path === 'tuesday-meetup') {
          return {
            ...form,
            options: {
              ...form.options,
              eventDates: newEventDates
            }
          };
        }
        return form;
      }));
      
      // Also persist to localStorage as backup
      persistFormOptions('tuesday-meetup', { eventDates: newEventDates });
      
      toast({
        title: "儲存成功",
        description: "週二交流會日期已同步到 Supabase",
      });
    } else {
      // Save to localStorage as fallback
      persistFormOptions('tuesday-meetup', { eventDates: newEventDates });
      toast({
        title: "儲存失敗",
        description: "無法儲存到 Supabase，已暫存到本機",
        variant: "destructive",
      });
    }
    
    setIsSaving(false);
    setSelectedForm(null);
  };

  // Save quiz course dates for course-quiz form
  const handleSaveQuizCourseDates = async () => {
    if (!selectedForm || selectedForm.path !== 'course-quiz') return;
    
    setIsSaving(true);
    
    const newQuizCourseDates: QuizCourseDateOption[] = Object.entries(editableQuizCourseDates).map(([courseName, datesStr]) => ({
      courseName,
      dates: datesStr.split('\n').filter(line => line.trim()).map(line => line.trim())
    }));
    
    // Save to Supabase
    const success = await saveFormOptionsToDB('course-quiz', { quizCourseDates: newQuizCourseDates });
    
    if (success) {
      // Update the forms array in state
      setFormsState(prev => prev.map(form => {
        if (form.path === 'course-quiz') {
          return {
            ...form,
            options: {
              ...form.options,
              quizCourseDates: newQuizCourseDates
            }
          };
        }
        return form;
      }));
      
      // Also persist to localStorage as backup
      persistFormOptions('course-quiz', { quizCourseDates: newQuizCourseDates });
      
      toast({
        title: "儲存成功",
        description: "課程測驗日期已同步到 Supabase",
      });
    } else {
      // Save to localStorage as fallback
      persistFormOptions('course-quiz', { quizCourseDates: newQuizCourseDates });
      toast({
        title: "儲存失敗",
        description: "無法儲存到 Supabase，已暫存到本機",
        variant: "destructive",
      });
    }
    
    setIsSaving(false);
    setSelectedForm(null);
  };

  // Save retraining course dates for course-retraining form
  const handleSaveRetrainingCourseDates = async () => {
    if (!selectedForm || selectedForm.path !== 'course-retraining') return;
    
    setIsSaving(true);
    
    // Get existing course data structure to preserve webhookLabel, webhookDateKey, isSingleDay
    const existingCourses = selectedForm.options?.retrainingCourseDates as RetrainingCourseDateOption[] || [];
    
    const newRetrainingCourseDates: RetrainingCourseDateOption[] = existingCourses.map(course => ({
      ...course,
      dates: editableRetrainingCourseDates[course.courseValue]?.split('\n').filter(line => line.trim()).map(line => line.trim()) || course.dates
    }));
    
    // Save to Supabase
    const success = await saveFormOptionsToDB('course-retraining', { retrainingCourseDates: newRetrainingCourseDates });
    
    if (success) {
      // Update the forms array in state
      setFormsState(prev => prev.map(form => {
        if (form.path === 'course-retraining') {
          return {
            ...form,
            options: {
              ...form.options,
              retrainingCourseDates: newRetrainingCourseDates
            }
          };
        }
        return form;
      }));
      
      // Also persist to localStorage as backup
      persistFormOptions('course-retraining', { retrainingCourseDates: newRetrainingCourseDates });
      
      toast({
        title: "儲存成功",
        description: "課程複訓日期已同步到 Supabase",
      });
    } else {
      // Save to localStorage as fallback
      persistFormOptions('course-retraining', { retrainingCourseDates: newRetrainingCourseDates });
      toast({
        title: "儲存失敗",
        description: "無法儲存到 Supabase，已暫存到本機",
        variant: "destructive",
      });
    }
    
    setIsSaving(false);
    setSelectedForm(null);
  };

  // Save packages/templates for student-product-claim form
  const handleSaveStudentProductClaimOptions = async () => {
    if (!selectedForm || selectedForm.path !== 'student-product-claim') return;
    
    setIsSaving(true);
    
    const parseOptions = (text: string): FormOption[] => {
      return text.split('\n').filter(line => line.trim()).map(line => {
        const trimmed = line.trim();
        const pipeIndex = trimmed.indexOf('|');
        if (pipeIndex > 0) {
          return { value: trimmed.substring(0, pipeIndex), label: trimmed.substring(pipeIndex + 1) };
        }
        return { value: trimmed, label: trimmed };
      });
    };
    
    const newPackages = parseOptions(editablePackages);
    const newTemplates = parseOptions(editableTemplates);
    
    const newOptions = { packages: newPackages, templates: newTemplates };
    
    const success = await saveFormOptionsToDB('student-product-claim', newOptions);
    
    if (success) {
      setFormsState(prev => prev.map(form => {
        if (form.path === 'student-product-claim') {
          return { ...form, options: { ...form.options, ...newOptions } };
        }
        return form;
      }));
      persistFormOptions('student-product-claim', newOptions);
      toast({ title: "儲存成功", description: "學員產品領用選項已同步到 Supabase" });
    } else {
      persistFormOptions('student-product-claim', newOptions);
      toast({ title: "儲存失敗", description: "無法儲存到 Supabase，已暫存到本機", variant: "destructive" });
    }
    
    setIsSaving(false);
    setSelectedForm(null);
  };

  // Save categories/creators for product-management form
  const handleSaveProductManagementOptions = async () => {
    if (!selectedForm || selectedForm.path !== 'product-management') return;
    
    setIsSaving(true);
    
    const newCategories = editableCategories.split('\n').filter(l => l.trim()).map(l => ({
      value: l.trim(),
      label: l.trim()
    }));
    const newCreators = editableCreators.split('\n').filter(l => l.trim()).map(l => ({
      value: l.trim(),
      label: l.trim()
    }));
    const newPriceTiers = editablePriceTiers.split('\n').filter(l => l.trim()).map(l => {
      const [twd, usd] = l.split('|').map(s => parseFloat(s.trim()));
      return { twd: twd || 0, usd: usd || 0 };
    });
    
    const newOptions = { categories: newCategories, creators: newCreators, priceTiers: newPriceTiers };
    
    const success = await saveFormOptionsToDB('product-management', newOptions as any);
    
    if (success) {
      setFormsState(prev => prev.map(form => {
        if (form.path === 'product-management') {
          return { ...form, options: { ...form.options, ...newOptions } as any };
        }
        return form;
      }));
      persistFormOptions('product-management', newOptions as any);
      toast({ title: "儲存成功", description: "產品管理選項已同步到 Supabase" });
    } else {
      persistFormOptions('product-management', newOptions as any);
      toast({ title: "儲存失敗", description: "無法儲存到 Supabase，已暫存到本機", variant: "destructive" });
    }
    
    setIsSaving(false);
    setSelectedForm(null);
  };

  // Save fillers/identityTypes/packages for referral-link-application form
  const handleSaveReferralLinkOptions = async () => {
    if (!selectedForm || selectedForm.path !== 'referral-link-application') return;
    
    setIsSaving(true);
    
    const newFillers = editableFillers.split('\n').filter(l => l.trim()).map(l => ({
      value: l.trim(),
      label: l.trim()
    }));
    const newIdentityTypes = editableIdentityTypes.split('\n').filter(l => l.trim()).map(l => ({
      value: l.trim(),
      label: l.trim()
    }));
    const newPackages = editableReferralPackages.split('\n').filter(l => l.trim()).map(l => ({
      value: l.trim(),
      label: l.trim()
    }));
    
    const newOptions = { fillers: newFillers, identityTypes: newIdentityTypes, packages: newPackages };
    
    const success = await saveFormOptionsToDB('referral-link-application', newOptions as any);
    
    if (success) {
      setFormsState(prev => prev.map(form => {
        if (form.path === 'referral-link-application') {
          return { ...form, options: { ...form.options, ...newOptions } as any };
        }
        return form;
      }));
      persistFormOptions('referral-link-application', newOptions as any);
      toast({ title: "儲存成功", description: "推薦連結申請表選項已同步" });
    } else {
      persistFormOptions('referral-link-application', newOptions as any);
      toast({ title: "儲存失敗", description: "無法儲存，已暫存到本機", variant: "destructive" });
    }
    
    setIsSaving(false);
    setSelectedForm(null);
  };

  // Save free/smart4a/paid packages for project-contract form
  const handleSaveProjectContractOptions = async () => {
    if (!selectedForm || selectedForm.path !== 'project-contract') return;
    
    setIsSaving(true);
    
    const newFreePackages = editableFreePackages.split('\n').filter(l => l.trim()).map(l => ({
      value: l.trim(),
      label: l.trim()
    }));
    const newSmart4aPackages = editableSmart4aPackages.split('\n').filter(l => l.trim()).map(l => ({
      value: l.trim(),
      label: l.trim()
    }));
    const newPaidPackages = editablePaidPackages.split('\n').filter(l => l.trim()).map(l => ({
      value: l.trim(),
      label: l.trim()
    }));
    
    const newOptions = { freePackages: newFreePackages, smart4aPackages: newSmart4aPackages, paidPackages: newPaidPackages };
    
    const success = await saveFormOptionsToDB('project-contract', newOptions as any);
    
    if (success) {
      setFormsState(prev => prev.map(form => {
        if (form.path === 'project-contract') {
          return { ...form, options: { ...form.options, ...newOptions } as any };
        }
        return form;
      }));
      persistFormOptions('project-contract', newOptions as any);
      
      // Dispatch event to notify the form component
      const event = new CustomEvent('formOptionsUpdated', {
        detail: { formPath: 'project-contract', options: newOptions },
      });
      window.dispatchEvent(event);
      
      toast({ title: "儲存成功", description: "合約套件選項已同步" });
    } else {
      persistFormOptions('project-contract', newOptions as any);
      toast({ title: "儲存失敗", description: "無法儲存，已暫存到本機", variant: "destructive" });
    }
    
    setIsSaving(false);
    setSelectedForm(null);
  };

  const isDatePassed = (dateStr: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // 處理日期區間格式（如 2026/1/17-1/18 或 2026/01/17-01/18）
    const firstDatePart = dateStr.split('-')[0];
    const [year, month, day] = firstDatePart.split('/').map(Number);
    if (!year || !month || !day) return false;
    const courseDate = new Date(year, month - 1, day);
    return courseDate <= today;
  };

  return (
    <div className="cosmic-bg min-h-screen">
      <ParticleBackground variant="cosmic" particleCount={60} />

      <div className="relative z-10 max-w-[85%] mx-auto px-6 py-10">
        {/* Header - Enhanced */}
        <header className="flex items-center justify-between mb-10 animate-fade-in">
          <div className="flex items-center gap-5">
            <img
              src={makefanLogo}
              alt="MAKE.fan"
              className="h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                表單儀表板
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                管理 Make.fan 自動化的表單入口
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-primary/30 transition-all focus:outline-none">
                <Avatar className="h-9 w-9 border border-border">
                  {userAvatarUrl ? (
                    <AvatarImage src={userAvatarUrl} alt="User avatar" />
                  ) : null}
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {userEmail && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{userEmail}</div>
              )}
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Search & Stats Row - Enhanced */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          {/* Search - Enhanced */}
          <div className="relative max-w-md flex-1">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 rounded-xl blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" />
              <GlassInput
                type="text"
                placeholder="搜尋表單名稱或場景..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-card/80 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Stats - Enhanced Cards */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">總表單</span>
              <span className="text-lg font-bold text-primary">{forms.length}</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <PenTool className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-muted-foreground">含簽名</span>
              <span className="text-lg font-bold text-accent">{forms.filter((f) => f.hasSignature).length}</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs text-muted-foreground">多步驟</span>
              <span className="text-lg font-bold text-purple-500">{forms.filter((f) => f.isMultiStep).length}</span>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>分類篩選</span>
          </div>
          {categoryOptions.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                border transition-all duration-200
                ${selectedCategory === category.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted hover:border-border'
                }
              `}
            >
              {category.label}
              <span className={`
                inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold
                ${selectedCategory === category.value
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Classification Guide Card - Collapsible */}
        <Collapsible defaultOpen={false}>
          <Card className="mb-6 bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20 backdrop-blur-sm overflow-hidden">
            <CollapsibleTrigger className="w-full group">
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer hover:bg-primary/5 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <CardTitle className="text-sm font-medium text-foreground/90">表單分類說明</CardTitle>
                </div>
                <ChevronDown className="w-4 h-4 text-primary/60 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-semibold shrink-0">1</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">每張表單只能有 <span className="text-foreground font-medium">1 個主分類</span>：自動化商城 / 課程相關 / 內部管理</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-semibold shrink-0">2</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">主分類決定「你在處理哪一類事情」，<span className="text-foreground font-medium">不可同時選兩個</span></p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-semibold shrink-0">3</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">屬性標籤只是補充說明，<span className="text-foreground font-medium">最多 1 個</span>（如：英文版、產品領用）</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-semibold shrink-0">4</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">卡片右上角最多顯示 <span className="text-foreground font-medium">2 個徽章</span>：主分類在前，屬性在後</p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Forms Grid - 3 columns - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredForms.map((form, index) => (
            <GlassCard 
              key={form.id} 
              className="p-5 relative group overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Classification Badge - Top Right */}
              {form.classification && (
                <FormClassificationBadge
                  classification={form.classification}
                  className="absolute top-4 right-4 z-10"
                />
              )}

              <div className="relative mb-4 pr-28">
                <h3 className="text-base font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-colors duration-300">
                  {form.displayName || form.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {form.description}
                </p>
              </div>

              {/* Scenario Info - Enhanced */}
              <div className="relative space-y-2 mb-4 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground shrink-0 font-medium">場景:</span>
                  <span className="text-foreground truncate">{form.scenarioName}</span>
                </div>
                <a
                  href={form.scenarioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  開啟 Make 場景
                </a>
              </div>

              {/* Features - Enhanced */}
              <div className="relative flex flex-wrap items-center gap-1.5 mb-4">
                {form.hasSignature && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-accent/10 text-accent border border-accent/20">
                    <PenTool className="w-2.5 h-2.5" />
                    簽名
                  </span>
                )}
                {form.isMultiStep && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    <Layers className="w-2.5 h-2.5" />
                    多步驟
                  </span>
                )}
                {form.prefillParams && form.prefillParams.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedForm(form);
                      setDialogType('prefill');
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  >
                    <Settings2 className="w-2.5 h-2.5" />
                    預填參數
                  </button>
                )}
                {form.options && (
                  <button
                    onClick={() => handleOpenOptionsDialog(form)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  >
                    <Code className="w-2.5 h-2.5" />
                    選項設定
                  </button>
                )}
                {form.webhookFields && form.webhookFields.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedForm(form);
                      setDialogType('webhook');
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  >
                    <Database className="w-2.5 h-2.5" />
                    Webhook
                  </button>
                )}
                {(form.path === 'student-club' || form.path === 'course-retraining' || form.path === 'tuesday-meetup' || form.path === 'venue-rental' || form.path === 'automation-marketplace' || form.path === 'automation-marketplace-en' || form.path === 'template-store' || form.path === 'template-store-en' || form.path === 'student-product-claim' || form.path === 'instructor-payment' || form.path === 'learning-video-confidentiality' || form.path === 'consulting-service' || form.path === 'course-quiz' || form.path === 'revenue-sharing-recipient' || form.path === 'payment-notification' || form.path === 'ai-digital-transform-course' || form.path === 'smart4a-member' || form.path === 'quotation' || form.path === 'service-inquiry' || form.path === 'product-management' || form.path === 'referral-link-application' || form.path === 'project-contract') && (
                  <button
                    onClick={() => handleOpenSubmissionsDialog(form)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border hover:border-green-400/40 hover:bg-green-500/10 hover:text-green-400 transition-all duration-200"
                  >
                    <Eye className="w-2.5 h-2.5" />
                    提交內容
                  </button>
                )}
              </div>

              {/* Actions - Compact & Refined */}
              <div className="relative flex items-center gap-2 pt-3 border-t border-border/30">
                <Link to={`/form/${form.path}`}>
                  <GlassButton variant="gradient" size="sm" className="gap-1.5">
                    <Link2 className="w-3 h-3" />
                    開啟
                  </GlassButton>
                </Link>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/form/${form.path}`,
                      `link-${form.id}`
                    )
                  }
                  className="p-2 rounded-md bg-muted/40 hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-all duration-200"
                  title="複製表單連結"
                >
                  {copiedId === `link-${form.id}` ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Empty State */}
        {filteredForms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">找不到符合的表單</h3>
            <p className="text-sm text-muted-foreground">請嘗試不同的搜尋關鍵字</p>
          </div>
        )}

        {/* Prefill Params Dialog */}
        <Dialog open={!!selectedForm && dialogType === 'prefill'} onOpenChange={() => setSelectedForm(null)}>
          <DialogContent className="glass-card border-white/10 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {selectedForm?.name} - 預填參數
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                使用 URL 參數預填表單欄位，例如：
              </p>
              <code className="block text-xs bg-muted/50 p-2 rounded break-all">
                /form/{selectedForm?.path}?{selectedForm?.prefillParams?.map(p => `${p.key}=值`).join('&')}
              </code>
              <div className="space-y-2 mt-4">
                <p className="text-xs font-medium text-foreground">可用參數：</p>
                {selectedForm?.prefillParams?.map((param) => (
                  <div key={param.key} className="flex items-start gap-2 text-xs">
                    <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                      {param.key}
                    </code>
                    <div>
                      <span className="text-foreground">{param.label}</span>
                      {param.description && (
                        <span className="text-muted-foreground ml-1">- {param.description}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Options Settings Dialog */}
        <Dialog open={!!selectedForm && dialogType === 'options'} onOpenChange={() => setSelectedForm(null)}>
          <DialogContent className="glass-card border-white/10 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {selectedForm?.displayName || selectedForm?.name} - 選項設定
              </DialogTitle>
            </DialogHeader>
            
            {/* 學員俱樂部專用：可編輯課程日期 */}
            {selectedForm?.path === 'student-club' ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>編輯課程日期選項，每行一個日期（格式：YYYY/MM/DD）</p>
                  <p className="text-xs text-muted-foreground/70">※ 過期日期會自動被過濾不顯示於表單中</p>
                </div>
                
                <textarea
                  value={editableCourseDates}
                  onChange={(e) => setEditableCourseDates(e.target.value)}
                  className="w-full h-40 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="2026/01/14&#10;2026/01/28&#10;2026/02/11"
                />
                
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="text-sm font-medium text-foreground mb-2">預覽（有效日期）：</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {editableCourseDates.split('\n').filter(line => line.trim()).map((line, idx) => {
                      const dateStr = line.trim();
                      const passed = isDatePassed(dateStr);
                      return (
                        <li key={idx} className={`flex items-center gap-2 ${passed ? 'opacity-50' : ''}`}>
                          <span className={`w-2 h-2 rounded-full ${passed ? 'bg-orange-400' : 'bg-green-400'}`} />
                          {dateStr}
                          {passed && <span className="text-xs text-orange-400">(已過期)</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="px-4 py-2 text-sm rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveCourseDates}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? '儲存中...' : '儲存變更'}
                  </button>
                </div>
              </div>
            ) : selectedForm?.path === 'tuesday-meetup' ? (
              /* 週二線下交流會專用：可編輯活動日期 */
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>編輯活動日期選項，每行一個日期（格式：YYYY/MM/DD）</p>
                  <p className="text-xs text-muted-foreground/70">※ 過期日期會自動被過濾不顯示於表單中</p>
                </div>
                
                <textarea
                  value={editableEventDates}
                  onChange={(e) => setEditableEventDates(e.target.value)}
                  className="w-full h-40 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="2026/01/06&#10;2026/02/03&#10;2026/03/10"
                />
                
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="text-sm font-medium text-foreground mb-2">預覽（有效日期）：</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {editableEventDates.split('\n').filter(line => line.trim()).map((line, idx) => {
                      const dateStr = line.trim();
                      const passed = isDatePassed(dateStr);
                      return (
                        <li key={idx} className={`flex items-center gap-2 ${passed ? 'opacity-50' : ''}`}>
                          <span className={`w-2 h-2 rounded-full ${passed ? 'bg-orange-400' : 'bg-green-400'}`} />
                          {dateStr} (二)
                          {passed && <span className="text-xs text-orange-400">(已過期)</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="px-4 py-2 text-sm rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveEventDates}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? '儲存中...' : '儲存變更'}
                  </button>
                </div>
              </div>
            ) : selectedForm?.path === 'course-quiz' ? (
              /* 訓後測驗專用：可編輯各課程日期 */
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>編輯各課程的測驗日期選項，每行一個日期</p>
                  <p className="text-xs text-muted-foreground/70">※ 過期日期會自動被過濾不顯示於表單中</p>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {selectedForm?.options?.quizCourseDates && (selectedForm.options.quizCourseDates as QuizCourseDateOption[]).map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{item.courseName}</label>
                      <textarea
                        value={editableQuizCourseDates[item.courseName] || ''}
                        onChange={(e) => setEditableQuizCourseDates(prev => ({
                          ...prev,
                          [item.courseName]: e.target.value
                        }))}
                        className="w-full h-24 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="2026/1/15&#10;2026/3/12"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="text-sm font-medium text-foreground mb-2">預覽（所有課程日期）：</h4>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {Object.entries(editableQuizCourseDates).map(([courseName, datesStr]) => (
                      <div key={courseName}>
                        <p className="text-xs font-medium text-foreground/80 mb-1">{courseName}:</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5 pl-3">
                          {datesStr.split('\n').filter(line => line.trim()).map((line, idx) => {
                            const dateStr = line.trim();
                            const passed = isDatePassed(dateStr);
                            return (
                              <li key={idx} className={`flex items-center gap-2 ${passed ? 'opacity-50' : ''}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${passed ? 'bg-orange-400' : 'bg-green-400'}`} />
                                {dateStr}
                                {passed && <span className="text-xs text-orange-400">(已過期)</span>}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="px-4 py-2 text-sm rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveQuizCourseDates}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? '儲存中...' : '儲存變更'}
                  </button>
                </div>
              </div>
            ) : selectedForm?.path === 'course-retraining' ? (
              /* 課程複訓專用：可編輯各課程日期 */
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>編輯各課程的複訓日期選項，每行一個日期</p>
                  <p className="text-xs text-muted-foreground/70">※ 日期格式支援 YYYY/MM/DD 或 YYYY/M/D（如 2026/1/15 或 2026/01/15）</p>
                  <p className="text-xs text-muted-foreground/70">※ 兩日課程格式：YYYY/M/D-M/D（如 2026/1/17-1/18）</p>
                  <p className="text-xs text-muted-foreground/70">※ 過期日期會自動被過濾不顯示於表單中</p>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {selectedForm?.options?.retrainingCourseDates && (selectedForm.options.retrainingCourseDates as RetrainingCourseDateOption[]).map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground">{item.courseName}</label>
                        <span className={`text-xs px-2 py-0.5 rounded ${item.isSingleDay ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                          {item.isSingleDay ? '單日' : '兩日'}
                        </span>
                      </div>
                      <textarea
                        value={editableRetrainingCourseDates[item.courseValue] || ''}
                        onChange={(e) => setEditableRetrainingCourseDates(prev => ({
                          ...prev,
                          [item.courseValue]: e.target.value
                        }))}
                        className="w-full h-28 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder={item.isSingleDay ? "2026/1/15\n2026/3/12" : "2026/1/17-1/18\n2026/3/21-3/22"}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="text-sm font-medium text-foreground mb-2">預覽（所有課程日期）：</h4>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {selectedForm?.options?.retrainingCourseDates && (selectedForm.options.retrainingCourseDates as RetrainingCourseDateOption[]).map((course, idx) => (
                      <div key={idx}>
                        <p className="text-xs font-medium text-foreground/80 mb-1 flex items-center gap-2">
                          {course.courseName}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${course.isSingleDay ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            {course.isSingleDay ? '單日' : '兩日'}
                          </span>
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-0.5 pl-3">
                          {(editableRetrainingCourseDates[course.courseValue] || '').split('\n').filter(line => line.trim()).map((line, dateIdx) => {
                            const dateStr = line.trim();
                            const passed = isDatePassed(dateStr);
                            return (
                              <li key={dateIdx} className={`flex items-center gap-2 ${passed ? 'opacity-50' : ''}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${passed ? 'bg-orange-400' : 'bg-green-400'}`} />
                                {dateStr}
                                {passed && <span className="text-xs text-orange-400">(已過期)</span>}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="px-4 py-2 text-sm rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveRetrainingCourseDates}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? '儲存中...' : '儲存變更'}
                  </button>
                </div>
              </div>
            ) : selectedForm?.path === 'student-product-claim' ? (
              /* 學員產品領用專用：可編輯套件與樣板選項 */
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>編輯套件與樣板選項，每行一個，格式：<code className="bg-muted/50 px-1 rounded text-xs">識別碼|顯示名稱</code></p>
                  <p className="text-xs text-muted-foreground/70">※ 直接貼上清單即可，儲存後即時生效</p>
                </div>
                
                {/* 套件選項 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">套件選項（多選）</label>
                  <textarea
                    value={editablePackages}
                    onChange={(e) => setEditablePackages(e.target.value)}
                    className="w-full h-40 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={"threads-08cujl|Threads\ndifyaiagent-qvtlvt|DifyAPI\ngetnews-vw9mdc|新聞快訊"}
                  />
                </div>

                {/* 樣板選項 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">樣板選項（單選）</label>
                  <textarea
                    value={editableTemplates}
                    onChange={(e) => setEditableTemplates(e.target.value)}
                    className="w-full h-28 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={"TEMP-25001|Threads 頻道自動化經營\nTEMP-25002|表單串接金流與電子發票"}
                  />
                </div>

                {/* 預覽 */}
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="text-sm font-medium text-foreground mb-2">預覽：</h4>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">套件（{editablePackages.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 pl-3">
                        {editablePackages.split('\n').filter(l => l.trim()).map((line, idx) => {
                          const trimmed = line.trim();
                          const pipeIdx = trimmed.indexOf('|');
                          const label = pipeIdx > 0 ? trimmed.substring(pipeIdx + 1) : trimmed;
                          return (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                              {label}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">樣板（{editableTemplates.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 pl-3">
                        {editableTemplates.split('\n').filter(l => l.trim()).map((line, idx) => {
                          const trimmed = line.trim();
                          const pipeIdx = trimmed.indexOf('|');
                          const label = pipeIdx > 0 ? trimmed.substring(pipeIdx + 1) : trimmed;
                          return (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              {label}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="px-4 py-2 text-sm rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveStudentProductClaimOptions}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? '儲存中...' : '儲存變更'}
                  </button>
                </div>
              </div>
            ) : selectedForm?.path === 'product-management' ? (
              /* 產品管理專用：可編輯類別與製作者 */
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>編輯類別與製作者選項，每行一個</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">類別選項</label>
                  <textarea
                    value={editableCategories}
                    onChange={(e) => setEditableCategories(e.target.value)}
                    className="w-full h-32 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={"CRM\nERP\nHR\n行銷\n財務"}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">方案月單價選項（台幣|美金）</label>
                  <textarea
                    value={editablePriceTiers}
                    onChange={(e) => setEditablePriceTiers(e.target.value)}
                    className="w-full h-32 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={"200|6.99\n700|22.99\n300|9.99"}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">製作者選項</label>
                  <textarea
                    value={editableCreators}
                    onChange={(e) => setEditableCreators(e.target.value)}
                    className="w-full h-28 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={"丁禹勝\n張元俊\n廖辰豐\n曹逸湘"}
                  />
                </div>

                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="text-sm font-medium text-foreground mb-2">預覽：</h4>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">類別（{editableCategories.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 pl-3">
                        {editableCategories.split('\n').filter(l => l.trim()).map((line, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            {line.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">方案月單價（{editablePriceTiers.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 pl-3">
                        {editablePriceTiers.split('\n').filter(l => l.trim()).map((line, idx) => {
                          const [twd, usd] = line.split('|').map(s => s.trim());
                          return (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                              NT${twd} / US${usd}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">製作者（{editableCreators.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 pl-3">
                        {editableCreators.split('\n').filter(l => l.trim()).map((line, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                            {line.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="px-4 py-2 text-sm rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveProductManagementOptions}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? '儲存中...' : '儲存變更'}
                  </button>
                </div>
              </div>
            ) : selectedForm?.path === 'referral-link-application' ? (
              /* 推薦連結申請表專用：可編輯填表人/身份類別/套件選擇 */
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>編輯選項，每行一個項目</p>
                </div>
                
                {/* 填表人 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">填表人</label>
                  <textarea
                    value={editableFillers}
                    onChange={(e) => setEditableFillers(e.target.value)}
                    className="w-full h-32 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Elena&#10;Joyce&#10;Jimbo"
                  />
                </div>

                {/* 申請人身份類別 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">申請人身份類別</label>
                  <textarea
                    value={editableIdentityTypes}
                    onChange={(e) => setEditableIdentityTypes(e.target.value)}
                    className="w-full h-20 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="經銷商&#10;合作夥伴&#10;團隊成員"
                  />
                </div>

                {/* 套件選擇 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">套件選擇</label>
                  <textarea
                    value={editableReferralPackages}
                    onChange={(e) => setEditableReferralPackages(e.target.value)}
                    className="w-full h-48 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="LineRichMenu&#10;LinePay&#10;DifyAPI"
                  />
                </div>

                {/* 預覽 */}
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="text-sm font-medium text-foreground mb-2">預覽：</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">填表人（{editableFillers.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <p className="text-xs text-muted-foreground pl-3">{editableFillers.split('\n').filter(l => l.trim()).map(l => l.trim()).join('、')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">身份類別（{editableIdentityTypes.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <p className="text-xs text-muted-foreground pl-3">{editableIdentityTypes.split('\n').filter(l => l.trim()).map(l => l.trim()).join('、')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">套件選擇（{editableReferralPackages.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <p className="text-xs text-muted-foreground pl-3">{editableReferralPackages.split('\n').filter(l => l.trim()).map(l => l.trim()).join('、')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="px-4 py-2 text-sm rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveReferralLinkOptions}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? '儲存中...' : '儲存變更'}
                  </button>
                </div>
              </div>
            ) : selectedForm?.path === 'project-contract' ? (
              /* 製作合約專用：可編輯免費套件/Smart4A開發套件/已知額外付費項目 */
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>編輯選項，每行一個項目</p>
                </div>
                
                {/* 免費套件 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">免費套件</label>
                  <textarea
                    value={editableFreePackages}
                    onChange={(e) => setEditableFreePackages(e.target.value)}
                    className="w-full h-28 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="LineOA&#10;Google Sheet&#10;Google Form"
                  />
                </div>

                {/* Smart4A開發套件 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Smart4A開發套件</label>
                  <textarea
                    value={editableSmart4aPackages}
                    onChange={(e) => setEditableSmart4aPackages(e.target.value)}
                    className="w-full h-48 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="LineRichMenu&#10;LinePay&#10;DifyAPI"
                  />
                </div>

                {/* 已知額外付費項目 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">已知額外付費項目</label>
                  <textarea
                    value={editablePaidPackages}
                    onChange={(e) => setEditablePaidPackages(e.target.value)}
                    className="w-full h-32 p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="LineOA&#10;MAKE&#10;Jotform"
                  />
                </div>

                {/* 預覽 */}
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="text-sm font-medium text-foreground mb-2">預覽：</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">免費套件（{editableFreePackages.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <p className="text-xs text-muted-foreground pl-3">{editableFreePackages.split('\n').filter(l => l.trim()).map(l => l.trim()).join('、')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">Smart4A開發套件（{editableSmart4aPackages.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <p className="text-xs text-muted-foreground pl-3">{editableSmart4aPackages.split('\n').filter(l => l.trim()).map(l => l.trim()).join('、')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/80 mb-1">已知額外付費項目（{editablePaidPackages.split('\n').filter(l => l.trim()).length} 個）：</p>
                      <p className="text-xs text-muted-foreground pl-3">{editablePaidPackages.split('\n').filter(l => l.trim()).map(l => l.trim()).join('、')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="px-4 py-2 text-sm rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveProjectContractOptions}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? '儲存中...' : '儲存變更'}
                  </button>
                </div>
              </div>
            ) : (
              /* 其他表單：顯示說明 */
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  如何新增/調整選項：
                </p>
                
                {/* 檔案位置 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">設定檔位置</span>
                  </div>
                  <code className="block text-xs bg-muted/50 p-2 rounded-lg text-foreground/80 font-mono">
                    src/data/forms.ts {selectedForm?.optionsInfo?.lineRange && `第 ${selectedForm.optionsInfo.lineRange} 行`}
                  </code>
                </div>

                {/* 目前已設定的選項 */}
                {selectedForm?.options && (
                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">目前已設定選項：</p>
                    <div className="space-y-2">
                      {selectedForm.options.packages && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">套件（多選）：</span>
                          <span className="text-foreground ml-1">
                            {selectedForm.options.packages.length} 個 ({selectedForm.options.packages.map(p => p.label).join('、')})
                          </span>
                        </div>
                      )}
                      {selectedForm.options.templates && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">樣板（單選）：</span>
                          <span className="text-foreground ml-1">
                            {selectedForm.options.templates.length} 個 ({selectedForm.options.templates.map(t => t.label).join('、')})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 範例程式碼 */}
                <div>
                  <p className="text-xs font-medium text-foreground mb-2">範例程式碼</p>
                  <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto">
                    <code className="text-foreground/80">{`options: {
  // 套件選項（多選）
  packages: [
    { value: 'basic', label: '基礎套件' },
    { value: 'new-package', label: '新套件' }, // 新增
  ],
  // 樣板選項（單選）
  templates: [
    { value: 'crm', label: 'CRM 客戶管理' },
    { value: 'new-template', label: '新樣板' }, // 新增
  ],
},`}</code>
                  </pre>
                </div>

                {/* 注意事項 */}
                {selectedForm?.optionsInfo?.notes && selectedForm.optionsInfo.notes.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">注意事項：</p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      {selectedForm.optionsInfo.notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Webhook Data Dialog */}
        <Dialog open={!!selectedForm && dialogType === 'webhook'} onOpenChange={() => setSelectedForm(null)}>
          <DialogContent className="glass-card border-white/10 max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                {selectedForm?.displayName || selectedForm?.name} - Webhook 資料結構
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                表單提交時傳送至 Webhook 的資料欄位：
              </p>
              
              {/* Webhook URL */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">Webhook URL：</p>
                <code className="block text-xs bg-muted/50 p-2 rounded break-all text-foreground/80">
                  {selectedForm?.webhookUrl}
                </code>
              </div>

              {/* 資料欄位表格 */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">資料欄位（共 {selectedForm?.webhookFields?.length} 個）：</p>
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2">
                  {selectedForm?.webhookFields?.map((field) => (
                    <div key={field.key} className="flex items-start gap-2 text-xs p-2 bg-muted/30 rounded">
                      <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0 font-mono">
                        {field.key}
                      </code>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{field.label}</span>
                          {field.type && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                              {field.type}
                            </span>
                          )}
                        </div>
                        {field.description && (
                          <p className="text-muted-foreground mt-0.5">{field.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON 範例 */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">JSON 結構範例：</p>
                <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto max-h-[200px]">
                  <code className="text-foreground/80">
{`{
${selectedForm?.webhookFields?.slice(0, 5).map(f => `  "${f.key}": ${f.type === 'number' ? '0' : f.type === 'array' ? '[]' : f.type === 'object' ? '{}' : '""'}`).join(',\n')}${(selectedForm?.webhookFields?.length || 0) > 5 ? ',\n  // ...' : ''}
}`}
                  </code>
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Submissions Dialog */}
        <Dialog open={!!selectedForm && dialogType === 'submissions'} onOpenChange={() => setSelectedForm(null)}>
          <DialogContent className="glass-card border-white/10 max-w-[90vw] w-full max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-foreground flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-400" />
                {selectedForm?.displayName || selectedForm?.name} - 提交內容
              </DialogTitle>
            </DialogHeader>
            
            {loadingSubmissions ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : selectedForm?.path === 'student-club' ? (
              submissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何報名資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">報名日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">課程日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">金額</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">學員</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">付款方式</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.full_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.phone}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.course_date}</td>
                          <td className="p-2 text-xs text-foreground">${sub.amount}</td>
                          <td className="p-2 text-xs">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sub.is_student ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                              {sub.is_student ? '是' : '否'}
                            </span>
                          </td>
                          <td className="p-2 text-xs text-foreground">{sub.payment_method || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {submissions.length} 筆報名資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'course-retraining' ? (
              courseRetrainingSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何報名資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">報名日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">課程名稱</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">課程日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">上課天數</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">金額</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">付款方式</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseRetrainingSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.full_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.phone}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.course_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.course_date}</td>
                          <td className="p-2 text-xs text-foreground">{sub.attendance_days}</td>
                          <td className="p-2 text-xs text-foreground">${sub.amount}</td>
                          <td className="p-2 text-xs text-foreground">{sub.payment_method || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {courseRetrainingSubmissions.length} 筆報名資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'tuesday-meetup' ? (
              tuesdayMeetupSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何報名資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">報名日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">訂單編號</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">活動日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">參加目的</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">來源</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tuesdayMeetupSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.order_number || '-'}</td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.full_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.phone}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.event_date}</td>
                          <td className="p-2 text-xs text-foreground max-w-[200px] truncate" title={sub.purposes || ''}>{sub.purposes || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.source || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {tuesdayMeetupSubmissions.length} 筆報名資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'venue-rental' ? (
              venueRentalSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何申請資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">申請日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">聯絡人</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">活動主題</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">租借天數</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">日期1</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">時間1</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">日期2</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">時間2</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">總時數</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">總金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venueRentalSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.contact_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.contact_phone}</td>
                          <td className="p-2 text-xs text-foreground">{sub.contact_email}</td>
                          <td className="p-2 text-xs text-foreground max-w-[150px] truncate" title={sub.event_theme}>{sub.event_theme}</td>
                          <td className="p-2 text-xs text-foreground">{sub.rental_days}</td>
                          <td className="p-2 text-xs text-foreground">{sub.rental_date1}</td>
                          <td className="p-2 text-xs text-foreground">{sub.start_time1}-{sub.end_time1}</td>
                          <td className="p-2 text-xs text-foreground">{sub.rental_date2 || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.start_time2 && sub.end_time2 ? `${sub.start_time2}-${sub.end_time2}` : '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.total_hours}hr</td>
                          <td className="p-2 text-xs text-foreground">${sub.total_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {venueRentalSubmissions.length} 筆申請資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'automation-marketplace' ? (
              automationMarketplaceSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何訂單資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">訂單日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名/公司</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">模組</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">方案</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">月數</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">金額</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">付款方式</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Org ID</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Lovable Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">原始單號</th>
                      </tr>
                    </thead>
                    <tbody>
                      {automationMarketplaceSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.name_or_company}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.phone || '-'}</td>
                          <td className="p-2 text-xs text-foreground max-w-[120px] truncate" title={sub.automation_module}>{sub.automation_module}</td>
                          <td className="p-2 text-xs text-foreground">{sub.plan === 'yearly' ? '年繳' : '月繳'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.purchase_months || '-'}</td>
                          <td className="p-2 text-xs text-foreground">${sub.total_cost} {sub.currency}</td>
                          <td className="p-2 text-xs text-foreground">{sub.payment_method === '0' ? 'ibon' : sub.payment_method === '1' ? 'ATM' : sub.payment_method === '2' ? '信用卡' : sub.payment_method || '-'}</td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.make_organization_id || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.lovable_email || '-'}</td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.original_order_number || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {automationMarketplaceSubmissions.length} 筆訂單資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'automation-marketplace-en' ? (
              automationMarketplaceENSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No order data available
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Order Date</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Name/Company</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Country</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Module</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Plan</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Months</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Total</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Org ID</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Lovable Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Original Order#</th>
                      </tr>
                    </thead>
                    <tbody>
                      {automationMarketplaceENSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-US') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.name_or_company}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.country || '-'}</td>
                          <td className="p-2 text-xs text-foreground max-w-[120px] truncate" title={sub.automation_module}>{sub.automation_module}</td>
                          <td className="p-2 text-xs text-foreground">{sub.plan === 'yearly' ? 'Yearly' : 'Monthly'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.purchase_months || '-'}</td>
                          <td className="p-2 text-xs text-foreground">${sub.total_cost} {sub.currency}</td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.make_organization_id || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.lovable_email || '-'}</td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.original_order_number || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    Total: {automationMarketplaceENSubmissions.length} orders
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'template-store' ? (
              templateStoreSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何訂單資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">訂單日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名/公司</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">範本</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">金額</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">付款方式</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">發票類型</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templateStoreSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.name_or_company}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.phone || '-'}</td>
                          <td className="p-2 text-xs text-foreground max-w-[150px] truncate" title={sub.template}>{sub.template}</td>
                          <td className="p-2 text-xs text-foreground">${sub.price} {sub.currency}</td>
                          <td className="p-2 text-xs text-foreground">{sub.payment_method === '0' ? 'ibon' : sub.payment_method === '1' ? 'ATM' : sub.payment_method === '2' ? '信用卡' : sub.payment_method || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.invoice_type === '0' ? '二聯' : sub.invoice_type === '1' ? '三聯' : sub.invoice_type || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {templateStoreSubmissions.length} 筆訂單資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'template-store-en' ? (
              templateStoreENSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No order data available
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Order Date</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Name/Company</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Country</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Template</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templateStoreENSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-US') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.name_or_company}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.country || '-'}</td>
                          <td className="p-2 text-xs text-foreground max-w-[150px] truncate" title={sub.template}>{sub.template}</td>
                          <td className="p-2 text-xs text-foreground">${sub.price} {sub.currency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    Total: {templateStoreENSubmissions.length} orders
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'student-product-claim' ? (
              studentProductClaimSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何申請資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">申請日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名/公司</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">學員編號</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Make Org ID</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">套件</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">範本</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentProductClaimSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.name_or_company}</td>
                          <td className="p-2 text-xs text-foreground">{sub.student_id || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.make_organization_id}</td>
                          <td className="p-2 text-xs text-foreground max-w-[150px] truncate" title={sub.packages || ''}>{sub.packages || '-'}</td>
                          <td className="p-2 text-xs text-foreground max-w-[150px] truncate" title={sub.template || ''}>{sub.template || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {studentProductClaimSubmissions.length} 筆申請資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'instructor-payment' ? (
              instructorPaymentSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何請款申請資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">申請日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">身分</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">活動分類</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">天數</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">日期1</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">時間1</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">日期2</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">時間2</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">合計時數</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructorPaymentSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.full_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.phone}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.role}</td>
                          <td className="p-2 text-xs text-foreground">{sub.activity_category}</td>
                          <td className="p-2 text-xs text-foreground">{sub.activity_days}</td>
                          <td className="p-2 text-xs text-foreground">{sub.activity_date1}</td>
                          <td className="p-2 text-xs text-foreground">{sub.start_time1}-{sub.end_time1}</td>
                          <td className="p-2 text-xs text-foreground">{sub.activity_date2 || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.start_time2 && sub.end_time2 ? `${sub.start_time2}-${sub.end_time2}` : '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.total_hours}hr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {instructorPaymentSubmissions.length} 筆請款申請資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'learning-video-confidentiality' ? (
              learningVideoConfidentialitySubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何簽署資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">簽署日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">身分證字號</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">簽署時間</th>
                      </tr>
                    </thead>
                    <tbody>
                      {learningVideoConfidentialitySubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.full_name}</td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.national_id}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.phone || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.signing_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {learningVideoConfidentialitySubmissions.length} 筆簽署資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'consulting-service' ? (
              consultingServiceSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何訂單資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">訂單日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名/公司</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">服務類別</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">方案/等級</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">計價方案</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">金額</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">付款方式</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultingServiceSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.customer_name_company}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.mobile}</td>
                          <td className="p-2 text-xs text-foreground">{sub.service_category}</td>
                          <td className="p-2 text-xs text-foreground">{sub.training_level || sub.coaching_mode || sub.consulting_plan || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.pricing_tier || '-'}</td>
                          <td className="p-2 text-xs text-foreground">NT$ {sub.total_price?.toLocaleString() || 0}</td>
                          <td className="p-2 text-xs text-foreground">{sub.payment_method || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {consultingServiceSubmissions.length} 筆訂單資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'course-quiz' ? (
              courseQuizSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何測驗資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">提交日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">學員姓名</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">課程名稱</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">課程日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">完訓日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">分數</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">正確題數</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseQuizSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.student_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.course_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.course_date}</td>
                          <td className="p-2 text-xs text-foreground">{sub.completion_date}</td>
                          <td className="p-2 text-xs text-foreground">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sub.total_score >= sub.max_score * 0.8 ? 'bg-green-500/10 text-green-400' : sub.total_score >= sub.max_score * 0.6 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                              {sub.total_score}/{sub.max_score}
                            </span>
                          </td>
                          <td className="p-2 text-xs text-foreground">{sub.correct_count}/{sub.question_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {courseQuizSubmissions.length} 筆測驗資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'revenue-sharing-recipient' ? (
              revenueSharingRecipientSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何收款人資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">提交日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">身分別</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名/公司</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">銀行</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">分行</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">帳號</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueSharingRecipientSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sub.recipient_type === 'company' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                              {sub.recipient_type === 'company' ? '公司戶' : '個人戶'}
                            </span>
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">
                            {sub.recipient_type === 'company' ? sub.company_name : sub.recipient_name}
                          </td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.phone}</td>
                          <td className="p-2 text-xs text-foreground">{sub.bank_name} ({sub.bank_code})</td>
                          <td className="p-2 text-xs text-foreground">{sub.branch_name} ({sub.branch_code})</td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.account_number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {revenueSharingRecipientSubmissions.length} 筆收款人資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'payment-notification' ? (
              paymentNotificationSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何匯款通知資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">提交日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">訂單編號</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名/公司</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">產品/服務</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">匯款日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">金額</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">帳號末五碼</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentNotificationSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.order_number || '-'}</td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.name_or_company}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.product_service}</td>
                          <td className="p-2 text-xs text-foreground">{sub.payment_date}</td>
                          <td className="p-2 text-xs text-foreground">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                              NT$ {sub.payment_amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.bank_last_5_digits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {paymentNotificationSubmissions.length} 筆匯款通知資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'ai-digital-transform-course' ? (
              aiDigitalTransformCourseSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何報名資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">報名日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">課程</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">場次</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">參加類型</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">人數</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">金額</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">付款方式</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">公司</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiDigitalTransformCourseSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.full_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.phone}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground max-w-[120px] truncate" title={sub.course_name}>{sub.course_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.session}</td>
                          <td className="p-2 text-xs text-foreground">{sub.participation_type}</td>
                          <td className="p-2 text-xs text-foreground">{sub.attendee_count}</td>
                          <td className="p-2 text-xs text-foreground">${sub.total_amount}</td>
                          <td className="p-2 text-xs text-foreground">{sub.payment_method}</td>
                          <td className="p-2 text-xs text-foreground">{sub.company_name || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {aiDigitalTransformCourseSubmissions.length} 筆報名資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'smart4a-member' ? (
              smart4aMemberSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何登記資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">登記編號</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">登記日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">姓名</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">郵遞區號</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">地址</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Make Org ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {smart4aMemberSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground font-mono">{sub.submission_id || '-'}</td>
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.full_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.phone}</td>
                          <td className="p-2 text-xs text-foreground">{sub.email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.postal_code || '-'}</td>
                          <td className="p-2 text-xs text-foreground max-w-[150px] truncate" title={sub.address || ''}>{sub.address || '-'}</td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.make_organization_id || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {smart4aMemberSubmissions.length} 筆登記資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'quotation' ? (
              quotationSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何報價單資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">報價日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">開立人員</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">公司名稱</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">聯絡窗口</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">客戶 Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">方案</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">指定顧問/講師</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">報價總額</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotationSubmissions.map((sub) => {
                        // 組合方案顯示文字
                        const packageItems: string[] = [];
                        if (sub.transformation_packages) {
                          packageItems.push(sub.transformation_packages);
                        }
                        if (sub.consulting_plan) {
                          packageItems.push(`${sub.consulting_plan} ${sub.consulting_months || 1}月`);
                        }
                        if (sub.training_category_label) {
                          packageItems.push(`${sub.training_category_label} ${sub.training_sessions || 1}次`);
                        }
                        const packageDisplay = packageItems.join(', ') || '-';
                        
                        // 組合指定人員顯示
                        const designatedPeople: string[] = [];
                        if (sub.consulting_designated_name) {
                          designatedPeople.push(`顧問: ${sub.consulting_designated_name}`);
                        }
                        if (sub.training_designated_name) {
                          designatedPeople.push(`講師: ${sub.training_designated_name}`);
                        }
                        const designatedDisplay = designatedPeople.join(', ') || '-';
                        
                        return (
                          <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="p-2 text-xs text-foreground">{sub.quotation_date}</td>
                            <td className="p-2 text-xs text-foreground font-medium">{sub.issuer_name}</td>
                            <td className="p-2 text-xs text-foreground">{sub.company_name}</td>
                            <td className="p-2 text-xs text-foreground">{sub.contact_person}</td>
                            <td className="p-2 text-xs text-foreground">{sub.customer_email}</td>
                            <td className="p-2 text-xs text-foreground max-w-[200px] truncate" title={packageDisplay}>
                              {packageDisplay}
                            </td>
                            <td className="p-2 text-xs text-foreground max-w-[150px] truncate" title={designatedDisplay}>
                              {designatedDisplay}
                            </td>
                            <td className="p-2 text-xs text-foreground font-medium">NT$ {sub.total_amount.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {quotationSubmissions.length} 筆報價單資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'service-inquiry' ? (
              serviceInquirySubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何詢價單資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">詢價日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">公司名稱</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">聯絡人</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">電話</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">陪跑方案</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">顧問服務</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">預估金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceInquirySubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.company_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.contact_person}</td>
                          <td className="p-2 text-xs text-foreground">{sub.contact_email}</td>
                          <td className="p-2 text-xs text-foreground">{sub.contact_phone}</td>
                          <td className="p-2 text-xs text-foreground">{sub.transformation_package || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.consulting_plan ? `${sub.consulting_plan} ${sub.consulting_months || 1}月` : '-'}</td>
                          <td className="p-2 text-xs text-foreground font-medium">NT$ {sub.estimated_amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {serviceInquirySubmissions.length} 筆詢價單資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'product-management' ? (
              productManagementSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何產品資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">建立日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">APP ID</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">APP 名稱</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">類別</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">月單價 (TWD)</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">月單價 (USD)</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">製作者</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">上架日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">官方 API</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">API Token/OAuth</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">附件場景</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productManagementSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-mono">{sub.app_id}</td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.app_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.category}</td>
                          <td className="p-2 text-xs text-foreground">NT${sub.monthly_price_twd}</td>
                          <td className="p-2 text-xs text-foreground">US${sub.monthly_price_usd}</td>
                          <td className="p-2 text-xs text-foreground">{sub.creator}</td>
                          <td className="p-2 text-xs text-foreground">{sub.publish_date}</td>
                          <td className="p-2 text-xs">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sub.requires_official_api ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                              {sub.requires_official_api ? '是' : '否'}
                            </span>
                          </td>
                          <td className="p-2 text-xs">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sub.requires_api_token_oauth ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                              {sub.requires_api_token_oauth ? '是' : '否'}
                            </span>
                          </td>
                          <td className="p-2 text-xs">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sub.has_scenario_attachment ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                              {sub.has_scenario_attachment ? '是' : '否'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {productManagementSubmissions.length} 筆產品資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'referral-link-application' ? (
              referralLinkSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何申請資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">申請日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">填表人</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">申請人</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">身份類別</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">經銷商自用</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">套件選擇</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">直接寄送</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">E-mail</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">寄副本</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralLinkSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.filler}</td>
                          <td className="p-2 text-xs text-foreground">{sub.applicant_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.identity_type}</td>
                          <td className="p-2 text-xs text-foreground">{sub.is_dealer_self_use}</td>
                          <td className="p-2 text-xs text-foreground max-w-[200px] truncate" title={sub.selected_packages}>{sub.selected_packages}</td>
                          <td className="p-2 text-xs text-foreground">{sub.send_directly}</td>
                          <td className="p-2 text-xs text-foreground">{sub.applicant_email || '-'}</td>
                          <td className="p-2 text-xs text-foreground">{sub.send_copy_to_filler}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {referralLinkSubmissions.length} 筆申請資料
                  </div>
                </div>
              )
            ) : selectedForm?.path === 'project-contract' ? (
              projectContractSubmissions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  目前沒有任何合約資料
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">建立日期</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">所屬公司</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">甲方公司</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">專案名稱</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">金額</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">含稅</th>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">工作天數</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectContractSubmissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-2 text-xs text-foreground">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString('zh-TW') : '-'}
                          </td>
                          <td className="p-2 text-xs text-foreground">{sub.contract_company}</td>
                          <td className="p-2 text-xs text-foreground font-medium">{sub.party_a_company}</td>
                          <td className="p-2 text-xs text-foreground max-w-[200px] truncate" title={sub.project_name}>{sub.project_name}</td>
                          <td className="p-2 text-xs text-foreground">{sub.project_amount}</td>
                          <td className="p-2 text-xs text-foreground">{sub.amount_includes_tax}</td>
                          <td className="p-2 text-xs text-foreground">{sub.estimated_work_days}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-muted-foreground mt-3 text-right">
                    共 {projectContractSubmissions.length} 筆合約資料
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                此表單尚未支援查看提交內容
              </div>
            )}
          </DialogContent>
        </Dialog>

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">沒有找到符合的表單</p>
          </div>
        )}

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-card/80 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 group ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          aria-label="回到頂部"
        >
          <ArrowUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
