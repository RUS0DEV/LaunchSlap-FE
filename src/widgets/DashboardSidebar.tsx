import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Мои проекты', end: true },
  { to: '/dashboard/projects/new', label: 'Добавить проект' },
  { to: '/dashboard/promotions', label: 'Мои продвижения' },
  { to: '/dashboard/payments', label: 'История оплат' },
];

export function DashboardSidebar() {
  return (
    <aside className="rounded-lg border border-gray-200 bg-white p-3">
      <nav className="grid gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm ${
                isActive
                  ? 'bg-gray-900 font-medium text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
