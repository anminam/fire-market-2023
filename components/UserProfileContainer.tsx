import Link from 'next/link';
import ProfileImage from './ProfileImage';

interface IProps {
  id?: string;
  avatar?: string | null;
  name?: string;
  size?: 12 | 16 | 18;
  isViewTextProfile?: boolean;
}

const UserProfileContainer = ({
  avatar,
  name,
  id,
  size = 16,
  isViewTextProfile,
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

          {isViewTextProfile && <p className="text-xs">프로필 보기</p>}
        </div>
      </div>
    </Link>
  );
};

export default UserProfileContainer;
