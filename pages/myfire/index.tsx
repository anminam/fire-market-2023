import type { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';
import useUser from '@/libs/client/useUser';
import useSWR, { SWRConfig } from 'swr';
import { Review, User } from '@prisma/client';
import EvaluationItem from '@/components/EvaluationItem';
import { withSSRSession } from '@/libs/server/withSession';
import client from '@/libs/server/client';
import PageContentsContainer from '@/components/PageContentsContainer';
import { BiHeart, BiReceipt, BiShoppingBag } from 'react-icons/bi';
import MyProfileImage from '@/components/MyProfileImage';
import { useRouter } from 'next/router';

interface ReviewWithUser extends Review {
  createdBy: User;
}
interface ReviewResponse {
  result: boolean;
  data: ReviewWithUser[];
}

const Reviews: NextPage = () => {
  const { data } = useSWR<ReviewResponse>('/api/users/my/reviews');
  return (
    <PageContentsContainer title="사람들에게 받은 평가">
      <ul>
        {data?.data?.map((_) => {
          return (
            <EvaluationItem
              key={_.id}
              comment={_.review}
              id={_.createdBy.id}
              name={_.createdBy.name}
              star={_.rating}
            />
          );
        })}
      </ul>
    </PageContentsContainer>
  );
};

// 나의거래
const MyBusiness = () => {
  return (
    <PageContentsContainer title="나의거래">
      <div>
        <ul className="space-y-6">
          <li>
            <Link href="/myfire/loved">
              <div className="flex items-center gap-2">
                <BiHeart size="20" />
                <div>관심목록</div>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/myfire/sale">
              <div className="flex items-center gap-2">
                <BiReceipt size="20" />
                <div>판매내역</div>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/myfire/bought">
              <div className="flex items-center gap-2">
                <BiShoppingBag size="20" />
                <div>구매내역</div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </PageContentsContainer>
  );
};

/**
 * 기타
 */
const Others = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/users/logout', {
      method: 'POST',
    }).then(() => {
      router.replace('/');
    });
  };
  return (
    <PageContentsContainer title="기타">
      <div>
        <ul className="space-y-6">
          <li>
            <button onClick={handleLogout}>로그아웃</button>
          </li>
        </ul>
      </div>
    </PageContentsContainer>
  );
};

/**
 * 나의 화재
 */
const Profile: NextPage = () => {
  const { user } = useUser();

  const router = useRouter();
  const handleProfileButtonClicked = () => {
    router.push('/myfire/edit');
  };

  return (
    <Layout hasTabBar title="나의 화재">
      <div className="px-4">
        <Link href="/myfire/edit">
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center space-x-3 ">
              <MyProfileImage />
              <div className="text-xl font-bold ">
                <span className="">{user?.name}</span>
              </div>
            </div>
            <div className="">
              <button
                className="btn btn-sm btn-neutral"
                onClick={handleProfileButtonClicked}
              >
                프로필보기
              </button>
            </div>
          </div>
        </Link>
        <div className="divider"></div>
        <MyBusiness />
        <div className="divider"></div>
        <Reviews />
        <div className="divider"></div>
        <Others />
      </div>
    </Layout>
  );
};

export default Profile;
