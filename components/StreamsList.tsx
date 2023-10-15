import { dateFormat } from '@/libs/client/utils';
import { StreamsResponse } from '@/pages/streams';
import Image from 'next/image';
import Link from 'next/link';

interface IProps {
  data: StreamsResponse | undefined;
}
const StreamsList = ({ data }: IProps) => {
  return (
    <div>
      {data?.data.map((_) => (
        <Link key={_.id} href={`/streams/${_.id}`}>
          <div className="space-y-3 px-4">
            <div className="relative w-full rounded-md shadow-sm bg-slate-300 aspect-video overflow-hidden">
              <Image
                layout="fill"
                src={`https://customer-rfd4j8o0msz4s9nx.cloudflarestream.com/${_.cloudStreamId}/thumbnails/thumbnail.jpg?height=270`}
                alt={`${_.name} 의 방송`}
              />
            </div>
            <h1 className="text-2xl font-bold">{_.name}</h1>
            <div>
              <span className="_date text-sm">{dateFormat(_.updatedAt)}</span>
            </div>
          </div>
          <div className="divider "></div>
        </Link>
      ))}
    </div>
  );
};

export default StreamsList;
