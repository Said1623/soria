import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Layout.css';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isSuperAdmin = user?.role === 'super_admin';
  const initials = `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase() || '?';

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `s-nav-link${isActive ? ' s-nav-link--active' : ''}`;

  const close = () => setOpen(false);

  const kitsActive = ['/', '/domaine', '/kit'].some(p =>
    p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Overlay mobile */}
      {open && isAuthenticated && (
        <div className="s-overlay" onClick={close} />
      )}

      {/* Sidebar — visible uniquement si authentifié */}
      {isAuthenticated && (
        <aside className={`s-sidebar${open ? ' s-sidebar--open' : ''}`}>

          {/* Logo */}
          <div className="s-logo">
            <div className="s-logo-icon">S</div>
            <div>
              <div className="s-logo-name">SORIA</div>
              <div className="s-logo-tagline">Système d'action guidée</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="s-nav">

            <div className="s-nav-section">Navigation</div>

            <NavLink to="/" end className={navClass} onClick={close}>
              <span>🏠</span><span>Accueil</span>
            </NavLink>

            <NavLink
              to="/"
              className={() => `s-nav-link${kitsActive ? ' s-nav-link--active' : ''}`}
              onClick={close}
            >
              <span>📚</span><span>Mes kits</span>
            </NavLink>

            {isSuperAdmin && (
              <>
                <div className="s-nav-section">Administration</div>
                <NavLink to="/admin/invitations" className={navClass} onClick={close}>
                  <span>⚙️</span><span>Invitations</span>
                </NavLink>
              </>
            )}

          </nav>

          {/* Footer utilisateur */}
          <div className="s-footer">
            <div className="s-footer-user">
              <div className="s-footer-avatar">{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div className="s-footer-name">{user?.prenom} {user?.nom}</div>
                <div className="s-footer-email">{user?.email}</div>
              </div>
            </div>
            <button className="s-logout" onClick={logout} title="Déconnexion">
              ↩
            </button>
          </div>

        </aside>
      )}

      {/* Contenu principal */}
      <div className={`s-wrap${isAuthenticated ? ' s-wrap--auth' : ''}`}>

        {/* Burger — mobile uniquement */}
        {isAuthenticated && (
          <button className="s-burger" onClick={() => setOpen(o => !o)} aria-label="Menu">
            ☰
          </button>
        )}

        <Outlet />
      </div>

    </div>
  );
}
