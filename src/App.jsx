import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import StepByStep from './pages/StepByStep';
import InstructionFormats from './pages/InstructionFormats';
import OpcodeExplorer from './pages/OpcodeExplorer';
import ControlSignalsPage from './pages/ControlSignalsPage';
import TestCases from './pages/TestCases';
import Analytics from './pages/Analytics';
import About from './pages/About';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/step-by-step" element={<StepByStep />} />
            <Route path="/formats" element={<InstructionFormats />} />
            <Route path="/opcodes" element={<OpcodeExplorer />} />
            <Route path="/control-signals" element={<ControlSignalsPage />} />
            <Route path="/tests" element={<TestCases />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
