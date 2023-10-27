import Link from 'next/link';
import ProfileImage from './ProfileImage';
import { communityDateFormat } from '@/libs/client/utils';

interface IProps {
  id?: string;
  avatar?: string | null;
  name?: string;
  size?: 10 | 12 | 16 | 18;
  isViewTextProfile?: boolean;
  isCommunity?: boolean;
  date?: Date | string;
}

const UserProfileContainer = ({
  avatar,
  name,
  id,
  size = 16,
  isViewTextProfile,
  isCommunity,
  date,
}: IProps) => {
  return (
    <Link href={`/profile/${id}`}>
      <div className="flex space-x-4 items-center mt-5">
        <ProfileImage avatar={avatar} size={size} />
        <div className="flex flex-col">
          {name ? (
            <div className="text-sm font-bold neutral">{name}</div>
          ) : (
            <div className="bg-neutral rounded animate-pulse w-20 h-3" />
          )}

          {/* 커뮤니티 전용 */}
          {isCommunity && date && (
            <div className="text-xs opacity-50">
              {communityDateFormat(date)}
            </div>
          )}

          {isViewTextProfile && <p className="text-xs">프로필 보기</p>}
        </div>
      </div>
    </Link>
  );
};

export default UserProfileContainer;
