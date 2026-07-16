'use client';

import React, { useState } from 'react';
import { OpPolicyEventTab } from 'src/components/op-policy/op-policy-event-tab';
import { OpPolicyExclusionTab } from 'src/components/op-policy/op-policy-exclusion-tab';
import { OpPolicyRewardTab } from 'src/components/op-policy/op-policy-reward-tab';

type OpPolicyTabId = 'reward' | 'event' | 'exclusion';

const TABS: { id: OpPolicyTabId; label: string }[] = [
  { id: 'reward', label: '적립·보상 정책' },
  { id: 'event', label: '참여·이벤트 정책' },
  { id: 'exclusion', label: '적립 제외 정책' },
];

export const OpPolicySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OpPolicyTabId>('reward');

  return (
    <div className="section active" id="sec-op-policy">
      <div className="info-box">
        <strong>조회 전용</strong> — 앱·서비스 운영의 핵심 정책 기준을 한곳에서 확인하는
        페이지입니다. 정책 수치·기준 변경은 별도 승인 절차를 거쳐 반영되며, 이 화면에서 직접
        수정하지 않습니다. (이용약관·개인정보처리방침 등 앱 노출용 약관은 <strong>약관 관리</strong>
        에서 별도 관리)
      </div>

      <div className="card">
        <div style={{ padding: '18px' }}>
          <div className="terms-nav">
            {TABS.map((tab) => (
              <div
                key={tab.id}
                className={`terms-tab ${tab.id === activeTab ? 'active' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveTab(tab.id);
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>

          {activeTab === 'reward' && <OpPolicyRewardTab />}
          {activeTab === 'event' && <OpPolicyEventTab />}
          {activeTab === 'exclusion' && <OpPolicyExclusionTab />}
        </div>
      </div>
    </div>
  );
};
