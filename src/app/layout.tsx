import 'src/global.css';

// ----------------------------------------------------------------------

import type { Viewport } from 'next';
import { CONFIG } from 'src/config-global';
import { LocalizationProvider } from 'src/locales';
import { detectLanguage } from 'src/locales/server';
import { I18nProvider } from 'src/locales/i18n-provider';
// import { AuthProvider } from 'src/auth/context/authContext';
// import { ThemeProvider } from 'src/context/theme-context';
import { AppThemeProvider } from 'src/theme/theme-provider';
import { AuthProvider } from 'src/auth/context/authContext/auth-provider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const lang = CONFIG.isStaticExport ? 'en' : await detectLanguage();

  return (
    <html lang={lang ?? 'kr'} suppressHydrationWarning>
      <body>
        <I18nProvider lang={CONFIG.isStaticExport ? undefined : lang}>
          <LocalizationProvider>
            <AuthProvider>
              <AppThemeProvider>{children}</AppThemeProvider>
            </AuthProvider>
          </LocalizationProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
