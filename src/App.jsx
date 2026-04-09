import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';
import ContextAction from './components/ContextAction';
import './index.css';

const S00Landing   = lazy(() => import('./screens/S00Landing'));
const S01Reach     = lazy(() => import('./screens/S01Reach'));
const S02Extraction = lazy(() => import('./screens/S02Extraction'));
const S03Pipeline  = lazy(() => import('./screens/S03Pipeline'));
const S04Channel   = lazy(() => import('./screens/S04Channel'));
const S05Territory = lazy(() => import('./screens/S05Territory'));
const S06Promo     = lazy(() => import('./screens/S06Promo'));
const S07Benchmark = lazy(() => import('./screens/S07Benchmark'));
const S08Outstanding = lazy(() => import('./screens/S08Outstanding'));
const S09Untapped  = lazy(() => import('./screens/S09Untapped'));

function ScreenFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-[1px]">Loading</span>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen flex-col gap-3">
      <div className="text-[72px] font-extrabold text-[var(--border)] leading-none tracking-[-4px]">404</div>
      <div className="text-[14px] font-semibold text-[var(--text-muted)]">Page not found</div>
      <a href="/" className="mt-2 text-[12px] font-bold text-[var(--accent)] hover:underline">← Back to Command Centre</a>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[260px] flex-1 min-h-screen flex flex-col">
        <Suspense fallback={<ScreenFallback />}>
          <Routes>
            <Route path="/" element={<S00Landing />} />
            <Route path="/reach" element={<S01Reach />} />
            <Route path="/extraction" element={<S02Extraction />} />
            <Route path="/pipeline" element={<S03Pipeline />} />
            <Route path="/channel" element={<S04Channel />} />
            <Route path="/territory" element={<S05Territory />} />
            <Route path="/promo" element={<S06Promo />} />
            <Route path="/benchmark" element={<S07Benchmark />} />
            <Route path="/outstanding" element={<S08Outstanding />} />
            <Route path="/untapped" element={<S09Untapped />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <ChatBot />
      <ContextAction />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
