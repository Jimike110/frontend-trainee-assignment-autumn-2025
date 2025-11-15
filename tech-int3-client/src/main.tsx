import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import { CustomThemeProvider } from './components/CustomThemeProvider.tsx';
import { NewAdsProvider } from './components/NewAdsProvider.tsx';
import 'nprogress/nprogress.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <NewAdsProvider>
          <App />
        </NewAdsProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
