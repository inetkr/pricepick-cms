'use client';

import React from 'react';
import { InfoBox } from 'src/components/common/info-box';
import { LuckySpinWheelEditor } from 'src/components/lucky-spin/lucky-spin-wheel-editor';
import { useLuckySpin } from 'src/sections/lucky-spin/hooks/use-lucky-spin';

export const LuckySpinSection: React.FC = () => {
  const { slots, isLoading, isSaving, hasSavedConfig, justSaved, updateSlot, saveConfig } =
    useLuckySpin();

  const statusText = isLoading
    ? '불러오는 중…'
    : isSaving
      ? '저장 중…'
      : justSaved
        ? '저장 완료 · 앱에서 다음 진입 시 반영됩니다.'
        : hasSavedConfig
          ? '저장된 설정을 불러왔습니다.'
          : '기본값(예시) 표시 중 · 저장하면 이 설정이 앱에 적용됩니다.';

  return (
    <div className="section active" id="sec-lucky-spin-config">
      <InfoBox type="info">
        <strong>행운룰렛 = 포인트·이벤트티켓을 확률로 지급</strong> — 확률·배분은 정책상 미결이라
        운영자가 직접 정합니다. 룰렛은 6칸이며 각 칸을 균등 확률(1/6)로 추첨합니다. 여기서 저장한
        설정을 앱이 그대로 읽어 룰렛을 렌더링하고 당첨 보상을 지급합니다.
      </InfoBox>

      <div className="card">
        <div className="card-header">
          <div className="card-title">룰렛 6칸 설정</div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={saveConfig}
            disabled={isLoading || isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-2)' }}>
              불러오는 중...
            </div>
          ) : (
            <LuckySpinWheelEditor slots={slots} onChange={updateSlot} />
          )}
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '10px' }}>
            {statusText}
          </div>
        </div>
      </div>
    </div>
  );
};
