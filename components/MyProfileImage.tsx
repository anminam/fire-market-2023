import useUser from '@/libs/client/useUser';
import ProfileImage from './ProfileImage';

const MyProfileImage = () => {
  const { user } = useUser();
  const avatar = user?.avatar;

  return <ProfileImage avatar={avatar} />;
};

export default MyProfileImage;
