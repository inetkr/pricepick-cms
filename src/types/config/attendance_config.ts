export type IAttendanceRecognitionCondition = 'RETURN_FROM_STORE' | 'MANUAL_CHECKIN';

export type IAttendanceRecognitionConditionOption = {
  code: IAttendanceRecognitionCondition;
  label: string;
};

export type IAttendanceConfig = {
  key: string;
  configured: boolean;
  value: IAttendanceConfigValue;
  updated_at?: string;
  recognition_condition_options?: IAttendanceRecognitionConditionOption[];
}

export type IAttendanceConfigValue = {
  daily_points: number;
  linked_store: string;
  streak_reward_event_ticket_amount: 1 | 2;
  recognition_condition: IAttendanceRecognitionCondition;
  streak_milestone_days: number;
  reset_time: string;
};
