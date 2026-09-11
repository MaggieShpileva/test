import type { FC } from 'react';
import clsx from 'clsx';
import WEBP_BONUS_COIN from '@assets/images/tasks/bonus-coin.webp';
import type { RewardItem as RewardItemType } from '../../types';
import styles from './RewardItem.module.scss';

type RewardItemProps = {
  item: RewardItemType;
  className?: string;
};

export const RewardItem: FC<RewardItemProps> = ({ item, className }) => (
  <div className={clsx(styles.root, className)}>
    <div className={styles.main}>
      <p className={styles.title}>{item.title}</p>
      <p className={styles.meta}>{item.date}</p>
    </div>
    <div className={styles.aside}>
      <div className={styles.amount}>
        <img src={WEBP_BONUS_COIN} alt="" width={14} height={14} className={styles.icon} />
        <span>+{item.amount}</span>
      </div>
      <p className={styles.meta}>{item.expires}</p>
    </div>
  </div>
);
