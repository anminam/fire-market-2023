import { dateFormat } from '@/libs/client/utils';
import Image from 'next/image';

interface Props {
  name: string;
  createdAt: string;
  content: string;
  avatar: string;
}

const size = '10';

export default function PostAnswer({
  avatar,
  name,
  createdAt,
  content,
}: Props) {
  return (
    <div className="flex space-x-3">
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
        <div>
          <span className="text-sm block font-medium">{name}</span>
          <span className="text-xs text-gray-500 block ">
            {dateFormat(createdAt)}
          </span>
        </div>
        <div className="mt-2">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}
