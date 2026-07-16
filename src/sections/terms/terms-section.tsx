'use client';

import React, { useEffect, useState } from 'react';
import { TERMS_TABS } from 'src/constants/terms';
import { useTerms } from 'src/sections/terms/hooks/use-terms';

export const TermsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TERMS_TABS[0]);
  const { policy, isLoading, isSaving, save } = useTerms(activeTab.type, activeTab.label);

  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setContent(policy?.content ?? '');
      setIsPublished(policy?.is_published ?? true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy, isLoading]);

  const handleSave = () => {
    save(content, isPublished);
  };

  return (
    <div className="section active">
      <div className="amber-box">
        <strong>주의</strong> — 약관 변경 시 반드시 법무 검토를 거치고, 변경 30일 전 회원에게 사전
        공지 후 적용하세요.
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">약관 관리</div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={isLoading || isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
        <div style={{ padding: '18px' }}>
          <div className="terms-nav">
            {TERMS_TABS.map((tab) => (
              <div
                key={tab.type}
                className={`terms-tab ${tab.type === activeTab.type ? 'active' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveTab(tab);
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-2)' }}>
              불러오는 중...
            </div>
          ) : (
            <>
              {!policy && (
                <div className="info-box" style={{ marginBottom: '14px' }}>
                  아직 등록된 정책이 없습니다. 내용을 입력하고 저장하면 &lsquo;{activeTab.label}
                  &rsquo; 이름으로 새 정책이 등록됩니다.
                </div>
              )}
              <textarea
                className="terms-editor"
                value={content}
                placeholder={`${activeTab.label} 내용을 입력하세요.`}
                onChange={(e) => setContent(e.target.value)}
              />
              {/* <div className="toggle-row" style={{ marginTop: '14px' }}>
                <div
                  className={`toggle ${isPublished ? 'on' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsPublished((prev) => !prev)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setIsPublished((prev) => !prev);
                  }}
                />
                <span className="toggle-label">
                  {isPublished ? '게시중 (회원에게 노출)' : '비공개 (숨김)'}
                </span>
              </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
