'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { InfoBox } from 'src/components/common/info-box';
import type { PaginationProps } from 'src/components/common/pagination';
import { BulkHistoryTable } from 'src/components/gifticon-bulk/bulk-history-table';
import { BulkPreviewTable } from 'src/components/gifticon-bulk/bulk-preview-table';
import { BulkTabs, type IBulkTab } from 'src/components/gifticon-bulk/bulk-tabs';
import { BulkTemplateDownload } from 'src/components/gifticon-bulk/bulk-template-download';
import { BulkUploadArea } from 'src/components/gifticon-bulk/bulk-upload-area';
import { BulkWarningBox } from 'src/components/gifticon-bulk/bulk-warning-box';
import type {
  IGifticonBulkHistoryEntry,
  IGifticonBulkRow,
} from 'src/types/gifticon-bulk/gifticon_bulk';
import {
  downloadGifticonBulkTemplate,
  MOCK_GIFTICON_BULK_HISTORY,
  parseGifticonBulkFile,
} from 'src/utils/gifticon-bulk';

// TODO(API 연동): 지금은 파싱한 파일 내용을 브라우저 메모리에만 담아 미리보기를 채운다.
// 백엔드 API가 준비되면 handleSubmit이 실제 등록 요청을 보내고, 성공/실패는 응답 기준으로
// 행마다 반영하며, 히스토리도 서버에 남긴 기록을 조회하도록 교체한다.
const PAGE_SIZE = 20;
let historySeq = 0;

export const GifticonBulkSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IBulkTab>('new');
  const [rows, setRows] = useState<IGifticonBulkRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<IGifticonBulkHistoryEntry[]>(MOCK_GIFTICON_BULK_HISTORY);

  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagedRows = rows.slice(startIndex, startIndex + PAGE_SIZE);

  const summary = useMemo(() => {
    const ok = rows.filter((r) => r.status === 'DONE').length;
    const fail = rows.filter((r) => r.status === 'ERROR').length;
    return { total: rows.length, ok, fail };
  }, [rows]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result ?? '');
      let parsed;
      try {
        parsed = parseGifticonBulkFile(text);
      } catch (err) {
        toast.error(`파일을 읽지 못했습니다: ${err instanceof Error ? err.message : String(err)}`);
        return;
      }
      setFileName(file.name);
      setCurrentPage(1);
      setRows(parsed.rows);
      if (!parsed.rows.length) {
        toast.error('읽을 수 있는 줄이 없습니다.');
        return;
      }
      toast.success(
        `${file.name} — ${parsed.rows.length}건 읽음${
          parsed.duplicateCount ? ` (상품코드 중복 ${parsed.duplicateCount}건 제외)` : ''
        }`
      );
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleSubmit = () => {
    if (!rows.length || isSubmitting) return;
    setIsSubmitting(true);
    // 실제 API가 없으므로 전부 성공 처리로 시뮬레이션한다.
    const doneRows = rows.map((r) => ({ ...r, status: 'DONE' as const }));
    setRows(doneRows);
    const ok = doneRows.length;
    toast.success(`${ok}개 상품을 등록했습니다.`);
    historySeq += 1;
    setHistory((prev) => [
      {
        id: `bulk-hist-new-${historySeq}`,
        fileName,
        createdAt: dayjs().toISOString(),
        total: doneRows.length,
        ok,
        fail: 0,
      },
      ...prev,
    ]);
    setIsSubmitting(false);
  };

  const paginationProps: PaginationProps = {
    currentPage: safePage,
    totalPages,
    totalItems,
    onPageChange: setCurrentPage,
    showTotal: true,
    showSizeChanger: false,
    itemsPerPage: PAGE_SIZE,
  };

  return (
    <div className="section active">
      <BulkTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'new' ? (
        <>
          <InfoBox>
            CSV 또는 JSON 파일로 상품 설명을 일괄 등록·수정합니다. 상품코드가 일치하는 항목은
            덮어쓰기됩니다.
          </InfoBox>

          <BulkTemplateDownload
            onDownload={downloadGifticonBulkTemplate}
            className="card"
            style={{ padding: '16px 18px', marginBottom: '16px' }}
          />

          <BulkUploadArea onFileUpload={handleFileUpload} />

          <BulkWarningBox />

          <div className="card">
            <div className="bt-head">
              <span className="bt-sum">
                대량 가져오기 (총 {summary.total} / 성공 {summary.ok} , 실패 {summary.fail})
              </span>
              {rows.length > 0 && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? '등록 중…' : '등록 실행'}
                </button>
              )}
            </div>
            <BulkPreviewTable
              data={pagedRows}
              startIndex={startIndex}
              pagination={rows.length > 0 ? paginationProps : undefined}
            />
          </div>
        </>
      ) : (
        <div className="card">
          <div className="bt-head">
            <span className="bt-sum">가져오기 이력</span>
          </div>
          <BulkHistoryTable data={history} />
        </div>
      )}
    </div>
  );
};
