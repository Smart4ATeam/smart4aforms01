import React, { useState, useRef } from 'react';
import GlassInput from './GlassInput';
import GlassButton from './GlassButton';
import GlassCard from '../GlassCard';
import ConditionalField from './ConditionalField';
import { Send, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import idCardExample from '@/assets/id-card-example.jpg';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RevenueSharingRecipientFormProps {
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

// 收款人身分選項
const RECIPIENT_TYPE_OPTIONS = [
  { value: 'company', label: '公司戶' },
  { value: 'individual', label: '個人戶' },
];

// 身分證字號驗證 (1碼大寫英文 + 9碼數字)
const validateIdNumber = (id: string): boolean => {
  const regex = /^[A-Z][0-9]{9}$/;
  return regex.test(id);
};

// 壓縮圖片到指定大小
const compressImage = async (file: File, maxSizeMB: number = 1): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // 計算縮放比例
        let quality = 0.9;
        const maxSize = maxSizeMB * 1024 * 1024;
        
        // 如果檔案已經小於限制，直接返回
        if (file.size <= maxSize) {
          resolve(file);
          return;
        }
        
        // 縮小尺寸直到檔案大小符合要求
        const scale = Math.sqrt(maxSize / file.size);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compress = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('壓縮失敗'));
                return;
              }
              
              if (blob.size <= maxSize || q <= 0.1) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                compress(q - 0.1);
              }
            },
            'image/jpeg',
            q
          );
        };
        
        compress(quality);
      };
      img.onerror = () => reject(new Error('圖片載入失敗'));
    };
    reader.onerror = () => reject(new Error('檔案讀取失敗'));
  });
};

// 將檔案轉換為 Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 檔案上傳元件
interface FileUploadProps {
  label: string;
  name: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
  isCompressing?: boolean;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  file,
  onFileChange,
  error,
  required,
  isCompressing,
  accept = '.jpg,.jpeg,.png',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleRemove = () => {
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground/80">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {!file ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={isCompressing}
          className={cn(
            "w-full p-6 rounded-xl border-2 border-dashed transition-all duration-200",
            "flex flex-col items-center justify-center gap-2",
            "border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/10",
            "text-muted-foreground hover:text-foreground",
            isCompressing && "cursor-not-allowed opacity-50"
          )}
        >
          <Upload className="w-8 h-8" />
          <span className="text-sm">點擊上傳檔案</span>
          <span className="text-xs text-muted-foreground">
            支援 JPG, JPEG, PNG（上傳後自動壓縮至 1MB 以內）
          </span>
        </button>
      ) : (
        <div className="p-4 rounded-xl border border-white/20 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isCompressing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              <div>
                <p className="text-sm text-foreground truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isCompressing ? '壓縮中...' : `${(file.size / 1024).toFixed(1)} KB`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isCompressing}
              className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};

export const RevenueSharingRecipientForm: React.FC<RevenueSharingRecipientFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  // 收款人身分別
  const [recipientType, setRecipientType] = useState<string>('');
  
  // 公司戶欄位
  const [companyName, setCompanyName] = useState('');
  const [companyTaxId, setCompanyTaxId] = useState('');
  const [companyContactName, setCompanyContactName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  
  // 個人戶欄位
  const [recipientName, setRecipientName] = useState('');
  const [recipientIdNumber, setRecipientIdNumber] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  
  // 共用欄位
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // 銀行帳戶資訊
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankbookFile, setBankbookFile] = useState<File | null>(null);
  const [bankbookCompressing, setBankbookCompressing] = useState(false);
  
  // 身分證上傳 (個人戶)
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idFrontCompressing, setIdFrontCompressing] = useState(false);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [idBackCompressing, setIdBackCompressing] = useState(false);
  
  // 表單狀態
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<Record<string, any> | null>(null);

  // 處理檔案上傳和壓縮
  const handleFileChange = async (
    file: File | null,
    setFile: (file: File | null) => void,
    setCompressing: (compressing: boolean) => void
  ) => {
    if (!file) {
      setFile(null);
      return;
    }

    // 驗證檔案類型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return;
    }

    setCompressing(true);
    try {
      const compressedFile = await compressImage(file, 1);
      setFile(compressedFile);
    } catch (error) {
      console.error('檔案壓縮失敗:', error);
      setFile(file);
    } finally {
      setCompressing(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!recipientType) {
      newErrors.recipientType = '請選擇收款人身分別';
    }

    // 公司戶驗證
    if (recipientType === 'company') {
      if (!companyName.trim()) {
        newErrors.companyName = '請輸入公司名稱';
      }
      if (!companyTaxId.trim()) {
        newErrors.companyTaxId = '請輸入公司統編';
      }
      if (!companyContactName.trim()) {
        newErrors.companyContactName = '請輸入公司聯絡人姓名';
      }
      if (!companyAddress.trim()) {
        newErrors.companyAddress = '請輸入聯絡地址';
      }
    }

    // 個人戶驗證
    if (recipientType === 'individual') {
      if (!recipientName.trim()) {
        newErrors.recipientName = '請輸入收款人姓名';
      }
      if (!recipientIdNumber.trim()) {
        newErrors.recipientIdNumber = '請輸入收款人身份證字號';
      } else if (!validateIdNumber(recipientIdNumber.toUpperCase())) {
        newErrors.recipientIdNumber = '身份證字號格式錯誤，應為1碼大寫英文字母及9碼數字（例：A123456789）';
      }
      if (!recipientAddress.trim()) {
        newErrors.recipientAddress = '請輸入戶籍地址';
      }
      if (!idFrontFile) {
        newErrors.idFront = '請上傳身分證正面影本';
      }
      if (!idBackFile) {
        newErrors.idBack = '請上傳身分證反面影本';
      }
    }

    // 共用欄位驗證
    if (!email.trim()) {
      newErrors.email = '請輸入 E-mail';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }

    if (!phone.trim()) {
      newErrors.phone = '請輸入聯絡電話';
    }

    // 銀行資訊驗證
    if (!bankName.trim()) {
      newErrors.bankName = '請輸入銀行名稱';
    }
    if (!bankCode.trim()) {
      newErrors.bankCode = '請輸入銀行代碼';
    }
    if (!branchName.trim()) {
      newErrors.branchName = '請輸入分行名稱';
    }
    if (!branchCode.trim()) {
      newErrors.branchCode = '請輸入分行代碼';
    }
    if (!accountNumber.trim()) {
      newErrors.accountNumber = '請輸入帳戶號碼';
    }
    if (!bankbookFile) {
      newErrors.bankbook = '請上傳存摺封面影本';
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

  const prepareSubmitData = async (): Promise<Record<string, any>> => {
    const selectedRecipientTypeOption = RECIPIENT_TYPE_OPTIONS.find(r => r.value === recipientType);

    const webhookData: Record<string, any> = {
      收款人身分別: selectedRecipientTypeOption?.label || '',
      'E-mail': email,
      聯絡電話: phone,
      銀行名稱: bankName,
      銀行代碼: bankCode,
      分行名稱: branchName,
      分行代碼: branchCode,
      帳戶號碼: accountNumber,
      lovable表單: true,
      submittedAt: new Date().toISOString(),
    };

    // 公司戶資料
    if (recipientType === 'company') {
      webhookData['公司名稱'] = companyName;
      webhookData['公司統編'] = companyTaxId;
      webhookData['公司聯絡人姓名'] = companyContactName;
      webhookData['聯絡地址'] = companyAddress;
    }

    // 個人戶資料
    if (recipientType === 'individual') {
      webhookData['收款人姓名'] = recipientName;
      webhookData['收款人身份證字號'] = recipientIdNumber.toUpperCase();
      webhookData['戶籍地址'] = recipientAddress;
    }

    // 處理檔案轉 Base64
    if (bankbookFile) {
      webhookData['存摺封面影本'] = await fileToBase64(bankbookFile);
    }
    if (recipientType === 'individual') {
      if (idFrontFile) {
        webhookData['身分證正面影本'] = await fileToBase64(idFrontFile);
      }
      if (idBackFile) {
        webhookData['身分證反面影本'] = await fileToBase64(idBackFile);
      }
    }

    return webhookData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 準備資料並顯示確認對話框
    const data = await prepareSubmitData();
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    if (pendingData) {
      onSubmit(pendingData);
    }
    setShowConfirmDialog(false);
  };

  // 確認頁面內容
  const renderConfirmContent = () => {
    const selectedRecipientTypeOption = RECIPIENT_TYPE_OPTIONS.find(r => r.value === recipientType);
    
    return (
      <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto">
        <div className="grid gap-2">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">收款人身分別</span>
            <span className="font-medium">{selectedRecipientTypeOption?.label}</span>
          </div>
          
          {recipientType === 'company' && (
            <>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">公司名稱</span>
                <span className="font-medium">{companyName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">公司統編</span>
                <span className="font-medium">{companyTaxId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">公司聯絡人姓名</span>
                <span className="font-medium">{companyContactName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">聯絡地址</span>
                <span className="font-medium">{companyAddress}</span>
              </div>
            </>
          )}
          
          {recipientType === 'individual' && (
            <>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">收款人姓名</span>
                <span className="font-medium">{recipientName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">收款人身份證字號</span>
                <span className="font-medium">{recipientIdNumber.toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">戶籍地址</span>
                <span className="font-medium">{recipientAddress}</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">E-mail</span>
            <span className="font-medium">{email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">聯絡電話</span>
            <span className="font-medium">{phone}</span>
          </div>
          
          <div className="mt-4 pt-2 border-t border-border">
            <p className="text-muted-foreground mb-2 font-medium">銀行帳戶資訊</p>
          </div>
          
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">銀行名稱</span>
            <span className="font-medium">{bankName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">銀行代碼</span>
            <span className="font-medium">{bankCode}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">分行名稱</span>
            <span className="font-medium">{branchName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">分行代碼</span>
            <span className="font-medium">{branchCode}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">帳戶號碼</span>
            <span className="font-medium">{accountNumber}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">存摺封面影本</span>
            <span className="font-medium text-green-500">已上傳</span>
          </div>
          
          {recipientType === 'individual' && (
            <>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">身分證正面影本</span>
                <span className="font-medium text-green-500">已上傳</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">身分證反面影本</span>
                <span className="font-medium text-green-500">已上傳</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 收款人身分別 */}
        <GlassCard className="space-y-6">
          <h2 className="form-section-title">收款人資料</h2>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground/80 mb-3">
              收款人身分別 <span className="text-destructive">*</span>
            </label>
            <div className="space-y-3">
              {RECIPIENT_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    recipientType === option.value
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  )}
                >
                  <input
                    type="radio"
                    name="recipientType"
                    value={option.value}
                    checked={recipientType === option.value}
                    onChange={(e) => {
                      setRecipientType(e.target.value);
                      clearError('recipientType');
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.recipientType && (
              <p className="text-sm text-destructive mt-1">{errors.recipientType}</p>
            )}
          </div>

          {/* 公司戶欄位 */}
          <ConditionalField show={recipientType === 'company'}>
            <div className="space-y-4 pl-4 border-l-2 border-primary/30">
              <GlassInput
                label="公司名稱"
                name="companyName"
                placeholder="請輸入公司名稱"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  clearError('companyName');
                }}
                required
                error={errors.companyName}
              />
              <GlassInput
                label="公司統編"
                name="companyTaxId"
                placeholder="請輸入公司統編"
                value={companyTaxId}
                onChange={(e) => {
                  setCompanyTaxId(e.target.value);
                  clearError('companyTaxId');
                }}
                required
                error={errors.companyTaxId}
              />
              <GlassInput
                label="公司聯絡人姓名"
                name="companyContactName"
                placeholder="請輸入公司聯絡人姓名"
                value={companyContactName}
                onChange={(e) => {
                  setCompanyContactName(e.target.value);
                  clearError('companyContactName');
                }}
                required
                error={errors.companyContactName}
              />
              <GlassInput
                label="聯絡地址"
                name="companyAddress"
                placeholder="請輸入聯絡地址"
                value={companyAddress}
                onChange={(e) => {
                  setCompanyAddress(e.target.value);
                  clearError('companyAddress');
                }}
                required
                error={errors.companyAddress}
              />
            </div>
          </ConditionalField>

          {/* 個人戶欄位 */}
          <ConditionalField show={recipientType === 'individual'}>
            <div className="space-y-4 pl-4 border-l-2 border-primary/30">
              <GlassInput
                label="收款人姓名"
                name="recipientName"
                placeholder="請輸入收款人姓名"
                value={recipientName}
                onChange={(e) => {
                  setRecipientName(e.target.value);
                  clearError('recipientName');
                }}
                required
                error={errors.recipientName}
              />
              <div className="space-y-1">
                <GlassInput
                  label="收款人身份證字號"
                  name="recipientIdNumber"
                  placeholder="例：A123456789"
                  value={recipientIdNumber}
                  onChange={(e) => {
                    setRecipientIdNumber(e.target.value.toUpperCase());
                    clearError('recipientIdNumber');
                  }}
                  required
                  error={errors.recipientIdNumber}
                />
                <p className="text-xs text-muted-foreground">
                  格式：1碼大寫英文字母 + 9碼數字
                </p>
              </div>
              <GlassInput
                label="戶籍地址"
                name="recipientAddress"
                placeholder="請輸入戶籍地址"
                value={recipientAddress}
                onChange={(e) => {
                  setRecipientAddress(e.target.value);
                  clearError('recipientAddress');
                }}
                required
                error={errors.recipientAddress}
              />
            </div>
          </ConditionalField>

          {/* 共用欄位 */}
          <ConditionalField show={!!recipientType}>
            <div className="space-y-4 mt-6">
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
            </div>
          </ConditionalField>
        </GlassCard>

        {/* 銀行帳戶資訊 */}
        <ConditionalField show={!!recipientType}>
          <GlassCard className="space-y-6">
            <h2 className="form-section-title">銀行帳戶資訊</h2>

            <GlassInput
              label="銀行名稱"
              name="bankName"
              placeholder="請輸入銀行名稱"
              value={bankName}
              onChange={(e) => {
                setBankName(e.target.value);
                clearError('bankName');
              }}
              required
              error={errors.bankName}
            />
            <GlassInput
              label="銀行代碼"
              name="bankCode"
              placeholder="請輸入銀行代碼"
              value={bankCode}
              onChange={(e) => {
                setBankCode(e.target.value);
                clearError('bankCode');
              }}
              required
              error={errors.bankCode}
            />
            <GlassInput
              label="分行名稱"
              name="branchName"
              placeholder="請輸入分行名稱"
              value={branchName}
              onChange={(e) => {
                setBranchName(e.target.value);
                clearError('branchName');
              }}
              required
              error={errors.branchName}
            />
            <GlassInput
              label="分行代碼"
              name="branchCode"
              placeholder="請輸入分行代碼"
              value={branchCode}
              onChange={(e) => {
                setBranchCode(e.target.value);
                clearError('branchCode');
              }}
              required
              error={errors.branchCode}
            />
            <GlassInput
              label="帳戶號碼"
              name="accountNumber"
              placeholder="請輸入帳戶號碼"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value);
                clearError('accountNumber');
              }}
              required
              error={errors.accountNumber}
            />
            <FileUpload
              label="存摺封面影本上傳"
              name="bankbook"
              file={bankbookFile}
              onFileChange={(file) => {
                handleFileChange(file, setBankbookFile, setBankbookCompressing);
                clearError('bankbook');
              }}
              error={errors.bankbook}
              required
              isCompressing={bankbookCompressing}
            />
          </GlassCard>
        </ConditionalField>

        {/* 身分證上傳 (僅個人戶) */}
        <ConditionalField show={recipientType === 'individual'}>
          <GlassCard className="space-y-6">
            <h2 className="form-section-title">身分證影本上傳</h2>
            
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
              <p className="text-sm text-muted-foreground">
                請上傳清楚拍攝之「橫式」身分證照片。
              </p>
              <div className="flex justify-center">
                <img 
                  src={idCardExample} 
                  alt="身分證範例圖" 
                  className="max-w-xs rounded-lg border border-border/50 shadow-sm"
                />
              </div>
            </div>

            <FileUpload
              label="身分證正面影本上傳"
              name="idFront"
              file={idFrontFile}
              onFileChange={(file) => {
                handleFileChange(file, setIdFrontFile, setIdFrontCompressing);
                clearError('idFront');
              }}
              error={errors.idFront}
              required
              isCompressing={idFrontCompressing}
            />
            <FileUpload
              label="身分證反面影本上傳"
              name="idBack"
              file={idBackFile}
              onFileChange={(file) => {
                handleFileChange(file, setIdBackFile, setIdBackCompressing);
                clearError('idBack');
              }}
              error={errors.idBack}
              required
              isCompressing={idBackCompressing}
            />
          </GlassCard>
        </ConditionalField>

        {/* 提交按鈕 */}
        <ConditionalField show={!!recipientType}>
          <GlassButton
            type="submit"
            variant="gradient"
            size="lg"
            loading={isSubmitting}
            disabled={bankbookCompressing || idFrontCompressing || idBackCompressing}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            送出資料
          </GlassButton>
        </ConditionalField>
      </form>

      {/* 確認對話框 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>確認送出資料</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-4">請確認以下資料是否正確：</p>
                {renderConfirmContent()}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>返回修改</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '送出中...' : '確認送出'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RevenueSharingRecipientForm;
