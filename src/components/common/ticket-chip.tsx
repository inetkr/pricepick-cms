import React from 'react';

export type TicketGrade = 'bronze' | 'silver' | 'gold' | 'event' | 'random';

interface TicketChipProps {
  grade: TicketGrade;
  quantity?: number;
  showQuantity?: boolean;
  showName?: boolean;
  className?: string;
  size?: 'small' | 'large';
  dim?: boolean;
  bare?: boolean;
}

// SVG paths từ file gốc
const TK_P1 =
  'M306.6,106.8l-49.5,49.5,2.4,2.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-2.4-2.4-138.6,138.6c-3.7,3.7-3.7,9.6,0,13.3l75.5,75.5c3.7,3.7,9.6,3.7,13.3,0l138.6-138.6-2.3-2.3c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l2.3,2.3,49.5-49.5c3.7-3.7,3.7-9.6,0-13.3l-75.5-75.5c-3.7-3.7-9.6-3.7-13.3,0ZM335.6,234.8c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM322.9,222.1c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM310.2,209.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM297.6,196.7c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM284.9,184.1c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7ZM272.2,171.4c1.4,1.4,1.4,3.5,0,4.9h0c-1.4,1.4-3.5,1.4-4.9,0l-4.7-4.7c-1.4-1.4-1.4-3.5,0-4.9h0c1.4-1.4,3.5-1.4,4.9,0l4.7,4.7Z';

const TK_P2 =
  'M316.2,155.8l12.1,6.2c.8.4,1.8.3,2.4-.4l9.6-9.6c1.4-1.4,3.8-.2,3.5,1.8l-2.1,13.5c-.1.9.3,1.8,1.1,2.2l12.1,6.2c1.8.9,1.4,3.6-.6,3.9l-13.5,2.1c-.9.1-1.6.8-1.7,1.7l-2.1,13.5c-.3,2-3,2.4-3.9.6l-6.2-12.1c-.4-.8-1.3-1.3-2.2-1.1l-13.5,2.1c-2,.3-3.2-2.1-1.8-3.5l9.6-9.6c.6-.6.8-1.6.4-2.4l-6.2-12.1c-.9-1.8,1-3.7,2.8-2.8Z';

const TK_P3 =
  'M180.7,298.9l-5.2,5.2,27.4,27.4-4.7,4.7-27.4-27.4-5.2,5.2-4.2-4.2,15.1-15.1,4.2,4.2ZM215.3,319.1l-4.7,4.7-31.6-31.6,4.7-4.7,31.6,31.6ZM231.9,296.8c1.9,1.9,1.9,3.9,0,5.8l-9.9,9.9c-1.9,1.9-3.8,1.8-5.7,0l-25.8-25.8c-1.9-1.9-2-3.8-.1-5.7l9.9-9.9c1.9-1.9,3.9-1.9,5.8,0l7.4,7.4-4.7,4.7-6.2-6.2-6.1,6.1,23.5,23.5,6.1-6.1-6.6-6.6,4.7-4.7,7.8,7.8ZM254.4,280l-5.2,5.2-20.1-8.1,14.1,14.1-4.7,4.7-31.6-31.6,4.7-4.7,13.4,13.4-8.1-18.6,5.2-5.2.2.2,8.6,21.4,23.6,9.2ZM269.5,265l-13.1,13.1-31.6-31.6,13-13,4.2,4.2-8.3,8.3,9.2,9.2,7.1-7.1,4.1,4.1-7.1,7.1,9.9,9.9,8.4-8.4,4.2,4.2ZM259,220.6l-5.2,5.2,27.4,27.4-4.7,4.7-27.4-27.4-5.2,5.2-4.2-4.2,15.1-15.1,4.2,4.2Z';

const GRADE_COLORS = {
  bronze: { c1: '#C68250', c2: '#8B5A2B', icon: 'rgba(255,255,255,0.95)' },
  silver: { c1: '#D8D8D8', c2: '#999999', icon: 'rgba(50,50,50,0.75)' },
  gold: { c1: '#FFD93B', c2: '#E6A800', icon: 'rgba(255,255,255,0.95)' },
  event: { c1: '#C9AAFF', c2: '#845EEE', icon: 'rgba(255,255,255,0.95)' },
  random: { c1: '#FF6B55', c2: '#C8200A', icon: 'rgba(255,255,255,0.95)' },
};

export const TicketChip: React.FC<TicketChipProps> = ({
  grade,
  quantity,
  showQuantity = true,
  showName = true,
  className = '',
  size = 'small',
  dim = false,
  bare = false,
}) => {
  const colors = GRADE_COLORS[grade];
  const uid = React.useId();

  // Size mapping
  const sizes = {
    small: { width: 28, height: 28 },
    large: { width: 60, height: 60 },
  };

  const { width, height } = sizes[size];

  // Render SVG icon
  const renderIcon = () => {
    // Random ticket có thêm dấu ?
    const questionMark =
      grade === 'random'
        ? `<text x="220" y="370" font-family="Arial Black, Arial" font-size="270" font-weight="900" fill="rgba(255,255,255,0.5)" text-anchor="middle">?</text>`
        : '';

    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.c1} />
            <stop offset="100%" stopColor={colors.c2} />
          </linearGradient>
        </defs>
        <path d={TK_P1} fill={`url(#g${uid})`} />
        <path d={TK_P2} fill={colors.icon} />
        <path d={TK_P3} fill={colors.icon} />
        {questionMark && (
          <path
            d="M220 370h0"
            fill="none"
            // Text sẽ được render bằng dangerouslySetInnerHTML trong span riêng
          />
        )}
      </svg>
    );
  };

  const renderNameByGrade = {
    bronze: '브론즈',
    silver: '실버',
    gold: '골드',
    event: '이벤트',
    random: '랜덤',
  };

  // Nếu bare mode: chỉ hiển thị icon + số, không có background
  if (bare) {
    return (
      <span className={`tk-chip bare ${grade} ${dim ? 'dim' : ''} ${className}`}>
        {renderIcon()}
        {showQuantity &&
          quantity !== undefined &&
          (showName ? (
            <span>
              {renderNameByGrade[grade]} {quantity}장
            </span>
          ) : (
            <span>{quantity}</span>
          ))}
      </span>
    );
  }

  // Normal mode: có background và border theo grade
  return (
    <span className={`tk-chip ${grade} ${dim ? 'dim' : ''} ${className}`}>
      {renderIcon()}
      {showQuantity &&
        quantity !== undefined &&
        (showName ? (
          <span>
            {renderNameByGrade[grade]} {quantity}장
          </span>
        ) : (
          <span>{quantity}</span>
        ))}
    </span>
  );
};

// Component để render nhiều ticket chips
interface TicketChipGroupProps {
  tickets: Array<{
    grade: TicketGrade;
    quantity: number;
  }>;
  className?: string;
  dim?: boolean;
  bare?: boolean;
  showName?: boolean;
  showQuantity?: boolean;
}

export const TicketChipGroup: React.FC<TicketChipGroupProps> = ({
  tickets,
  className = '',
  bare = false,
  showQuantity = false,
  showName = false,
  dim = false,
}) => {
  return (
    <div className={`tk-chips ${className}`}>
      {tickets.map((t, idx) => (
        <TicketChip
          key={idx}
          grade={t.grade}
          quantity={t.quantity}
          bare={bare}
          showQuantity={showQuantity}
          showName={showName}
          dim={dim}
        />
      ))}
    </div>
  );
};
