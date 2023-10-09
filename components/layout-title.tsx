import { cls } from '@/libs/client/utils';

interface Props {
  canGoBack?: boolean;
  children: React.ReactNode;
}
export default function LayoutTitle({ canGoBack, children }: Props) {
  return (
    <span className={cls(canGoBack ? 'mx-auto' : '', '')}>{children}</span>
  );
}
