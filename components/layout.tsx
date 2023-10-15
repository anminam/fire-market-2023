import React from 'react';

import { cls } from '@/libs/client/utils';
import { useRouter } from 'next/router';
import LayoutTitle from './layout-title';
import GroundNavBar from './GroundNavBar';
import Head from 'next/head';

import { AiOutlineHome } from 'react-icons/ai';
import { FaChevronLeft } from 'react-icons/fa';

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  isViewTabBar?: boolean;
  children: React.ReactNode;
  isHideTitle?: boolean;
}

export default function Layout({
  title: pTitle,
  canGoBack,
  isViewTabBar,
  children,
  isHideTitle = true,
}: LayoutProps) {
  const router = useRouter();

  const onBackClick = () => {
    router.back();
  };

  const onHomeClick = () => {
    router.replace('/');
  };

  const title = `${pTitle} | 화재장터`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      {isHideTitle && (
        <div className="w-full h-12 max-w-xl justify-center bg-base-100 fixed border-b border-b-neutral top-0 flex items-center z-10">
          {canGoBack ? (
            <div className="absolute flex left-4 space-x-5 items-center h-5 text-lg">
              <button onClick={onBackClick} className="">
                <FaChevronLeft size="18" />
              </button>
              <button onClick={onHomeClick} className="">
                <AiOutlineHome size="20" />
              </button>
            </div>
          ) : null}
          {pTitle && <LayoutTitle canGoBack={canGoBack}>{pTitle}</LayoutTitle>}
        </div>
      )}
      <div className={cls('pt-12', isViewTabBar ? 'pb-24' : '')}>
        {children}
      </div>
      {isViewTabBar && <GroundNavBar />}
    </div>
  );
}
