export const ProductStatus = {
  SALE: 'SALE',
  CMPL: 'CMPL',
  RSRV: 'RSRV',
  CNCL: 'CNCL',
  HIDE: 'HIDE',
  DLTE: 'DLTE',
};

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];
