import './App.css';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import AdListPage from './pages/AdListPage';
import StatsPage from './pages/StatsPage';
import AdDetailPage from './pages/AdDetailPage';
import { MainLayout } from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="/list" element={<AdListPage />} />
          <Route path="/item/:id" element={<AdDetailPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
