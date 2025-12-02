import { Routes, Route, Link } from 'react-router-dom';
import Issues from './Pages/Issues';
import IssueDetail from './Pages/IssueDetail';
import { useAuth } from './context/context';
import { LoginForm } from './Components/authentication/LoginForm'
import { RegistrationForm } from './Components/authentication/RegistrationForm'
import { ProtectedRoute } from './Components/authentication/ProtectedRoute';
import { Layout } from './Components/authentication/Logout';


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
  const { token } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      } />
        <Route path="/issues" element={
        <ProtectedRoute>
          <Issues />
        </ProtectedRoute>
      } />
      </Route>
      <Route path="/issues/:id" element={
        <ProtectedRoute>
          <IssueDetail />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
