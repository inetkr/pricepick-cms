'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from 'src/auth/hooks';

// Map đường dẫn đến breadcrumb và title
const PAGE_META: Record<string, { title: string; bc: string }> = {
  '/': { title: '대시보드', bc: '개요' },
  '/members': { title: '회원 목록', bc: '회원 관리' },
  '/tickets': { title: '티켓 내역', bc: '티켓 · 보상' },
  '/draws': { title: '추첨 관리', bc: '티켓 · 보상' },
  '/prizes': { title: '경품/응모 관리', bc: '티켓 · 보상' },
  '/attendance': { title: '주간 이벤트 추첨', bc: '티켓 · 보상' },
  // '/clawback': { title: '환수 이력', bc: '티켓 · 보상' },
  '/lucky-spin-config': { title: '행운룰렛 설정', bc: '티켓 · 보상' },
  '/points': { title: '포인트 내역', bc: '포인트 관리' },
  '/point-attendance': { title: '출석체크 설정', bc: '포인트 관리' },
  '/point-policy': { title: '포인트 정책', bc: '포인트 관리' },
  '/gifticons': { title: '구매/사용 내역', bc: '기프티콘 관리' },
  '/gifticon-cancel': { title: '취소 내역', bc: '기프티콘 관리' },
  '/gifticon-products': { title: '상품 목록', bc: '기프티콘 관리' },
  '/gifticon-bulk': { title: '상품설명 일괄등록', bc: '기프티콘 관리' },
  '/banners': { title: '배너 관리', bc: '콘텐츠' },
  '/events': { title: '이벤트 관리', bc: '콘텐츠' },
  '/invite': { title: '친구초대 관리', bc: '콘텐츠' },
  '/announcement': { title: '공지사항 관리', bc: '콘텐츠' },
  '/notifications': { title: '알림 관리', bc: '콘텐츠' },
  '/op-policy': { title: '운영 정책', bc: '운영' },
  '/terms': { title: '약관 관리', bc: '운영' },
  '/inquiries': { title: '1:1 문의', bc: '운영' },
  '/withdrawal': { title: '계정 탈퇴 처리', bc: '운영' },
  '/stats': { title: '수익 분석', bc: '매출 · 수익' },
  '/revenue': { title: '매출 내역', bc: '매출 · 수익' },
  '/settlement': { title: '정산 내역', bc: '매출 · 수익' },
  '/postback': { title: '포스트백 로그', bc: '시스템' },
  '/appver': { title: '앱 버전 관리', bc: '시스템' },
  '/apikeys': { title: '제휴몰 API 관리', bc: '시스템' },
  '/scheduler': { title: '스케줄러', bc: '시스템' },
  '/accounts': { title: '관리자 계정', bc: '계정 관리' },
};

export default function HeaderSection() {
  const pathname = usePathname();
  const [, setCurrentTime] = useState('');
  const { admin } = useAuthContext();
  const role = admin?.role === 'SUPERADMIN' ? '슈퍼어드민' : '관리자';
  const router = useRouter();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
          now.getDate()
        ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  const meta = PAGE_META[pathname.replace(/\/$/, '')] || { title: '대시보드', bc: '개요' };

  const handleNotificationClick = () => {
    // TODO: navigate to notifications
    router.push('/notifications');
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button type="button" className="mob-hamburger" title="메뉴">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="topbar-bc">
          <span>{meta.bc}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <div className="topbar-title">{meta.title}</div>
      </div>
      <div className="topbar-right">
        {/* <span className="topbar-date">{currentTime}</span>

        <button id="ip-lang-toggle" data-lang="ko" onClick={handleLanguageToggle}>
          <span data-l="ko" className="on">
            KO
          </span>
          <span data-l="vi">VI</span>
        </button> */}

        <div
          className="topbar-icon"
          role="button"
          tabIndex={0}
          onClick={handleNotificationClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleNotificationClick();
            }
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="dot" />
        </div>

        <span className="role-chip">{role}</span>
      </div>
    </div>
  );
}
