import ChatPersonSelect from '@/components/ChatPersonSelect';
import { User } from '@prisma/client';
import { useState } from 'react';

// 예시용 리스트 가져오기.
function getList(): User[] {
  return [...Array.from(Array(2).keys())].map((_) => ({
    avatar: '',
    createdAt: new Date(),
    email: '',
    firebaseUid: '',
    id: _,
    name: `이름${_}`,
    updatedAt: new Date(),
    phone: '',
    canStream: false,
  }));
}
export default function Example() {
  const [isOpen, setOpen] = useState(false);

  const handlePersonSelected = (id: number) => {
    console.log(id);
    setOpen(false);
  };

  const handleClick = (id: number) => {
    // onClick(id);
  };

  return (
    <div>
      <button onClick={() => setOpen(true)}>가라</button>
      <ChatPersonSelect
        isOpen={isOpen}
        list={getList()}
        onSelected={handlePersonSelected}
        onClose={() => setOpen(false)}
        title="선택하라"
      />
    </div>
  );
}
