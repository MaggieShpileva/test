import type { FC } from 'react';
import type { TaskChild } from '../../../../types';
import styles from '../../TaskGroupCard.module.scss';

type TaskGroupChildrenProps = {
  items: TaskChild[];
  image: string;
};

export const TaskGroupChildren: FC<TaskGroupChildrenProps> = ({ items, image }) => (
  <ul className={styles.children}>
    {items.map((child) => (
      <li key={child.id} className={styles.child}>
        <img className={styles.childImage} src={image} alt="" width={60} height={60} />
        <div className={styles.childText}>
          <p className={styles.childTitle}>{child.title}</p>
          <p className={styles.childDescription}>{child.description}</p>
        </div>
        {child.isCompleted ? <span className={styles.check} aria-label="Выполнено" /> : null}
      </li>
    ))}
  </ul>
);
