import { PostWithUser } from '@/interface/Community';
import { communityDateFormat } from '@/libs/client/utils';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { BiSolidChat } from 'react-icons/bi';

interface Props {
  item: PostWithUser;
}

export default function PostItem({ item }: Props) {
  return (
    <Link key={item.id} href={`/community/${item.id}`} className="flex flex-col items-start px-4 py-5">
      {/* 뱃지 */}
      <div className="mb-2">
        <div className="space-x-1">
          <div className="badge badge-sm badge-neutral">질문</div>
          {item.statusCd === 'HIDE' && <div className="badge badge-sm badge-neutral">숨김</div>}
        </div>
      </div>
      <div className="font-bold">{item.question}</div>

      <div className="mt-1 items-center justify-between w-full font-medium text-xs opacity-50">
        <span>{item.user.name}</span> &bull; <span>{communityDateFormat(item.createdAt)}</span>
      </div>

      <div className="text-xs flex mt-1 space-x-2 opacity-50">
        {item._count.Interests > 0 && (
          <div className="flex items-center space-x-1">
            <AiOutlineHeart />
            <div>{item._count.Interests}</div>
          </div>
        )}
        {item._count.Answers > 0 && (
          <div className="flex items-center space-x-1">
            <BiSolidChat />
            <div>{item._count.Answers}</div>
          </div>
        )}
      </div>
    </Link>
  );
}
