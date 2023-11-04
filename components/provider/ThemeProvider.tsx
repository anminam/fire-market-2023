import { useMiniStore } from '@/hooks/useStore';
import { ReactNode, useEffect } from 'react';

interface IThemeProps {
  children: ReactNode;
}
function ThemeProvider({ children }: IThemeProps) {
  const { theme } = useMiniStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <div>{children}</div>;
}

export default ThemeProvider;
