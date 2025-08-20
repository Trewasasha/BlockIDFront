import styles from './Error.module.css';

export const Error = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className={styles.error}>
      <span>{message}</span>
      <button onClick={onClose} className={styles.closeButton}>×</button>
    </div>
  );
};