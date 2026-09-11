import type { FC } from 'react';
import clsx from 'clsx';
import type { TaskItem } from '../../types';
import { TaskCard } from '../TaskCard';
import { TaskGroupCard } from '../TaskGroupCard';
import styles from './TasksList.module.scss';

type TasksListProps = {
  tasks: TaskItem[];
  className?: string;
  onTaskClick?: (task: TaskItem) => void;
  onClaimClick?: (task: TaskItem) => void;
};

export const TasksList: FC<TasksListProps> = ({
  tasks,
  className,
  onTaskClick,
  onClaimClick,
}) => (
  <div className={clsx(styles.root, className)}>
    {tasks.map((task) =>
      task.children && task.progress ? (
        <TaskGroupCard
          key={task.id}
          title={task.title}
          description={task.description}
          reward={task.reward}
          image={task.image}
          progress={task.progress}
          childrenTasks={task.children}
          onClick={() => onTaskClick?.(task)}
        />
      ) : (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          reward={task.reward}
          image={task.image}
          timeLeft={task.timeLeft}
          canClaim={task.canClaim}
          onClick={() => onTaskClick?.(task)}
          onClaimClick={() => onClaimClick?.(task)}
        />
      )
    )}
  </div>
);
