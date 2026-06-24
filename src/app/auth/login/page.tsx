import { CONFIG } from 'src/config-global';

import { LoginContainer } from 'src/auth/view/login';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in - ${CONFIG.appName}` };

export default function Page() {
  return <LoginContainer />;
}
