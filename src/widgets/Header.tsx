import { Menu, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useLogoutMutation } from '@/features/auth/api/authApi';
import { logout } from '@/features/auth/model/authSlice';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { Button } from '@/shared/ui/Button';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutRequest] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch (error) {
      toast.info(getApiErrorMessage(error));
    } finally {
      dispatch(logout());
      navigate('/', { replace: true });
    }
  };

  const links = user
    ? [
        { to: '/dashboard', label: 'Кабинет' },
        ...(user.role === 'admin'
          ? [{ to: '/admin/projects', label: 'Админка' }]
          : []),
      ]
    : [
        { to: '/login', label: 'Вход' },
        { to: '/register', label: 'Регистрация' },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold text-gray-950">
          LaunchSlab
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm ${isActive ? 'font-semibold text-gray-950' : 'text-gray-600'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <span className="text-sm text-gray-500">{user.email}</span>
              <Link
                to="/dashboard/projects/new"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-900 bg-gray-900 px-4 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Добавить проект
              </Link>
              <Button type="button" variant="ghost" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : null}
        </nav>
        <Button
          type="button"
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Открыть меню"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      {isOpen ? (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-700"
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <span className="text-sm text-gray-500">{user.email}</span>
                <NavLink
                  to="/dashboard/projects/new"
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-700"
                >
                  Добавить проект
                </NavLink>
                <Button type="button" variant="secondary" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
