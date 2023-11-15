/**
 * 판매상태 변경 모달.
 */
import { useMiniStore } from '@/hooks/useStore';
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
  const { setRoomState } = useMiniStore();

  // 상태 수정.
  const [setStateToServer, { data, loading }] = useMutation<ModalSellProductStateResponse>(
    `/api/products/${productId}/status/${buyerId}`,
  );

  // handle - 판매완료클릭.
  const handleCompleteClick = () => {
    if (loading) false;
    setStateToServer({ status: 'CMPL' }, 'PATCH');
  };
  // handle - 예약클릭.
  const handleReservationClick = () => {
    if (loading) false;
    setStateToServer({ status: 'RSRV' }, 'PATCH');
  };

  const closeModal = () => {
    if (ref && 'current' in ref && ref.current !== null) {
      (ref.current as HTMLDialogElement).close();
    }
  };

  useEffect(() => {
    if (!productId || !data) return;

    const { status } = data;

    switch (status) {
      case ProductStatus.CMPL:
        setRoomState(productId, buyerId, status);
        alert('판매완료 처리되었습니다.');
        break;
      case ProductStatus.HIDE:
        setRoomState(productId, buyerId, status);
        alert('숨김 처리되었습니다.');
        break;
      case ProductStatus.RSRV:
        setRoomState(productId, buyerId, status);
        alert('예약 처리되었습니다.');
        break;
    }

    closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, router]);

  return (
    <div>
      <dialog className="modal" ref={ref}>
        <div className="modal-box w-52 p-0">
          <div className="btn-group btn-group-vertical w-52">
            <button className="btn" onClick={handleReservationClick}>
              예약중
            </button>
            <button className="btn" onClick={handleCompleteClick}>
              판매완료
            </button>
            <button className="btn" onClick={() => closeModal()}>
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
