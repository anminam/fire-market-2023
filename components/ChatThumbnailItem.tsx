import { chatDateFormat, getImageSrc } from '@/libs/client/utils';
import ProfileImage from './ProfileImage';

const ChatThumbnailItem = ({
  name,
  avatar,
  text,
  date,
  productImage,
  productImageAlt,
  readCount,
}: {
  name?: string;
  avatar?: string | null;
  text?: string;
  date?: Date;
  productImage?: string;
  productImageAlt?: string;
  readCount?: number;
}) => {
  return (
    <div className="flex px-4 items-center justify-between">
      {/* 좌측 */}
      <div className="flex">
        {/* 이미지 */}
        <div className="flex mr-4 items-center">
          <ProfileImage avatar={avatar} size={14} />
        </div>
        {/* 우측 정보 */}
        <div>
          <div className="flex items-center">
            <div className="mr-1">{name}</div>
            {date && <div className="text-xs opacity-50">· {chatDateFormat(date)}</div>}
            {readCount ? (
              <div className="text-[10px] bg-secondary text-white rounded-full ml-2 min-w-[1rem] flex justify-center items-center">
                <div>{readCount}</div>
              </div>
            ) : null}
          </div>
          <p className="mr-4 opacity-50 text-sm line-clamp-1">{text}</p>
        </div>
      </div>
      {/* 우측 */}
      {productImage && (
        <div className="avatar">
          <div className="w-12 rounded">
            <img className="" alt={productImageAlt} src={getImageSrc(productImage, true)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatThumbnailItem;
