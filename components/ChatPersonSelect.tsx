import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Sheet from 'react-modal-sheet';
import UserProfileContainer from './UserProfileContainer';
import { User } from '@prisma/client';
import UserProfileSelectContainer from './UserProfileSelectContainer';

interface IPersonListProps {
  id: number;
  name: string;
}

interface BottomUpProps {
  title: string;
  list: User[];
  onSelected: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPersonSelect({ list, onSelected, title = '선택', isOpen = false, onClose }: BottomUpProps) {
  return (
    <div className="">
      <Sheet
        isOpen={isOpen}
        onClose={() => onClose()}
        className=""
        // snapPoints={[100, 400, 100, 0]}
        snapPoints={[0.7, 0.3, 0]}
      >
        <Sheet.Container>
          <Sheet.Header className="bg-neutral">
            <div className="border-b-[1px] divide-[hsl(var(--bc)/20%)]">
              <div className="flex relative items-center justify-center px-4">
                <button
                  className={`btn btn-circle btn-ghost absolute left-0 bg-transparent border-0 py-3`}
                  onClick={() => onClose()}
                >
                  <AiOutlineClose size="24" />
                </button>
                <div className="text-sm font-bold py-3">{title}</div>
              </div>
            </div>
          </Sheet.Header>
          <Sheet.Content className="bg-neutral">
            <Sheet.Scroller>
              <ul className="flex flex-col divide-y divide-[hsl(var(--bc)/20%)] justify-center ">
                {list.map((_) => {
                  return (
                    <li key={_.id} className="px-4">
                      <button className="w-full py-2" onClick={() => onSelected(_.id)}>
                        <UserProfileSelectContainer
                          id={_.id.toString() || ''}
                          avatar={_.avatar}
                          name={_.name}
                          size={12}
                          isViewTextProfile={false}
                        ></UserProfileSelectContainer>
                      </button>
                    </li>
                  );
                })}
                <li className="px-4">
                  <button className="btn btn-neutral w-full" onClick={() => onSelected(0)}>
                    <div className="">선택안함</div>
                  </button>
                </li>
              </ul>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
}
