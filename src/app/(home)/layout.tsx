import { AuthGuard } from 'src/auth/guard';
import { MainLayout } from 'src/layouts/main-layout';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <MainLayout>
      <AuthGuard>{children}</AuthGuard>
    </MainLayout>
  );
}
