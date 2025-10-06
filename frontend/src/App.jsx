import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import PatientsPage from './pages/PatientsPage';
import RecordsPage from './pages/RecordsPage';
import LoginPage from './pages/LoginPage';
import RequireAuth from './components/RequireAuth';
import { Menu, X, LogOut } from 'lucide-react';
import Logo from './assets/logo.png';
import PatientsPageBackup from './pages/PatientsPageBackup';
import RecordsPageBackup from './pages/RecordsPageBackup';

export default function App() {
  const [logoutMessage, setLogoutMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('authenticated') === 'true';
    setIsAuthenticated(auth);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    setIsAuthenticated(false);
    setLogoutMessage('Sesión cerrada con éxito');
    navigate('/login');

    setTimeout(() => setLogoutMessage(''), 3000); // Oculta después de 3 segundos
  };

  const navLinks = [
    { to: '/', label: 'Pacientes' },
    { to: '/historias', label: 'Historias clínicas' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src={Logo} alt="Logo" className="h-10 object-contain" />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-4 items-center">
            {isAuthenticated &&
              navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-150 ${
                    location.pathname === link.to
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-red-600 hover:underline ml-4"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Cerrar sesión
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && isAuthenticated && (
          <nav className="md:hidden px-4 pb-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-150 ${
                    location.pathname === link.to
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="text-red-600 text-sm text-left mt-2 hover:underline flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Cerrar sesión
              </button>
            </div>
          </nav>
        )}
      </header>

      <main className="px-4 py-6">
        {logoutMessage && (
          <div className="max-w-xl mx-auto mb-4 px-4 py-2 bg-green-100 text-green-700 text-sm rounded shadow">
            {logoutMessage}
          </div>
        )}

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <PatientsPageBackup />
              </RequireAuth>
            }
          />
          <Route
            path="/historias"
            element={
              <RequireAuth>
                <RecordsPageBackup />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
