import React from 'react';

import { cls } from '@/libs/client/utils';
import { useRouter } from 'next/router';
import LayoutTitle from './layout-title';
import GroundNavBar from './GroundNavBar';
import Head from 'next/head';

import { AiOutlineHome, AiOutlineMore } from 'react-icons/ai';
import { FaChevronLeft } from 'react-icons/fa';

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  isViewTabBar?: boolean;
  children: React.ReactNode;
  isHideTitle?: boolean;
  isMore?: boolean;
  isProducts?: boolean;
  onMoreClick?: () => void;
}

export default function Layout({
  title: pTitle,
  canGoBack,
  isViewTabBar,
  children,
  isHideTitle = true,
  isMore = false,
  isProducts = false,
  onMoreClick,
}: LayoutProps) {
  const router = useRouter();

  const onBackClick = () => {
    router.back();
  };

  const onHomeClick = () => {
    router.replace('/');
  };

  const handleClickMore = () => {
    onMoreClick?.();
  };

  const title = `${pTitle ?? ''} | 화재장터`;

  const topIconColor = isProducts ? 'white' : 'base-100';

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      {isHideTitle && (
        <div
          className={`w-full h-12 max-w-xl justify-center fixed top-0 flex items-center z-10 ${
            isProducts ? 'bg-transparent' : 'bg-base-100 border-b-[1px] border-b-[hsl(var(--bc)/20%)]'
          }`}
        >
          {canGoBack ? (
            <div className="absolute flex left-2 space-x-1 items-center h-5 text-lg">
              <button onClick={onBackClick} className="btn btn-circle btn-ghost">
                <FaChevronLeft size="18" color={topIconColor} />
              </button>
              <button onClick={onHomeClick} className="btn btn-circle btn-ghost">
                <AiOutlineHome size="20" color={topIconColor} />
              </button>
            </div>
          ) : null}
          {pTitle && !isProducts && <LayoutTitle canGoBack={canGoBack}>{pTitle}</LayoutTitle>}
          {isMore && (
            <div className="absolute flex right-2 space-x-1 items-center h-5 text-lg">
              <button onClick={() => handleClickMore()} className="btn btn-circle btn-ghost">
                <AiOutlineMore size="20" color={topIconColor} />
              </button>
            </div>
          )}
        </div>
      )}
      <div className={cls(isProducts ? '' : 'pt-12', isViewTabBar ? 'pb-24' : '')}>{children}</div>
      {isViewTabBar && <GroundNavBar />}
    </div>
  );
}
