import { css } from '@emotion/react';

export const globalStyles = css`
  :root {
    --main: #845eee;
    --main-dark: #6c4ab6;
    --main-hover: #6c4ab6;
    --main-soft: rgba(132, 94, 238, 0.08);
    --main-line: rgba(132, 94, 238, 0.22);
    --amber: #d97706;
    --amber-soft: rgba(217, 119, 6, 0.1);

    --bg: #f4f1fb;
    --surface: #ffffff;
    --surface-2: #f8f7fc;
    --surface-3: #eee9f8;
    --border: #e4dff0;
    --border-soft: rgba(0, 0, 0, 0.05);

    --text: #1a1130;
    --text-2: #5a5370;
    --text-3: #9b93b0;

    --success: #16a34a;
    --success-soft: rgba(22, 163, 74, 0.1);
    --danger: #dc2626;
    --danger-soft: rgba(220, 38, 38, 0.1);
    --warning: #d97706;
    --warning-soft: rgba(217, 119, 6, 0.1);
    --info: #2563eb;
    --info-soft: rgba(37, 99, 235, 0.1);

    --bronze: #a0622a;
    --silver: #7a7a8c;
    --gold: #a07800;

    --r-sm: 6px;
    --r-md: 10px;
    --r-lg: 14px;
    --r-xl: 18px;
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 12px 36px rgba(0, 0, 0, 0.14);

    --sidebar-w: 240px;
    --font: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont,
      'Apple SD Gothic Neo', system-ui, sans-serif;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html,
  body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  /* ── 로그인 ── */
  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 60% 30%, rgba(132, 94, 238, 0.1), transparent 60%), #ede8f8;
  }
  .login-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px;
    width: 400px;
    box-shadow: var(--shadow-lg);
  }
  .login-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
  }
  .login-logo-mark {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--main), #9b78ff);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(132, 94, 238, 0.4);
  }
  .login-logo-text {
    font-size: 18px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.3px;
  }
  .login-logo-sub {
    font-size: 11px;
    color: var(--text-3);
    margin-top: 2px;
  }
  .login-title {
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 6px;
    letter-spacing: -0.4px;
  }
  .login-sub {
    font-size: 13px;
    color: var(--text-2);
    margin-bottom: 24px;
  }
  .role-select-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-2);
    margin-bottom: 8px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .role-btns {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }
  .role-btn {
    flex: 1;
    border: 1.5px solid var(--border);
    background: white;
    border-radius: var(--r-md);
    padding: 9px 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-2);
    cursor: pointer;
    font-family: var(--font);
    text-align: center;
    transition: all 0.15s;
  }
  .role-btn span {
    display: block;
    font-size: 9px;
    font-weight: 500;
    margin-top: 2px;
    opacity: 0.6;
  }
  .role-btn.active {
    border-color: var(--main);
    background: var(--main-soft);
    color: var(--main-hover);
  }
  .login-input {
    width: 100%;
    background: var(--surface-2);
    border: 1.5px solid var(--border);
    border-radius: var(--r-md);
    padding: 11px 14px;
    color: var(--text);
    font-size: 13px;
    outline: none;
    margin-bottom: 12px;
    font-family: var(--font);
    transition: border-color 0.15s;
  }
  .login-input:focus {
    border-color: var(--main);
  }
  .login-btn {
    width: 100%;
    background: var(--main);
    color: white;
    border: none;
    border-radius: var(--r-md);
    padding: 13px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
    font-family: var(--font);
    margin-top: 4px;
  }
  .login-btn:hover {
    background: var(--main-dark);
  }

  /* ── 레이아웃 ── */
  .app {
    display: flex;
    min-height: 100vh;
  }

  /* ── 사이드바 (포인츠허브 스타일) ── */
  :root {
    --sb-active: #6366f1;
    --sb-active-dk: #4f46e5;
    --sb-hover: #f5f3ff;
    --sb-text: #374151;
    --sb-sub: #9ca3af;
    --sb-bdr: #e5e7eb;
    --sb-mini-w: 60px;
  }

  .sidebar {
    width: var(--sidebar-w);
    background: #ffffff;
    border-right: 1.5px solid var(--sb-bdr);
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    z-index: 300;
    overflow: hidden;
    transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .sidebar.sb-mini {
    width: var(--sb-mini-w);
  }
  .sidebar.sb-mini + .main {
    margin-left: var(--sb-mini-w) !important;
  }

  /* 접기 토글 — position:fixed로 overflow:hidden 클리핑 우회 */
  .sb-toggle {
    position: fixed;
    top: 50vh;
    left: calc(var(--sidebar-w) - 14px);
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 310;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    color: #9ca3af;
    padding: 0;
    font-family: var(--font);
    transition: left 0.22s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s, color 0.15s;
  }
  .sidebar.sb-mini .sb-toggle {
    left: calc(var(--sb-mini-w) - 14px);
  }
  .sb-toggle:hover {
    border-color: var(--sb-active);
    color: var(--sb-active);
  }
  .sb-toggle svg {
    width: 12px;
    height: 12px;
    transition: transform 0.22s;
  }
  .sidebar.sb-mini .sb-toggle svg {
    transform: rotate(180deg);
  }

  /* 로고 */
  .sb-logo {
    padding: 14px 16px 12px;
    border-bottom: 1.5px solid var(--sb-bdr);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    min-height: 58px;
    overflow: hidden;
  }
  .sb-logo-mark {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #845eee, #6366f1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 10px rgba(99, 102, 241, 0.3);
  }
  .sb-logo-txt {
    overflow: hidden;
    white-space: nowrap;
    transition: opacity 0.15s, width 0.2s;
  }
  .sb-logo-name {
    font-size: 15px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.3px;
  }
  .sb-logo-sub {
    font-size: 10px;
    color: #9ca3af;
    margin-top: 2px;
  }
  .sidebar.sb-mini .sb-logo-txt {
    opacity: 0;
    width: 0;
  }

  /* 네비 스크롤 영역 */
  .sb-nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px 0 16px;
  }
  .sb-nav::-webkit-scrollbar {
    width: 3px;
  }
  .sb-nav::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 2px;
  }

  /* 그룹 */
  .sb-grp {
    margin-bottom: 2px;
  }
  .sb-grp-hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px 4px;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    transition: opacity 0.15s;
    white-space: nowrap;
  }
  .sb-grp-hd:hover {
    opacity: 0.7;
  }
  .sb-grp-lbl {
    font-size: 10px;
    font-weight: 700;
    color: #9ca3af;
    letter-spacing: 0.9px;
    text-transform: uppercase;
  }
  .sb-chev {
    flex-shrink: 0;
    color: #d1d5db;
    transition: transform 0.2s;
  }
  .sb-chev svg {
    width: 13px;
    height: 13px;
  }
  .sb-grp.collapsed .sb-chev {
    transform: rotate(-90deg);
  }
  .sb-grp-items {
    overflow: hidden;
    max-height: 600px;
    opacity: 1;
    transition: max-height 0.25s ease, opacity 0.2s ease;
  }
  .sb-grp.collapsed .sb-grp-items {
    max-height: 0;
    opacity: 0;
  }
  .sidebar.sb-mini .sb-grp-hd {
    display: none;
  }
  .sidebar.sb-mini .sb-grp-items {
    max-height: 600px !important;
    opacity: 1 !important;
  }
  /* 구분선 (mini 모드에서 그룹 경계) */
  .sidebar.sb-mini .sb-grp {
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 2px;
    margin-bottom: 2px;
  }

  /* 메뉴 항목 */
  .sb-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px 8px 18px;
    color: #374151;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.12s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-family: var(--font);
    position: relative;
    white-space: nowrap;
  }
  .sb-item:hover {
    background: var(--sb-hover);
    color: var(--sb-active);
  }
  .sb-item.active {
    background: var(--sb-active);
    color: #ffffff;
    font-weight: 600;
  }
  .sb-item.active:hover {
    background: var(--sb-active-dk);
  }
  .sb-item-ico {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sb-item-ico svg {
    width: 18px;
    height: 18px;
  }
  .sb-item.active .sb-item-ico svg {
    stroke: rgba(255, 255, 255, 0.9);
  }
  .sb-item-lbl {
    flex: 1;
    overflow: hidden;
  }
  .sb-item-badge {
    margin-left: auto;
    background: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: 700;
    border-radius: 10px;
    padding: 1px 7px;
    min-width: 18px;
    text-align: center;
    flex-shrink: 0;
  }
  .sb-item.active .sb-item-badge {
    background: rgba(255, 255, 255, 0.25);
  }

  /* mini 모드 항목 */
  .sidebar.sb-mini .sb-item {
    padding: 10px;
    justify-content: center;
  }
  .sidebar.sb-mini .sb-item-lbl {
    display: none;
  }
  .sidebar.sb-mini .sb-item-badge {
    display: none;
  }
  .sidebar.sb-mini .sb-item-ico {
    width: 20px;
    height: 20px;
  }
  .sidebar.sb-mini .sb-item-ico svg {
    width: 20px;
    height: 20px;
  }
  /* tooltip */
  .sidebar.sb-mini .sb-item::after {
    content: attr(data-label);
    position: absolute;
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    background: #1f2937;
    color: #fff;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s;
    z-index: 200;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  .sidebar.sb-mini .sb-item:hover::after {
    opacity: 1;
  }

  /* 하단 사용자 영역 */
  .sb-footer {
    padding: 12px 14px;
    border-top: 1.5px solid var(--sb-bdr);
    flex-shrink: 0;
    overflow: hidden;
  }
  .sb-user {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .sb-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--sb-active);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }
  .sb-user-info {
    overflow: hidden;
    white-space: nowrap;
  }
  .sb-user-name {
    font-size: 12px;
    font-weight: 700;
    color: #111827;
  }
  .sb-user-email {
    font-size: 10px;
    color: #9ca3af;
    margin-top: 1px;
  }
  .sb-footer-btns {
    display: flex;
    gap: 6px;
  }
  .sb-fbtn {
    flex: 1;
    background: transparent;
    color: #6b7280;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 7px 8px;
    font-size: 11px;
    cursor: pointer;
    font-family: var(--font);
    font-weight: 600;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    white-space: nowrap;
  }
  .sb-fbtn:hover {
    color: #111827;
    border-color: #9ca3af;
  }
  .sb-fbtn.sb-fbtn-del:hover {
    color: #ef4444;
    border-color: #ef4444;
    background: #fef2f2;
  }
  .sb-fbtn svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }
  /* mini 모드 footer */
  .sidebar.sb-mini .sb-user {
    justify-content: center;
    margin-bottom: 8px;
  }
  .sidebar.sb-mini .sb-user-info {
    display: none;
  }
  .sidebar.sb-mini .sb-footer {
    padding: 10px 8px;
  }
  .sidebar.sb-mini .sb-footer-btns {
    flex-direction: column;
  }
  .sidebar.sb-mini .sb-fbtn span {
    display: none;
  }

  /* ── 메인 ── */
  .main {
    margin-left: var(--sidebar-w);
    flex: 1;
    min-width: 0;
    transition: margin-left 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .topbar-bc {
    font-size: 12px;
    color: var(--text-3);
  }
  .topbar-bc svg {
    width: 12px;
    height: 12px;
    vertical-align: middle;
    margin: 0 2px;
  }
  .topbar-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }
  .topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .topbar-date {
    font-size: 12px;
    color: var(--text-2);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .topbar-icon {
    width: 34px;
    height: 34px;
    border-radius: var(--r-md);
    background: var(--surface-2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-2);
    cursor: pointer;
    transition: all 0.15s;
    position: relative;
  }
  .topbar-icon:hover {
    color: var(--text);
    border-color: var(--text-3);
  }
  .topbar-icon svg {
    width: 16px;
    height: 16px;
  }
  .topbar-icon .dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--danger);
    border: 2px solid var(--surface);
  }

  #ip-lang-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0;
    background: #ffffff;
    border: 1px solid #e3e0ec;
    border-radius: 999px;
    padding: 3px;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 10px rgba(90, 60, 150, 0.12);
  }
  #ip-lang-toggle span {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.4px;
    color: #9890ad;
    padding: 3px 12px;
    border-radius: 999px;
    line-height: 1.4;
    transition: background 0.15s, color 0.15s;
  }
  #ip-lang-toggle span.on {
    background: #845eee;
    color: #fff;
  }
  #ip-lang-toggle:hover {
    border-color: #845eee;
  }

  .role-chip {
    background: var(--main-soft);
    color: var(--main-hover);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--main-line);
  }
  .role-chip::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--main);
  }

  /* ── 섹션 ── */
  .section {
    display: none;
    padding: 26px;
  }
  .section.active {
    display: block;
    animation: fadeIn 0.2s ease-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ── 카드 ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
    margin-bottom: 16px;
  }
  .card-header {
    padding: 15px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
  .card-title {
    font-size: 14px;
    font-weight: 700;
  }
  .card-sub {
    font-size: 11px;
    color: var(--text-2);
    margin-top: 2px;
  }
  .card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  /* ── 통계 카드 ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 20px 22px;
    position: relative;
    overflow: hidden;
    transition: all 0.2s;
  }
  .stat-card:hover {
    border-color: var(--text-3);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }
  .stat-card.purple::before {
    background: linear-gradient(90deg, var(--main), var(--main-hover));
  }
  .stat-card.green::before {
    background: linear-gradient(90deg, var(--success), #06b6d4);
  }
  .stat-card.amber::before {
    background: linear-gradient(90deg, var(--amber), #fbbf24);
  }
  .stat-card.red::before {
    background: linear-gradient(90deg, var(--danger), #f97316);
  }
  .stat-card.blue::before {
    background: linear-gradient(90deg, var(--info), #7c3aed);
  }
  .stat-label {
    font-size: 11px;
    color: var(--text-2);
    margin-bottom: 10px;
    font-weight: 600;
    letter-spacing: -0.1px;
  }
  .stat-value {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }
  .stat-change {
    font-size: 11px;
    color: var(--success);
    margin-top: 6px;
    font-weight: 600;
  }
  .stat-change.down {
    color: var(--danger);
  }
  .stat-change.neutral {
    color: var(--text-2);
  }

  /* ── 테이블 ── */
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    text-align: center;
    padding: 10px 18px;
    font-size: 11px;
    color: var(--text-2);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 1px solid var(--border);
    background: var(--surface-2);
    white-space: nowrap;
    position: relative;
  }
  th:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 30%;
    height: 40%;
    width: 1px;
    background: rgba(0, 0, 0, 0.13);
  }
  td {
    padding: 12px 18px;
    font-size: 13px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    text-align: center !important;
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:hover td {
    background: var(--surface-2);
  }

  /* ── 배지 ── */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }
  .badge-purple {
    background: var(--main-soft);
    color: var(--main-hover);
  }
  .badge-green {
    background: var(--success-soft);
    color: var(--success);
  }
  .badge-red {
    background: var(--danger-soft);
    color: var(--danger);
  }
  .badge-amber {
    background: var(--amber-soft);
    color: var(--amber);
  }
  .badge-gray {
    background: rgba(155, 147, 176, 0.12);
    color: var(--text-2);
  }
  .badge-blue {
    background: var(--info-soft);
    color: var(--info);
  }

  .role-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
  }
  .role-tag.superadmin {
    background: var(--main-soft);
    color: var(--main-hover);
    border: 1px solid var(--main-line);
  }
  .role-tag.operator {
    background: var(--success-soft);
    color: var(--success);
  }
  .role-tag.cs {
    background: var(--info-soft);
    color: var(--info);
  }

  .tk-bronze {
    background: rgba(205, 127, 50, 0.15);
    color: var(--bronze);
    border: 1px solid rgba(205, 127, 50, 0.3);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
  .tk-silver {
    background: rgba(192, 192, 192, 0.15);
    color: var(--silver);
    border: 1px solid rgba(192, 192, 192, 0.25);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
  .tk-gold {
    background: rgba(255, 215, 0, 0.15);
    color: var(--gold);
    border: 1px solid rgba(255, 215, 0, 0.3);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
  .tk-event {
    background: rgba(168, 85, 247, 0.15);
    color: #c084fc;
    border: 1px solid rgba(168, 85, 247, 0.3);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  /* ── 버튼 ── */
  .btn {
    padding: 7px 14px;
    border-radius: var(--r-md);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    font-family: var(--font);
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .btn-primary {
    background: var(--main);
    color: white;
  }
  .btn-primary:hover {
    background: var(--main-dark);
  }
  .btn-ghost {
    background: transparent;
    color: var(--text-2);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover {
    color: var(--text);
    border-color: var(--text-2);
  }
  .btn-danger {
    background: var(--danger-soft);
    color: var(--danger);
  }
  .btn-danger:hover {
    background: rgba(239, 68, 68, 0.25);
  }
  .btn-success {
    background: var(--success-soft);
    color: var(--success);
  }
  .btn-warning {
    background: var(--amber-soft);
    color: var(--amber);
  }
  .btn-sm {
    padding: 5px 10px;
    font-size: 11px;
    border-radius: var(--r-sm);
  }
  .btn-disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ── 툴바/필터 ── */
  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    align-items: center;
    flex-wrap: wrap;
  }
  .search-box {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 8px 14px;
    color: var(--text);
    font-size: 13px;
    outline: none;
    font-family: var(--font);
    min-width: 200px;
    transition: border-color 0.15s;
  }
  .search-box:focus {
    border-color: var(--main);
  }
  .search-box::placeholder {
    color: var(--text-3);
  }
  .filter-sel {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 8px 12px;
    color: var(--text-2);
    font-size: 13px;
    outline: none;
    cursor: pointer;
    font-family: var(--font);
  }

  /* ── 정보 박스 ── */
  .info-box {
    background: var(--main-soft);
    border: 1px solid var(--main-line);
    border-radius: var(--r-md);
    padding: 12px 16px;
    font-size: 12px;
    color: var(--text-2);
    margin-bottom: 14px;
    line-height: 1.6;
  }
  .info-box strong {
    color: var(--main-hover);
  }
  .warn-box {
    background: var(--danger-soft);
    border: 1px solid rgba(239, 68, 68, 0.28);
    border-radius: var(--r-md);
    padding: 12px 16px;
    font-size: 12px;
    color: var(--text-2);
    margin-bottom: 14px;
    line-height: 1.6;
  }
  .warn-box strong {
    color: var(--danger);
  }
  .amber-box {
    background: var(--amber-soft);
    border: 1px solid rgba(245, 158, 11, 0.25);
    border-radius: var(--r-md);
    padding: 12px 16px;
    font-size: 12px;
    color: var(--text-2);
    margin-bottom: 14px;
    line-height: 1.6;
  }
  .amber-box strong {
    color: var(--amber);
  }

  .data-source-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 11px 16px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    margin-bottom: 14px;
    align-items: center;
    font-size: 12px;
  }
  .ds-label {
    color: var(--text-3);
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 4px;
  }
  .ds-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    border: 1px solid;
  }
  .ds-tag::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .ds-tag.ours {
    color: var(--success);
    border-color: rgba(16, 185, 129, 0.3);
    background: var(--success-soft);
  }
  .ds-tag.ours::before {
    background: var(--success);
  }
  .ds-tag.coupang {
    color: var(--amber);
    border-color: rgba(245, 158, 11, 0.3);
    background: var(--amber-soft);
  }
  .ds-tag.coupang::before {
    background: var(--amber);
  }
  .ds-tag.calc {
    color: var(--info);
    border-color: rgba(59, 130, 246, 0.3);
    background: var(--info-soft);
  }
  .ds-tag.calc::before {
    background: var(--info);
  }
  .ds-tag.policy {
    color: var(--main-hover);
    border-color: var(--main-line);
    background: var(--main-soft);
  }
  .ds-tag.policy::before {
    background: var(--main);
  }

  /* ── 차트 바 ── */
  .chart-bar-wrap {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 120px;
    padding: 4px 0 0;
  }
  .chart-bar-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    height: 100%;
    justify-content: flex-end;
  }
  .chart-bar {
    width: 100%;
    border-radius: 5px 5px 0 0;
    background: linear-gradient(180deg, #845eee, #6c4ab6);
    transition: all 0.2s;
    cursor: pointer;
    min-height: 5px;
  }
  .chart-bar:hover {
    filter: brightness(1.2);
  }
  .chart-bar.today {
    background: linear-gradient(180deg, var(--amber), #d97706);
    box-shadow: 0 0 14px rgba(245, 158, 11, 0.35);
  }
  .chart-value {
    font-size: 10px;
    font-weight: 700;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
  .chart-label {
    font-size: 10px;
    color: var(--text-2);
  }

  /* ── 스케줄러 ── */
  .scheduler-item {
    padding: 13px 18px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .scheduler-item:last-child {
    border-bottom: none;
  }
  .scheduler-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .scheduler-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .scheduler-dot.running {
    background: var(--success);
    box-shadow: 0 0 5px rgba(22, 163, 74, 0.4);
    animation: pulse 1.5s infinite;
  }
  .scheduler-dot.stopped {
    background: var(--danger);
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
  }
  .scheduler-name {
    font-size: 13px;
    font-weight: 600;
  }
  .scheduler-desc {
    font-size: 11px;
    color: var(--text-2);
    margin-top: 1px;
  }
  .scheduler-stat {
    text-align: right;
  }
  .scheduler-last {
    font-size: 11px;
    color: var(--text-2);
  }
  .scheduler-next {
    font-size: 12px;
    font-weight: 600;
    margin-top: 2px;
  }

  /* ── 배너 ── */
  .banner-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    padding: 16px;
  }
  .banner-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    overflow: hidden;
  }
  .banner-preview {
    height: 72px;
    display: flex;
    align-items: center;
    padding: 0 18px;
    font-size: 13px;
    font-weight: 700;
    color: white;
  }
  .banner-info {
    padding: 12px 14px;
  }
  .banner-name {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .banner-meta {
    font-size: 11px;
    color: var(--text-2);
  }
  .banner-actions {
    display: flex;
    gap: 6px;
    margin-top: 10px;
  }

  /* ── 이벤트 카드 ── */
  .event-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 16px;
    margin-bottom: 12px;
  }
  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  .event-title {
    font-size: 14px;
    font-weight: 700;
  }
  .event-period {
    font-size: 11px;
    color: var(--text-2);
    margin-bottom: 5px;
  }
  .event-desc {
    font-size: 12px;
    color: var(--text-2);
    line-height: 1.6;
  }
  .event-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }

  /* ── 정책 ── */
  .policy-item {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
  }
  .policy-item:last-child {
    border-bottom: none;
  }
  .policy-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-2);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .policy-value {
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .policy-desc {
    font-size: 11px;
    color: var(--text-2);
    margin-top: 3px;
  }

  /* ── 모달 ── */
  .modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(26, 17, 48, 0.35);
    z-index: 200;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
  }
  .modal-overlay.open {
    display: flex;
    animation: overlayIn 0.18s ease-out;
  }
  @keyframes overlayIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-xl);
    width: 500px;
    max-width: 95vw;
    max-height: 88vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    animation: modalIn 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  }
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  .modal-header {
    padding: 18px 22px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: var(--surface);
    z-index: 1;
  }
  .modal-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.2px;
  }
  .modal-close {
    cursor: pointer;
    background: transparent;
    border: none;
    color: var(--text-2);
    width: 30px;
    height: 30px;
    border-radius: var(--r-md);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .modal-close:hover {
    color: var(--text);
    background: var(--surface-2);
  }
  .modal-body {
    padding: 20px 22px;
  }
  .modal-footer {
    padding: 14px 22px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .push-preview {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 14px 16px;
    box-shadow: var(--shadow-md);
    max-width: 360px;
    margin: 0 auto;
  }
  .push-preview-app {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .push-preview-icon {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: var(--main);
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .push-preview-appname {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-2);
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .push-preview-time {
    font-size: 11px;
    color: var(--text-3);
    margin-left: auto;
  }
  .push-preview-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 3px;
  }
  .push-preview-body {
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.5;
    white-space: pre-wrap;
  }
  .form-group {
    margin-bottom: 14px;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .form-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-2);
    margin-bottom: 5px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .form-input {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 10px 13px;
    color: var(--text);
    font-size: 13px;
    outline: none;
    font-family: var(--font);
    transition: border-color 0.15s;
  }
  .form-input:focus {
    border-color: var(--main);
  }
  .form-select {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 10px 13px;
    color: var(--text);
    font-size: 13px;
    outline: none;
    font-family: var(--font);
  }
  .form-hint {
    font-size: 11px;
    color: var(--text-3);
    margin-top: 4px;
  }
  .field-error {
    font-size: 11px;
    color: var(--danger);
    margin-top: 4px;
    line-height: 1.5;
  }
  .form-input.has-error,
  .form-select.has-error {
    border-color: var(--danger);
  }
  .form-submit-error {
    background: var(--danger-soft);
    border: 1px solid rgba(220, 38, 38, 0.28);
    border-radius: var(--r-md);
    padding: 10px 13px;
    color: var(--danger);
    font-size: 12px;
    margin-top: 10px;
    line-height: 1.5;
  }
  textarea.form-input {
    resize: vertical;
    min-height: 80px;
  }
  .user-search {
    position: relative;
  }
  .user-search-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }
  .user-search-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 5px 6px 5px 12px;
    font-size: 12px;
    color: var(--text);
  }
  .user-search-chip button {
    border: none;
    background: transparent;
    color: var(--text-3);
    cursor: pointer;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 1;
    padding: 0;
  }
  .user-search-chip button:hover {
    background: var(--border);
    color: var(--text);
  }
  .tm-grade-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }
  .tm-grade-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    flex-shrink: 0;
    min-width: 44px;
  }
  .tm-stepper {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .tm-stepper-btn {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: var(--r-md);
    border: 1px solid var(--border);
    background: var(--surface-2);
    color: var(--text-2);
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-family: var(--font);
    transition: all .15s;
  }
  .tm-stepper-btn:hover {
    background: var(--surface);
    border-color: var(--text-2);
    color: var(--text);
  }
  .tm-stepper .form-input {
    width:64px;
    text-align:center;
    flex:none;
  }

  /* ── Pagination Wrapper ── */
  .pagination-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 12px;
  }

  .pagination-info {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 12px;
    color: var(--text-2);
  }

  .pagination-size-changer {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .pagination-size-changer .filter-sel {
    padding: 4px 8px;
    font-size: 12px;
    border-radius: var(--r-sm);
    border: 1px solid var(--border);
    background: var(--surface-2);
    color: var(--text-2);
    outline: none;
    cursor: pointer;
    font-family: var(--font);
  }

  .pagination-size-changer .filter-sel:focus {
    border-color: var(--main);
  }

  /* ── 페이지네이션 ── */
  .pagination {
    display: flex;
    gap: 5px;
    justify-content: center;
    padding: 16px;
  }
  .page-btn {
    width: 30px;
    height: 30px;
    border-radius: var(--r-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-2);
    transition: all 0.15s;
    font-family: var(--font);
  }
  .page-btn:hover,
  .page-btn.active {
    background: var(--main);
    color: white;
    border-color: var(--main);
  }

  /* ── 회원 유형 배지 ── */
  .member-type-kakao {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--main-soft);
    color: var(--main-hover);
    border: 1px solid var(--main-line);
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
  }
  .member-type-kakao::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--main);
    flex-shrink: 0;
  }
  .member-type-apple {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(31, 31, 31, 0.07);
    color: #1f1f1f;
    border: 1px solid rgba(31, 31, 31, 0.15);
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
  }
  .member-type-apple::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #1f1f1f;
    flex-shrink: 0;
  }
  .member-type-google {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(66, 133, 244, 0.08);
    color: #4285f4;
    border: 1px solid rgba(66, 133, 244, 0.2);
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
  }
  .member-type-google::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4285f4;
    flex-shrink: 0;
  }
  /* dark mode overrides for member types are in the .dark section */

  /* ── 티켓 칩 ── */
  .tk-chips {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
  }
  .tk-chip svg {
    display: block;
    flex-shrink: 0;
  }
  .tk-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    padding: 3px 7px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
  .tk-chip.bronze {
    background: rgba(205, 127, 50, 0.2);
    color: var(--bronze);
    border: 1px solid rgba(205, 127, 50, 0.35);
  }
  .tk-chip.silver {
    background: rgba(122, 122, 140, 0.12);
    color: var(--silver);
    border: 1px solid rgba(122, 122, 140, 0.25);
  }
  .tk-chip.gold {
    background: rgba(255, 215, 0, 0.18);
    color: var(--gold);
    border: 1px solid rgba(255, 215, 0, 0.35);
  }
  .tk-chip.event {
    background: rgba(168, 85, 247, 0.18);
    color: #c084fc;
    border: 1px solid rgba(168, 85, 247, 0.35);
  }
  .tk-chip.dim {
    opacity: 0.3;
  }
  .tk-chip.bare {
    background: none !important;
    border: none !important;
    padding: 0 2px !important;
  }
  /* ── 랜덤 → 전환예정 컬럼 ── */
  .rnd-chip-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
  .conv-arrow {
    font-size: 13px;
    color: var(--text3);
    line-height: 1;
  }
  .conv-preview {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 4px;
    align-items: center;
  }
  .conv-preview .tk-chip {
    font-size: 10px;
    padding: 2px 6px;
    min-width: auto;
  }

  /* ── 회원 목록 테이블: 모든 tk-chip 박스 제거 (SVG+숫자만 표시) ── */
  #sec-members table .tk-chip.bronze,
  #sec-members table .tk-chip.silver,
  #sec-members table .tk-chip.gold,
  #sec-members table .tk-chip.event,
  #sec-members table .tk-chip.random {
    background: transparent !important;
    border: none !important;
    padding: 2px 4px !important;
  }

  /* ── 회원 목록 테이블 컬럼 너비 ── */
  #sec-members table {
    table-layout: fixed;
    width: 100%;
  }
  #sec-members table th:nth-child(1) {
    width: 120px;
  } /* 닉네임 */
  #sec-members table th:nth-child(2) {
    width: 160px;
  } /* 가입 유형 */
  #sec-members table th:nth-child(3) {
    width: 90px;
  } /* 가입일 */
  #sec-members table th:nth-child(4) {
    width: 70px;
  } /* 랜덤 티켓 */
  #sec-members table th:nth-child(5) {
    width: 90px;
  } /* 전환예정 */
  #sec-members table th:nth-child(6) {
    width: 160px;
  } /* 등급 티켓 */
  #sec-members table th:nth-child(7) {
    width: 70px;
  } /* 이벤트 티켓 */
  #sec-members table th:nth-child(8) {
    width: 90px;
  } /* 마케팅 수신 */
  #sec-members table th:nth-child(9) {
    width: 60px;
  } /* 상태 */
  #sec-members table th:nth-child(10) {
    width: 60px;
  } /* 관리 */
  #sec-members table td,
  #sec-members table th {
    vertical-align: middle;
  }
  #sec-members table td {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── 마케팅 수신 배지 ── */
  .mkt-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }
  .mkt-badge.all {
    background: var(--success-soft);
    color: var(--success);
  }
  .mkt-badge.sel {
    background: var(--amber-soft);
    color: var(--amber);
  }
  .mkt-badge.none {
    background: var(--danger-soft);
    color: var(--danger);
  }

  /* ── 토글 ── */
  .toggle-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .toggle {
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background: var(--border);
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .toggle.on {
    background: var(--main);
  }
  .toggle::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  .toggle.on::after {
    transform: translateX(16px);
  }
  .toggle-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-2);
  }

  /* ── 색상 프리셋 ── */
  .color-presets {
    display: flex;
    gap: 8px;
    margin-top: 6px;
  }
  .color-dot {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.15s;
  }
  .color-dot:hover,
  .color-dot.sel {
    border-color: var(--text);
    transform: scale(1.12);
  }

  /* ── 토스트 ── */
  .toast {
    position: fixed;
    bottom: 26px;
    right: 26px;
    background: #1a1130;
    color: white;
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 11px 16px;
    font-size: 13px;
    font-weight: 600;
    box-shadow: var(--shadow-lg);
    z-index: 500;
    opacity: 0;
    transform: translateY(6px);
    transition: all 0.22s;
    pointer-events: none;
  }
  .toast.show {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Sonner 토스트 ── */
  /* sonner 기본 스타일은 :where()로 감싸져 있어 위의 전역 * 리셋(padding:0)에
     밀릴 수 있다. 속성 선택자로 명시해 우선순위를 확보한다. */
  [data-sonner-toaster] [data-sonner-toast] {
    padding: 14px 16px;
    border-radius: var(--r-md);
    box-shadow: var(--shadow-lg);
    font-size: 13px;
  }
  [data-sonner-toaster] [data-sonner-toast] [data-content] {
    gap: 2px;
  }
  [data-sonner-toaster] [data-sonner-toast] [data-title] {
    font-weight: 600;
  }
  [data-sonner-toaster] [data-sonner-toast] [data-description] {
    font-size: 12px;
    opacity: 0.85;
  }
  [data-sonner-toaster] [data-sonner-toast] [data-close-button] {
    padding: 0;
  }
  [data-sonner-toaster] [data-sonner-toast] [data-button] {
    padding-left: 8px;
    padding-right: 8px;
  }

  /* ── 약관 탭 ── */
  .terms-nav {
    display: flex;
    border-bottom: 1px solid var(--border);
    margin-bottom: 18px;
  }
  .terms-tab {
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-2);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.15s;
  }
  .terms-tab:hover {
    color: var(--text);
  }
  .terms-tab.active {
    color: var(--main);
    border-bottom-color: var(--main);
  }
  .terms-editor {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 14px;
    font-size: 13px;
    color: var(--text);
    line-height: 1.9;
    min-height: 360px;
    outline: none;
    font-family: var(--font);
    width: 100%;
    resize: vertical;
  }
  .terms-editor:focus {
    border-color: var(--main);
  }

  /* ── 1:1 문의 ── */
  .inquiry-item {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.12s;
  }
  .inquiry-item:hover {
    background: var(--surface-2);
  }
  .inquiry-item:last-child {
    border-bottom: none;
  }
  .inquiry-title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .inquiry-meta {
    font-size: 11px;
    color: var(--text-2);
    display: flex;
    gap: 12px;
  }

  /* ── 티켓 등급 카드 ── */
  .ticket-grade-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 16px;
    display: flex;
    gap: 14px;
    align-items: center;
    margin-bottom: 12px;
  }
  .ticket-grade-icon {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .ticket-grade-icon.bronze {
    background: rgba(205, 127, 50, 0.15);
  }
  .ticket-grade-icon.silver {
    background: rgba(192, 192, 192, 0.15);
  }
  .ticket-grade-icon.gold {
    background: rgba(255, 215, 0, 0.15);
  }
  .tk-svg-large {
    width: 40px;
    height: 60px;
    flex-shrink: 0;
    display: block;
  }
  .tk-svg-small {
    width: 18px;
    height: 26px;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
  }
  .ticket-grade-icon svg {
    display: block;
  }
  .ticket-grade-info {
    flex: 1;
  }
  .ticket-grade-name {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 3px;
  }
  .ticket-grade-range {
    font-size: 12px;
    color: var(--text-2);
  }
  .ticket-grade-benefit {
    font-size: 11px;
    margin-top: 3px;
  }

  /* ── 친구초대 ── */
  .invite-stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }
  .invite-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 16px;
    text-align: center;
  }
  .invite-card-value {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 4px;
    font-variant-numeric: tabular-nums;
  }
  .invite-card-label {
    font-size: 11px;
    color: var(--text-2);
  }

  /* ── 기프티콘 ── */
  .gifticon-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 16px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .gifticon-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--r-md);
    background: var(--main-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .gifticon-info {
    flex: 1;
  }
  .gifticon-name {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .gifticon-meta {
    font-size: 11px;
    color: var(--text-2);
  }
  .gifticon-actions {
    display: flex;
    gap: 6px;
  }

  /* ── 다크 테마 ── */
  .dark {
    --bg: #0b0c12;
    --surface: #111318;
    --surface-2: #181b24;
    --surface-3: #20232e;
    --border: #252836;
    --text: #e5e7eb;
    --text-2: #9ca3af;
    --text-3: #6b7280;
    --main-hover: #9b78ff;
    --main-soft: rgba(132, 94, 238, 0.12);
    --main-line: rgba(132, 94, 238, 0.28);
    --success: #10b981;
    --success-soft: rgba(16, 185, 129, 0.14);
    --danger: #ef4444;
    --danger-soft: rgba(239, 68, 68, 0.14);
    --amber: #f59e0b;
    --amber-soft: rgba(245, 158, 11, 0.14);
    --info: #3b82f6;
    --info-soft: rgba(59, 130, 246, 0.14);
    --bronze: #cd7f32;
    --silver: #a0a0b0;
    --gold: #d4a800;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.35);
    --shadow-lg: 0 12px 36px rgba(0, 0, 0, 0.45);
  }
  .dark .chart-bar {
    background: linear-gradient(180deg, #845eee, #6c4ab6);
  }
  .dark tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
  .dark th {
    background: rgba(255, 255, 255, 0.02);
  }
  .dark .login-wrap {
    background: radial-gradient(ellipse at 60% 30%, rgba(132, 94, 238, 0.15), transparent 60%), #0b0c12;
  }

  /* ── 사이드바 다크모드 ── */
  .dark {
    --sb-bdr: #252836;
    --sb-hover: rgba(99, 102, 241, 0.12);
    --sb-text: #d1d5db;
    --sb-sub: #6b7280;
  }
  .dark .sidebar {
    background: #111318;
    border-right-color: #252836;
  }
  .dark .sb-logo-name {
    color: #f9fafb;
  }
  .dark .sb-logo-sub {
    color: #6b7280;
  }
  .dark .sb-nav::-webkit-scrollbar-thumb {
    background: #252836;
  }
  .dark .sb-grp-lbl {
    color: #4b5563;
  }
  .dark .sb-chev {
    color: #374151;
  }
  .dark .sb-item {
    color: #9ca3af;
  }
  .dark .sb-item:hover {
    background: var(--sb-hover);
    color: #a5b4fc;
  }
  .dark .sb-grp {
    border-bottom-color: #1f2937;
  }
  .dark .sb-user-name {
    color: #f9fafb;
  }
  .dark .sb-user-email {
    color: #4b5563;
  }
  .dark .sb-fbtn {
    color: #6b7280;
    border-color: #252836;
  }
  .dark .sb-fbtn:hover {
    color: #e5e7eb;
    border-color: #4b5563;
    background: #1f2937;
  }
  .dark .sb-fbtn.sb-fbtn-del:hover {
    color: #fca5a5;
    border-color: #7f1d1d;
    background: rgba(127, 29, 29, 0.2);
  }
  .dark .sb-toggle {
    background: #111318;
    border-color: #252836;
    color: #6b7280;
  }
  .dark .sb-toggle:hover {
    border-color: var(--sb-active);
    color: var(--sb-active);
  }
  .dark .sidebar.sb-mini .sb-item::after {
    background: #1f2937;
  }

  /* ── 추가 유틸리티 ── */
  .yellow-box {
    background: rgba(255, 209, 102, 0.08);
    border: 1px solid rgba(255, 209, 102, 0.2);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 12px;
    color: var(--text-2);
    margin-bottom: 14px;
    line-height: 1.6;
  }
  .yellow-box strong {
    color: var(--amber);
  }
  .ticket-bronze {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(205, 127, 50, 0.15);
    color: var(--bronze);
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(205, 127, 50, 0.3);
  }
  .ticket-silver {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(192, 192, 192, 0.15);
    color: var(--silver);
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(192, 192, 192, 0.3);
  }
  .ticket-gold {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(255, 215, 0, 0.15);
    color: var(--gold);
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(255, 215, 0, 0.3);
  }
  .tk-chip.random {
    background: rgba(255, 107, 85, 0.15);
    color: #c8200a;
    border: 1px solid rgba(255, 107, 85, 0.35);
  }
  .ticket-event {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(168, 85, 247, 0.15);
    color: #c084fc;
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(168, 85, 247, 0.3);
  }
  .exclude-tag {
    display: inline-block;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    margin: 3px;
  }
  .exclude-tag .remove {
    color: var(--danger);
    cursor: pointer;
    margin-left: 6px;
  }

  /* 수동 수정 표시 */
  .manual-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    background: #fef3c7;
    color: #92400e;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 600;
    vertical-align: middle;
    margin-left: 4px;
  }
  .manual-badge svg {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
  }
  tr.manual-edited td {
    background: rgba(254, 243, 199, 0.15);
  }

  /* ═══════════════════════════════════════════
     모바일 반응형  (max-width: 768px)
     ─ 데스크탑 레이아웃은 건드리지 않음
     ═══════════════════════════════════════════ */

  /* 모바일 백드롭 */
  .mobile-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 290;
  }
  .mobile-backdrop.open {
    display: block;
    animation: fadeIn 0.2s ease-out;
  }

  /* 햄버거 버튼 (데스크탑에서는 숨김) */
  .mob-hamburger {
    display: none;
    width: 36px;
    height: 36px;
    border-radius: var(--r-md);
    border: 1px solid var(--border);
    background: var(--surface-2);
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-2);
    flex-shrink: 0;
    padding: 0;
    font-family: var(--font);
    transition: all 0.15s;
  }
  .mob-hamburger:hover {
    color: var(--text);
    border-color: var(--text-2);
  }
  .mob-hamburger svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    /* 햄버거 노출 / 데스크탑 접기 토글 숨김 */
    .mob-hamburger {
      display: flex;
    }
    .sb-toggle {
      display: none !important;
    }

    /* 사이드바: 오프-스크린 → 햄버거 탭 시 슬라이드인 */
    .sidebar {
      left: calc(-1 * var(--sidebar-w) - 20px);
      width: var(--sidebar-w) !important;
      transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .sidebar.sb-mini {
      left: calc(-1 * var(--sidebar-w) - 20px);
      width: var(--sidebar-w) !important;
    }
    .sidebar.mobile-open {
      left: 0;
      box-shadow: var(--shadow-lg);
    }

    /* 메인: 사이드바 마진 제거 → 풀폭 */
    .main {
      margin-left: 0 !important;
    }

    /* 드로어 열릴 때 body 스크롤 잠금 */
    body.mob-sb-open {
      overflow: hidden;
    }

    /* 탑바 */
    .topbar {
      padding: 0 12px;
      height: 52px;
      gap: 8px;
    }
    .topbar-date {
      display: none;
    }
    .role-chip {
      display: none;
    }
    .topbar-bc {
      display: none;
    }
    .topbar-title {
      font-size: 14px;
    }
    .topbar-left {
      gap: 8px;
    }

    /* 섹션 패딩 */
    .section {
      padding: 12px;
    }

    /* 통계 그리드 → 2열 */
    .stats-grid {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 14px;
    }
    .stat-card {
      padding: 14px 14px;
    }
    .stat-value {
      font-size: 20px;
    }

    /* 카드/배너/초대/폼 그리드 → 1열 */
    .card-grid {
      grid-template-columns: 1fr;
    }
    .banner-grid {
      grid-template-columns: 1fr;
      padding: 12px;
    }
    .invite-stat-grid {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .form-row {
      grid-template-columns: 1fr;
    }

    /* 테이블 가로 스크롤 — card 컨테이너가 스크롤 박스 역할 */
    .card {
      overflow-x: auto;
    }

    /* 검색/필터 */
    .search-box {
      min-width: 0;
      flex: 1;
    }
    .toolbar {
      flex-wrap: wrap;
      gap: 8px;
    }

    /* 스케줄러 */
    .scheduler-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .scheduler-stat {
      text-align: left;
    }

    /* 기프티콘 카드 */
    .gifticon-card {
      flex-wrap: wrap;
    }

    /* 모달 */
    .modal {
      width: calc(100vw - 24px) !important;
      max-width: 100% !important;
    }
    .modal-body {
      padding: 14px 16px;
    }
    .modal-header {
      padding: 14px 16px;
    }
    .modal-footer {
      padding: 10px 16px;
      flex-wrap: wrap;
    }

    /* 로그인 박스 */
    .login-box {
      width: calc(100vw - 32px);
      max-width: 400px;
      padding: 28px 20px;
    }

    /* 다크모드 사이드바 배경 보정 */
    .dark .sidebar.mobile-open {
      border-right-color: #252836;
    }
  }
`;