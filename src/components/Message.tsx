import styles from "./Message.module.css";

type MessageType = {
  message: string;
};

function Message({ message }: MessageType) {
  return (
    <p className={styles.message}>
      <span role="img">👋</span> {message}
    </p>
  );
}

export default Message;
