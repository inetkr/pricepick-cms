import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { ITicketStat } from 'src/types/tickets/ticket_stat';
import type { ITicket } from 'src/types/tickets/ticket';
import type {
  ILuckySpinConfig,
  ILuckySpinConfigSlot,
  ILuckySpinJackpotPolicy,
  ILuckySpinLog,
  ILuckySpinStats,
  ILuckySpinType,
} from 'src/types/tickets/roulette';
import type {
  ITicketValueConfigApiValues,
  ITicketValueConfigData,
} from 'src/types/config/ticket_value_config';

const tableName = 'ticket';
export default class TicketAPI extends BaseAPI {
  constructor() {
    super(tableName);
  }

  getTicketStat = async (): Promise<ApiResponse<ITicketStat>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket statistics:', error);
      throw error;
    }
  };

  getTicketList = async (
    page: number,
    limit: number,
    filter?: {
      search?: string;
      reason?: string;
      period?: string;
    }
  ): Promise<ApiPaginatedResponse<ITicket>> => {
    try {
      const requestParam: any = {
        page,
        limit,
        order: JSON.stringify([['created_at', 'desc']]),
      };
      if (filter) {
        requestParam.filter = JSON.stringify(filter);
      }
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/list_ticket_history`,
        {
          params: requestParam,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket list:', error);
      throw error;
    }
  };

  addSubTicket = async (subTicketData: {
    user_identifier: string; // 닉네임 또는 UID
    action: 'ADMIN_ADD' | 'ADMIN_SUB';
    ticket_type: 'EVENT' | 'BRONZE' | 'SILVER' | 'GOLD';
    amount: number;
    description: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/add_sub_ticket/`,
        subTicketData
      );
      return response.data;
    } catch (error) {
      console.error('Error adding sub-ticket:', error);
      throw error;
    }
  };

  addSubMultiTicket = async (subTicketData: {
    user_id: string; // 닉네임 또는 UID
    action: 'ADMIN_ADD' | 'ADMIN_SUB';
    tickets: {
      ticket_type: 'EVENT' | 'BRONZE' | 'SILVER' | 'GOLD';
      amount: number;
    }[];
    description: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/add_sub_multi_ticket/`,
        subTicketData
      );
      return response.data;
    } catch (error) {
      console.error('Error adding sub-multi-ticket:', error);
      throw error;
    }
  };

  getLuckySpinConfig = async (): Promise<ApiResponse<ILuckySpinConfig>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/lucky_spin_config`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching lucky spin configuration:', error);
      throw error;
    }
  };

  updateLuckySpinConfig = async (
    slots: ILuckySpinConfigSlot[]
  ): Promise<ApiResponse<ILuckySpinConfig>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/lucky_spin_config`,
        { slots }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating lucky spin configuration:', error);
      throw error;
    }
  };

  getLuckySpinStats = async (): Promise<ApiResponse<ILuckySpinStats>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/lucky_spin_stats`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching lucky spin stats:', error);
      throw error;
    }
  };

  getLuckySpinJackpotConfig = async (): Promise<ApiResponse<ILuckySpinConfig>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/lucky_spin_jackpot_config`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching jackpot lucky spin configuration:', error);
      throw error;
    }
  };

  updateLuckySpinJackpotConfig = async (
    slots: ILuckySpinConfigSlot[]
  ): Promise<ApiResponse<ILuckySpinConfig>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/lucky_spin_jackpot_config`,
        { slots }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating jackpot lucky spin configuration:', error);
      throw error;
    }
  };

  getLuckySpinJackpotStats = async (): Promise<ApiResponse<ILuckySpinStats>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/lucky_spin_jackpot_stats`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching jackpot lucky spin stats:', error);
      throw error;
    }
  };

  getLuckySpinJackpotPolicy = async (): Promise<ApiResponse<ILuckySpinJackpotPolicy>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/lucky_spin_jackpot_policy`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching jackpot lucky spin policy:', error);
      throw error;
    }
  };

  updateLuckySpinJackpotPolicy = async (policy: {
    daily_limit: number;
    event_ticket_daily_cap: number;
    event_ticket_monthly_cap: number;
  }): Promise<ApiResponse<ILuckySpinJackpotPolicy>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/lucky_spin_jackpot_policy`,
        policy
      );
      return response.data;
    } catch (error) {
      console.error('Error updating jackpot lucky spin policy:', error);
      throw error;
    }
  };

  getLuckySpinLogs = async (
    page: number,
    limit: number,
    spinType: ILuckySpinType
  ): Promise<ApiPaginatedResponse<ILuckySpinLog>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/lucky_spin_log`, {
        params: {
          page,
          limit,
          filter: JSON.stringify({ spin_type: spinType }),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lucky spin logs:', error);
      throw error;
    }
  };

  getTicketValueConfig = async (): Promise<ApiResponse<ITicketValueConfigData>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(
        `/${tableName}/admin/ticket_value_config`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket value configuration:', error);
      throw error;
    }
  };

  updateTicketValueConfig = async (
    values: ITicketValueConfigApiValues
  ): Promise<ApiResponse<ITicketValueConfigData>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.post(
        `/${tableName}/admin/ticket_value_config`,
        values
      );
      return response.data;
    } catch (error) {
      console.error('Error updating ticket value configuration:', error);
      throw error;
    }
  };
}
