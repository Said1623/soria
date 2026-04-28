import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();

  const token = localStorage.getItem('soria_token');
  const userRaw = localStorage.getItem('soria_user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  const isAuthenticated = !!localStorage.getItem('soria_token');

  const logout = () => {
    localStorage.removeItem('soria_token');
    localStorage.removeItem('soria_user');
    navigate('/login');
  };

  return { user, token, logout, isAuthenticated };
}
