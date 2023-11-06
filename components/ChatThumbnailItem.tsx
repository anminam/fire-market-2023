import { chatDateFormat, getImageSrc } from '@/libs/client/utils';
import ProfileImage from './ProfileImage';
import { IRoom } from '@/interface/Chat';
import { User } from '@prisma/client';
import StatusBadge from './StatusBadge';

const ChatThumbnailItem = ({
  userMy,
  userYour,
  text,
  room,
}: {
  userMy: User;
  userYour: User;
  text?: string;
  room: IRoom;
}) => {
  // 내상품 여부.
  let isMyProduct = userMy.id === room.product.userId;
  // 뱃지 노출 여부.
  let isShowBadge = false;

  if (isMyProduct) {
    // 내상품이면 buyerId 상대방과 비교한다.
    isShowBadge = room.product.buyerId === userYour.id;
  } else {
    // 내상품이 아니면 buyerId 내것과 비교한다.
    isShowBadge = room.product.buyerId === userMy.id;
  }
  // if (isShowBadge) {
  //   // debugger;
  // }
  return (
    <div className="flex px-4 items-center justify-between">
      {/* 좌측 */}
      <div className="flex">
        {/* 이미지 */}
        <div className="flex mr-4 items-center">
          <ProfileImage avatar={userYour.avatar} size={14} />
        </div>
        {/* 우측 정보 */}
        <div>
          <div className="flex items-center">
            <div className="mr-1">{userYour.name}</div>
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
                <StatusBadge status={room.product.statusCd} />
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
