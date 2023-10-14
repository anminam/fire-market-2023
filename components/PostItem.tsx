import { dateFormate } from '@/libs/client/utils';
import Link from 'next/link';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { BiSolidChat } from 'react-icons/bi';

interface Props {
  id: string;
  name: string;
  createdAt: string;
  content: string;
  wondering: number;
  answer: number;
}

export default function PostItem({
  id,
  name,
  createdAt,
  content,
  answer,
  wondering,
}: Props) {
  return (
    <Link
      key={id}
      href={`/community/${id}`}
      className="flex flex-col items-start py-5"
    >
      <div className="badge badge-sm badge-neutral">질문</div>
      <div className="text-lg font-bold">{content}</div>

      <div className="mt-1 items-center justify-between w-full font-medium text-xs">
        <span>{name}</span> &bull; <span>{dateFormate(createdAt)}</span>
      </div>

      <div className="text-xs flex mt-1 space-x-1">
        <div className="flex items-center space-x-1">
          <AiOutlineQuestionCircle />
          <div>{wondering || '0'}</div>
        </div>
        <div>&bull;</div>
        <div className="flex items-center space-x-1">
          <BiSolidChat /> <div>{answer || '0'}</div>
        </div>
      </div>
    </Link>
  );
}
