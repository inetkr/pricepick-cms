import { useCallback, useEffect, useState } from 'react';
import { policyAPI } from 'src/api';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';
import type { IPolicyType } from 'src/types/common';
import type { IPolicy } from 'src/types/policy';

export const useTerms = (type: IPolicyType, title: string) => {
  const { showMessageIcon } = useDialogMessage();
  const [policy, setPolicy] = useState<IPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadPolicy = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await policyAPI.getPolicyByType(type);
      setPolicy(responseData?.result?.object ?? null);
    } catch (error) {
      console.error(`Failed to load terms policy (${type}):`, error);
      setPolicy(null);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadPolicy();
  }, [loadPolicy]);

  const save = async (content: string, isPublished: boolean) => {
    setIsSaving(true);
    try {
      const responseData = policy
        ? await policyAPI.updatePolicy(policy.id, { title, content, type, is_published: isPublished })
        : await policyAPI.createPolicy({ title, content, type, is_published: isPublished });

      if (responseData && responseData.result && responseData.result.object) {
        showMessageIcon('약관이 저장되었습니다.', DialogMessageIcon.success, () => {
          loadPolicy();
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to save terms policy (${type}):`, error);
      showMessageIcon('약관 저장에 실패했습니다.', DialogMessageIcon.alert);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { policy, isLoading, isSaving, save, reload: loadPolicy };
};
