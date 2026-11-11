import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import User from "../components/User";

function PageNav() {
  const { isLoggedIn } = useAuth();
  return (
    <nav className={styles.nav}>
      <Logo></Logo>
      <ul>
        <li>
          <NavLink to={"/pricing"}>Pricing</NavLink>
        </li>
        <li>
          <NavLink to={"/product"}>Product</NavLink>
        </li>
        <li>
          {isLoggedIn ? (
            <div className={styles.userWrapper}>
              <User />
            </div>
          ) : (
            <NavLink to={"/login"} className={styles.ctaLink}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
