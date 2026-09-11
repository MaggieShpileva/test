import type { FC } from 'react';
import clsx from 'clsx';
import WEBP_BONUS_COIN from '@assets/images/tasks/bonus-coin.webp';
import styles from './TasksSeasonBadge.module.scss';

type TasksSeasonBadgeProps = {
  amount: number;
  className?: string;
};

export const TasksSeasonBadge: FC<TasksSeasonBadgeProps> = ({
  amount,
  className,
}) => (
  <div className={clsx(styles.root, className)}>
    <img
      className={styles.icon}
      src={WEBP_BONUS_COIN}
      alt=""
      width={28}
      height={28}
    />
    <p className={styles.text}>За сезон начислено {amount} бонусов</p>
  </div>
);
