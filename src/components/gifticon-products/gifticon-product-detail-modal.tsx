'use client';

import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { giftAPI } from 'src/api';
import { Modal } from 'src/components/common/modal';
import { GifticonProductImageModal } from 'src/components/gifticon-products/gifticon-product-image-modal';
import type {
  IGifticonProduct,
  IGifticonProductDetail,
} from 'src/types/gifticon-products/gifticon_product';
import {
  apiTicketPriceToParts,
  formatBrandedProductName,
  formatGifticonTicketComboText,
  resolveGifticonImageUrl,
} from 'src/utils/gifticon-products';

// ----------------------------------------------------------------------

interface GifticonProductDetailModalProps {
  // 목록에서 누른 행 — 상세 API 응답이 올 때까지 보여줄 초기값으로만 쓴다.
  product: IGifticonProduct;
  onClose: () => void;
  onSave: (id: string, patch: Partial<IGifticonProduct>) => void;
}

// API는 valid_end를 시각까지 포함한 ISO 문자열로 내려주므로 <input type="date">가
// 받는 YYYY-MM-DD로 잘라 준다.
const toDateInputValue = (isoDate: string | null): string => {
  if (!isoDate) return '';
  const d = dayjs(isoDate);
  return d.isValid() ? d.format('YYYY-MM-DD') : '';
};

// 카테고리·상품코드·유효기간·상품판매종료일·판매가격·브랜드는 서버 값을 그대로 보여주기만
// 한다 — 수정 가능한 값은 상품명과 기프팅 쿠폰 유의사항 두 곳뿐이다(요청: 2026-09-18).
export const GifticonProductDetailModal: React.FC<GifticonProductDetailModalProps> = ({
  product: initialProduct,
  onClose,
  onSave,
}) => {
  const [product, setProduct] = useState<IGifticonProductDetail>({
    ...initialProduct,
    description: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(product.product_name);
  const [imageUrl, setImageUrl] = useState(product.image_url ?? '');
  // 이미지 변경 팝업에서 새로 고른 파일 — 저장을 눌러야 그때 업로드된다.
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState(product.description ?? '');
  const [imgError, setImgError] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [error, setError] = useState('');

  // 목록 행에는 없는 값(특히 기프팅 쿠폰 유의사항 = description)까지 받으려면 상세 API를
  // 따로 불러야 한다 — 목록 응답만으로는 채울 수 없다.
  const reqRef = useRef(0);
  useEffect(() => {
    const seq = reqRef.current + 1;
    reqRef.current = seq;
    setIsLoading(true);
    giftAPI
      .getProductDetail(initialProduct.id)
      .then((res) => {
        if (reqRef.current !== seq) return;
        const row = res?.result?.object;
        if (!row) return;
        setProduct(row);
        setName(row.product_name);
        setImageUrl(row.image_url ?? '');
        setDescription(row.description ?? '');
        setImgError(false);
      })
      .catch((err) => {
        console.error('Failed to load gifticon product detail:', err);
        toast.error('상품 상세 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (reqRef.current === seq) setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProduct.id]);

  // 로컬로 고른 이미지의 미리보기 URL(objectURL)은 브라우저 메모리를 붙잡고 있으니
  // 모달이 닫힐 때 정리한다.
  const imageUrlRef = useRef(imageUrl);
  imageUrlRef.current = imageUrl;
  useEffect(
    () => () => {
      if (imageUrlRef.current.startsWith('blob:')) URL.revokeObjectURL(imageUrlRef.current);
    },
    []
  );

  const ticketParts = apiTicketPriceToParts(product.ticket_price);
  const showImage = !!imageUrl.trim() && !imgError;

  // 판매가격 아래 병기 — 상품 목록 표(gip-price-main)와 같은 형식으로 등급 조합 전체를
  // "골드 79 + 실버 1"처럼 보여준다. 환산값이 없으면 빨간 안내 문구.
  const hasPrice = product.price_won > 0;
  const priceHintText = !hasPrice
    ? ''
    : ticketParts.length > 0
      ? `${formatGifticonTicketComboText(ticketParts)} (${product.price_won.toLocaleString('ko-KR')}원)`
      : '티켓 환산값이 설정되지 않았습니다 — 「티켓 가치 설정」에서 등급별 환산가치를 먼저 넣어 주세요.';

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('상품명은 반드시 넣어야 합니다.');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      // 바뀐 값만 보낸다 — 아무것도 안 바꿨으면 업데이트 호출 자체를 하지 않는다.
      const payload: { image_url?: string; product_name?: string; description?: string } = {};
      let uploadedImageUrl: string | null = null;

      if (pendingImageFile) {
        const uploadRes = await giftAPI.uploadProductImage(pendingImageFile);
        const imagePath = uploadRes?.result?.object?.image_path;
        uploadedImageUrl = resolveGifticonImageUrl(imagePath);
        if (imagePath) payload.image_url = imagePath;
      }
      if (trimmedName !== product.product_name) payload.product_name = trimmedName;
      const trimmedDescription = description.trim();
      if (trimmedDescription !== (product.description ?? '')) {
        payload.description = trimmedDescription;
      }

      if (Object.keys(payload).length > 0) {
        await giftAPI.updateProduct(product.id, payload);
      }

      onSave(product.id, {
        product_name: trimmedName,
        image_url: uploadedImageUrl ?? product.image_url,
      });
      toast.success('상품 정보를 저장했습니다.');
      onClose();
    } catch (err) {
      console.error('Failed to save gifticon product:', err);
      toast.error('상품 정보를 저장하지 못했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
    <Modal
      open
      onClose={onClose}
      title="상품 상세 정보"
      width="680px"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isLoading || isSaving}
          >
            {isSaving ? '저장 중…' : '저장'}
          </button>
        </>
      }
    >
      <div className="modal-body">
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>
          기본 정보
          {isLoading && (
            <span style={{ marginLeft: '8px', fontWeight: 400, fontSize: '12px', color: 'var(--text-3)' }}>
              불러오는 중…
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '22px', alignItems: 'flex-start' }}>
          <div style={{ width: '150px', flexShrink: 0, textAlign: 'center' }}>
            <div
              style={{
                width: '150px',
                height: '150px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                background: 'var(--surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '10px',
              }}
            >
              {showImage ? (
                <img
                  src={imageUrl}
                  alt=""
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9C2DC"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="8" width="18" height="13" rx="2" />
                  <path d="M3 12h18" />
                  <path d="M12 8v13" />
                </svg>
              )}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ width: '100%' }}
              disabled={isLoading || isSaving}
              onClick={() => setShowImageEditor(true)}
            >
              이미지 변경
            </button>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px 16px',
            }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="gid-category">
                카테고리
              </label>
              <input
                id="gid-category"
                className="form-input"
                value={product.category_name}
                disabled
                style={{ background: 'var(--surface-2)' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="gid-code">
                상품코드
              </label>
              <input
                id="gid-code"
                className="form-input"
                value={product.product_code}
                disabled
                style={{ background: 'var(--surface-2)', fontFamily: 'monospace', fontSize: '12px' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="gid-validity">
                유효기간 (일)
              </label>
              <input
                id="gid-validity"
                className="form-input"
                type="number"
                value={product.provider_valid_days != null ? String(product.provider_valid_days) : ''}
                disabled
                style={{ background: 'var(--surface-2)' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="gid-name">
                상품명
              </label>
              <input
                id="gid-name"
                className="form-input"
                value={name}
                disabled={isLoading || isSaving}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="gid-sale-end">
                상품판매종료일
              </label>
              <input
                id="gid-sale-end"
                className="form-input"
                type="date"
                value={toDateInputValue(product.valid_end)}
                disabled
                style={{ background: 'var(--surface-2)' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="gid-price">
                판매가격 (원)
              </label>
              <input
                id="gid-price"
                className="form-input"
                type="number"
                style={{ textAlign: 'right', background: 'var(--surface-2)' }}
                value={String(product.price_won)}
                disabled
              />
              {priceHintText && (
                <div className={`gid-won${ticketParts.length > 0 ? '' : ' none'}`}>
                  {priceHintText}
                </div>
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="gid-brand">
                브랜드
              </label>
              <input
                id="gid-brand"
                className="form-input"
                value={product.brand_name}
                disabled
                style={{ background: 'var(--surface-2)' }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: '14px',
              background: 'var(--danger-soft)',
              color: 'var(--danger)',
              borderRadius: 'var(--r-md)',
              padding: '10px 14px',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>
            기프팅 쿠폰 유의사항
          </div>
          <textarea
            className="form-input"
            rows={6}
            style={{ resize: 'vertical', lineHeight: 1.6 }}
            placeholder="이 상품의 유의사항을 적어 주세요."
            value={description}
            disabled={isLoading || isSaving}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </Modal>

    {showImageEditor && (
      <GifticonProductImageModal
        productLabel={formatBrandedProductName(product.brand_name, name)}
        currentImageUrl={imageUrl}
        onClose={() => setShowImageEditor(false)}
        onSave={(file, previewUrl) => {
          setPendingImageFile(file);
          setImageUrl(previewUrl);
          setImgError(false);
          setShowImageEditor(false);
        }}
      />
    )}
    </>
  );
};
