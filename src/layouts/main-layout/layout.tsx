'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import HeaderSection from '../core/header-section';
import SidebarSection from '../core/sidebar-section';

export type MainLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function MainLayout({ sx, children, header }: MainLayoutProps) {
  return (
    <div className="app">
      <SidebarSection />
      <main className="main">
        <HeaderSection />
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
