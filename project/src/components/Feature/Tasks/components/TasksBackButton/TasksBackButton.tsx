import type { FC } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import SVG_CHEVRON_LEFT from '@assets/icons/chevron-left.svg?react';
import styles from './TasksBackButton.module.scss';

type TasksBackButtonProps = {
  className?: string;
};

export const TasksBackButton: FC<TasksBackButtonProps> = ({ className }) => (
  <Link to="/" className={clsx(styles.root, className)}>
    <SVG_CHEVRON_LEFT className={styles.icon} width={12} height={12} aria-hidden />
    <span className={styles.label}>к билетам</span>
  </Link>
);
