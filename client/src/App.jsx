import { Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'sonner';
import Issues from './Pages/Issues';
import IssueDetail from './Pages/IssueDetail';
import EditIssue from './Pages/EditIssue';
import Settings from './Pages/Settings';
import Metrics from './Pages/Metrics';
import { useAuth } from './context/context';
import { LoginForm } from './Components/authentication/LoginForm'
import { RegistrationForm } from './Components/authentication/RegistrationForm'
import { ProtectedRoute } from './Components/authentication/ProtectedRoute';
import { Layout } from './Components/authentication/Logout';
import { cardVariants, cardPadding, typography, buttonVariants } from './styles';

function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className={`${cardVariants.default} ${cardPadding.lg} text-center`}>
        <h1 className={`${typography.h1} mb-4`}>
          Apartment Tracker
        </h1>
        <nav className="mt-6 space-x-4">
          <Link to="/issues" className={buttonVariants.link}>
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
    <>
    <Toaster richColors position="bottom-right" />
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Home />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/issues/new" element={<Issues />} />
        <Route path="/issues/:id/edit" element={<EditIssue />} />
        <Route path="/issues/:id" element={<IssueDetail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/metrics" element={<Metrics />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
