'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { InfoBox } from 'src/components/common/info-box';
import type { PaginationProps } from 'src/components/common/pagination';
import type {
  GifticonProduct} from 'src/components/gifticon-products/gifticon-product-table';
import {
  GifticonProductTable,
} from 'src/components/gifticon-products/gifticon-product-table';
import { GifticonProductToolbar } from 'src/components/gifticon-products/gifticon-product-toolbar';
import { TicketEditModal } from 'src/components/gifticon-products/ticket-edit-modal';

// Mock data
const mockProducts: GifticonProduct[] = [
  {
    id: 10,
    category: '커피/음료',
    brand: '투썸플레이스',
    name: '[투썸플레이스] 5천원권',
    code: '72429',
    expiry: '2999/12/30',
    valid: '유효기간 내',
    price: 5000,
    ticketGrade: 'bronze',
    ticketQty: 55,
    isManual: false,
    manualQty: null,
    status: 'active',
  },
  {
    id: 9,
    category: '커피/음료',
    brand: '투썸플레이스',
    name: '[투썸플레이스] 1만원권',
    code: '72436',
    expiry: '2999/12/30',
    valid: '유효기간 내',
    price: 10000,
    ticketGrade: 'silver',
    ticketQty: 11,
    isManual: false,
    manualQty: null,
    status: 'active',
  },
  {
    id: 8,
    category: '커피/음료',
    brand: '투썸플레이스',
    name: '[투썸플레이스] 3만원권',
    code: '72441',
    expiry: '2999/12/30',
    valid: '유효기간 내',
    price: 30000,
    ticketGrade: 'gold',
    ticketQty: 17,
    isManual: false,
    manualQty: null,
    status: 'active',
  },
  {
    id: 7,
    category: '문화/생활',
    brand: '북앤라이프',
    name: '도서문화상품권 5만원권',
    code: '75264',
    expiry: '2999/12/30',
    valid: '유효기간 내',
    price: 50000,
    ticketGrade: 'gold',
    ticketQty: 28,
    isManual: false,
    manualQty: null,
    status: 'active',
  },
  {
    id: 6,
    category: '문화/생활',
    brand: '북앤라이프',
    name: '도서문화상품권 3만원권',
    code: '75260',
    expiry: '2999/12/30',
    valid: '유효기간 내',
    price: 30000,
    ticketGrade: 'gold',
    ticketQty: 17,
    isManual: false,
    manualQty: null,
    status: 'active',
  },
  // ... more products
];

// Hàm tính tự động số ticket
const calculateTicketQty = (
  price: number
): { qty: number; grade: 'bronze' | 'silver' | 'gold' } => {
  const multiplied = price * 1.1;
  if (price < 3000) {
    const qty = Math.ceil(multiplied / 100);
    return { qty, grade: 'bronze' };
  }
  if (price < 7000) {
    const qty = Math.ceil(multiplied / 1000);
    return { qty, grade: 'silver' };
  }
  const qty = Math.ceil(multiplied / 2000);
  return { qty, grade: 'gold' };
};

export const GifticonProductsSection: React.FC = () => {
  const [products, setProducts] = useState<GifticonProduct[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<GifticonProduct | null>(null);
  const pageSize = 10;

  // Filter
  const filteredProducts = products.filter((p) => {
    if (searchTerm && !p.name.includes(searchTerm)) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedStatus && p.status !== selectedStatus) return false;
    return true;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleTicketEdit = (product: GifticonProduct) => {
    setEditingProduct(product);
  };

  const handleSaveTicket = (qty: number) => {
    if (!editingProduct) return;
    const auto = calculateTicketQty(editingProduct.price);
    const isManual = qty !== auto.qty;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ticketQty: qty,
              isManual,
              manualQty: isManual ? qty : null,
            }
          : p
      )
    );
    toast.success('교환 티켓이 저장되었습니다.');
    setEditingProduct(null);
  };

  const handleToggleStatus = (product: GifticonProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              status: p.status === 'active' ? 'inactive' : 'active',
            }
          : p
      )
    );
    toast.success('상태가 변경되었습니다.');
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginationProps: PaginationProps = {
    currentPage,
    totalPages,
    totalItems,
    onPageChange: handlePageChange,
    showTotal: true,
    onItemsPerPageChange: (size) => {
      setCurrentPage(1);
    },
    showSizeChanger: true,
  };

  const editingAuto = editingProduct
    ? calculateTicketQty(editingProduct.price)
    : { qty: 0, grade: 'bronze' };

  return (
    <div className="section active">
      <InfoBox>
        기프티콘 연동 상품 목록입니다. 교환 티켓은 보상정책 기준으로 자동 계산됩니다. 교환 티켓 칩을
        클릭하면 수량을 수정할 수 있습니다.
      </InfoBox>

      <GifticonProductToolbar
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
      />

      <GifticonProductTable
        data={paginatedData}
        pagination={paginationProps}
        onTicketEdit={handleTicketEdit}
        onToggleStatus={handleToggleStatus}
      />

      {editingProduct && (
        <TicketEditModal
          open={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveTicket}
          productName={editingProduct.name}
          price={editingProduct.price}
          grade={editingProduct.ticketGrade}
          autoQty={editingAuto.qty}
          currentQty={
            editingProduct.isManual
              ? editingProduct.manualQty || editingProduct.ticketQty
              : editingProduct.ticketQty
          }
        />
      )}
    </div>
  );
};
