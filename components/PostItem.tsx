import { dateFormat, communityDateFormat } from '@/libs/client/utils';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { BiSolidChat } from 'react-icons/bi';

interface Props {
  id: number;
  name: string;
  createdAt: string;
  content: string;
  wondering: number;
  answer: number;
}

export default function PostItem({ id, name, createdAt, content, answer, wondering }: Props) {
  return (
    <Link key={id} href={`/community/${id}`} className="flex flex-col items-start px-4 py-5">
      {/* 뱃지 */}
      <div className="mb-2">
        <div className="badge badge-sm badge-neutral">질문</div>
      </div>
      <div className="font-bold">{content}</div>

      <div className="mt-1 items-center justify-between w-full font-medium text-xs opacity-50">
        <span>{name}</span> &bull; <span>{communityDateFormat(createdAt)}</span>
      </div>

      <div className="text-xs flex mt-1 space-x-2 opacity-50">
        {wondering > 0 && (
          <div className="flex items-center space-x-1">
            <AiOutlineHeart />
            <div>{wondering}</div>
          </div>
        )}
        {answer > 0 && (
          <div className="flex items-center space-x-1">
            <BiSolidChat />
            <div>{answer}</div>
          </div>
        )}
      </div>
    </Link>
  );
}
