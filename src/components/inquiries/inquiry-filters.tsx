import React, { useState } from 'react';
import { QNA_STATE_FILTER_OPTIONS, QNA_TYPE_FILTER_OPTIONS } from 'src/constants/qna';

export interface InquiryFilterValues {
  search: string;
  state: string;
  type: string;
}

interface InquiryFiltersProps {
  onApplyFilters: (filters: InquiryFilterValues) => void;
}

export const InquiryFilters: React.FC<InquiryFiltersProps> = ({ onApplyFilters }) => {
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [type, setType] = useState('');

  const handleApplyFilters = () => {
    onApplyFilters({ search, state, type });
  };

  return (
    <>
      <input
        className="search-box"
        placeholder="제목, 내용 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
      />
      <select className="filter-sel" value={state} onChange={(e) => setState(e.target.value)}>
        {QNA_STATE_FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select className="filter-sel" value={type} onChange={(e) => setType(e.target.value)}>
        {QNA_TYPE_FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button type="button" className="btn btn-primary btn-sm" onClick={handleApplyFilters}>
        검색
      </button>
    </>
  );
};
