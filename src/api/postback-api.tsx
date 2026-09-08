import axios from 'src/utils/axios';
import type { ApiPagination, ApiResponse } from 'src/types/api_response';
import type {
  IPostbackListParams,
  IPostbackLogList,
  IPostbackMerchantOption,
} from 'src/types/postback/postback';

const tableName = 'postback_log';

type PostbackListResponse = ApiResponse<IPostbackLogList> & { pagination: ApiPagination };

export default class PostbackAPI {
  /* 포스트백 로그 목록 — 서버가 받는 것은 page · limit · source · keyword · action 뿐이다.
     검색·구분·쪽나눔을 서버가 처리한다: 화면에서 거르면 서버가 잘라 준 쪽나눔과 어긋난다
     (2쪽을 보는 중에 걸러도 1쪽에 있던 건은 걸러지지 않는다).

     ALL 과 빈 값은 「거르지 않음」이라 아예 보내지 않는다 — 빈 문자열을 붙여 보내면
     서버가 그걸 값으로 받아 0건이 나오는 수가 있다.

     쪽을 넘길 때도 부르는 호출이라 전역 로딩 스피너를 띄우는 인스턴스를 쓰지 않는다 —
     넘길 때마다 화면 전체가 덮이면 표를 훑어 내려갈 수가 없다.
     대신 표 안에서 「불러오는 중…」으로 알린다. */
  getList = async (params: IPostbackListParams): Promise<PostbackListResponse> => {
    try {
      const requestParam: Record<string, unknown> = {
        page: params.page,
        limit: params.limit,
        source: params.source,
      };
      /* 공백만 친 검색어는 안 친 것으로 본다 — 그대로 보내면 서버가 값으로 받아
         0건이 나오고, 화면에는 「없다」로 보인다. */
      const keyword = params.keyword?.trim();
      if (keyword) requestParam.keyword = keyword;
      if (params.action && params.action !== 'ALL') requestParam.action = params.action;

      const response = await axios.axiosInstance.get(`/${tableName}/admin/list`, {
        params: requestParam,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching postback log list:', error);
      throw error;
    }
  };

  /* 머천트 목록 — 고르는 칸에 채울 값이다. 목록이 자주 바뀌지 않아 탭을 열 때 한 번만 부른다.
     count 까지 함께 오지만 칸에는 이름만 적는다 — 고르는 자리에 숫자를 섞으면 이름이 밀린다. */
  getMerchants = async (): Promise<ApiResponse<IPostbackMerchantOption[]>> => {
    try {
      const response = await axios.axiosInstance.get(`/${tableName}/admin/merchants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching postback merchant list:', error);
      throw error;
    }
  };
}
