export const ProductStatus = {
  SALE: 'SALE' as const, // 판매중
  CMPL: 'CMPL' as const, // 판매완료
  RSRV: 'RSRV' as const, // 예약중
  CNCL: 'CNCL' as const, // 취소
  HIDE: 'HIDE' as const, // 숨김
  DLTE: 'DLTE' as const, // 삭제

  QSTN: 'QSTN' as const, // 질문
};

// export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];
export type ProductStatus = keyof typeof ProductStatus;
