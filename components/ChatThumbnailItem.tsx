import { chatDateFormat, getImageSrc } from '@/libs/client/utils';
import ProfileImage from './ProfileImage';
import { IRoom } from '@/interface/Chat';
import { User } from '@prisma/client';

const ChatThumbnailItem = ({ user, text, room, me }: { user: User; text?: string; room: IRoom; me?: User }) => {
  // 상품이 내꺼이거나 || 거래한 사람이 나면 뱃지를 보여준다.
  const isShowBadge = room.product.userId === me?.id || room.product.buyerId === me?.id;

  return (
    <div className="flex px-4 items-center justify-between">
      {/* 좌측 */}
      <div className="flex">
        {/* 이미지 */}
        <div className="flex mr-4 items-center">
          <ProfileImage avatar={user.avatar} size={14} />
        </div>
        {/* 우측 정보 */}
        <div>
          <div className="flex items-center">
            <div className="mr-1">{user.name}</div>
            {room.updatedAt && <div className="text-xs opacity-50">· {chatDateFormat(room.updatedAt)}</div>}
            {room.readCount ? (
              <div className="text-[10px] bg-secondary text-white rounded-full ml-2 min-w-[1rem] flex justify-center items-center">
                <div>{room.readCount}</div>
              </div>
            ) : null}
          </div>
          <div className="flex items-center">
            {/* 뱃지 */}
            {isShowBadge ? (
              <>
                {room.product.statusCd === 'RSRV' ? (
                  <div className="badge badge-warning badge-sm mr-2">예약중</div>
                ) : null}
                {room.product.statusCd === 'CMPL' ? (
                  <div className="badge badge-success badge-sm mr-2">판매완료</div>
                ) : null}
              </>
            ) : null}

            <div className="mr-4 opacity-50 text-sm line-clamp-1">{text}</div>
          </div>
        </div>
      </div>
      {/* 우측 */}
      {room.product.image && (
        <div className="avatar">
          <div className="w-12 rounded">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="" alt={room.product.name + '의 사진'} src={getImageSrc(room.product.image, true)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatThumbnailItem;
