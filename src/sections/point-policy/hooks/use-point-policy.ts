import { useEffect, useState } from 'react';
import { configAPI } from 'src/api';
import type { IPointPolicyConfig, IPointPolicyConfigValue } from 'src/types/config/point_policy_config';

const CONFIG_KEY = 'POINT_POLICY';

const defaultConfig: IPointPolicyConfigValue = {
  exchange_rate: { point: 10, won: 1 },
  expiry_policy: 'ONE_YEAR',
  daily_accumulation_limit: null,
  conversion_direction: 'BIDIRECTIONAL',
  apply_timing: 'IMMEDIATE',
  scheduled_at: null,
};

export const usePointPolicy = () => {
  const [config, setConfig] = useState<IPointPolicyConfigValue>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const responseData = await configAPI.getConfig<IPointPolicyConfig>(CONFIG_KEY);
      if (responseData && responseData.result && responseData.result.object) {
        setConfig(responseData.result.object.value);
      }
    } catch (error) {
      console.error('Failed to load point policy config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (next: IPointPolicyConfigValue) => {
    setIsSaving(true);
    try {
      await configAPI.setConfig<IPointPolicyConfigValue>(CONFIG_KEY, next);
      setConfig(next);
      return true;
    } catch (error) {
      console.error('Failed to save point policy config:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return { config, isLoading, isSaving, saveConfig, reload: loadConfig };
};
