import { NavLink, Outlet } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "active" : undefined;

export const AppLayout = () => (
  <main>
    <header className="nav">
      <span className="brand">
        Doorstep<span>.</span>
      </span>
      <nav>
        <NavLink to="/" end className={navClass}>
          Services
        </NavLink>
        <NavLink to="/bookings" className={navClass}>
          My bookings
        </NavLink>
      </nav>
    </header>
    <Outlet />
  </main>
);
