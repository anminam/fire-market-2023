import { CommunityState } from '@/interface/Community';
import PostItem from './PostItem';
import NothingWithContainer from './NothingWithContainer';

interface IProps {
  list: CommunityState[];
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

  return list.map(_ => {
    return (
      <div key={_.id}>
        <PostItem
          id={_.id}
          content={_.question}
          createdAt={_.createdAt.toString()}
          name={_.user.name}
          answer={_._count?.Answers}
          wondering={_._count?.Interests}
        />
      </div>
    );
  });
}
