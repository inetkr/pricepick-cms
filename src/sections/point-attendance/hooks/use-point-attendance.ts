import { useEffect, useState } from 'react';
import { configAPI, pointAPI } from 'src/api';
import type { IAttendanceConfig, IAttendanceConfigValue } from 'src/types/config/attendance_config';

const CONFIG_KEY = 'ATTENDANCE_CONFIG';

const defaultConfig: IAttendanceConfigValue = {
  daily_points: 100,
  linked_store: 'COUPANG',
  streak_reward_event_ticket_amount: 1,
  recognition_condition: 'RETURN_FROM_STORE',
  reset_time: '00:00',
  streak_milestone_days: 5,
};

const todayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const usePointAttendance = () => {
  const [config, setConfig] = useState<IAttendanceConfigValue>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [todayVisits, setTodayVisits] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const responseData = await configAPI.getConfig<IAttendanceConfig>(CONFIG_KEY);
      if (responseData && responseData.result && responseData.result.object && responseData.result.object.value) {
        setConfig(responseData.result.object.value);
      }
    } catch (error) {
      console.error('Failed to load attendance config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTodayStats = async () => {
    setIsStatsLoading(true);
    try {
      const today = todayStr();
      const responseData = await pointAPI.getPointHistoryList(1, 1, {
        category: 'ATTENDANCE',
        from_date: today,
        to_date: today,
      });
      if (responseData && responseData.result && responseData.result.object) {
        const visits = responseData.result.object.count;
        setTodayVisits(visits);
        setTodayPoints(visits * config.daily_points);
      }
    } catch (error) {
      console.error('Failed to load today attendance stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const saveConfig = async (next: IAttendanceConfigValue) => {
    setIsSaving(true);
    try {
      await configAPI.setConfig<IAttendanceConfigValue>(CONFIG_KEY, next);
      setConfig(next);
      return true;
    } catch (error) {
      console.error('Failed to save attendance config:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      loadTodayStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return {
    config,
    isLoading,
    isSaving,
    saveConfig,
    todayVisits,
    todayPoints,
    isStatsLoading,
  };
};
