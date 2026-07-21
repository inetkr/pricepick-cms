import React from 'react';
import { ANNOUNCEMENT_TYPE_LABEL } from 'src/constants/announcement';
import type { IAnnouncement, IAnnouncementType } from 'src/types/announcement';
import type { PaginationProps } from '../common/pagination';
import { Pagination } from '../common/pagination';

interface AnnouncementTableProps {
  announcements: IAnnouncement[];
  pagination?: PaginationProps;
  onEdit: (announcement: IAnnouncement) => void;
  onDelete: (announcement: IAnnouncement) => void;
}

const TYPE_BADGE_CLASS: Record<IAnnouncementType, string> = {
  NORMAL: 'badge-gray',
  MAINTENANCE: 'badge-amber',
  UPDATE: 'badge-purple',
  POLICY_CHANGE: 'badge-red',
  EVENT: 'badge-green',
};

const renderDate = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
  announcements,
  pagination,
  onEdit,
  onDelete,
}) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">공지 목록</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>제목</th>
          <th style={{ textAlign: 'center' }}>분류</th>
          <th style={{ textAlign: 'center' }}>게시일</th>
          <th style={{ textAlign: 'center' }}>조회수</th>
          <th style={{ textAlign: 'center' }}>상태</th>
          <th style={{ textAlign: 'center' }}>관리</th>
        </tr>
      </thead>
      <tbody>
        {announcements.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              style={{ textAlign: 'center', padding: '32px', color: 'var(--text-2)' }}
            >
              등록된 공지가 없습니다.
            </td>
          </tr>
        ) : (
          announcements.map((announcement) => (
            <tr key={announcement.id}>
              <td style={{ fontWeight: 500 }}>{announcement.title}</td>
              <td style={{ textAlign: 'center' }}>
                <span className={`badge ${TYPE_BADGE_CLASS[announcement.type]}`}>
                  {ANNOUNCEMENT_TYPE_LABEL[announcement.type] || announcement.type}
                </span>
              </td>
              <td style={{ textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {renderDate(announcement.created_at)}
              </td>
              <td style={{ textAlign: 'center' }}>
                {announcement.view_count?.toLocaleString() ?? 0}
              </td>
              <td style={{ textAlign: 'center' }}>
                <span
                  className={`badge ${announcement.is_published ? 'badge-green' : 'badge-amber'}`}
                >
                  {announcement.is_published ? '게시' : '임시저장'}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onEdit(announcement)}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    // style={{ color: 'var(--danger)' }}
                    onClick={() => onDelete(announcement)}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    {pagination && <Pagination {...pagination} />}
  </div>
);
