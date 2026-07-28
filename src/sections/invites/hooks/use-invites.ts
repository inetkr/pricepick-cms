import { useEffect, useState } from 'react';
import { inviteAPI } from 'src/api';
import type { IInvite } from 'src/types/invites/invite';
import type { IInviteStat } from 'src/types/invites/invite_stat';

export const useInvites = () => {
  const [ranking, setRanking] = useState<IInvite[]>([]);
  const [stats, setStats] = useState<IInviteStat>({
    total_referrals: 0,
    total_completed: 0,
    conversion_rate: 0,
    total_points_granted: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadRanking = async () => {
    setIsLoading(true);
    try {
      const responseData = await inviteAPI.getInviteRanking(1, 10);
      if (responseData && responseData.result && responseData.result.object) {
        setRanking(responseData.result.object.rows);
      }
    } catch (error) {
      console.error('Failed to load invite ranking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const responseData = await inviteAPI.getInviteStat();
      if (responseData && responseData.result && responseData.result.object) {
        setStats(responseData.result.object);
      }
    } catch (error) {
      console.error('Failed to load invite stats:', error);
    }
  };

  useEffect(() => {
    loadStats();
    loadRanking();
  }, []);

  return { ranking, stats, isLoading };
};
