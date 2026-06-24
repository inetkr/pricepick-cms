'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { InfoBox } from 'src/components/common/info-box';
import { EventCard, EventData } from 'src/components/events/event-card';
import { EventFormData, EventModal } from 'src/components/events/event-modal';

// Mock data (từ file gốc)
const mockEvents: EventData[] = [
  {
    id: '1',
    title: '5월 출석 체크',
    period: '05/01 ~ 05/31',
    target: '전체 회원',
    description: '5일 연속 출석 달성 시 이벤트 티켓 1장 지급.',
    status: 'active',
  },
  {
    id: '2',
    title: '신규 가입 웰컴 보너스',
    period: '상시',
    target: '신규 가입자',
    description: '가입 즉시 이벤트 티켓 1장 + 200P 지급. (어뷰징 방지: 카카오 연동 후 지급)',
    status: 'active',
  },
  {
    id: '3',
    title: '첫 경유 구매 보너스',
    period: '상시',
    target: '신규 가입 7일 내',
    description:
      '첫 경유 구매(가입 7일 내) 시 골드 티켓 1장 지급. 구매 확정 후 지급(연동 D+7 / 미연동 D+30).',
    status: 'active',
  },
];

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>(mockEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: EventData) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (event: EventData) => {
    if (window.confirm(`"${event.title}" 이벤트를 삭제하시겠습니까?`)) {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      toast.success('이벤트가 삭제되었습니다.');
    }
  };

  const handleSaveEvent = (data: EventFormData) => {
    if (editingEvent) {
      // Edit existing event
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? {
                ...e,
                title: data.title,
                period: `${data.startDate} ~ ${data.endDate}`,
                target: targetLabels[data.target] || '전체 회원',
                status: data.isActive ? 'active' : 'inactive',
              }
            : e
        )
      );
      toast.success('이벤트가 수정되었습니다.');
    } else {
      // Add new event
      const newEvent: EventData = {
        id: Date.now().toString(),
        title: data.title,
        period: `${data.startDate} ~ ${data.endDate}`,
        target: targetLabels[data.target] || '전체 회원',
        description: `${data.ticketCount}장 지급 이벤트`,
        status: data.isActive ? 'active' : 'inactive',
      };
      setEvents((prev) => [...prev, newEvent]);
      toast.success('이벤트가 추가되었습니다.');
    }
    setIsModalOpen(false);
  };

  const targetLabels: Record<string, string> = {
    all: '전체 회원',
    new: '신규 가입자',
    bronze: '브론즈',
    silver: '실버',
    gold: '골드',
  };

  return (
    <div className="section active">
      <InfoBox>
        <strong>정책 확정 반영</strong> — 온보딩·이벤트 보상 확정 적용.
      </InfoBox>

      <div className="card">
        <div className="card-header">
          <div className="card-title">이벤트 관리</div>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleAddEvent}>
            + 이벤트 추가
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
              등록된 이벤트가 없습니다.
            </div>
          ) : (
            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))
          )}
        </div>
      </div>

      {/* <EventModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        title={editingEvent ? '이벤트 수정' : '이벤트 추가'}
        initialData={
          editingEvent
            ? {
                title: editingEvent.title,
                ticketCount: 1,
                target: 'all',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                isActive: editingEvent.status === 'active',
              }
            : undefined
        }
      /> */}
    </div>
  );
};
