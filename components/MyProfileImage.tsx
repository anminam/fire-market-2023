import useUser from '@/libs/client/useUser';
import Image from 'next/image';

const MyProfileImage = () => {
  const { user } = useUser();
  return (
    <div className="avatar">
      <div className="w-16 h-16 rounded-full bg-slate-500 relative overflow-hidden">
        {user?.avatar && (
          <Image
            alt="avatar"
            src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${user?.avatar}/avatar`}
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
