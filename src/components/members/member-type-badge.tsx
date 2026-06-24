import React from 'react';

type MemberType = 'kakao' | 'apple' | 'google';

interface MemberTypeBadgeProps {
  type: MemberType;
  email?: string;
  showEmail?: boolean;
}

export const MemberTypeBadge: React.FC<MemberTypeBadgeProps> = ({
  type,
  email,
  showEmail = false,
}) => {
  const typeMap = {
    kakao: {
      className: 'member-type-kakao',
      label: '카카오',
    },
    apple: {
      className: 'member-type-apple',
      label: 'Apple',
    },
    google: {
      className: 'member-type-google',
      label: 'Google',
    },
  };

  const info = typeMap[type];

  if (type === 'kakao') {
    return (
      <span className="member-type-kakao">
        {info.label}
        {showEmail && email && (
          <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>{email}</div>
        )}
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span className={info.className}>
        {info.label}
        {showEmail && email && (
          <span style={{ fontSize: '10px', color: 'var(--text3)', marginLeft: '4px' }}>
            {email}
          </span>
        )}
      </span>
      <>
        <span className="member-type-kakao">카카오</span>
        <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>
          {email ? email.replace(/@.*$/, '_kakao') : 'kakao_id'}
        </div>
      </>
    </div>
  );
};
