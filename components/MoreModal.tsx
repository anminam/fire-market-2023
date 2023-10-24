import { useRouter } from 'next/router';
import { ForwardedRef, forwardRef } from 'react';

interface MoreModalProps {
  productId?: string;
  productUserId: number;
  userId: number;
}

function MoreModal(
  { productId, productUserId, userId }: MoreModalProps,
  ref: ForwardedRef<HTMLDialogElement>
) {
  const router = useRouter();
  // 내껀가!!!
  const isMe = userId === productUserId;

  const handleCancel = () => {
    if (ref && 'current' in ref && ref.current !== null) {
      (ref.current as HTMLDialogElement).close();
    }
  };

  const handleEdit = () => {
    router.push(`/products/upload?productId=${productId}`);
  };
  const handleHide = () => {};
  const handleDelete = () => {};

  return (
    <div>
      <dialog id="modal_more_product" className="modal" ref={ref}>
        <div className="modal-box w-52 p-0">
          <div className="btn-group btn-group-vertical w-52">
            {isMe && (
              <>
                <button className="btn " onClick={handleEdit}>
                  계시글 수정
                </button>
                <button className="btn" onClick={handleHide}>
                  숨기기
                </button>
                <button className="btn text-red-700" onClick={handleDelete}>
                  삭제
                </button>
              </>
            )}
            <button className="btn" onClick={handleCancel}>
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

export default forwardRef<HTMLDialogElement, MoreModalProps>(MoreModal);
