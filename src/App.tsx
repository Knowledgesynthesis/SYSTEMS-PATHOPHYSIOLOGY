import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import PropagationGraph from './pages/PropagationGraph';
import TimelineSimulator from './pages/TimelineSimulator';
import OrganMatrix from './pages/OrganMatrix';
import OrganModules from './pages/OrganModules';
import CaseEngine from './pages/CaseEngine';
import Assessment from './pages/Assessment';
import Glossary from './pages/Glossary';

function App() {
  const { initializeSimulation } = useStore();

  useEffect(() => {
    // Initialize simulation with default state on app load
    initializeSimulation();
  }, [initializeSimulation]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="propagation" element={<PropagationGraph />} />
          <Route path="timeline" element={<TimelineSimulator />} />
          <Route path="matrix" element={<OrganMatrix />} />
          <Route path="organs" element={<OrganModules />} />
          <Route path="organs/:organId" element={<OrganModules />} />
          <Route path="cases" element={<CaseEngine />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="glossary" element={<Glossary />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
