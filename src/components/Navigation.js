import styles from "./Navigation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faUser } from "@fortawesome/free-solid-svg-icons";

const { Link } = require("react-router-dom");

const Navigation = () => (
  <nav className={styles.nav}>
    <Link to="/">
      <FontAwesomeIcon
        icon={faComment}
        size="2xl"
        className={styles.icon}
        style={{ color: "#3a1d1d" }}
      />
    </Link>

    <Link to="/profile">
      <FontAwesomeIcon
        icon={faUser}
        size="2xl"
        className={styles.icon}
        style={{ color: "#3a1d1d" }}
      />
    </Link>
  </nav>
);

export default Navigation;
