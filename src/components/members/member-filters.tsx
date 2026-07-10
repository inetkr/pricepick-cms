import React, { useState } from 'react';

export interface MemberFilterValues {
  search: string;
  kakao_status: string;
  account_status: string;
}

interface MemberFiltersProps {
  onApplyFilters: (filters: MemberFilterValues) => void;
}

const kakaoStatusOptions = [
  { value: '', label: '전체 연동상태' },
  { value: 'NOT_LINKED', label: '게스트(미연동)' },
  { value: 'LINKED', label: '카카오 연동' },
];

const accountStatusOptions = [
  { value: '', label: '전체 상태' },
  { value: 'NORMAL', label: '정상' },
  { value: 'BLOCK', label: '정지' },
  { value: 'DELETE', label: '탈퇴' },
];

export const MemberFilters: React.FC<MemberFiltersProps> = ({ onApplyFilters }) => {
  const [search, setSearch] = useState('');
  const [kakaoStatus, setKakaoStatus] = useState('');
  const [accountStatus, setAccountStatus] = useState('');

  const handleApplyFilters = () => {
    onApplyFilters({
      search,
      kakao_status: kakaoStatus,
      account_status: accountStatus,
    });
  };

  return (
    <>
      <input
        className="search-box"
        placeholder="닉네임 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="filter-sel"
        value={kakaoStatus}
        onChange={(e) => setKakaoStatus(e.target.value)}
      >
        {kakaoStatusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        className="filter-sel"
        value={accountStatus}
        onChange={(e) => setAccountStatus(e.target.value)}
      >
        {accountStatusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button className="btn btn-primary btn-sm" onClick={handleApplyFilters}>
        검색
      </button>
    </>
  );
};
