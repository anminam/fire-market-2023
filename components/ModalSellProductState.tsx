import { ProductStatus } from '@/interface/ProductKind';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import { ForwardedRef, forwardRef, useEffect } from 'react';

interface IProp {
  productId?: number;
  productUserId: number;
  buyerId: number;
}

interface ModalSellProductStateResponse {
  result: boolean;
  status: ProductStatus;
}

function ModalSellProductState({ productId, productUserId, buyerId }: IProp, ref: ForwardedRef<HTMLDialogElement>) {
  const router = useRouter();

  // 상태 수정.
  const [setStateToServer, { data, loading }] = useMutation<ModalSellProductStateResponse>(
    `/api/products/${productId}/status/${buyerId}`,
  );

  // handle - 판매완료클릭.
  const handleCompleteClick = () => {
    setStateToServer({ status: 'CMPL' }, 'PATCH');
  };
  // handle - 예약클릭.
  const handleReservationClick = () => {
    setStateToServer({ status: 'RSRV' }, 'PATCH');
  };

  // handle - 취소클릭.
  const handleCancelClick = () => {
    if (ref && 'current' in ref && ref.current !== null) {
      (ref.current as HTMLDialogElement).close();
    }
  };

  useEffect(() => {
    switch (data?.status) {
      case ProductStatus.CMPL:
        alert('판매완료 처리되었습니다.');
        router.push('/');
        break;
      case ProductStatus.HIDE:
        alert('숨김 처리되었습니다.');
        router.push('/');
        break;
      case ProductStatus.HIDE:
        alert('예약 처리되었습니다.');
        router.push('/');
        break;
    }
  }, [data, router]);

  return (
    <div>
      <dialog id="modal_more_product" className="modal" ref={ref}>
        <div className="modal-box w-52 p-0">
          <div className="btn-group btn-group-vertical w-52">
            <button className="btn" onClick={handleReservationClick}>
              예약중
            </button>
            <button className="btn" onClick={handleCompleteClick}>
              판매완료
            </button>
            <button className="btn" onClick={handleCancelClick}>
              취소
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>닫기</button>
        </form>
      </dialog>
    </div>
  );
}

export default forwardRef<HTMLDialogElement, IProp>(ModalSellProductState);
