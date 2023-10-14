import Link from 'next/link';
import React from 'react';

interface FloatingButton {
  children: React.ReactNode;
  href: string;
  title?: string;
}

export default function FloatingButton({
  children,
  href,
  title,
}: FloatingButton) {
  return (
    <Link
      href={href}
      className="font-bold text-sm fixed bg-blue-500 hover:bg-blue-400 border-0  border-transparent transition-colors cursor-pointer  bottom-24 right-5 shadow-xl  rounded-full px-3 py-2 h-15 flex items-center justify-center text-white"
    >
      {children} <span className="pl-1">{title || '글쓰기'}</span>
    </Link>
  );
}
