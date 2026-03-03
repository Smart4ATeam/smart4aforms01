import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassInput from './GlassInput';
import GlassTextarea from './GlassTextarea';
import GlassButton from './GlassButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

interface FormData {
  promptInfo: string;
  promptDesc: string;
  lineId: string;
  selectMode: string;
}

interface PromptModeChangeFormProps {
  webhookUrl: string;
  onSuccess?: () => void;
}

const PromptModeChangeForm: React.FC<PromptModeChangeFormProps> = ({
  webhookUrl,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    promptInfo: '',
    promptDesc: '',
    lineId: '',
    selectMode: '',
  });

  // Pre-fill from URL parameters
  useEffect(() => {
    const promptInfo = searchParams.get('PromptInfo');
    const promptDesc = searchParams.get('PromptDesc');
    const lineId = searchParams.get('LINEID');
    const selectMode = searchParams.get('SELECTMODE');

    if (promptInfo || promptDesc || lineId || selectMode) {
      setFormData(prev => ({
        ...prev,
        ...(promptInfo && { promptInfo }),
        ...(promptDesc && { promptDesc }),
        ...(lineId && { lineId }),
        ...(selectMode && { selectMode }),
      }));
    }
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      const webhookData = {
        '規則描述 (生成內容的撰寫規則)': formData.promptInfo,
        '注意事項 (提醒生成時該注意的事項)': formData.promptDesc,
        'LINE ID': formData.lineId,
        '選擇模式': formData.selectMode,
        submittedAt: new Date().toISOString(),
      };

      // Send to webhook
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(webhookData),
      });

      // Save to Supabase
      const { error: dbError } = await (supabase.from as any)('prompt_mode_changes')
        .insert({
          prompt_info: formData.promptInfo,
          prompt_desc: formData.promptDesc,
          line_id: formData.lineId,
          select_mode: formData.selectMode,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Still show success as webhook was sent
      }

      setShowSuccessDialog(true);
      onSuccess?.();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: '提交失敗',
        description: '請稍後再試或聯繫客服',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    // Reset form
    setFormData({
      promptInfo: '',
      promptDesc: '',
      lineId: '',
      selectMode: '',
    });
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <GlassTextarea
          label="規則描述 (生成內容的撰寫規則)"
          name="promptInfo"
          value={formData.promptInfo}
          onChange={handleInputChange}
          placeholder="請輸入生成內容的撰寫規則..."
          rows={6}
        />

        <GlassTextarea
          label="注意事項 (提醒生成時該注意的事項)"
          name="promptDesc"
          value={formData.promptDesc}
          onChange={handleInputChange}
          placeholder="請輸入提醒生成時該注意的事項..."
          rows={6}
        />

        <GlassInput
          label="LINE ID"
          name="lineId"
          value={formData.lineId}
          onChange={handleInputChange}
          placeholder="請輸入您的 LINE ID"
        />

        <GlassInput
          label="選擇模式"
          name="selectMode"
          value={formData.selectMode}
          onChange={handleInputChange}
          placeholder="請輸入選擇模式"
        />

        <div className="pt-4">
          <GlassButton
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? '提交中...' : '確認提交'}
          </GlassButton>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>確認提交資料</DialogTitle>
            <DialogDescription>
              請確認以下資料是否正確
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">規則描述</p>
              <p className="text-foreground whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                {formData.promptInfo || '(未填寫)'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">注意事項</p>
              <p className="text-foreground whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                {formData.promptDesc || '(未填寫)'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs">LINE ID</p>
                <p className="text-foreground">{formData.lineId || '(未填寫)'}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">選擇模式</p>
                <p className="text-foreground">{formData.selectMode || '(未填寫)'}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <GlassButton
              type="button"
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              返回修改
            </GlassButton>
            <GlassButton
              type="button"
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
            >
              確認送出
            </GlassButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={handleSuccessClose}>
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="rounded-full bg-accent/20 p-3">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle>提交成功！</DialogTitle>
              <DialogDescription>
                您的提詞設定已成功送出
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="sm:justify-center">
            <GlassButton onClick={handleSuccessClose}>
              完成
            </GlassButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromptModeChangeForm;
