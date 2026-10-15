import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserProvider, useBrowser } from './context/BrowserContext';
import { Navbar } from './components/layout/Navbar';
import { HomeScreen } from './components/layout/HomeScreen';
import { ResearchWorkspace } from './components/workspace/ResearchWorkspace';
import { OfflineBanner } from './components/layout/OfflineBanner';

const BrowserApp: React.FC = () => {
  const { view } = useBrowser();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex flex-col">
        {view === 'home' ? <HomeScreen /> : <ResearchWorkspace />}
      </div>
      <OfflineBanner />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserProvider>
        <BrowserApp />
      </BrowserProvider>
    </ThemeProvider>
  );
};

export default App;
