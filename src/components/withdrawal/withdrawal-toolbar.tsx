import React, { useState } from 'react';

interface WithdrawalToolbarProps {
  onSearch: (value: string) => void;
}

export const WithdrawalToolbar: React.FC<WithdrawalToolbarProps> = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const handleSearch = () => onSearch(search);

  return (
    <div className="toolbar">
      <input
        className="search-box"
        placeholder="식별 아이디 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <button type="button" className="btn btn-primary btn-sm" onClick={handleSearch}>
        검색
      </button>
    </div>
  );
};
