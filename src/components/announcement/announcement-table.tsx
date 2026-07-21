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
  UPDATE: 'badge-blue',
  POLICY_CHANGE: 'badge-purple',
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
          <th>분류</th>
          <th>게시일</th>
          <th>조회수</th>
          <th>노출</th>
          <th>관리</th>
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
              <td>
                <span className={`badge ${TYPE_BADGE_CLASS[announcement.type]}`}>
                  {ANNOUNCEMENT_TYPE_LABEL[announcement.type] || announcement.type}
                </span>
              </td>
              <td>{renderDate(announcement.created_at)}</td>
              <td>{announcement.view_count?.toLocaleString() ?? 0}</td>
              <td>
                <span
                  className={`badge ${announcement.is_published ? 'badge-green' : 'badge-gray'}`}
                >
                  {announcement.is_published ? '노출' : '숨김'}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
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
                    style={{ color: 'var(--danger)' }}
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
