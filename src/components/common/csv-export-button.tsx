import React from 'react';

export interface CsvColumn<T> {
  header: string;
  accessor: (row: T) => string | number | null | undefined;
}

interface CsvExportButtonProps<T> {
  data: T[];
  columns: CsvColumn<T>[];
  filename: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const escapeCsvValue = (value: string | number | null | undefined): string => {
  const stringValue = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export function exportArrayToCsv<T>(data: T[], columns: CsvColumn<T>[], filename: string) {
  const header = columns.map((col) => escapeCsvValue(col.header)).join(',');
  const rows = data.map((row) => columns.map((col) => escapeCsvValue(col.accessor(row))).join(','));
  const csvContent = [header, ...rows].join('\r\n');

  const bom = String.fromCharCode(0xfeff);
  const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function CsvExportButton<T>({
  data,
  columns,
  filename,
  label = '내보내기',
  className = 'btn btn-ghost btn-sm',
  style,
}: CsvExportButtonProps<T>) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      disabled={data.length === 0}
      onClick={() => exportArrayToCsv(data, columns, filename)}
    >
      {label}
    </button>
  );
}
