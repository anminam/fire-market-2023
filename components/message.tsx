import Image from 'next/image';
import { cls } from '../libs/client/utils';

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
  userName?: string;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
  userName,
}: MessageProps) {
  return (
    <div
      className={cls(
        'flex items-start',
        reversed ? 'flex-row-reverse space-x-reverse' : 'space-x-2'
      )}
    >
      <div className="w-8 h-8 rounded-full bg-slate-400 relative">
        {avatarUrl ? (
          <Image
            alt={`${userName}의 아바타`}
            src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${avatarUrl}/avatar`}
            className="w-12 h-12 rounded-full bg-slate-300 object-cover"
            layout="fill"
          />
        ) : null}
      </div>
      <div className="w-1/2 text-sm text-gray-700 p-2 mx-2 border border-gray-300 rounded-md">
        <p>{message}</p>
      </div>
    </div>
  );
}
