import useUser from '@/libs/client/useUser';
import Image from 'next/image';

const MyProfileImage = () => {
  const { user } = useUser();
  return (
    <div className="avatar">
      <div className="w-16 rounded-full">
        {user?.avatar && (
          <Image
            height={64}
            width={64}
            alt="avatar"
            src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${user?.avatar}/avatar`}
            className="w-16 h-16 bg-slate-500 rounded-full"
          />
        )}
      </div>
    </div>
  );
};

export default MyProfileImage;
