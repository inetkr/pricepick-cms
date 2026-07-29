import axios from 'src/utils/axios';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type {
  DrawRoundStatus,
  IDrawEntry,
  IDrawPrizeTier,
  IDrawRound,
  IGiftStatus,
  IPrizeDrawTemplateConfig,
} from 'src/types/weekly-draws/weekly-draw';

const DEFAULT_TEMPLATE_CONFIG_KEY = 'PRIZE_DRAW_DEFAULT_TEMPLATE';

export default class WeeklyDrawAPI {
  getDefaultTemplate = async (): Promise<ApiResponse<IPrizeDrawTemplateConfig>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/config/${DEFAULT_TEMPLATE_CONFIG_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching prize draw default template:', error);
      throw error;
    }
  };

  setDefaultTemplate = async (
    tiers: IDrawPrizeTier[]
  ): Promise<ApiResponse<IPrizeDrawTemplateConfig>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post('/config/admin/set', {
        key: DEFAULT_TEMPLATE_CONFIG_KEY,
        value: { tiers },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating prize draw default template:', error);
      throw error;
    }
  };

  getRounds = async (
    page: number,
    limit: number,
    status?: DrawRoundStatus
  ): Promise<ApiPaginatedResponse<IDrawRound>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get('/prize_draw/admin/rounds', {
        params: { page, limit, ...(status ? { status } : {}) },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching prize draw rounds:', error);
      throw error;
    }
  };

  getRoundEntries = async (
    roundId: string,
    page: number,
    limit: number
  ): Promise<ApiPaginatedResponse<IDrawEntry>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/prize_draw/admin/rounds/${roundId}/entries`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching prize draw round entries:', error);
      throw error;
    }
  };

  updateRoundTiers = async (
    roundId: string,
    tiers: IDrawPrizeTier[]
  ): Promise<ApiResponse<IDrawRound>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.put(
        `/prize_draw/admin/rounds/${roundId}/tiers`,
        { tiers }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating prize draw round tiers:', error);
      throw error;
    }
  };

  updateEntriesGiftStatus = async (
    roundId: string,
    entries: { id: string; gift_status: IGiftStatus; gift_note?: string }[]
  ): Promise<ApiResponse<unknown>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.put(
        `/prize_draw/admin/rounds/${roundId}/entries`,
        { entries }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating prize draw entry gift status:', error);
      throw error;
    }
  };
}
