import { cls } from '@/libs/client/utils';

interface IProps {
  avatar?: string | null;
  alt?: string;
  size?: number;
}
const ProfileImage = ({ avatar, size = 16, alt = 'avatar' }: IProps) => {
  return (
    <div className="avatar">
      <div
        className={cls(
          `w-${size} h-${size} rounded-full bg-neutral relative overflow-hidden`,
          !avatar ? 'animate-pulse' : ''
        )}
      >
        {avatar && (
          <img
            alt={alt}
            src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${avatar}/avatar`}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
