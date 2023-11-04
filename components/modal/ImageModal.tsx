import { useMiniStore } from '@/hooks/useStore';
import ReactModal from 'react-modal';

const customStyles = {
  overlay: {
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'hsl(var(--b3))',
    borderColor: 'hsl(var(--b3))',
  },
};

export default function ImageModal() {
  const { isImageModal, closeImageModal, imageModalSrc } = useMiniStore();

  return (
    <ReactModal
      isOpen={isImageModal}
      ariaHideApp={!isImageModal}
      style={customStyles}
      appElement={(typeof window === 'object' && document.getElementById('root')) || undefined}
    >
      {/* 상단 */}
      <div className="flex flex-col">
        <div className="flex flex-row-reverse">
          <button className={`btn btn-sm`} onClick={() => closeImageModal()}>
            X
          </button>
        </div>
        {/* 컨텐츠 */}
        <div>
          {' '}
          <img src={imageModalSrc} alt="이미지" />
        </div>
      </div>
    </ReactModal>
  );
}
