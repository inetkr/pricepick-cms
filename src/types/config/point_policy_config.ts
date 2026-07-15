export type IPointExpiryPolicy = 'ONE_YEAR' | 'SIX_MONTHS' | 'NO_EXPIRY';

export type IPointConversionDirection = 'BIDIRECTIONAL' | 'ONE_WAY_POINT_TO_TICKET';

export type IPointApplyTiming = 'IMMEDIATE' | 'SCHEDULED';

export type IPointPolicyConfig = {
  key: string;
  value: IPointPolicyConfigValue;
};

export type IPointPolicyConfigValue = {
  exchange_rate: {
    point: number;
    won: number;
  };
  expiry_policy: IPointExpiryPolicy;
  daily_accumulation_limit: number | null;
  conversion_direction: IPointConversionDirection;
  apply_timing: IPointApplyTiming;
  scheduled_at: string | null;
};
