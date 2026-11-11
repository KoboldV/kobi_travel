import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./User.module.css";

function User() {
  const { user, logOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  function handleClick() {
    if (isLoggedIn && user !== null) {
      logOut();
      navigate("/ ", { replace: true });
    }
  }

  return (
    <div className={styles.user}>
      <img src={user?.avatar} alt={user?.name} />
      <span>Welcome, {user?.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
