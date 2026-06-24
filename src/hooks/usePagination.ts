import { useState } from 'react';

export interface IUsePaginationForDataGridProParams {
  initialPageSize: number;
  initialPage: number;
}

export const ROW_PER_PAGE_OPTIONS_DEFAULT = [10, 20, 50, 100];
export const ROW_PER_PAGE_DEFAULT = ROW_PER_PAGE_OPTIONS_DEFAULT[0];

export const usePagination = (props: IUsePaginationForDataGridProParams) => {
  const { initialPageSize = ROW_PER_PAGE_DEFAULT, initialPage = 0 } = props;
  const [paginationModel, setPaginationModel] = useState({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const handlePaginationChange = (model: { page: number; pageSize: number }) => {
    setPaginationModel(model);
  };

  return {
    paginationModel,
    handlePaginationChange,
  };
};
