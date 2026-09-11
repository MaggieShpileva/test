import type { FC, MouseEvent } from 'react';
import clsx from 'clsx';
import WEBP_BONUS_COIN from '@assets/images/tasks/bonus-coin.webp';
import SVG_CHEVRON_DOWN from '@assets/icons/chevron-down.svg?react';
import styles from '../../TaskGroupCard.module.scss';

type TaskGroupHeaderProps = {
  title: string;
  description: string;
  reward: number;
  image: string;
  progress: { done: number; total: number };
  isOpen: boolean;
  onClick?: () => void;
  onToggle: (event: MouseEvent) => void;
};

export const TaskGroupHeader: FC<TaskGroupHeaderProps> = ({
  title, description, reward, image, progress, isOpen, onClick, onToggle,
}) => (
  <div
    className={styles.main}
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    }}
  >
    <div className={styles.media}>
      <img className={styles.image} src={image} alt="" width={124} height={124} />
      <div className={styles.reward}>
        <img src={WEBP_BONUS_COIN} alt="" width={14} height={14} className={styles.rewardIcon} />
        <span className={styles.rewardValue}>+{reward}</span>
      </div>
    </div>
    <div className={styles.content}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.footer}>
        <div className={styles.progress}>
          <span
            className={styles.progressFill}
            style={{ width: `${(progress.done / progress.total) * 100}%` }}
          />
          <span className={styles.progressText}>
            Выполнено {progress.done}/{progress.total}
          </span>
        </div>
        <button
          type="button"
          className={clsx(styles.toggle, isOpen && styles.toggleOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Свернуть группу' : 'Развернуть группу'}
          onClick={onToggle}
        >
          <SVG_CHEVRON_DOWN width={24} height={24} aria-hidden />
        </button>
      </div>
    </div>
  </div>
);
