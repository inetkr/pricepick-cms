export type IAppVersionForceUpdate = 'ACTIVE' | 'INACTIVE';

export type IAppVersionPlatform = 'ios' | 'android';

export type IAppVersionConfigValue = {
  latest_version: string;
  min_supported_version: string;
  force_update: IAppVersionForceUpdate;
  store_link: string;
  release_note: string;
  release_date: string;
};

export type IAppVersionConfig = {
  key: string;
  value: IAppVersionConfigValue;
};

export type IAppVersionConfigMap = Record<IAppVersionPlatform, IAppVersionConfigValue>;
