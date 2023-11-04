import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';
import useUser from '@/libs/client/useUser';
import PageContentsContainer from '@/components/PageContentsContainer';
import { BiHeart, BiLogOut, BiPalette, BiReceipt, BiShoppingBag, BiSolidPalette } from 'react-icons/bi';
import MyProfileImage from '@/components/MyProfileImage';
import { useRouter } from 'next/router';
import { Suspense } from 'react';
import { AiOutlineFire } from 'react-icons/ai';
import { auth } from '@/libs/client/firebase';
import { useMiniStore } from '@/hooks/useStore';

// 나의 거래
const MyBusiness = () => {
  return (
    <PageContentsContainer title="나의 거래">
      <div>
        <ul className="space-y-6">
          <li>
            <Link href="/myfire/loved">
              <div className="flex items-center space-x-2">
                <BiHeart size="20" />
                <div>관심목록</div>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/myfire/sell">
              <div className="flex items-center space-x-2">
                <BiReceipt size="20" />
                <div>판매내역</div>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/myfire/bought">
              <div className="flex items-center space-x-2">
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

// 나의 화재생활
const MyFireCommunity = () => {
  return (
    <PageContentsContainer title="나의 화재생활">
      <div>
        <ul className="space-y-6">
          <li>
            <Link href="/myfire/community">
              <div className="flex items-center space-x-2">
                <AiOutlineFire size="20" />
                <div>화재생활 활동</div>
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
  const { isApp } = useMiniStore();

  const handleLogout = async () => {
    await auth.signOut();
    await fetch('/api/users/logout', {
      method: 'POST',
    }).then(() => {
      router.replace('/login');
    });
  };

  const handleAppLogout = () => {
    // @ts-ignore
    Logout.postMessage({});
  };

  return (
    <PageContentsContainer title="기타">
      <div>
        <ul className="space-y-6">
          <li>
            <Link href="/myfire/theme">
              <div className="flex items-center space-x-2">
                <BiPalette size="20" />
                <div>테마</div>
              </div>
            </Link>
          </li>
          <li>
            <div className="flex items-center space-x-2">
              <BiLogOut size="20" />
              <button onClick={() => (isApp ? handleAppLogout() : handleLogout())}>로그아웃</button>
            </div>
          </li>
        </ul>
      </div>
    </PageContentsContainer>
  );
};

const MiniProfile = () => {
  const router = useRouter();
  const { user } = useUser();
  const handleProfileButtonClicked = () => {
    router.push('/myfire/edit');
  };
  return (
    <Link href="/myfire/edit">
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center space-x-3 ">
          <MyProfileImage />
          {user?.name ? (
            <div className="text-xl font-bold">
              <span className="">{user?.name}</span>
            </div>
          ) : (
            <div className="animate-pulse h-4 bg-neutral rounded min-w-full" />
          )}
        </div>
        <div className="">
          <button className="btn btn-sm btn-neutral" onClick={handleProfileButtonClicked}>
            프로필보기
          </button>
        </div>
      </div>
    </Link>
  );
};

/**
 * 나의 화재
 */
const Myfire: NextPage = () => {
  return (
    <Layout isViewTabBar title="나의 화재">
      <div className="">
        <div className="px-4">
          <Suspense fallback={<div>loading...</div>}>
            <MiniProfile />
          </Suspense>
        </div>
        <div className="divider" />
        <div className="px-4">
          <MyBusiness />
        </div>
        <div className="divider" />
        <div className="px-4">
          <MyFireCommunity />
        </div>
        <div className="divider"></div>
        <div className="px-4">
          <Others />
        </div>
      </div>
    </Layout>
  );
};

export default Myfire;
