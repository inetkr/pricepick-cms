import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { policyAPI } from 'src/api';
import type { IPolicyType } from 'src/types/common';
import type { IPolicy } from 'src/types/policy';

export const useTerms = (type: IPolicyType, title: string) => {
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
        toast.success('약관이 저장되었습니다.');
        loadPolicy();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to save terms policy (${type}):`, error);
      toast.error('약관 저장에 실패했습니다.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { policy, isLoading, isSaving, save, reload: loadPolicy };
};
