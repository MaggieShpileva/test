import type { FC } from 'react';
import { SegmentedControl } from 'components-funtech-ui';
import clsx from 'clsx';
import type { TaskTab } from '../../types';
import styles from './TasksTabs.module.scss';

type TasksTabsProps = {
  activeTab: TaskTab;
  activeCount: number;
  onChange: (tab: TaskTab) => void;
  className?: string;
};

const TAB_ACTIVE = 'active' as const;
const TAB_REWARDS = 'rewards' as const;

export const TasksTabs: FC<TasksTabsProps> = ({
  activeTab,
  activeCount,
  onChange,
  className,
}) => {
  const labels = {
    [TAB_ACTIVE]: `Активные (${activeCount})`,
    [TAB_REWARDS]: 'Награды',
  } as const;

  return (
    <SegmentedControl
      buttonsName={[labels[TAB_ACTIVE], labels[TAB_REWARDS]]}
      activeValue={labels[activeTab]}
      onChange={(label) => {
        onChange(label === labels[TAB_REWARDS] ? TAB_REWARDS : TAB_ACTIVE);
      }}
      aria-label="Вкладки заданий"
      classNames={{
        root: clsx(styles.root, className),
        indicator: styles.indicator,
        button: styles.button,
        buttonActive: styles.buttonActive,
        buttonInactive: styles.buttonInactive,
      }}
    />
  );
};
