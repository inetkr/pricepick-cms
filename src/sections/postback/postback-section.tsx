'use client';

import React, { useState } from 'react';
import { PostbackCoupangTable } from 'src/components/postback/postback-coupang-table';
import { PostbackLinkpriceTable } from 'src/components/postback/postback-linkprice-table';
import { PostbackNoticeModal } from 'src/components/postback/postback-notice-modal';
import { PostbackTabs } from 'src/components/postback/postback-tabs';
import { usePostback } from 'src/sections/postback/hooks/use-postback';

/* 포스트백 로그 — 제휴사가 보내온 값을 「받은 그대로」 확인하는 화면이다.
   계산해서 만든 값(제휴 수수료 매출·환수 금액·적립 예상)은 여기 두지 않는다.
   두 제휴사는 수신 필드가 하나도 겹치지 않아 한 표에 섞지 않고 탭으로 가른다 —
   각 탭이 자기 검색·거르개를 갖고 서로 건드리지 않는다.
   화면에는 값만 두고, 왜 그런지는 「Notice !」 모달로 넣는다. */
export const PostbackSection: React.FC = () => {
  const pb = usePostback();
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  const shared = {
    rows: pb.rows,
    count: pb.count,
    isLoading: pb.isLoading,
    page: pb.page,
    totalPages: pb.totalPages,
    onPageChange: pb.setPage,
  };

  return (
    <div className="section active" id="sec-postback">
      <button type="button" className="ta-notice" onClick={() => setIsNoticeOpen(true)}>
        <span>포스트백 로그 Notice</span>
        <span className="ta-notice-mark">!</span>
      </button>

      <PostbackTabs active={pb.tab} onChange={pb.changeTab} />

      {pb.tab === 'coupang' ? (
        <PostbackCoupangTable {...shared} {...pb.coupang} />
      ) : (
        <PostbackLinkpriceTable {...shared} {...pb.linkprice} />
      )}

      <PostbackNoticeModal open={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} />
    </div>
  );
};
