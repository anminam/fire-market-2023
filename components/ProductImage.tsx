import { getImageSrc } from '@/libs/client/utils';

interface IProps {
  alt?: string;
  src?: string;
  size?: 10 | 11 | 12 | 14 | 16 | 20 | 24 | 28;
}

export default function ProductImage({ alt, src, size = 20 }: IProps) {
  return (
    <div className={`w-${size} h-${size} bg-gray-400 rounded-md overflow-hidden`}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={`${alt}`} src={getImageSrc(src, true)} className=" bg-neutral object-cover w-full h-full" />
      )}
    </div>
  );
}
