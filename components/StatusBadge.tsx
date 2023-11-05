import { ProductStatus } from '@/interface/ProductKind';

export default function StatusBadge({ status }: { status: ProductStatus }) {
  let color = '';
  let text = '';

  if (status === 'RSRV') {
    color = 'badge-warning';
    text = '예약중';
  }

  if (status === 'CMPL') {
    color = 'badge-success';
    text = '판매완료';
  }

  if (!text) {
    return null;
  }

  return (
    <div className={`badge badge-sm ${color} mr-2`}>
      <div>{text}</div>
    </div>
  );
}
