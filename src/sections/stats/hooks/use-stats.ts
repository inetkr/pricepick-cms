import { useState, useEffect } from 'react';
import { statsAPI } from 'src/api';
import type { IStatsSummary } from 'src/types/stats/stats';

const emptySummary: IStatsSummary = {
  mall_commissions: [],
  gifticon_profit: {
    gifticon_exchange_value: 0,
    wholesale_cost: 0,
    gifticon_profit: 0,
  },
  ticket_cost_by_grade: [],
  net_profit: {
    fee_revenue: 0,
    gifticon_revenue: 0,
    ticket_cost: 0,
    net_profit: 0,
    net_profit_margin: 0,
  },
};

export const useStats = () => {
  const [summary, setSummary] = useState<IStatsSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);

  const loadSummary = async () => {
    setIsLoading(true);
    try {
      const responseData = await statsAPI.getStatsSummary();
      if (responseData && responseData.result && responseData.result.object) {
        setSummary(responseData.result.object);
      }
    } catch (error) {
      console.error('Failed to load statistics summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return { summary, isLoading, reload: loadSummary };
};
