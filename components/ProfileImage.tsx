import { cls, getImageSrc } from '@/libs/client/utils';

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
          !avatar ? 'animate-pulse' : '',
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {avatar && <img alt={alt} src={getImageSrc(avatar, true)} />}
      </div>
    </div>
  );
};

export default ProfileImage;
