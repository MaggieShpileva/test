import { useState, type FC, type MouseEvent } from 'react';
import clsx from 'clsx';
import type { TaskChild } from '../../types';
import { TaskGroupChildren } from './components/TaskGroupChildren';
import { TaskGroupHeader } from './components/TaskGroupHeader';
import styles from './TaskGroupCard.module.scss';

type TaskGroupCardProps = {
  title: string;
  description: string;
  reward: number;
  image: string;
  progress: { done: number; total: number };
  childrenTasks: TaskChild[];
  className?: string;
  onClick?: () => void;
};

export const TaskGroupCard: FC<TaskGroupCardProps> = ({
  title,
  description,
  reward,
  image,
  progress,
  childrenTasks,
  className,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (event: MouseEvent) => {
    event.stopPropagation();
    setIsOpen((v) => !v);
  };

  return (
    <article className={clsx(styles.root, className)}>
      <TaskGroupHeader
        title={title}
        description={description}
        reward={reward}
        image={image}
        progress={progress}
        isOpen={isOpen}
        onClick={onClick}
        onToggle={handleToggle}
      />
      {isOpen ? <TaskGroupChildren items={childrenTasks} image={image} /> : null}
    </article>
  );
};
