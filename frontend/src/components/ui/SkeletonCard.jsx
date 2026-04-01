import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`skeleton ${styles.image}`} />
      <div className={styles.body}>
        <div className={`skeleton ${styles.cat}`} />
        <div className={`skeleton ${styles.title}`} />
        <div className={`skeleton ${styles.titleSm}`} />
        <div className={styles.footer}>
          <div className={`skeleton ${styles.price}`} />
          <div className={`skeleton ${styles.btn}`} />
        </div>
      </div>
    </div>
  );
}
