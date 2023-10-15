import type { NextPage } from 'next';
import Layout from '@/components/layout';
import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import OtherProfileImage from '@/components/UserProfileContainer';

interface OtherUserResponse {
  result: boolean;
  data: User;
}

/**
 * 나의 화재
 */
const OtherProfile: NextPage = () => {
  const router = useRouter();

  const { data, isLoading } = useSWR<OtherUserResponse>(
    router.query.id ? `/api/users/${router.query.id}` : null
  );

  return (
    <Layout canGoBack title="나의 화재">
      <div className="px-4">
        <OtherProfileImage avatar={data?.data.avatar} name={data?.data.name} />
      </div>
      <div className="divider"></div>
    </Layout>
  );
};

export default OtherProfile;
