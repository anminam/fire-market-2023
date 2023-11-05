import { PostWithUser } from '@/interface/Community';
import PostItem from './PostItem';
import NothingWithContainer from './NothingWithContainer';
import LoadingWithContainer from './LoadingWithContainer';

interface IProps {
  list?: PostWithUser[];
}

export default function CommunitiesByList({ list }: IProps) {
  return (
    <div className="divide-y divide-[hsl(var(--bc)/20%)]">
      <CommunitiesByListItem list={list} />
    </div>
  );
}

function CommunitiesByListItem({ list }: IProps) {
  if (!list) {
    return <LoadingWithContainer />;
  }
  if (!list.length) {
    return <NothingWithContainer />;
  }

  return list.map((_) => {
    return (
      <div key={_.id}>
        <PostItem item={_} />
      </div>
    );
  });
}
