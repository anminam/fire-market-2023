import { cls } from '../libs/client/utils';
import ProfileImage from './ProfileImage';

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatar?: string;
  name?: string;
  time: string;
}

export default function Message({
  message,
  avatar,
  reversed,
  name,
  time,
}: MessageProps) {
  return (
    <div className="w-full">
      <div className={cls(`chat`, reversed ? 'chat-start' : 'chat-end')}>
        <div className="chat-image avatar">
          <ProfileImage avatar={avatar} size={10} />
        </div>
        <div className="chat-header">
          {name}
          <time className="text-xs opacity-50">{time}</time>
        </div>
        <div className="chat-bubble">{message}</div>
        {/* <div className="chat-footer opacity-50">아마 본거?</div> */}
      </div>
    </div>
  );
}
