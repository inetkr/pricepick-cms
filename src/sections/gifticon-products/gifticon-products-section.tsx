'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { giftAPI } from 'src/api';
import type { PaginationProps } from 'src/components/common/pagination';
import { GifticonProductDetailModal } from 'src/components/gifticon-products/gifticon-product-detail-modal';
import { GifticonProductTable } from 'src/components/gifticon-products/gifticon-product-table';
import { GifticonProductToolbar } from 'src/components/gifticon-products/gifticon-product-toolbar';
import type { IGifticonProduct } from 'src/types/gifticon-products/gifticon_product';
import {
  PAGE_SIZE_OPTIONS,
  useGifticonProducts,
} from 'src/sections/gifticon-products/hooks/use-gifticon-products';

export const GifticonProductsSection: React.FC = () => {
  const {
    products,
    setProducts,
    totalItems,
    totalPages,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    handleSearch,
  } = useGifticonProducts();
  const [editingProduct, setEditingProduct] = useState<IGifticonProduct | null>(null);

  const startIndex = (page - 1) * limit;

  const handleToggleStatus = async (product: IGifticonProduct) => {
    const nextActive = !product.is_active;
    try {
      await giftAPI.updateProduct(product.id, { is_active: nextActive });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: nextActive } : p))
      );
      toast.success('상태가 변경되었습니다.');
    } catch (error) {
      console.error('Failed to update gifticon product status:', error);
      toast.error('상태 변경에 실패했습니다.');
    }
  };

  // 저장 성공 토스트는 모달이 실제 API 응답을 받은 뒤 직접 띄운다 — 여기서는 목록만 갱신한다.
  const handleSaveProduct = (id: string, patch: Partial<IGifticonProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const paginationProps: PaginationProps = {
    currentPage: page,
    totalPages,
    totalItems,
    onPageChange: setPage,
    showTotal: true,
    showSizeChanger: true,
    itemsPerPage: limit,
    sizeOptions: PAGE_SIZE_OPTIONS,
    onItemsPerPageChange: setLimit,
  };

  return (
    <div className="section active">
      <GifticonProductToolbar onSearch={handleSearch} />

      <GifticonProductTable
        data={products}
        startIndex={startIndex}
        pagination={paginationProps}
        totalLabel={
          isLoading ? '불러오는 중…' : `총 ${totalItems.toLocaleString('ko-KR')}개 상품`
        }
        onRowClick={setEditingProduct}
        onToggleStatus={handleToggleStatus}
      />

      {editingProduct && (
        <GifticonProductDetailModal
          key={editingProduct.id}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};
