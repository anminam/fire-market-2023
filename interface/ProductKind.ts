export const ProductStatus = {
  SALE: 'SALE', // 판매중
  CMPL: 'CMPL', // 판매완료
  RSRV: 'RSRV', // 예약중
  CNCL: 'CNCL', // 취소
  HIDE: 'HIDE', // 숨김
  DLTE: 'DLTE', // 삭제

  QSTN: 'QSTN', // 질문
};

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];
