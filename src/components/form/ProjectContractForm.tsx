import React, { useState, useEffect } from 'react';
import GlassInput from './GlassInput';
import GlassTextarea from './GlassTextarea';
import GlassRadio from './GlassRadio';
import GlassCheckbox from './GlassCheckbox';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import { cn } from '@/lib/utils';
import { Send, ChevronLeft, ChevronRight, CheckCircle, Check, Building2, FileText, Package, Eye, Gift, Wrench, CreditCard } from 'lucide-react';
import { getFormOptionsFromDB, getPersistedFormOptions } from '@/data/forms';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProjectContractFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting: boolean;
}

// Grid radio component for 有/沒有 selections
const GridRadioSection: React.FC<{
  title: string;
  description?: string;
  items: string[];
  values: Record<string, string>;
  onChange: (item: string, value: string) => void;
  required?: boolean;
}> = ({ title, description, items, values, onChange, required }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium text-foreground/80">
        {title}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {description && (
        <ul className="text-xs text-muted-foreground mt-1.5 list-disc pl-4 space-y-0.5">
          <li>不確定的項目建議先勾選「有」，合約生成確認後可手動刪除</li>
          <li>沒有列在此的項目請再手動填寫</li>
        </ul>
      )}
    </div>
    <div className="border border-border/40 rounded-xl overflow-hidden bg-muted/10">
      <div className="grid grid-cols-[1fr_72px_72px] bg-muted/30 border-b border-border/30 px-4 py-2.5">
        <span className="text-xs font-semibold text-muted-foreground">項目</span>
        <span className="text-xs font-semibold text-muted-foreground text-center">有</span>
        <span className="text-xs font-semibold text-muted-foreground text-center">沒有</span>
      </div>
      {items.map((item, idx) => (
        <div
          key={item}
          className={cn(
            'grid grid-cols-[1fr_72px_72px] px-4 py-2.5 items-center transition-colors hover:bg-muted/20',
            idx !== items.length - 1 && 'border-b border-border/15'
          )}
        >
          <span className="text-sm text-foreground/85">{item}</span>
          <div className="flex justify-center">
            <input
              type="radio"
              name={`grid-${title}-${item}`}
              value="有"
              checked={values[item] === '有'}
              onChange={() => onChange(item, '有')}
              className="w-4 h-4 accent-[hsl(var(--primary))]"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="radio"
              name={`grid-${title}-${item}`}
              value="沒有"
              checked={values[item] === '沒有'}
              onChange={() => onChange(item, '沒有')}
              className="w-4 h-4 accent-[hsl(var(--primary))]"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DEFAULT_FREE_PACKAGES = ['LineOA', 'Google Sheet', 'Google Form', '各社群發佈權限'];
const DEFAULT_SMART4A_PACKAGES = [
  'LineRichMenu', 'LinePay', 'DifyAPI', '認證與編號生成器',
  'Line Flex 名片樣板', 'Ragic Plus', '財政部電子發票',
  'AI Voice 優聲學', 'LINE FLEX 會員卡掃碼系列', 'Meeting Wizard',
  'Whimsical', '黑貓Pay金流', '綠界金流支付', '藍新金流支付',
  'Threads', 'MitakeSMS 三竹簡訊',
];
const DEFAULT_PAID_PACKAGES = [
  'LineOA', 'MAKE', 'Jotform', 'OpenAI / Deepseek / etc',
  'Google Workspace', 'Ragic', 'OCR', '短網址',
];

const STEPS = [
  { id: 'basic', title: '基本資料', icon: Building2 },
  { id: 'project', title: '專案資訊', icon: FileText },
  { id: 'packages', title: '套件選擇', icon: Package },
  { id: 'confirm', title: '確認送出', icon: Eye },
];

const ProjectContractForm: React.FC<ProjectContractFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);

  // Options loaded from DB
  const [freePackageItems, setFreePackageItems] = useState<string[]>(DEFAULT_FREE_PACKAGES);
  const [smart4aPackageItems, setSmart4aPackageItems] = useState<string[]>(DEFAULT_SMART4A_PACKAGES);
  const [paidPackageItems, setPaidPackageItems] = useState<string[]>(DEFAULT_PAID_PACKAGES);

  useEffect(() => {
    const loadOptions = async () => {
      const dbOptions = await getFormOptionsFromDB('project-contract');
      const options = dbOptions || getPersistedFormOptions('project-contract');
      if (options) {
        if ((options as any).freePackages) {
          setFreePackageItems((options as any).freePackages.map((p: any) => p.label || p));
        }
        if ((options as any).smart4aPackages) {
          setSmart4aPackageItems((options as any).smart4aPackages.map((p: any) => p.label || p));
        }
        if ((options as any).paidPackages) {
          setPaidPackageItems((options as any).paidPackages.map((p: any) => p.label || p));
        }
      }
    };
    loadOptions();

    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.formPath === 'project-contract' && detail?.options) {
        const opts = detail.options;
        if (opts.freePackages) setFreePackageItems(opts.freePackages.map((p: any) => p.label || p));
        if (opts.smart4aPackages) setSmart4aPackageItems(opts.smart4aPackages.map((p: any) => p.label || p));
        if (opts.paidPackages) setPaidPackageItems(opts.paidPackages.map((p: any) => p.label || p));
      }
    };
    window.addEventListener('formOptionsUpdated', handleUpdate);
    return () => window.removeEventListener('formOptionsUpdated', handleUpdate);
  }, []);

  const [formData, setFormData] = useState({
    filler_email: '',
    contract_company: '',
    party_a_company: '',
    party_a_tax_id: '',
    party_a_contact: '',
    party_a_address: '',
    party_a_phone: '',
    party_a_fax: '',
    party_a_signer: '',
    project_name: '',
    project_amount: '',
    amount_includes_tax: '',
    estimated_work_days: '',
    project_content: '',
  });

  const [freePackageValues, setFreePackageValues] = useState<Record<string, string>>({});
  const [smart4aSelected, setSmart4aSelected] = useState<Record<string, boolean>>({});
  const [paidPackageValues, setPaidPackageValues] = useState<Record<string, string>>({});

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.filler_email.trim()) {
        newErrors.filler_email = '請填寫填表人 E-mail';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.filler_email)) {
        newErrors.filler_email = '請輸入有效的 E-mail';
      }
      if (!formData.contract_company) newErrors.contract_company = '請選擇合約所屬公司';
      if (!formData.party_a_company.trim()) newErrors.party_a_company = '請填寫甲方公司名稱';
      if (!formData.party_a_tax_id.trim()) newErrors.party_a_tax_id = '請填寫甲方統編';
      if (!formData.party_a_contact.trim()) newErrors.party_a_contact = '請填寫甲方負責人姓名';
      if (!formData.party_a_address.trim()) newErrors.party_a_address = '請填寫甲方公司地址';
      if (!formData.party_a_phone.trim()) newErrors.party_a_phone = '請填寫甲方公司電話號碼';
    }

    if (step === 1) {
      if (!formData.project_name.trim()) newErrors.project_name = '請填寫專案名稱/合約標的';
      if (!formData.project_amount.trim()) newErrors.project_amount = '請填寫專案金額';
      if (!formData.amount_includes_tax) newErrors.amount_includes_tax = '請選擇是否含稅';
      if (!formData.estimated_work_days.trim()) newErrors.estimated_work_days = '請填寫預估工作天數';
      if (!formData.project_content.trim()) newErrors.project_content = '請填寫專案建置內容';
    }

    if (step === 2) {
      const missingFree = freePackageItems.some(item => !freePackageValues[item]);
      if (missingFree) newErrors.free_packages = '請完成所有免費套件選擇';
      const missingPaid = paidPackageItems.some(item => !paidPackageValues[item]);
      if (missingPaid) newErrors.paid_packages = '請完成所有已知額外付費項目選擇';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildPayload = () => {
    const selectedSmart4a = Object.entries(smart4aSelected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    return {
      ...formData,
      contract_type: '專案建置合約',
      free_packages: freePackageValues,
      smart4a_packages: selectedSmart4a,
      paid_packages: paidPackageValues,
    };
  };

  const handleConfirmSubmit = () => {
    onSubmit(buildPayload());
  };

  const renderPackageConfirmation = (values: Record<string, string>) => {
    const hasItems = Object.entries(values).filter(([, v]) => v === '有').map(([k]) => k);
    const noItems = Object.entries(values).filter(([, v]) => v === '沒有').map(([k]) => k);
    return (
      <>
        {hasItems.length > 0 && (
          <div className="confirmation-item">
            <span className="confirmation-label">有</span>
            <span className="confirmation-value text-xs">{hasItems.join('、')}</span>
          </div>
        )}
        {noItems.length > 0 && (
          <div className="confirmation-item">
            <span className="confirmation-label">沒有</span>
            <span className="confirmation-value text-xs text-muted-foreground">{noItems.join('、')}</span>
          </div>
        )}
      </>
    );
  };

  // ========== Step Indicator ==========
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1.5 mb-8">
      {STEPS.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const StepIcon = step.icon;
        return (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => {
                if (isCompleted) setCurrentStep(index);
              }}
              disabled={!isCompleted}
              className={cn(
                'step-pill',
                isActive && 'step-pill-active',
                isCompleted && 'step-pill-completed cursor-pointer',
                !isActive && !isCompleted && 'step-pill-inactive'
              )}
            >
              {isCompleted ? (
                <span className="step-pill-number">
                  <Check className="w-3 h-3" />
                </span>
              ) : (
                <span className="step-pill-number">{index + 1}</span>
              )}
              <span className="step-pill-title hidden sm:inline">{step.title}</span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'w-4 sm:w-8 h-[2px] rounded-full transition-colors duration-300',
                  index < currentStep ? 'bg-[hsl(270_50%_45%)]' : 'bg-border'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // ========== Section Header ==========
  const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string }> = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 pb-4 mb-2 border-b border-border/30">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  );

  // ========== Step 1: 基本資料 ==========
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <SectionHeader icon={Building2} title="基本資料" subtitle="合約甲方相關資訊" />

      <GlassInput
        label="填表人 E-mail"
        name="filler_email"
        type="email"
        placeholder="請輸入您的電子郵件"
        value={formData.filler_email}
        onChange={(e) => updateField('filler_email', e.target.value)}
        required
        error={errors.filler_email}
      />

      <GlassRadio
        name="contract_company"
        label="合約所屬公司"
        options={[
          { value: '禹動 Smart4A', label: '禹動 Smart4A' },
          { value: '炘世紀 Simsix', label: '炘世紀 Simsix' },
        ]}
        value={formData.contract_company}
        onChange={(v) => updateField('contract_company', v)}
        required
        error={errors.contract_company}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassInput
          label="甲方公司名稱"
          name="party_a_company"
          placeholder="請輸入甲方公司名稱"
          value={formData.party_a_company}
          onChange={(e) => updateField('party_a_company', e.target.value)}
          required
          error={errors.party_a_company}
        />
        <GlassInput
          label="甲方統編"
          name="party_a_tax_id"
          placeholder="請輸入甲方統編"
          value={formData.party_a_tax_id}
          onChange={(e) => updateField('party_a_tax_id', e.target.value)}
          required
          error={errors.party_a_tax_id}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassInput
          label="甲方負責人姓名"
          name="party_a_contact"
          placeholder="請輸入甲方負責人姓名"
          value={formData.party_a_contact}
          onChange={(e) => updateField('party_a_contact', e.target.value)}
          required
          error={errors.party_a_contact}
        />
        <GlassInput
          label="甲方簽約代表"
          name="party_a_signer"
          placeholder="選填"
          value={formData.party_a_signer}
          onChange={(e) => updateField('party_a_signer', e.target.value)}
        />
      </div>

      <GlassInput
        label="甲方公司地址"
        name="party_a_address"
        placeholder="請輸入甲方公司地址"
        value={formData.party_a_address}
        onChange={(e) => updateField('party_a_address', e.target.value)}
        required
        error={errors.party_a_address}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassInput
          label="甲方公司電話號碼"
          name="party_a_phone"
          placeholder="請輸入甲方公司電話號碼"
          value={formData.party_a_phone}
          onChange={(e) => updateField('party_a_phone', e.target.value)}
          required
          error={errors.party_a_phone}
        />
        <GlassInput
          label="甲方公司傳真號碼"
          name="party_a_fax"
          placeholder="選填"
          value={formData.party_a_fax}
          onChange={(e) => updateField('party_a_fax', e.target.value)}
        />
      </div>
    </div>
  );

  // ========== Step 2: 專案資訊 ==========
  const renderProjectInfo = () => (
    <div className="space-y-6">
      <SectionHeader icon={FileText} title="專案建置合約" subtitle="專案詳細資訊" />

      <GlassInput
        label="專案名稱 / 合約標的"
        name="project_name"
        placeholder="請輸入專案名稱或合約標的"
        value={formData.project_name}
        onChange={(e) => updateField('project_name', e.target.value)}
        required
        error={errors.project_name}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassInput
          label="專案金額"
          name="project_amount"
          placeholder="請輸入金額"
          value={formData.project_amount}
          onChange={(e) => updateField('project_amount', e.target.value)}
          required
          error={errors.project_amount}
        />
        <GlassRadio
          name="amount_includes_tax"
          label="金額是否含稅"
          options={[
            { value: '是', label: '是' },
            { value: '否', label: '否' },
          ]}
          value={formData.amount_includes_tax}
          onChange={(v) => updateField('amount_includes_tax', v)}
          required
          error={errors.amount_includes_tax}
        />
        <GlassInput
          label="預估工作天數"
          name="estimated_work_days"
          placeholder="例：30"
          value={formData.estimated_work_days}
          onChange={(e) => updateField('estimated_work_days', e.target.value)}
          required
          error={errors.estimated_work_days}
        />
      </div>

      <GlassTextarea
        label="專案建置內容"
        name="project_content"
        placeholder={`請條列式換行簡述，例如：\n透過 LineOA 及 Google Sheet、Google Form 作為智慧客服及案件管理工具。\n客戶透過 Google Form 填寫申請單位資料及上傳檔案；公司內部透過 Google Form 記錄收支。`}
        value={formData.project_content}
        onChange={(e) => updateField('project_content', e.target.value)}
        rows={6}
        required
        error={errors.project_content}
      />
    </div>
  );

  // ========== Step 3: 套件選擇 ==========
  const renderPackages = () => {
    const freeCount = Object.values(freePackageValues).filter(Boolean).length;
    const smart4aCount = Object.values(smart4aSelected).filter(Boolean).length;
    const paidCount = Object.values(paidPackageValues).filter(Boolean).length;

    return (
    <div className="space-y-6">
      <SectionHeader icon={Package} title="套件選擇" subtitle="選擇專案使用的套件與服務" />

      <Accordion type="multiple" defaultValue={['free', 'smart4a', 'paid']} className="space-y-3">
        {/* 免費套件 */}
        <AccordionItem value="free" className="border border-border/40 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 [&[data-state=open]>div>.acc-badge]:bg-primary/15">
            <div className="flex items-center gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-foreground">免費套件</span>
                <span className="text-destructive ml-0.5">*</span>
              </div>
              {freeCount > 0 && (
                <span className="acc-badge text-[10px] font-medium bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                  已填 {freeCount}/{freePackageItems.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1">
            <ul className="text-xs text-muted-foreground mb-3 list-disc pl-4 space-y-0.5">
              <li>不確定的項目建議先勾選「有」，合約生成確認後可手動刪除</li>
              <li>沒有列在此的項目請再手動填寫</li>
            </ul>
            <div className="border border-border/40 rounded-xl overflow-hidden bg-muted/10">
              <div className="grid grid-cols-[1fr_72px_72px] bg-muted/30 border-b border-border/30 px-4 py-2.5">
                <span className="text-xs font-semibold text-muted-foreground">項目</span>
                <span className="text-xs font-semibold text-muted-foreground text-center">有</span>
                <span className="text-xs font-semibold text-muted-foreground text-center">沒有</span>
              </div>
              {freePackageItems.map((item, idx) => (
                <div
                  key={item}
                  className={cn(
                    'grid grid-cols-[1fr_72px_72px] px-4 py-2.5 items-center transition-colors hover:bg-muted/20',
                    idx !== freePackageItems.length - 1 && 'border-b border-border/15'
                  )}
                >
                  <span className="text-sm text-foreground/85">{item}</span>
                  <div className="flex justify-center">
                    <input type="radio" name={`grid-free-${item}`} value="有" checked={freePackageValues[item] === '有'} onChange={() => { setFreePackageValues(prev => ({ ...prev, [item]: '有' })); if (errors.free_packages) setErrors(prev => ({ ...prev, free_packages: '' })); }} className="w-4 h-4 accent-[hsl(var(--primary))]" />
                  </div>
                  <div className="flex justify-center">
                    <input type="radio" name={`grid-free-${item}`} value="沒有" checked={freePackageValues[item] === '沒有'} onChange={() => { setFreePackageValues(prev => ({ ...prev, [item]: '沒有' })); if (errors.free_packages) setErrors(prev => ({ ...prev, free_packages: '' })); }} className="w-4 h-4 accent-[hsl(var(--primary))]" />
                  </div>
                </div>
              ))}
            </div>
            {errors.free_packages && (
              <p className="text-xs text-destructive mt-2">{errors.free_packages}</p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Smart4A 開發套件 */}
        <AccordionItem value="smart4a" className="border border-border/40 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20">
            <div className="flex items-center gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-foreground">Smart4A 開發套件</span>
              </div>
              {smart4aCount > 0 && (
                <span className="text-[10px] font-medium bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                  已選 {smart4aCount} 項
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1">
            <ul className="text-xs text-muted-foreground mb-3 list-disc pl-4 space-y-0.5">
              <li>不確定的項目建議先勾選，合約生成確認後可手動刪除</li>
              <li>沒有列在此的項目請再手動填寫</li>
            </ul>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {smart4aPackageItems.map(item => (
                <GlassCheckbox
                  key={item}
                  name={`smart4a-${item}`}
                  label={item}
                  checked={smart4aSelected[item] || false}
                  onChange={(e) => setSmart4aSelected(prev => ({ ...prev, [item]: e.target.checked }))}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 已知額外付費項目 */}
        <AccordionItem value="paid" className="border border-border/40 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20">
            <div className="flex items-center gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-foreground">已知額外付費項目</span>
                <span className="text-destructive ml-0.5">*</span>
              </div>
              {paidCount > 0 && (
                <span className="text-[10px] font-medium bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                  已填 {paidCount}/{paidPackageItems.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1">
            <ul className="text-xs text-muted-foreground mb-3 list-disc pl-4 space-y-0.5">
              <li>不確定的項目建議先勾選「有」，合約生成確認後可手動刪除</li>
              <li>沒有列在此的項目請再手動填寫</li>
            </ul>
            <div className="border border-border/40 rounded-xl overflow-hidden bg-muted/10">
              <div className="grid grid-cols-[1fr_72px_72px] bg-muted/30 border-b border-border/30 px-4 py-2.5">
                <span className="text-xs font-semibold text-muted-foreground">項目</span>
                <span className="text-xs font-semibold text-muted-foreground text-center">有</span>
                <span className="text-xs font-semibold text-muted-foreground text-center">沒有</span>
              </div>
              {paidPackageItems.map((item, idx) => (
                <div
                  key={item}
                  className={cn(
                    'grid grid-cols-[1fr_72px_72px] px-4 py-2.5 items-center transition-colors hover:bg-muted/20',
                    idx !== paidPackageItems.length - 1 && 'border-b border-border/15'
                  )}
                >
                  <span className="text-sm text-foreground/85">{item}</span>
                  <div className="flex justify-center">
                    <input type="radio" name={`grid-paid-${item}`} value="有" checked={paidPackageValues[item] === '有'} onChange={() => { setPaidPackageValues(prev => ({ ...prev, [item]: '有' })); if (errors.paid_packages) setErrors(prev => ({ ...prev, paid_packages: '' })); }} className="w-4 h-4 accent-[hsl(var(--primary))]" />
                  </div>
                  <div className="flex justify-center">
                    <input type="radio" name={`grid-paid-${item}`} value="沒有" checked={paidPackageValues[item] === '沒有'} onChange={() => { setPaidPackageValues(prev => ({ ...prev, [item]: '沒有' })); if (errors.paid_packages) setErrors(prev => ({ ...prev, paid_packages: '' })); }} className="w-4 h-4 accent-[hsl(var(--primary))]" />
                  </div>
                </div>
              ))}
            </div>
            {errors.paid_packages && (
              <p className="text-xs text-destructive mt-2">{errors.paid_packages}</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
    );
  };

  // ========== Step 4: 確認 ==========
  const renderConfirmation = () => {
    const selectedSmart4a = Object.entries(smart4aSelected).filter(([, v]) => v).map(([k]) => k);

    return (
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/15 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">確認合約資料</h2>
            <p className="text-xs text-muted-foreground mt-1">請確認以下資訊無誤後送出</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="confirmation-card">
            <div className="confirmation-card-header">
              <span className="confirmation-card-number">1</span>
              <span>基本資料</span>
            </div>
            <div className="confirmation-card-content">
              <div className="confirmation-item">
                <span className="confirmation-label">合約所屬公司</span>
                <span className="confirmation-value">{formData.contract_company}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">甲方公司名稱</span>
                <span className="confirmation-value">{formData.party_a_company}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">甲方統編</span>
                <span className="confirmation-value font-mono">{formData.party_a_tax_id}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">甲方負責人</span>
                <span className="confirmation-value">{formData.party_a_contact}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">甲方地址</span>
                <span className="confirmation-value text-right max-w-[60%]">{formData.party_a_address}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">甲方電話</span>
                <span className="confirmation-value">{formData.party_a_phone}</span>
              </div>
              {formData.party_a_fax && (
                <div className="confirmation-item">
                  <span className="confirmation-label">甲方傳真</span>
                  <span className="confirmation-value">{formData.party_a_fax}</span>
                </div>
              )}
              {formData.party_a_signer && (
                <div className="confirmation-item">
                  <span className="confirmation-label">簽約代表</span>
                  <span className="confirmation-value">{formData.party_a_signer}</span>
                </div>
              )}
            </div>
          </div>

          <div className="confirmation-card">
            <div className="confirmation-card-header">
              <span className="confirmation-card-number">2</span>
              <span>專案資訊</span>
            </div>
            <div className="confirmation-card-content">
              <div className="confirmation-item">
                <span className="confirmation-label">專案名稱</span>
                <span className="confirmation-value text-right max-w-[60%]">{formData.project_name}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">專案金額</span>
                <span className="confirmation-value">{formData.project_amount}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">含稅</span>
                <span className="confirmation-value">{formData.amount_includes_tax}</span>
              </div>
              <div className="confirmation-item">
                <span className="confirmation-label">預估工作天數</span>
                <span className="confirmation-value">{formData.estimated_work_days}</span>
              </div>
              <div className="pt-1.5">
                <span className="confirmation-label block mb-1">專案建置內容</span>
                <p className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed bg-muted/20 rounded-lg p-3">{formData.project_content}</p>
              </div>
            </div>
          </div>

          <div className="confirmation-card">
            <div className="confirmation-card-header">
              <span className="confirmation-card-number">3</span>
              <span>套件選擇</span>
            </div>
            <div className="confirmation-card-content space-y-3">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">免費套件</p>
                {renderPackageConfirmation(freePackageValues)}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Smart4A 開發套件</p>
                {selectedSmart4a.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedSmart4a.map(item => (
                      <span key={item} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        <Check className="w-3 h-3" />
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">未選擇</p>
                )}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">已知額外付費項目</p>
                {renderPackageConfirmation(paidPackageValues)}
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          點擊「確認送出」即表示您確認以上資料無誤
        </p>
      </div>
    );
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderProjectInfo();
      case 2: return renderPackages();
      case 3: return renderConfirmation();
      default: return null;
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="space-y-6">
      {renderStepIndicator()}

      <div className="animate-fade-in" key={currentStep}>
        {getStepContent()}
      </div>

      <div className="flex justify-between gap-4 pt-2">
        <GlassButton
          type="button"
          variant="outline"
          onClick={goToPrevious}
          disabled={currentStep === 0}
          className={cn(currentStep === 0 && 'invisible')}
        >
          <ChevronLeft className="w-4 h-4" />
          上一步
        </GlassButton>

        {isLastStep ? (
          <GlassButton
            type="button"
            variant="gradient"
            onClick={handleConfirmSubmit}
            loading={isSubmitting}
          >
            <Send className="w-4 h-4" />
            確認送出
          </GlassButton>
        ) : (
          <GlassButton type="button" variant="gradient" onClick={goToNext}>
            {currentStep === 2 ? (
              <>
                <Eye className="w-4 h-4" />
                預覽確認
              </>
            ) : (
              <>
                下一步
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </GlassButton>
        )}
      </div>
    </div>
  );
};

export default ProjectContractForm;
