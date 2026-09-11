import type { FC } from 'react';
import { BottomModal } from 'components-funtech-ui';
import clsx from 'clsx';
import WEBP_BONUS_COIN from '@assets/images/tasks/bonus-coin.webp';
import type { TaskItem } from '../../types';
import { TaskModalHowTo } from './components/TaskModalHowTo';
import styles from './TaskModal.module.scss';

type TaskModalProps = {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export const TaskModal: FC<TaskModalProps> = ({ task, isOpen, onClose }) => {
  if (!task) return null;

  const { modal } = task;

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      showHandle
      aria-label={task.title}
      classNames={{
        root: styles.root,
        backdrop: styles.backdrop,
        sheet: styles.sheet,
        handle: styles.handle,
        content: styles.content,
      }}
    >
      <div className={styles.body}>
        <div className={styles.tags}>
          <span className={clsx(styles.tag, styles.tagPrimary)}>{modal.statusLabel}</span>
          <span className={clsx(styles.tag, styles.tagSecondary)}>{modal.secondaryTag}</span>
        </div>
        <h2 className={styles.title}>{task.title}</h2>
        <div className={styles.reward}>
          <div className={styles.rewardTop}>
            <img className={styles.rewardIcon} src={WEBP_BONUS_COIN} alt="" width={36} height={36} />
            <p className={styles.rewardValue}>{task.reward}</p>
          </div>
          <p className={styles.rewardCaption}>{modal.rewardCaption}</p>
        </div>
        {modal.showHowTo && modal.howToSteps ? (
          <TaskModalHowTo steps={modal.howToSteps} />
        ) : modal.note ? (
          <p className={styles.note}>{modal.note}</p>
        ) : null}
        <button type="button" className={styles.cta} onClick={onClose}>
          {modal.ctaLabel}
        </button>
      </div>
    </BottomModal>
  );
};
