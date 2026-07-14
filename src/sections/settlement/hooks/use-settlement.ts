import { useState, useEffect } from 'react';
import { settlementAPI } from 'src/api';
import type {
  IAffiliateSettlement,
  IMonthlySettlement,
  ISettlementDiffReason,
} from 'src/types/settlement/settlement';
import type { ISettlementStat } from 'src/types/settlement/settlement_stat';

const emptyStat: ISettlementStat = {
  monthly_confirmed: 0,
  monthly_estimated: 0,
  yearly_total: 0,
  yearly_change_rate: 0,
};

export const useSettlement = () => {
  const [stats, setStats] = useState<ISettlementStat>(emptyStat);
  const [affiliateSettlements, setAffiliateSettlements] = useState<IAffiliateSettlement[]>([]);
  const [monthlySettlements, setMonthlySettlements] = useState<IMonthlySettlement[]>([]);
  const [diffReasons, setDiffReasons] = useState<ISettlementDiffReason[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [statRes, affiliateRes, monthlyRes, diffRes] = await Promise.all([
        settlementAPI.getSettlementStat(),
        settlementAPI.getAffiliateSettlementList(),
        settlementAPI.getMonthlySettlementList(),
        settlementAPI.getSettlementDiffReasons(),
      ]);
      if (statRes && statRes.result && statRes.result.object) {
        setStats(statRes.result.object);
      }
      if (affiliateRes && affiliateRes.result && affiliateRes.result.object) {
        setAffiliateSettlements(affiliateRes.result.object);
      }
      if (monthlyRes && monthlyRes.result && monthlyRes.result.object) {
        setMonthlySettlements(monthlyRes.result.object);
      }
      if (diffRes && diffRes.result && diffRes.result.object) {
        setDiffReasons(diffRes.result.object);
      }
    } catch (error) {
      console.error('Failed to load settlement data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return {
    stats,
    affiliateSettlements,
    monthlySettlements,
    diffReasons,
    isLoading,
    reload: loadAll,
  };
};
