import useUser from '@/libs/client/useUser';
import { cls } from '@/libs/client/utils';
import Image from 'next/image';

const MyProfileImage = () => {
  const { user } = useUser();
  const avatar = user?.avatar;

  return (
    <div className="avatar">
      <div
        className={cls(
          `w-16 h-16 rounded-full bg-neutral relative overflow-hidden`,
          !avatar ? 'animate-pulse' : ''
        )}
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
  );
};

export default MyProfileImage;
