import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import { HiPencil } from 'react-icons/hi';
import useSWR from 'swr';
import CommunitiesByList from '@/components/CommunitiesByList';
import { PostWithUser } from '@/interface/Community';

interface CommunityResponse {
  result: boolean;
  data: PostWithUser[];
}

const Community = () => {
  const { data } = useSWR<CommunityResponse>('/api/posts');

  return (
    <Layout isViewTabBar title="화재생활">
      <CommunitiesByList list={data?.data} />
      <FloatingButton href="/community/write">
        <HiPencil />
      </FloatingButton>
    </Layout>
  );
};

export default Community;
