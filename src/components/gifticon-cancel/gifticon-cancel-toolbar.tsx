'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  GIFTICON_UNUSED_ORDER_DEFAULT_FILTERS,
  type IGifticonOrderDateType,
  type IGifticonUnusedOrderFilters,
} from 'src/types/gifticons/gifticon_order';

// ----------------------------------------------------------------------

interface GifticonCancelToolbarProps {
  onApply: (filters: IGifticonUnusedOrderFilters) => void;
  onExport: () => Promise<void>;
}

// 구매내역/미사용취소 검색줄과 같은 필드 구성(이름·상품명·기프티콘 코드 + 기간).
export const GifticonCancelToolbar: React.FC<GifticonCancelToolbarProps> = ({
  onApply,
  onExport,
}) => {
  const [draft, setDraft] = useState<IGifticonUnusedOrderFilters>(
    GIFTICON_UNUSED_ORDER_DEFAULT_FILTERS
  );
  const [isExporting, setIsExporting] = useState(false);

  const patch = (next: Partial<IGifticonUnusedOrderFilters>) =>
    setDraft((prev) => ({ ...prev, ...next }));

  const submit = () => onApply(draft);

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } catch (error) {
      console.error('Failed to export cancelled gifticon orders:', error);
      toast.error('내보내기에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="srch">
      <div className="srch-row">
        <input
          className="search-box"
          placeholder="이름"
          value={draft.keyword}
          onChange={(e) => patch({ keyword: e.target.value })}
          onKeyDown={handleEnter}
        />
        <input
          className="search-box"
          placeholder="상품명"
          value={draft.productName}
          onChange={(e) => patch({ productName: e.target.value })}
          onKeyDown={handleEnter}
        />
        <input
          className="search-box"
          placeholder="기프티콘 코드"
          value={draft.voucherCode}
          onChange={(e) => patch({ voucherCode: e.target.value })}
          onKeyDown={handleEnter}
        />
      </div>
      <div className="srch-row">
        <select
          className="filter-sel"
          value={draft.dateType}
          onChange={(e) => patch({ dateType: e.target.value as IGifticonOrderDateType })}
        >
          <option value="PURCHASE">구매일</option>
          <option value="CANCEL">취소일</option>
        </select>
        <input
          className="form-input srch-date"
          type="date"
          value={draft.from}
          onChange={(e) => patch({ from: e.target.value })}
        />
        <span className="srch-tilde">~</span>
        <input
          className="form-input srch-date"
          type="date"
          value={draft.to}
          onChange={(e) => patch({ to: e.target.value })}
        />
        <button type="button" className="btn btn-primary btn-sm" onClick={submit}>
          검색
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{ marginLeft: 'auto' }}
          disabled={isExporting}
          onClick={handleExport}
        >
          {isExporting ? '내보내는 중…' : 'CSV 내보내기'}
        </button>
      </div>
    </div>
  );
};
