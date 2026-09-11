import type { FC } from 'react';
import clsx from 'clsx';
import type { RewardMonthGroup } from '../../types';
import { RewardItem } from '../RewardItem';
import styles from './RewardsList.module.scss';

type RewardsListProps = {
  groups: RewardMonthGroup[];
  className?: string;
};

export const RewardsList: FC<RewardsListProps> = ({ groups, className }) => (
  <div className={clsx(styles.root, className)}>
    {groups.map((group) => (
      <section key={group.month} className={styles.group}>
        <h3 className={styles.month}>{group.month}</h3>
        <div className={styles.items}>
          {group.items.map((item) => (
            <RewardItem key={item.id} item={item} />
          ))}
        </div>
      </section>
    ))}
  </div>
);
