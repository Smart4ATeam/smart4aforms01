import React, { useState, useEffect, useRef } from 'react';
import GlassInput from './GlassInput';
import GlassSelect from './GlassSelect';
import GlassRadio from './GlassRadio';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import { Upload, X, Image, FileText } from 'lucide-react';
import { getFormOptionsFromDB, getPersistedFormOptions, FORM_OPTIONS_UPDATED_EVENT } from '@/data/forms';
import type { FormOptionsConfig } from '@/data/forms';

interface ProductManagementFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

const DEFAULT_CATEGORIES = [
  { value: 'CRM', label: 'CRM' },
  { value: 'ERP', label: 'ERP' },
  { value: 'HR', label: 'HR' },
  { value: '行銷', label: '行銷' },
  { value: '財務', label: '財務' },
  { value: '其他', label: '其他' },
];

const DEFAULT_CREATORS = [
  { value: '丁禹勝', label: '丁禹勝' },
  { value: '張元俊', label: '張元俊' },
  { value: '廖辰豐', label: '廖辰豐' },
  { value: '曹逸湘', label: '曹逸湘' },
];

const DEFAULT_PRICE_TIERS = [
  { twd: 0, usd: 0 },
  { twd: 100, usd: 3.99 },
  { twd: 150, usd: 4.99 },
  { twd: 200, usd: 6.99 },
  { twd: 250, usd: 8.99 },
  { twd: 300, usd: 9.99 },
  { twd: 500, usd: 17.99 },
  { twd: 700, usd: 22.99 },
  { twd: 800, usd: 28.99 },
  { twd: 1000, usd: 39.99 },
];

const ProductManagementForm: React.FC<ProductManagementFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    requiresOfficialApi: '',
    requiresApiTokenOauth: '',
    hasScenarioAttachment: '',
    publishDate: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [appImageFile, setAppImageFile] = useState<File | null>(null);
  const [appImagePreview, setAppImagePreview] = useState<string | null>(null);
  const [scenarioFile, setScenarioFile] = useState<File | null>(null);
  const appImageInputRef = useRef<HTMLInputElement>(null);
  const scenarioInputRef = useRef<HTMLInputElement>(null);
  const [creatorOther, setCreatorOther] = useState('');

  // Dynamic options
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [creators, setCreators] = useState(DEFAULT_CREATORS);
  const [priceTiers, setPriceTiers] = useState(DEFAULT_PRICE_TIERS);

  useEffect(() => {
    const loadOptions = async () => {
      const dbOpts = await getFormOptionsFromDB('product-management');
      const localOpts = getPersistedFormOptions('product-management');
      const opts: FormOptionsConfig = dbOpts || localOpts || {};
      if ((opts as any).categories) setCategories((opts as any).categories);
      if ((opts as any).creators) setCreators((opts as any).creators);
      if ((opts as any).priceTiers) setPriceTiers((opts as any).priceTiers);
    };
    loadOptions();

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.formPath === 'product-management' && detail?.options) {
        if (detail.options.categories) setCategories(detail.options.categories);
        if (detail.options.creators) setCreators(detail.options.creators);
        if (detail.options.priceTiers) setPriceTiers(detail.options.priceTiers);
      }
    };
    window.addEventListener(FORM_OPTIONS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(FORM_OPTIONS_UPDATED_EVENT, handler);
  }, []);

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handleAppImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, appImage: '檔案大小不可超過 10MB' }));
      return;
    }
    setAppImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAppImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    if (errors.appImage) setErrors(prev => { const n = { ...prev }; delete n.appImage; return n; });
  };

  const handleScenarioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, scenarioFile: '檔案大小不可超過 10MB' }));
      return;
    }
    setScenarioFile(file);
    if (errors.scenarioFile) setErrors(prev => { const n = { ...prev }; delete n.scenarioFile; return n; });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.appId?.trim()) e.appId = '請輸入 APP ID';
    if (!formData.appName?.trim()) e.appName = '請輸入 APP 名稱';
    if (!formData.category) e.category = '請選擇類別';
    if (formData.monthlyPriceTwd == null && formData.monthlyPriceTwd !== 0) e.monthlyPriceTwd = '請選擇方案月單價';
    if (!formData.creator) e.creator = '請選擇製作者';
    if (formData.creator === '其他' && !creatorOther.trim()) e.creatorOther = '請輸入製作者姓名';
    if (!formData.publishDate) e.publishDate = '請選擇製作日期';
    if (!formData.requiresOfficialApi) e.requiresOfficialApi = '請選擇';
    if (!formData.requiresApiTokenOauth) e.requiresApiTokenOauth = '請選擇';
    if (!formData.installLink?.trim()) e.installLink = '請輸入安裝連結';
    if (!formData.hasScenarioAttachment) e.hasScenarioAttachment = '請選擇';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert files to base64
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const actualCreator = formData.creator === '其他' ? creatorOther : formData.creator;

    const payload: Record<string, any> = {
      appId: formData.appId,
      appName: formData.appName,
      category: formData.category,
      monthlyPriceTwd: Number(formData.monthlyPriceTwd),
      monthlyPriceUsd: Number(formData.monthlyPriceUsd),
      creator: actualCreator,
      publishDate: formData.publishDate,
      requiresOfficialApi: formData.requiresOfficialApi === '是',
      requiresApiTokenOauth: formData.requiresApiTokenOauth === '是',
      installLink: formData.installLink,
      docLink: formData.docLink || '',
      hasScenarioAttachment: formData.hasScenarioAttachment === '是',
    };

    if (appImageFile) {
      payload.appImageBase64 = await toBase64(appImageFile);
      payload.appImageFilename = appImageFile.name;
    }

    if (formData.hasScenarioAttachment === '是' && scenarioFile) {
      payload.scenarioFileBase64 = await toBase64(scenarioFile);
      payload.scenarioFilename = scenarioFile.name;
    }

    onSubmit(payload);
  };

  const creatorOptions = [
    ...creators,
    { value: '其他', label: '其他' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本資訊 */}
      <GlassCard className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 mb-3">📦 產品基本資訊</h3>
        
        <GlassInput
          label="APP ID"
          name="appId"
          placeholder="請輸入 APP ID"
          value={formData.appId || ''}
          onChange={e => updateField('appId', e.target.value)}
          error={errors.appId}
          required
        />

        <GlassInput
          label="APP 名稱"
          name="appName"
          placeholder="請輸入 APP 名稱"
          value={formData.appName || ''}
          onChange={e => updateField('appName', e.target.value)}
          error={errors.appName}
          required
        />

        <GlassSelect
          label="類別"
          name="category"
          placeholder="請選擇類別"
          options={categories}
          value={formData.category || ''}
          onChange={e => updateField('category', e.target.value)}
          error={errors.category}
          required
        />
      </GlassCard>

      {/* 定價 */}
      <GlassCard className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 mb-3">💰 定價資訊</h3>

        <GlassSelect
          label="方案月單價"
          name="priceTier"
          placeholder="請選擇方案月單價"
          options={priceTiers.map(p => ({
            value: `${p.twd}|${p.usd}`,
            label: `NT$${p.twd} / US$${p.usd}`,
          }))}
          value={formData.monthlyPriceTwd != null && formData.monthlyPriceUsd != null ? `${formData.monthlyPriceTwd}|${formData.monthlyPriceUsd}` : ''}
          onChange={e => {
            const [twd, usd] = e.target.value.split('|').map(Number);
            updateField('monthlyPriceTwd', twd);
            updateField('monthlyPriceUsd', usd);
          }}
          error={errors.monthlyPriceTwd}
          required
        />
      </GlassCard>

      {/* 製作者與日期 */}
      <GlassCard className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 mb-3">👤 製作者與日期</h3>

        <GlassRadio
          name="creator"
          label="APP 製作者"
          options={creatorOptions}
          value={formData.creator || ''}
          onChange={val => updateField('creator', val)}
          error={errors.creator}
          required
        />

        {formData.creator === '其他' && (
          <GlassInput
            label="請輸入製作者姓名"
            name="creatorOther"
            placeholder="請填寫中文姓名"
            value={creatorOther}
            onChange={e => {
              setCreatorOther(e.target.value);
              if (errors.creatorOther) setErrors(prev => { const n = { ...prev }; delete n.creatorOther; return n; });
            }}
            error={errors.creatorOther}
            required
          />
        )}

        <GlassInput
          label="製作日期/上架日期"
          name="publishDate"
          type="date"
          value={formData.publishDate || ''}
          onChange={e => updateField('publishDate', e.target.value)}
          error={errors.publishDate}
          required
        />
      </GlassCard>

      {/* 技術規格 */}
      <GlassCard className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 mb-3">⚙️ 技術規格</h3>

        <GlassRadio
          name="requiresOfficialApi"
          label="是否需官方 API 授權"
          options={[
            { value: '是', label: '是' },
            { value: '否', label: '否' },
          ]}
          value={formData.requiresOfficialApi}
          onChange={val => updateField('requiresOfficialApi', val)}
          error={errors.requiresOfficialApi}
          required
        />

        <GlassRadio
          name="requiresApiTokenOauth"
          label="是否額外申請 API Token 或進行 OAuth 2 認證"
          options={[
            { value: '是', label: '是' },
            { value: '否', label: '否' },
          ]}
          value={formData.requiresApiTokenOauth}
          onChange={val => updateField('requiresApiTokenOauth', val)}
          error={errors.requiresApiTokenOauth}
          required
        />

        <GlassInput
          label="安裝連結"
          name="installLink"
          type="url"
          placeholder="請輸入安裝連結"
          value={formData.installLink || ''}
          onChange={e => updateField('installLink', e.target.value)}
          error={errors.installLink}
          required
        />

        <GlassInput
          label="說明資料連結"
          name="docLink"
          type="url"
          placeholder="請輸入說明資料連結（選填）"
          value={formData.docLink || ''}
          onChange={e => updateField('docLink', e.target.value)}
        />
      </GlassCard>

      {/* 附件 */}
      <GlassCard className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 mb-3">📎 檔案附件</h3>

        {/* APP 圖檔 */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-foreground/70">
            APP 圖檔
          </label>
          <p className="text-xs text-muted-foreground">可上傳 1 個支援的檔案 (image)，大小上限為 10 MB。</p>
          <input
            ref={appImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleAppImageChange}
            className="hidden"
          />
          {appImagePreview ? (
            <div className="relative inline-block">
              <img src={appImagePreview} alt="APP 圖檔預覽" className="w-24 h-24 object-cover rounded-lg border border-border" />
              <button
                type="button"
                onClick={() => { setAppImageFile(null); setAppImagePreview(null); }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => appImageInputRef.current?.click()}
              className="glass-input flex items-center gap-2 cursor-pointer hover:bg-accent/10 transition-colors w-fit px-4 py-2"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">新增檔案</span>
            </button>
          )}
          {errors.appImage && <p className="text-xs text-destructive">{errors.appImage}</p>}
        </div>

        {/* 是否有附件場景 */}
        <GlassRadio
          name="hasScenarioAttachment"
          label="是否有附件場景"
          options={[
            { value: '是', label: '是' },
            { value: '否', label: '否' },
          ]}
          value={formData.hasScenarioAttachment}
          onChange={val => updateField('hasScenarioAttachment', val)}
          error={errors.hasScenarioAttachment}
          required
        />

        {/* 上傳附件場景 */}
        {formData.hasScenarioAttachment === '是' && (
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground/70">
              上傳附件場景
            </label>
            <p className="text-xs text-muted-foreground">可上傳場景 JSON 檔案，大小上限為 10 MB。</p>
            <input
              ref={scenarioInputRef}
              type="file"
              accept=".json,.blueprint,.txt,.zip"
              onChange={handleScenarioFileChange}
              className="hidden"
            />
            {scenarioFile ? (
              <div className="flex items-center gap-2 glass-input w-fit px-4 py-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{scenarioFile.name}</span>
                <button
                  type="button"
                  onClick={() => setScenarioFile(null)}
                  className="w-4 h-4 text-destructive hover:text-destructive/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => scenarioInputRef.current?.click()}
                className="glass-input flex items-center gap-2 cursor-pointer hover:bg-accent/10 transition-colors w-fit px-4 py-2"
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">新增檔案</span>
              </button>
            )}
            {errors.scenarioFile && <p className="text-xs text-destructive">{errors.scenarioFile}</p>}
          </div>
        )}
      </GlassCard>

      <GlassButton
        type="submit"
        variant="gradient"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        提交產品資料
      </GlassButton>
    </form>
  );
};

export default ProductManagementForm;
