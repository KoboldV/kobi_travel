import AppNav from "../components/AppNav";
import Sidebar from "../components/Sidebar";
import styles from "./AppLayout.module.css";
import Map from "../components/Map";
import User from "../components/User";

function AppLayout() {
  return (
    <div className={styles.app}>
      <User></User>
      <Sidebar></Sidebar>
      <Map></Map>
    </div>
  );
}

export default AppLayout;
