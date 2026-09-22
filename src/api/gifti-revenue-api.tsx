import axios from 'src/utils/axios';
import type { ApiPagination, ApiResponse } from 'src/types/api_response';
import type {
  IGiftiRevenueByPeriod,
  IGiftiRevenueGroupBy,
  IGiftiRevenueOrderList,
  IGiftiRevenueRangeParams,
} from 'src/types/revenue/revenue_gifti';

const tableName = 'gift_revenue';

type OrderListResponse = ApiResponse<IGiftiRevenueOrderList> & { pagination: ApiPagination };

/* Gifti Shop sales revenue.
   by_period was locked in as a real endpoint on 2026-09-22 (GET
   /gift_revenue/admin/by_period). orders was locked in right after, on 2026-09-22
   (GET /gift_revenue/admin/orders). There's no separate summary call for the stat
   cards — they reuse the `total` that by_period returns (never computing the same
   value twice).

   The range param can arrive as an empty object ({}) with no range_type key — the
   default state where no range has been picked. Spreading it as { ...range } means
   none of range_type/date/month/from/to are sent in that case (the server reads that
   as ALL), and those keys are only attached once something has actually been picked —
   no special-casing needed here. */
export default class GiftiRevenueAPI {
  /* By period — group_by maps 1:1 to the screen's monthly/daily toggle.
     Clicking a monthly row to drill into daily re-calls this with range narrowed to
     that month. The three stat cards also reuse this response's `total` (no separate call). */
  getByPeriod = async (
    range: IGiftiRevenueRangeParams,
    groupBy: IGiftiRevenueGroupBy
  ): Promise<ApiResponse<IGiftiRevenueByPeriod>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/by_period`, {
        params: { ...range, group_by: groupBy },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gifti revenue by period:', error);
      throw error;
    }
  };

  /* Per order — the sales for that day once a day is clicked into. The server
     paginates (always called with range_type=DAY&date=YYYY-MM-DD — this screen only
     ever drills down to single-day granularity). Not a call that re-fires on every
     keystroke of a search box, so it keeps the global loading spinner. */
  getOrders = async (params: {
    page: number;
    limit: number;
    range: IGiftiRevenueRangeParams;
  }): Promise<OrderListResponse> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/orders`, {
        params: { page: params.page, limit: params.limit, ...params.range },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gifti revenue orders:', error);
      throw error;
    }
  };
}
