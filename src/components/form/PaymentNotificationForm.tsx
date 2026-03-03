import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import { 
  User, 
  CreditCard,
  Upload,
  FileText,
  X
} from 'lucide-react';

interface PaymentNotificationFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

const PaymentNotificationForm: React.FC<PaymentNotificationFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [searchParams] = useSearchParams();

  // Form state
  const [nameOrCompany, setNameOrCompany] = useState('');
  const [email, setEmail] = useState('');
  const [productService, setProductService] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountLast5, setAccountLast5] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Read prefill params from URL
  useEffect(() => {
    const orderParam = searchParams.get('orderNumber') || searchParams.get('order');
    const nameParam = searchParams.get('nameOrCompany') || searchParams.get('name');
    const emailParam = searchParams.get('email');
    const productParam = searchParams.get('productService') || searchParams.get('product');
    const amountParam = searchParams.get('paymentAmount') || searchParams.get('amount');

    if (orderParam) setOrderNumber(orderParam);
    if (nameParam) setNameOrCompany(nameParam);
    if (emailParam) setEmail(emailParam);
    if (productParam) setProductService(productParam);
    if (amountParam) setPaymentAmount(amountParam);
  }, [searchParams]);

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, proofFile: '檔案大小不可超過 5MB' }));
        return;
      }
      
      setProofFile(file);
      clearError('proofFile');
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setProofPreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setProofFile(null);
    setProofPreview(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nameOrCompany.trim()) {
      newErrors.nameOrCompany = '請輸入姓名或公司行號';
    }

    if (!email.trim()) {
      newErrors.email = '請輸入電子郵件信箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }

    if (!productService.trim()) {
      newErrors.productService = '請輸入產品/服務';
    }

    if (!paymentDate) {
      newErrors.paymentDate = '請選擇匯款日期';
    }

    if (!paymentAmount.trim()) {
      newErrors.paymentAmount = '請輸入匯款金額';
    } else if (isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
      newErrors.paymentAmount = '請輸入有效的金額';
    }

    if (!bankName.trim()) {
      newErrors.bankName = '請輸入匯款銀行';
    }

    if (!accountLast5.trim()) {
      newErrors.accountLast5 = '請輸入帳號末五碼';
    } else if (!/^\d{5}$/.test(accountLast5)) {
      newErrors.accountLast5 = '帳號末五碼必須為 5 位數字';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert file to base64 if exists
    let proofBase64 = '';
    if (proofFile) {
      proofBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(proofFile);
      });
    }

    const formData: Record<string, any> = {
      nameOrCompany,
      email,
      productService,
      paymentDate,
      paymentAmount: Number(paymentAmount),
      bankName,
      accountLast5,
      orderNumber: orderNumber.trim() || '',
      proofFileName: proofFile?.name || '',
      proofFileBase64: proofBase64,
      submittedAt: new Date().toISOString(),
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本資訊區塊 */}
      <GlassCard className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-md shadow-primary/20">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">基本資訊</h3>
        </div>

        <GlassInput
          label="姓名/公司行號"
          value={nameOrCompany}
          onChange={(e) => {
            setNameOrCompany(e.target.value);
            clearError('nameOrCompany');
          }}
          placeholder="請輸入姓名或公司行號"
          required
          error={errors.nameOrCompany}
        />

        <GlassInput
          label="電子郵件信箱"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError('email');
          }}
          placeholder="請輸入電子郵件信箱"
          required
          error={errors.email}
        />

        <GlassInput
          label="訂單編號"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="請輸入訂單編號（選填）"
        />

        <GlassInput
          label="產品/服務"
          value={productService}
          onChange={(e) => {
            setProductService(e.target.value);
            clearError('productService');
          }}
          placeholder="請輸入購買的產品或服務"
          required
          error={errors.productService}
        />
      </GlassCard>

      {/* 匯款資訊區塊 */}
      <GlassCard className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-md shadow-primary/20">
            <CreditCard className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">匯款資訊</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GlassInput
            label="匯款日期"
            type="date"
            value={paymentDate}
            onChange={(e) => {
              setPaymentDate(e.target.value);
              clearError('paymentDate');
            }}
            required
            error={errors.paymentDate}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground/70">
              匯款金額<span className="text-destructive ml-0.5">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => {
                  setPaymentAmount(e.target.value);
                  clearError('paymentAmount');
                }}
                placeholder="請輸入金額"
                className={`glass-input pr-14 ${errors.paymentAmount ? 'border-destructive focus:border-destructive' : ''}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                TWD
              </span>
            </div>
            {errors.paymentAmount && (
              <p className="text-xs text-destructive mt-1">{errors.paymentAmount}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GlassInput
            label="匯款銀行"
            value={bankName}
            onChange={(e) => {
              setBankName(e.target.value);
              clearError('bankName');
            }}
            placeholder="例如：台新銀行、中國信託"
            required
            error={errors.bankName}
          />

          <GlassInput
            label="帳號末五碼"
            value={accountLast5}
            onChange={(e) => {
              // Only allow digits
              const value = e.target.value.replace(/\D/g, '').slice(0, 5);
              setAccountLast5(value);
              clearError('accountLast5');
            }}
            placeholder="請輸入帳號末五碼"
            required
            error={errors.accountLast5}
            maxLength={5}
          />
        </div>
      </GlassCard>

      {/* 匯款證明區塊 */}
      <GlassCard className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-md shadow-primary/20">
            <Upload className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">匯款證明</h3>
          <span className="text-sm text-muted-foreground">（選填）</span>
        </div>

        {!proofFile ? (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-primary/60" />
              <p className="mb-2 text-sm text-foreground/80">
                <span className="font-semibold">瀏覽文檔</span>
              </p>
              <p className="text-xs text-muted-foreground">Drag and drop files here</p>
              <p className="text-xs text-muted-foreground mt-1">支援 JPG、PNG、PDF（最大 5MB）</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="relative p-4 bg-primary/5 rounded-xl border border-primary/20">
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 p-1 rounded-full bg-destructive/20 hover:bg-destructive/30 transition-colors"
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
            
            {proofPreview ? (
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={proofPreview} 
                  alt="匯款證明預覽" 
                  className="max-h-40 rounded-lg object-contain"
                />
                <p className="text-sm text-foreground/80">{proofFile.name}</p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{proofFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(proofFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {errors.proofFile && (
          <p className="text-sm text-destructive">{errors.proofFile}</p>
        )}
      </GlassCard>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <GlassButton
          type="submit"
          disabled={isSubmitting}
          className="px-12 py-3"
        >
          {isSubmitting ? '送出中...' : '送出通知'}
        </GlassButton>
      </div>
    </form>
  );
};

export default PaymentNotificationForm;
