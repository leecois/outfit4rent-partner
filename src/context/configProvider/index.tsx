import './config.css';

import { RefineThemes } from '@refinedev/antd';
import type { ThemeConfig } from 'antd';
import { ConfigProvider as AntdConfigProvider, theme } from 'antd';
import { ThemeProvider } from 'antd-style';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'light' | 'dark';

type ConfigProviderContextProps = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

export const ConfigProviderContext = createContext<
  ConfigProviderContextProps | undefined
>(undefined);

const defaultMode: Mode = (localStorage.getItem('theme') as Mode) || 'light';

type ConfigProviderProps = {
  theme?: ThemeConfig;
};

export const ConfigProvider = ({
  theme: themeFromProps,
  children,
}: PropsWithChildren<ConfigProviderProps>) => {
  const [mode, setMode] = useState<Mode>(defaultMode);

  const handleSetMode = (newMode: Mode) => {
    localStorage.setItem('theme', newMode);
    const html = document.querySelector('html');
    html?.setAttribute('data-theme', newMode);
    setMode(newMode);
  };

  // add data-theme to html tag
  useEffect(() => {
    const html = document.querySelector('html');
    html?.setAttribute('data-theme', mode);
  }, []);

  return (
    <ConfigProviderContext.Provider value={{ mode, setMode: handleSetMode }}>
      <AntdConfigProvider
        theme={{
          ...RefineThemes.Orange,
          algorithm:
            mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
          ...themeFromProps,
        }}
      >
        <ThemeProvider appearance={mode}>{children}</ThemeProvider>
      </AntdConfigProvider>
    </ConfigProviderContext.Provider>
  );
};

export const useConfigProvider = () => {
  const context = useContext(ConfigProviderContext);

  if (context === undefined) {
    throw new Error('useConfigProvider must be used within a ConfigProvider');
  }

  return context;
};
