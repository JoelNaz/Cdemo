import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';
import S00Landing from './screens/S00Landing';
import S01Reach from './screens/S01Reach';
import S02Extraction from './screens/S02Extraction';
import S03Pipeline from './screens/S03Pipeline';
import S04Channel from './screens/S04Channel';
import S05Territory from './screens/S05Territory';
import S06Promo from './screens/S06Promo';
import S07Benchmark from './screens/S07Benchmark';
import S08Outstanding from './screens/S08Outstanding';
import S09Untapped from './screens/S09Untapped';
import './index.css';

function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[260px] flex-1 min-h-screen flex flex-col">
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
        </Routes>
      </main>
      <ChatBot />
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
