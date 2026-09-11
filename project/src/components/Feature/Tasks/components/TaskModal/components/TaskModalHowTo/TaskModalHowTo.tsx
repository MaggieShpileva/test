import type { FC } from 'react';
import clsx from 'clsx';
import styles from './TaskModalHowTo.module.scss';

type TaskModalHowToProps = {
  steps: string[];
  className?: string;
};

export const TaskModalHowTo: FC<TaskModalHowToProps> = ({ steps, className }) => (
  <div className={clsx(styles.root, className)}>
    <h3 className={styles.title}>Как выполнить</h3>
    <ol className={styles.list}>
      {steps.map((step, index) => (
        <li key={step} className={styles.item}>
          <span className={styles.number} aria-hidden>
            {index + 1}
          </span>
          <p className={styles.text}>{step}</p>
        </li>
      ))}
    </ol>
  </div>
);
