'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PaginationProps } from 'src/components/common/table';
import { NoticeFilter } from 'src/components/notices/notice-filter';
import { NoticeForm, NoticeFormData } from 'src/components/notices/notice-form';
import { NoticeStats } from 'src/components/notices/notice-stats';
import { NoticeItem, NoticeTable } from 'src/components/notices/notice-table';

// Mock data
const mockNotices: NoticeItem[] = [
  {
    id: 1,
    title: '[점검] 5/15 새벽 서버 정기 점검 안내',
    category: 'maintenance',
    publishedDate: '2026/05/12',
    views: 1204,
    isPublished: true,
    isPinned: false,
  },
  {
    id: 2,
    title: 'v1.4.3 업데이트 안내 (ATT·포스트백 개선)',
    category: 'update',
    publishedDate: '2026/05/08',
    views: 3821,
    isPublished: true,
    isPinned: false,
  },
  {
    id: 3,
    title: '개인정보처리방침 개정 안내 (시행 6/1)',
    category: 'policy',
    publishedDate: '2026/05/05',
    views: 2015,
    isPublished: true,
    isPinned: false,
  },
  {
    id: 4,
    title: '제휴몰 추가 안내 (11번가·G마켓 오픈)',
    category: 'general',
    publishedDate: '2026/04/28',
    views: 5640,
    isPublished: true,
    isPinned: false,
  },
  {
    id: 5,
    title: '[임시저장] 여름 시즌 이벤트 사전 공지',
    category: 'event',
    publishedDate: '2026/05/13',
    views: 0,
    isPublished: false,
    isPinned: false,
  },
];

// Convert NoticeItem -> NoticeFormData for editing
const noticeToFormData = (notice: NoticeItem): NoticeFormData => ({
  id: notice.id,
  title: notice.title,
  category: notice.category,
  content: '공지 내용입니다...', // Giả định
  isPublished: notice.isPublished,
  isPinned: notice.isPinned,
});

export const NoticeSection: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>(mockNotices);
  const [filtered, setFiltered] = useState<NoticeItem[]>(mockNotices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const pageSize = 5;

  // Filter logic
  useEffect(() => {
    let result = notices;
    if (searchTerm) {
      result = result.filter(
        (n) => n.title.includes(searchTerm) || n.title.includes(searchTerm) // thêm content nếu có
      );
    }
    if (selectedCategory) {
      result = result.filter((n) => n.category === selectedCategory);
    }
    if (selectedStatus) {
      const isPublished = selectedStatus === 'published';
      result = result.filter((n) => n.isPublished === isPublished);
    }
    setFiltered(result);
    setCurrentPage(1);
  }, [notices, searchTerm, selectedCategory, selectedStatus]);

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const paginationProps: PaginationProps = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };

  // Handlers
  const handleCreate = (data: NoticeFormData) => {
    const newNotice: NoticeItem = {
      id: Date.now(),
      title: data.title,
      category: data.category,
      publishedDate: new Date().toISOString().split('T')[0],
      views: 0,
      isPublished: data.isPublished,
      isPinned: data.isPinned,
    };
    setNotices((prev) => [newNotice, ...prev]);
    toast.success('공지가 게시되었습니다.');
    setIsFormVisible(false);
  };

  const handleDraft = (data: NoticeFormData) => {
    const newNotice: NoticeItem = {
      id: Date.now(),
      title: data.title,
      category: data.category,
      publishedDate: new Date().toISOString().split('T')[0],
      views: 0,
      isPublished: false,
      isPinned: data.isPinned,
    };
    setNotices((prev) => [newNotice, ...prev]);
    toast.success('임시저장되었습니다.');
    setIsFormVisible(false);
  };

  const handleEdit = (notice: NoticeItem) => {
    setEditingNotice(notice);
    setIsFormVisible(true);
  };

  const handleUpdate = (data: NoticeFormData) => {
    if (!editingNotice) return;
    setNotices((prev) =>
      prev.map((n) =>
        n.id === editingNotice.id
          ? {
              ...n,
              title: data.title,
              category: data.category,
              isPublished: data.isPublished,
              isPinned: data.isPinned,
            }
          : n
      )
    );
    toast.success('공지가 수정되었습니다.');
    setIsFormVisible(false);
    setEditingNotice(null);
  };

  const handleDelete = (item: NoticeItem) => {
    setNotices((prev) => prev.filter((n) => n.id !== item.id));
    toast.success('공지가 삭제되었습니다.');
  };

  const handleToggleStatus = (item: NoticeItem) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isPublished: !n.isPublished } : n))
    );
    toast.success(`공지가 ${item.isPublished ? '숨김' : '노출'} 처리되었습니다.`);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingNotice(null);
  };

  return (
    <div className="section active">
      <NoticeStats
        published={notices.filter((n) => n.isPublished).length}
        monthlyCreated={notices.filter((n) => n.publishedDate.startsWith('2026/05')).length}
        drafts={notices.filter((n) => !n.isPublished).length}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingNotice(null);
            setIsFormVisible(true);
          }}
        >
          + 새 공지 작성
        </button>
      </div>

      {isFormVisible && (
        <NoticeForm
          initialData={editingNotice ? noticeToFormData(editingNotice) : undefined}
          onSubmit={editingNotice ? handleUpdate : handleCreate}
          onDraft={handleDraft}
          onCancel={handleCancelForm}
          isEditing={!!editingNotice}
        />
      )}

      <NoticeFilter
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setSelectedStatus}
      />

      <NoticeTable
        data={paginatedData}
        pagination={paginationProps}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};
