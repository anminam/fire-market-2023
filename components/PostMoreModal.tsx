import { ProductStatus } from '@/interface/ProductKind';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import { ForwardedRef, forwardRef, useEffect } from 'react';

interface PostMoreModalProps {
  postId: number;
  postUserId: number;
  userId: number;
}

interface PostMoreModalResponse {
  result: boolean;
  status: ProductStatus;
}

function PostMoreModal({ postId, postUserId, userId }: PostMoreModalProps, ref: ForwardedRef<HTMLDialogElement>) {
  const router = useRouter();
  // 내껀가!!!
  const isMe = userId === postUserId;

  // 상태 수정.
  const [setStateToServer, { loading, data }] = useMutation<PostMoreModalResponse>(
    `/api/posts/${router.query.id}/status`,
  );

  const handleCancel = () => {
    if (ref && 'current' in ref && ref.current !== null) {
      (ref.current as HTMLDialogElement).close();
    }
  };

  // 수정.
  const handleEdit = () => {
    router.push(`/community/${postId}/edit`);
  };

  // 감추기.
  const handleHide = () => {
    setStateToServer({ status: ProductStatus.HIDE }, 'PATCH');
  };

  // 삭제.
  const handleDelete = () => {
    setStateToServer({ status: ProductStatus.DLTE }, 'PATCH');
  };

  useEffect(() => {
    switch (data?.status) {
      case ProductStatus.DLTE:
        alert('삭제되었습니다.');
        router.push('/');
        break;
      case ProductStatus.HIDE:
        alert('숨김처리되었습니다.');
        router.push('/');
        break;
    }
  }, [data, router]);

  return (
    <div>
      <dialog id="modal_more_product" className="modal" ref={ref}>
        <div className="modal-box w-52 p-0">
          <div className="btn-group btn-group-vertical w-52">
            {isMe && (
              <>
                <button className="btn" onClick={handleEdit}>
                  게시글 수정
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

export default forwardRef<HTMLDialogElement, PostMoreModalProps>(PostMoreModal);
