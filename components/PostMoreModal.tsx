import useConfirm from '@/hooks/useConfirm';
import { PostWithUser } from '@/interface/Community';
import { ProductStatus } from '@/interface/ProductKind';
import { IUser } from '@/interface/User';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import { ForwardedRef, forwardRef, useEffect } from 'react';
import { AiOutlineAlert } from 'react-icons/ai';

interface PostMoreModalProps {
  post: PostWithUser;
  user: IUser;
}

interface PostMoreModalResponse {
  result: boolean;
  status: ProductStatus;
}

function PostMoreModal({ post, user }: PostMoreModalProps, ref: ForwardedRef<HTMLDialogElement>) {
  const router = useRouter();

  // 내껀가!!!
  const isMe = user.id === post.user.id;

  // api - 상태 수정.
  const [setStateToServer, { loading, data }] = useMutation<PostMoreModalResponse>(
    `/api/posts/${router.query.id}/status`,
  );

  // api - 신고.
  const [startClaim, { data: claimData }] = useMutation<PostMoreModalResponse>(`/api/posts/${router.query.id}/claim`);

  const handleCancel = () => {
    if (ref && 'current' in ref && ref.current !== null) {
      (ref.current as HTMLDialogElement).close();
    }
  };

  // 수정.
  const handleEdit = () => {
    router.push(`/community/${post.id}/edit`);
  };

  // 감추기.
  const handleHide = () => {
    setStateToServer({ status: ProductStatus.HIDE }, 'PATCH');
  };

  // 보이기.
  const handleShow = () => {
    setStateToServer({ status: ProductStatus.SALE }, 'PATCH');
  };

  // 삭제.
  const handleDelete = () => {
    setStateToServer({ status: ProductStatus.DLTE }, 'PATCH');
  };

  // 신고.
  const onClaimOk = () => {
    startClaim({});
  };
  // 신고 callback.
  useEffect(() => {
    if (claimData?.result) {
      alert('신고되었습니다.');
    }
  }, [claimData]);
  const onClaimCancel = () => {
    alert('취소되었습니다.');
  };
  const handleClaim = useConfirm(
    '무분별한 신고 시, 서비스 이용에 제한될 수 있습니다. 신고하시겠습니까?',
    onClaimOk,
    onClaimCancel,
  );

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
      case ProductStatus.SALE:
        alert('다시 게시됐습니다.');
        router.push('/');
        break;
    }
  }, [data, router]);

  return (
    <div>
      <dialog id="modal_more_product" className="modal" ref={ref}>
        <div className="modal-box w-52 p-0">
          <div className="btn-group btn-group-vertical w-52">
            {/* 본인 것 */}
            {isMe && (
              <>
                <button className="btn" onClick={handleEdit}>
                  게시글 수정
                </button>
                {post.statusCd !== ProductStatus.HIDE && (
                  <button className="btn" onClick={handleHide}>
                    숨기기
                  </button>
                )}
                {post.statusCd === ProductStatus.HIDE && (
                  <button className="btn" onClick={handleShow}>
                    올리기
                  </button>
                )}
                <button className="btn text-red-700" onClick={handleDelete}>
                  삭제
                </button>
              </>
            )}
            {/* 타인 것 */}
            {!isMe && (
              <>
                <button className="btn" onClick={handleClaim}>
                  <div className="flex items-center text-red-700 space-x-1">
                    <AiOutlineAlert size={13} />
                    <div>신고</div>
                  </div>
                </button>
              </>
            )}
            {/* 공통 */}
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
