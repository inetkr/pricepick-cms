import { useCallback, useEffect, useState } from 'react';
import { configAPI } from 'src/api';
import type {
  IAppVersionConfigMap,
  IAppVersionConfigValue,
  IAppVersionPlatform,
} from 'src/types/config/app_version_config';

const CONFIG_KEYS: Record<IAppVersionPlatform, string> = {
  ios: 'APP_VERSION_IOS',
  android: 'APP_VERSION_ANDROID',
};

const emptyConfig: IAppVersionConfigValue = {
  latest_version: '',
  min_supported_version: '',
  force_update: 'INACTIVE',
  store_link: '',
  release_note: '',
  release_date: '',
};

const defaultConfigMap: IAppVersionConfigMap = {
  ios: { ...emptyConfig },
  android: { ...emptyConfig },
};

const normalizeValue = (raw: any): IAppVersionConfigValue | null => {
  const value = raw?.value ?? raw;
  if (!value || typeof value !== 'object') return null;
  return {
    latest_version: value.latest_version ?? '',
    min_supported_version: value.min_supported_version ?? '',
    force_update: value.force_update === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
    store_link: value.store_link ?? '',
    release_note: value.release_note ?? '',
    release_date: value.release_date ?? '',
  };
};

// GET /config/admin/app_version isn't a generic /config/:key lookup, so its
// exact response shape isn't pinned down by the rest of the codebase. Accept
// a few plausible shapes (keyed by config key, keyed by platform, or a
// {key,value} row list) instead of assuming one and breaking silently.
const normalizeResponse = (raw: any): IAppVersionConfigMap => {
  const map: IAppVersionConfigMap = { ios: { ...emptyConfig }, android: { ...emptyConfig } };
  if (!raw) return map;

  if (Array.isArray(raw)) {
    raw.forEach((row) => {
      if (row?.key === CONFIG_KEYS.ios) map.ios = normalizeValue(row) ?? map.ios;
      if (row?.key === CONFIG_KEYS.android) map.android = normalizeValue(row) ?? map.android;
    });
    return map;
  }

  if (raw[CONFIG_KEYS.ios] || raw[CONFIG_KEYS.android]) {
    map.ios = normalizeValue(raw[CONFIG_KEYS.ios]) ?? map.ios;
    map.android = normalizeValue(raw[CONFIG_KEYS.android]) ?? map.android;
    return map;
  }

  if (raw.ios || raw.android) {
    map.ios = normalizeValue(raw.ios) ?? map.ios;
    map.android = normalizeValue(raw.android) ?? map.android;
  }

  return map;
};

export const useAppVersion = () => {
  const [configs, setConfigs] = useState<IAppVersionConfigMap>(defaultConfigMap);
  const [isLoading, setIsLoading] = useState(true);
  const [savingPlatform, setSavingPlatform] = useState<IAppVersionPlatform | null>(null);

  const loadConfigs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await configAPI.getAppVersion<any>();
      const object = response?.result?.object ?? response;
      setConfigs(normalizeResponse(object));
    } catch (error) {
      console.error('Failed to load app version config:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveConfig = useCallback(
    async (platform: IAppVersionPlatform, next: IAppVersionConfigValue) => {
      setSavingPlatform(platform);
      try {
        await configAPI.setConfig<IAppVersionConfigValue>(CONFIG_KEYS[platform], next);
        setConfigs((prev) => ({ ...prev, [platform]: next }));
        return true;
      } catch (error) {
        console.error(`Failed to save ${platform} app version config:`, error);
        return false;
      } finally {
        setSavingPlatform(null);
      }
    },
    []
  );

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  return { configs, isLoading, savingPlatform, saveConfig, reload: loadConfigs };
};
