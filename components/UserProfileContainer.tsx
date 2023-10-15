import Image from 'next/image';
import Link from 'next/link';

interface IProps {
  id?: string;
  avatar?: string | null;
  name?: string;
  size?: '12' | '16' | '18';
  isViewTextProfile?: boolean;
}
const UserProfileContainer = ({
  avatar,
  name,
  id,
  size = '16',
  isViewTextProfile,
}: IProps) => {
  return (
    <Link href={`/profile/${id}`}>
      <div className="flex space-x-4 items-center mt-5">
        <div className="avatar">
          <div
            className={`w-${size} h-${size} rounded-full bg-slate-500 relative overflow-hidden`}
          >
            {avatar && (
              <Image
                alt="avatar"
                src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${avatar}/avatar`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={true}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-bold neutral">{name}</div>

          {isViewTextProfile && <p className="text-xs">프로필 보기</p>}
        </div>
      </div>
    </Link>
  );
};

export default UserProfileContainer;
