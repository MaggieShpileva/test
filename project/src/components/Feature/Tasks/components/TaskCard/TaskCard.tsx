import type { FC, MouseEvent } from 'react';
import clsx from 'clsx';
import WEBP_BONUS_COIN from '@assets/images/tasks/bonus-coin.webp';
import styles from './TaskCard.module.scss';

type TaskCardProps = {
  title: string;
  description: string;
  reward: number;
  image: string;
  timeLeft?: string;
  canClaim?: boolean;
  className?: string;
  onClick?: () => void;
  onClaimClick?: () => void;
};

export const TaskCard: FC<TaskCardProps> = ({
  title,
  description,
  reward,
  image,
  timeLeft,
  canClaim,
  className,
  onClick,
  onClaimClick,
}) => {
  const handleClaim = (event: MouseEvent) => {
    event.stopPropagation();
    onClaimClick?.();
  };

  return (
    <article
      className={clsx(styles.root, className)}
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
          <img className={styles.rewardIcon} src={WEBP_BONUS_COIN} alt="" width={14} height={14} />
          <span className={styles.rewardValue}>+{reward}</span>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.head}>
          <h3 className={styles.title}>{title}</h3>
          {timeLeft ? <span className={styles.time}>{timeLeft}</span> : null}
        </div>
        <p className={styles.description}>{description}</p>
        {canClaim ? (
          <button type="button" className={styles.claim} onClick={handleClaim}>
            забрать награду
          </button>
        ) : null}
      </div>
    </article>
  );
};
