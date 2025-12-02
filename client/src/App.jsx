import { Routes, Route, Link } from 'react-router-dom';
import Issues from './pages/Issues';
import IssueDetail from './Pages/IssueDetail';
import EditIssue from './Pages/EditIssue';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Apartment Tracker
        </h1>
        <nav className="mt-6 space-x-4">
          <Link to="/issues" className="text-blue-600 hover:underline">
            View Issues
          </Link>
        </nav>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/issues" element={<Issues />} />
      <Route path="/issues/:id" element={<IssueDetail />} />
      <Route path="/issues/:id/edit" element={<EditIssue />} />
    </Routes>
  );
}

export default App;
