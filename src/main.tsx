import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store/index.ts'
import { LoadingOverlay } from './components/ui/LoadingOverlay.tsx'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingOverlay />} persistor={persistor}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
        <Toaster />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
