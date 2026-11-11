import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Homepage.module.css";
import { Link } from "react-router-dom";

export default function Homepage() {
  const { isLoggedIn } = useAuth();
  return (
    <main className={styles.homepage}>
      <PageNav></PageNav>
      <section>
        <h1>
          You travel the world.
          <br />
          KobiTravel keeps track of your adventures.
        </h1>
        <h2>
          A world map that tracks your footsteps into every city you can think
          of. Never forget your wonderful experiences, and show your friends how
          you have wandered the world.
        </h2>
        {isLoggedIn ? (
          <Link to="/app" className="cta">
            Start exploring now
          </Link>
        ) : (
          <Link to="login" className="cta">
            Login and start exploring
          </Link>
        )}
      </section>
    </main>
  );
}
