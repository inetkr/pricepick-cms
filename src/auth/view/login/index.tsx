'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import { signIn } from 'src/auth/context/authContext';
import { useAuthContext } from 'src/auth/hooks';
import { DialogMessageIcon, useDialogMessage } from 'src/context/dialog-message-context';

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  username: zod.string().min(1, { message: 'Username is required!' }),
  password: zod.string().min(1, { message: 'Password is required!' }),
});

// ----------------------------------------------------------------------

export function LoginContainer() {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { showMessageIcon } = useDialogMessage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ username, password });
      await checkUserSession();
      router.push('/');
    } catch (error) {
      console.error('Error during sign in:', error);
      showMessageIcon('로그인에 실패했습니다. 다시 시도해주세요.', DialogMessageIcon.alert);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-mark">
            <svg width="22" height="22" viewBox="0 0 360 363" fill="none">
              <path
                d="M178.702 82.69C125.37 82.69 82.14 125.94 82.14 179.29V277.43H115.61V252.41C132.54 267.04 154.59 275.87 178.7 275.87C232.03 275.87 275.27 232.62 275.27 179.28C275.27 125.93 232.03 82.68 178.7 82.68L178.702 82.69ZM178.7 242.4C143.85 242.4 115.61 214.15 115.61 179.29C115.61 144.43 143.85 116.18 178.7 116.18C213.55 116.18 241.79 144.43 241.79 179.29C241.79 214.15 213.55 242.4 178.7 242.4Z"
                fill="white"
              />
              <path
                d="M180 0C80.59 0 0 80.62 0 180.06V363H62.4V316.37C93.94 343.63 135.04 360.12 180 360.12C279.41 360.12 360 279.5 360 180.06C360 80.62 279.42 0 180 0ZM180 297.7C115.05 297.7 62.4 245.02 62.4 180.06C62.4 115.1 115.06 62.42 180 62.42C244.94 62.42 297.6 115.1 297.6 180.06C297.6 245.02 244.94 297.7 180 297.7Z"
                fill="rgba(255,255,255,0.7)"
              />
            </svg>
          </div>
          <div>
            <div className="login-logo-text">PricePick CMS</div>
            <div className="login-logo-sub">v{process.env.NEXT_PUBLIC_VERSION} · 관리자 전용</div>
          </div>
        </div>

        <div className="login-title">로그인</div>
        <div className="login-sub">권한에 따라 접근 메뉴가 달라집니다.</div>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="이메일"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
