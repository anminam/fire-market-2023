import Link from 'next/link';
import React from 'react';

interface FloatingButton {
  children: React.ReactNode;
  href: string;
}

export default function FloatingButton({ children, href }: FloatingButton) {
  return (
    <Link legacyBehavior href={href}>
      <a className="text-sm fixed bg-blue-500 hover:bg-blue-400 border-0  border-transparent transition-colors cursor-pointer  bottom-24 right-5 shadow-xl  rounded-full px-3 py-2 h-15 flex items-center justify-center text-white">
        {children} <span className=" font-bold">글쓰기</span>
      </a>
    </Link>
  );
}
