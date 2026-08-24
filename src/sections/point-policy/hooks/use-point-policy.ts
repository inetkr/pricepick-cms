import { useEffect, useState } from 'react';
import { configAPI, pointAPI } from 'src/api';
import type { IPointPolicyConfigValue } from 'src/types/config/point_policy_config';

const CONFIG_KEY = 'POINT_POLICY';
const DEFAULT_DAILY_POINTS = 100;

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
  const [dailyPoints, setDailyPoints] = useState(DEFAULT_DAILY_POINTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const responseData = await pointAPI.getPointPolicy();
      const object = responseData?.result?.object;
      if (object?.value?.exchange_rate) {
        setConfig(object.value);
      }
      if (object?.daily_points !== undefined) {
        setDailyPoints(object.daily_points);
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

  return { config, dailyPoints, isLoading, isSaving, saveConfig, reload: loadConfig };
};
