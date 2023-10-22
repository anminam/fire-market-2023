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
  isTranslate?: boolean;
}

export default function Layout({
  title: pTitle,
  canGoBack,
  isViewTabBar,
  children,
  isHideTitle = true,
  isTranslate = false,
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
        <div
          className={`w-full h-12 max-w-xl justify-center fixed top-0 flex items-center z-10 ${
            isTranslate
              ? 'bg-transparent'
              : 'bg-base-100 border-b border-b-neutral'
          }`}
        >
          {canGoBack ? (
            <div className="absolute flex left-2 space-x-1 items-center h-5 text-lg">
              <button
                onClick={onBackClick}
                className="btn btn-circle btn-ghost"
              >
                <FaChevronLeft
                  size="18"
                  color={cls(isTranslate ? 'white' : '')}
                />
              </button>
              <button
                onClick={onHomeClick}
                className="btn btn-circle btn-ghost"
              >
                <AiOutlineHome
                  size="20"
                  color={cls(isTranslate ? 'white' : '')}
                />
              </button>
            </div>
          ) : null}
          {pTitle && !isTranslate && (
            <LayoutTitle canGoBack={canGoBack}>{pTitle}</LayoutTitle>
          )}
        </div>
      )}
      <div
        className={cls(isTranslate ? '' : 'pt-12', isViewTabBar ? 'pb-24' : '')}
      >
        {children}
      </div>
      {isViewTabBar && <GroundNavBar />}
    </div>
  );
}
