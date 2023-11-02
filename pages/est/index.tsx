import ChatPersonSelect from '@/components/ChatPersonSelect';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Sheet from 'react-modal-sheet';

// 예시용 인터페이스.
interface IPersonListProps {
  id: number;
  name: string;
}

// 예시용 리스트 가져오기.
function getList(): IPersonListProps[] {
  return [...Array.from(Array(2).keys())].map((_) => ({
    id: _,
    name: _.toString(),
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
