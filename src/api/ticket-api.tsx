import axios from 'src/utils/axios';
import BaseAPI from './base-api';
import type { ApiPaginatedResponse, ApiResponse } from 'src/types/api_response';
import type { ITicketStat } from 'src/types/tickets/ticket_stat';
import type { ITicket } from 'src/types/tickets/ticket';

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
}
