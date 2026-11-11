type ButtonPropType = {
  children: React.ReactNode;
  type: "primary" | "back" | "position";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

import styles from "./Button.module.css";

function Button({ children, type, onClick }: ButtonPropType) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  );
}

export default Button;
