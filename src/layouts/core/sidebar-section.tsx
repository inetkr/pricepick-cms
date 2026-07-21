'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  AdminIcon,
  ApiIcon,
  AppIcon,
  BannerIcon,
  BellIcon,
  BulkIcon,
  CancelIcon,
  ChartIcon,
  ChatIcon,
  DashboardIcon,
  DrawIcon,
  EventIcon,
  GiftIcon,
  InviteIcon,
  MembersIcon,
  PointsIcon,
  PolicyIcon,
  PostbackIcon,
  LuckySpinIcon,
  PrizeIcon,
  ProductIcon,
  RevenueIcon,
  ScheduleIcon,
  SettlementIcon,
  TermsIcon,
  TicketIcon,
  WithdrawIcon,
  AttendanceIcon,
  PointPolicyIcon,
  AnnouncementIcon,
  AbuseIcon,
} from './Icons';
import { authAPI } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  disabled?: boolean;
};

type MenuGroup = {
  id: string;
  label: string;
  items: MenuItem[];
};

const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'grp-main',
    label: '개요',
    items: [{ id: 'dashboard', label: '대시보드', icon: <DashboardIcon />, href: '/' }],
  },
  {
    id: 'grp-revenue',
    label: '매출 · 수익',
    items: [
      { id: 'stats', label: '수익 분석', icon: <ChartIcon />, href: '/stats', disabled: true },
      {
        id: 'revenue',
        label: '매출 내역',
        icon: <RevenueIcon />,
        href: '/revenue',
        disabled: true,
      },
      {
        id: 'settlement',
        label: '정산 내역',
        icon: <SettlementIcon />,
        href: '/settlement',
        disabled: true,
      },
    ],
  },
  {
    id: 'grp-members',
    label: '회원 관리',
    items: [{ id: 'members', label: '회원 목록', icon: <MembersIcon />, href: '/members' }],
  },
  {
    id: 'grp-ticket',
    label: '티켓 · 보상',
    items: [
      { id: 'tickets', label: '티켓 내역', icon: <TicketIcon />, href: '/tickets' },
      {
        id: 'draws',
        label: '추첨 관리',
        icon: <DrawIcon />,
        href: '/draws',
        badge: 1,
        disabled: true,
      },
      {
        id: 'prizes',
        label: '경품/응모 관리',
        icon: <PrizeIcon />,
        href: '/prizes',
        disabled: true,
      },
      {
        id: 'attendance',
        label: '주간 이벤트 추첨',
        icon: <AttendanceIcon />,
        href: '/attendance',
        disabled: true,
      },
      {
        id: 'lucky-spin-config',
        label: '행운룰렛 설정',
        icon: <LuckySpinIcon />,
        href: '/lucky-spin-config',
      },
      // { id: 'clawback', label: '환수 이력', icon: <ClawbackIcon />, href: '/clawback' },
    ],
  },
  {
    id: 'grp-points',
    label: '포인트 관리',
    items: [
      { id: 'points', label: '포인트 내역', icon: <PointsIcon />, href: '/points' },
      {
        id: 'point-attendance',
        label: '출석체크 설정',
        icon: <AttendanceIcon />,
        href: '/point-attendance',
      },
      {
        id: 'point-policy',
        label: '포인트 정책',
        icon: <PointPolicyIcon />,
        href: '/point-policy',
      },
    ],
  },
  {
    id: 'grp-gifticon',
    label: '기프티콘 관리',
    items: [
      {
        id: 'gifticons',
        label: '구매/사용 내역',
        icon: <GiftIcon />,
        href: '/gifticons',
        disabled: true,
      },
      {
        id: 'gifticon-cancel',
        label: '취소 내역',
        icon: <CancelIcon />,
        href: '/gifticon-cancel',
        disabled: true,
      },
      {
        id: 'gifticon-products',
        label: '상품 목록',
        icon: <ProductIcon />,
        href: '/gifticon-products',
        disabled: true,
      },
      {
        id: 'gifticon-bulk',
        label: '상품설명 일괄등록',
        icon: <BulkIcon />,
        href: '/gifticon-bulk',
        disabled: true,
      },
    ],
  },
  {
    id: 'grp-content',
    label: '콘텐츠',
    items: [
      { id: 'banners', label: '배너 관리', icon: <BannerIcon />, href: '/banners', disabled: true },
      { id: 'events', label: '이벤트 관리', icon: <EventIcon />, href: '/events', disabled: true },
      {
        id: 'invite',
        label: '친구초대 관리',
        icon: <InviteIcon />,
        href: '/invite',
        disabled: true,
      },
      {
        id: 'announcement',
        label: '공지사항 관리',
        icon: <AnnouncementIcon />,
        href: '/announcement',
      },
      { id: 'notifications', label: '알림 관리', icon: <BellIcon />, href: '/notifications' },
    ],
  },
  {
    id: 'grp-ops',
    label: '운영',
    items: [
      { id: 'op-policy', label: '운영 정책', icon: <PolicyIcon />, href: '/op-policy' },
      { id: 'terms', label: '약관 관리', icon: <TermsIcon />, href: '/terms' },
      { id: 'inquiries', label: '1:1 문의', icon: <ChatIcon />, href: '/inquiries' },
      { id: 'withdrawal', label: '계정 탈퇴 처리', icon: <WithdrawIcon />, href: '/withdrawal' },
      {
        id: 'abuse',
        label: '어뷰징·이상적립 모니터링',
        icon: <AbuseIcon />,
        href: '/abuse',
        disabled: true,
      },
    ],
  },
  {
    id: 'grp-system',
    label: '시스템',
    items: [
      {
        id: 'postback',
        label: '포스트백 로그',
        icon: <PostbackIcon />,
        href: '/postback',
        disabled: true,
      },
      { id: 'appver', label: '앱 버전 관리', icon: <AppIcon />, href: '/appver', disabled: true },
      {
        id: 'apikeys',
        label: '제휴몰 API 관리',
        icon: <ApiIcon />,
        href: '/apikeys',
        disabled: true,
      },
      {
        id: 'scheduler',
        label: '스케줄러',
        icon: <ScheduleIcon />,
        href: '/scheduler',
        disabled: true,
      },
    ],
  },
  {
    id: 'grp-admin',
    label: '계정 관리',
    items: [{ id: 'accounts', label: '관리자 계정', icon: <AdminIcon />, href: '/accounts' }],
  },
];

export default function SidebarSection() {
  const pathname = usePathname();
  const { logout, admin } = useAuthContext();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [isMini, setIsMini] = useState(false);
  const [user] = useState({
    name: admin?.username || '관리자',
    email: admin?.email || '',
    avatar: admin?.username ? admin.username.charAt(0).toUpperCase() : 'A',
  });

  // Toggle group thu gọn
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Toggle sidebar mini mode
  const toggleSidebar = () => {
    setIsMini(!isMini);
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    await authAPI.logout().finally(() => {
      logout();
      router.push('/auth/login');
    });
  };

  // Chuyển theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className={`sidebar ${isMini ? 'sb-mini' : ''}`}>
      {/* Nút thu gọn sidebar (desktop) */}
      <button type="button" className="sb-toggle" onClick={toggleSidebar} title="메뉴 접기/펼치기">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Logo */}
      <div className="sb-logo">
        <div className="sb-logo-mark">
          <svg width="20" height="20" viewBox="0 0 360 363" fill="none">
            <path
              d="M178.702 82.69C125.37 82.69 82.14 125.94 82.14 179.29V277.43H115.61V252.41C132.54 267.04 154.59 275.87 178.7 275.87C232.03 275.87 275.27 232.62 275.27 179.28C275.27 125.93 232.03 82.68 178.7 82.68L178.702 82.69ZM178.7 242.4C143.85 242.4 115.61 214.15 115.61 179.29C115.61 144.43 143.85 116.18 178.7 116.18C213.55 116.18 241.79 144.43 241.79 179.29C241.79 214.15 213.55 242.4 178.7 242.4Z"
              fill="white"
            />
            <path
              d="M180 0C80.59 0 0 80.62 0 180.06V363H62.4V316.37C93.94 343.63 135.04 360.12 180 360.12C279.41 360.12 360 279.5 360 180.06C360 80.62 279.42 0 180 0ZM180 297.7C115.05 297.7 62.4 245.02 62.4 180.06C62.4 115.1 115.06 62.42 180 62.42C244.94 62.42 297.6 115.1 297.6 180.06C297.6 245.02 244.94 297.7 180 297.7Z"
              fill="rgba(255,255,255,0.65)"
            />
          </svg>
        </div>
        <div className="sb-logo-txt">
          <div className="sb-logo-name">PricePick</div>
          <div className="sb-logo-sub">Admin Panel</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sb-nav">
        {MENU_GROUPS.map((group) => (
          <div key={group.id} className={`sb-grp ${collapsedGroups[group.id] ? 'collapsed' : ''}`}>
            <div
              className="sb-grp-hd"
              role="button"
              tabIndex={0}
              onClick={() => toggleGroup(group.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleGroup(group.id);
                }
              }}
            >
              <span className="sb-grp-lbl">{group.label}</span>
              <span className="sb-chev">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
            <div className="sb-grp-items">
              {group.items.map((item) => {
                const isActive = pathname.replace(/\/$/, '') === item.href.replace(/\/$/, '');
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`sb-item ${isActive ? 'active' : ''} ${item.disabled ? 'btn-disabled' : ''}`}
                    data-label={item.label}
                    disabled={item.disabled}
                    onClick={() => !item.disabled && router.push(item.href)}
                  >
                    <span className="sb-item-ico">{item.icon}</span>
                    <span className="sb-item-lbl">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="sb-item-badge">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer user area */}
      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-avatar">{user.avatar}</div>
          <div className="sb-user-info">
            <div className="sb-user-name">{user.name}</div>
            <div className="sb-user-email">{user.email}</div>
          </div>
        </div>
        <div className="sb-footer-btns">
          <button type="button" className="sb-fbtn" onClick={toggleTheme}>
            <svg
              className="theme-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              {theme === 'dark' ? (
                <circle cx="12" cy="12" r="5" />
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              )}
            </svg>
            <span>{theme === 'dark' ? '라이트 모드' : '다크 모드'}</span>
          </button>
          <button type="button" className="sb-fbtn sb-fbtn-del" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
