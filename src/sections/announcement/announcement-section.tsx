'use client';

import React, { useState } from 'react';
import { AnnouncementEditModal } from 'src/components/announcement/announcement-edit-modal';
import { AnnouncementFormCard } from 'src/components/announcement/announcement-form-card';
import { AnnouncementStats } from 'src/components/announcement/announcement-stats';
import { AnnouncementTable } from 'src/components/announcement/announcement-table';
import type { PaginationProps } from 'src/components/common/pagination';
import { useAnnouncement } from 'src/sections/announcement/hooks/use-announcement';
import type { IAnnouncement } from 'src/types/announcement';

export const AnnouncementSection: React.FC = () => {
  const {
    announcements,
    stats,
    isLoading,
    isSaving,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalItems,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useAnnouncement();

  const [editingAnnouncement, setEditingAnnouncement] = useState<IAnnouncement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (announcement: IAnnouncement) => {
    setEditingAnnouncement(announcement);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleSaveEdit = async (id: string, data: { title: string; content: string }) => {
    const ok = await updateAnnouncement(id, data);
    if (ok) handleCloseEditModal();
  };

  const paginationProps: PaginationProps = {
    currentPage: page,
    totalPages,
    onPageChange: setPage,
    onItemsPerPageChange: setLimit,
    showSizeChanger: true,
    showTotal: true,
    totalItems,
    itemsPerPage: limit,
  };

  return (
    <div className="section active" id="sec-notice">
      <AnnouncementStats stats={stats} />
      <AnnouncementFormCard
        isSaving={isSaving}
        onSubmit={({ title, content, type, isPublished }) =>
          createAnnouncement({ title, content, type, is_published: isPublished })
        }
      />
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
          불러오는 중...
        </div>
      ) : (
        <AnnouncementTable
          announcements={announcements}
          pagination={paginationProps}
          onEdit={handleEdit}
          onDelete={deleteAnnouncement}
        />
      )}
      <AnnouncementEditModal
        isOpen={isEditModalOpen}
        announcement={editingAnnouncement}
        isSaving={isSaving}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
