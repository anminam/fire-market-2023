import { useMiniStore } from '@/hooks/useStore';
import { ITheme } from '@/interface/Theme';
import { ReactNode, use, useEffect } from 'react';

interface IThemeProps {
  children: ReactNode;
}
function ThemeProvider({ children }: IThemeProps) {
  const { theme, setTheme } = useMiniStore();

  useEffect(() => {
    const theme = (localStorage.getItem('sflea_theme') || 'dark') as ITheme;
    if (theme) {
      setTheme(theme);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!theme) return;
    localStorage.setItem('sflea_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <div>{children}</div>;
}

export default ThemeProvider;
