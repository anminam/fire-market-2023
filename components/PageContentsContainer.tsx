import React from 'react';

interface IProps {
  title: string;
  children: React.ReactNode;
}

const PageContentsContainer = ({ title, children }: IProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <h1 className="pb-4">{title}</h1>
      <div>{children}</div>
    </div>
  );
};

export default PageContentsContainer;
