'use client';

import React from 'react';
import {
  pbDt,
  pbHasValue,
  pbLineCellClass,
  pbLineKeys,
  pbLineText,
  pbMerchantTime,
  pbMoneyText,
  pbTm,
} from 'src/utils/postback';
import type { IPostbackLog, IPostbackLogLine } from 'src/types/postback/postback';

/* 받은 값이 없으면 자리를 채우지 않고 빈 걸 그대로 드러낸다 —
   0 이나 임의의 값으로 메우면 「안 온 값」과 구분이 안 된다. */
export const PbNone: React.FC = () => <span className="pb-none">—</span>;

export const PbRaw: React.FC<{ value: unknown }> = ({ value }) =>
  pbHasValue(value) ? <>{String(value)}</> : <PbNone />;

// 금액 — 천 단위만 찍는다. 숫자로 못 읽으면 받은 값을 그대로 적는다.
export const PbMoney: React.FC<{ value: number | string | null | undefined }> = ({ value }) => {
  if (!pbHasValue(value)) return <PbNone />;
  return <>{pbMoneyText(value)}</>;
};

// 줄 오른쪽 끝의 펼침 표시. 실제로는 행 전체가 눌린다.
export const PbCaret: React.FC = () => (
  <td className="pb-caret">
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </td>
);

/* 시각 칸 — 큰 글씨는 제휴사가 보낸 주문 시각이고 원문 문자열을 그 밑에 그대로 남긴다.
   제휴사 시각이 안 왔으면 우리가 받은 시각(created_at)으로 넘어가고, 그럴 땐 그렇다고 적는다 —
   둘은 다른 값이라 말없이 섞으면 안 된다. */
export const PbTimeCell: React.FC<{ row: IPostbackLog }> = ({ row }) => {
  const { raw, at, hasTime } = pbMerchantTime(row);
  if (at) {
    return (
      <>
        <div style={{ fontWeight: 700 }}>{pbDt(at)}</div>
        {/* 시각이 안 온 건(링크프라이스 day 만 온 경우)은 00:00:00 을 적지 않는다 —
            받지도 않은 값을 적는 셈이 된다 */}
        {hasTime && <div className="pb-dim">{pbTm(at)}</div>}
        {Boolean(raw) && <div className="pb-raw">{raw}</div>}
      </>
    );
  }
  return (
    <>
      <div style={{ fontWeight: 700 }}>{pbDt(row.created_at)}</div>
      <div className="pb-dim">{pbTm(row.created_at)}</div>
      <div className="pb-raw">{raw ? `${raw} · 수신 시각` : '수신 시각'}</div>
    </>
  );
};

/* 펼치면 나오는 수신 원문 필드 — 접힌 화면에 이미 나온 것도 빼지 않는다.
   「받은 그대로」가 이 화면의 목적이라 한자리에 전부 모여 있어야 한다.
   안 온 키도 자리를 지운 채 남겨 둔다: 무엇이 안 왔는지가 이 화면에서는 정보다. */
export const PbRawFields: React.FC<{ pairs: [string, string][] }> = ({ pairs }) => (
  <div className="pb-rawbox">
    {pairs.map(([k, v]) => (
      <div className="pb-rawitem" key={k}>
        <span className="k">{k}</span>
        <span className="v">{v || <PbNone />}</span>
      </div>
    ))}
  </div>
);

/* 주문 줄(lines) 표 — 칸 이름이 곧 서버가 준 키다.
   줄마다 키가 달라도 합집합으로 칸을 잡아 한 줄만 가진 키도 빠지지 않는다.
   대사 결과(matched)도 따로 빼지 않고 제 칸에 그대로 선다 — 규격의 일부이지 덧붙인 값이 아니다. */
export const PbLinesTable: React.FC<{
  rowId: string;
  lines: IPostbackLogLine[] | null | undefined;
}> = ({ rowId, lines }) => {
  const keys = pbLineKeys(lines);
  if (!lines?.length || keys.length === 0) return null;
  return (
    <table>
      <thead>
        <tr>
          {keys.map((k) => (
            <th key={k}>{k}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {lines.map((line, i) => (
          <tr key={[rowId, i].join('-')}>
            {keys.map((k) => {
              const text = pbLineText(line, k);
              return (
                <td key={k} className={pbLineCellClass(k)} title={text}>
                  <PbRaw value={text} />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
