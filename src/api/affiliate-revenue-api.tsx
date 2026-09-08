import axios from 'src/utils/axios';
import type { ApiPagination, ApiResponse } from 'src/types/api_response';
import type {
  IAffiliateRevenueByMerchant,
  IAffiliateRevenueByPeriod,
  IAffiliateRevenueFilters,
  IAffiliateRevenueGroupBy,
  IAffiliateRevenueMerchantSort,
  IAffiliateRevenueOrderList,
  IAffiliateRevenueRangeParams,
  IAffiliateRevenueSummary,
} from 'src/types/revenue/revenue_fee';

const tableName = 'affiliate_revenue';

type OrderListResponse = ApiResponse<IAffiliateRevenueOrderList> & { pagination: ApiPagination };

export default class AffiliateRevenueAPI {
  /* 거르개 목록 — 제휴몰 명부와 상태 값 목록을 한 번에 받는다.
     화면에 들어올 때 한 번만 부른다: 조회 기간을 바꿀 때마다 다시 부르면 매 조회마다 호출이
     하나씩 더 붙는데, 거르개는 고르는 칸을 채우는 값일 뿐이라 그렇게까지 최신일 이유가 없다.
     곁다리로 채우는 목록이라 전역 로딩 스피너도 띄우지 않는다(axiosInstance = noloading). */
  getFilters = async (params: {
    range: IAffiliateRevenueRangeParams;
    sort?: IAffiliateRevenueMerchantSort;
  }): Promise<ApiResponse<IAffiliateRevenueFilters>> => {
    try {
      const response = await axios.axiosInstance.get(`/${tableName}/admin/filters`, {
        params: { ...params.range, ...(params.sort ? { sort: params.sort } : {}) },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching affiliate revenue filters:', error);
      throw error;
    }
  };

  /* 요약 다섯 장 — 조회 기간만 받아서 쿠팡·링크프라이스 분리까지 서버가 해 준다.
     화면 맨 위 카드라 로딩 스피너를 띄우는 인스턴스를 쓴다. */
  getSummary = async (
    range: IAffiliateRevenueRangeParams
  ): Promise<ApiResponse<IAffiliateRevenueSummary>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/summary`, {
        params: { ...range },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching affiliate revenue summary:', error);
      throw error;
    }
  };

  /* 건별 내역 — 페이지 단위로 서버가 잘라 준다. 응답이 제휴몰·상태 명부를 함께 주므로
     거르개는 화면에서 걸지 않고 merchant_id·ticket_status·search 로 서버에 맡긴다
     (화면에서만 걸러 두면 서버가 잘라 준 쪽나눔과 어긋난다).
     ⚠️ search 는 받은 명세에 없는 파라미터다 — 서버가 안 받으면 검색어를 쳐도 목록이
     그대로라 「검색이 안 먹는다」로 보인다. 지원 여부를 확인한 뒤 없으면 이 줄과 툴바의
     검색 칸을 함께 빼야 한다.
     검색어를 칠 때마다(눌러 담은 뒤) 다시 부르는 호출이라 전역 로딩 스피너는 띄우지
     않는다 — 표 안에서 「불러오는 중…」으로 알린다. */
  getOrders = async (params: {
    page: number;
    limit: number;
    range: IAffiliateRevenueRangeParams;
    search?: string;
    merchantId?: string;
    ticketStatus?: string;
  }): Promise<OrderListResponse> => {
    try {
      const requestParam: Record<string, unknown> = {
        page: params.page,
        limit: params.limit,
        ...params.range,
      };
      if (params.search) requestParam.search = params.search;
      if (params.merchantId) requestParam.merchant_id = params.merchantId;
      if (params.ticketStatus) requestParam.ticket_status = params.ticketStatus;
      const response = await axios.axiosInstance.get(`/${tableName}/admin/orders`, {
        params: requestParam,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching affiliate revenue orders:', error);
      throw error;
    }
  };

  // 기간별 매출 — group_by 가 화면의 월별/일별/기간별 고르기와 1:1로 맞물린다
  getByPeriod = async (
    range: IAffiliateRevenueRangeParams,
    groupBy: IAffiliateRevenueGroupBy
  ): Promise<ApiResponse<IAffiliateRevenueByPeriod>> => {
    try {
      const response = await axios.axiosInstanceWithLoading.get(`/${tableName}/admin/by_period`, {
        params: { ...range, group_by: groupBy },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching affiliate revenue by period:', error);
      throw error;
    }
  };

  /* 제휴몰별 — 기간별에서 한 줄을 고르면 그 구간(RANGE)으로 다시 부른다.
     검색어(keyword)와 정렬(sort)도 서버가 처리한다. 화면에서 거르고 정렬하면 서버가 준
     합계와 눈앞의 줄들이 어긋난다 — 목록이 페이지로 잘려 오게 되는 순간 바로 틀어진다.
     검색어를 칠 때마다 다시 부르는 호출이라 전역 로딩 스피너는 띄우지 않는다(표 안에서
     「불러오는 중…」으로 알린다) — 반 초마다 화면 전체가 덮이면 글자를 칠 수가 없다. */
  getByMerchant = async (params: {
    range: IAffiliateRevenueRangeParams;
    sort?: IAffiliateRevenueMerchantSort;
    keyword?: string;
  }): Promise<ApiResponse<IAffiliateRevenueByMerchant>> => {
    try {
      const requestParam: Record<string, unknown> = { ...params.range };
      if (params.sort) requestParam.sort = params.sort;
      if (params.keyword) requestParam.keyword = params.keyword;
      const response = await axios.axiosInstance.get(`/${tableName}/admin/by_merchant`, {
        params: requestParam,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching affiliate revenue by merchant:', error);
      throw error;
    }
  };
}
