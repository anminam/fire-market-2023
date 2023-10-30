import { PostWithUser } from '@/interface/Community';
import PostItem from './PostItem';
import NothingWithContainer from './NothingWithContainer';

interface IProps {
  list: PostWithUser[];
}

export default function CommunitiesByList({ list }: IProps) {
  return (
    <div className="divide-y-2 divide-neutral">
      <CommunitiesByListItem list={list} />
    </div>
  );
}

function CommunitiesByListItem({ list }: IProps) {
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
