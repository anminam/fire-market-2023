import { chatDateFormat, getImageSrc } from '@/libs/client/utils';
import ProfileImage from './ProfileImage';

const ChatThumbnailItem = ({
  name,
  avatar,
  text,
  date,
  productImage,
  productImageAlt,
}: {
  name?: string;
  avatar?: string | null;
  text?: string;
  date?: Date;
  productImage?: string;
  productImageAlt?: string;
}) => {
  return (
    <div className="flex px-4 items-center justify-between">
      {/* 좌측 */}
      <div className="flex">
        <div className="flex mr-4 items-center">
          <ProfileImage avatar={avatar} size={14} />
        </div>
        <div>
          <div className="flex items-center">
            <div className="mr-1">{name}</div>
            {date && (
              <div className="text-xs opacity-50">· {chatDateFormat(date)}</div>
            )}
          </div>
          <p className="opacity-50">{text}</p>
        </div>
      </div>
      {/* 우측 */}
      {productImage && (
        <div className="avatar">
          <div className="w-12 rounded">
            <img
              className=""
              alt={productImageAlt}
              src={getImageSrc(productImage, true)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatThumbnailItem;
