import ProfileImage from './ProfileImage';

const ChatThumbnailItem = ({
  name,
  avatar,
  text,
}: {
  name?: string;
  avatar?: string | null;
  text?: string;
}) => {
  return (
    <>
      <ProfileImage avatar={avatar} />
      <div>
        <p className="">{name}</p>
        <p className="text-xs opacity-">{text}</p>
      </div>
    </>
  );
};

export default ChatThumbnailItem;
