import { useEffect, useMemo, useState, type FC } from 'react';
import clsx from 'clsx';
import WEBP_HERO from '@assets/images/tasks/hero.webp';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/features/auth/authSlice';
import {
  fetchBonusesHistory,
  fetchTasks,
} from '@/store/features/tasks/tasksSlice';
import type { TaskItem, TaskTab } from './types';
import { mapApiHistoryToUi, mapApiTasksToUi } from './utils/mapApiToUi';
import { TasksBackButton } from './components/TasksBackButton';
import { TasksSeasonBadge } from './components/TasksSeasonBadge';
import { TasksTabs } from './components/TasksTabs';
import { TasksList } from './components/TasksList';
import { RewardsList } from './components/RewardsList';
import { TaskModal } from './components/TaskModal';
import styles from './Tasks.module.scss';

type TasksProps = {
  className?: string;
};

export const Tasks: FC<TasksProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const {
    tasks: apiTasks,
    bonusSummary,
    history,
    tasksStatus,
    historyStatus,
    tasksError,
    historyError,
  } = useAppSelector((state) => state.tasks);

  const [tab, setTab] = useState<TaskTab>('active');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        const result = await dispatch(login());
        if (login.rejected.match(result)) return;
      }

      await Promise.all([
        dispatch(fetchTasks()),
        dispatch(fetchBonusesHistory({ limit: 20, offset: 0 })),
      ]);
    };

    void load();
    // Токен читаем только при монтировании; повторный fetch после login не нужен.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-once bootstrap
  }, [dispatch]);

  const tasks = useMemo(() => mapApiTasksToUi(apiTasks), [apiTasks]);
  const rewardGroups = useMemo(() => mapApiHistoryToUi(history), [history]);
  const seasonBonuses = bonusSummary?.earned ?? 0;
  const isLoading =
    tasksStatus === 'idle' ||
    tasksStatus === 'loading' ||
    historyStatus === 'idle' ||
    historyStatus === 'loading';
  const errorMessage = tasksError || historyError;

  return (
    <section className={clsx(styles.root, className)}>
      <div className={styles.hero} aria-hidden>
        <img className={styles.heroImage} src={WEBP_HERO} alt="" />
      </div>
      <div className={styles.top}>
        <TasksBackButton />
        <div className={styles.heading}>
          <h1 className={styles.title}>Задания</h1>
          <p className={styles.subtitle}>Выполняй задания и получай бонусы</p>
        </div>
        <TasksSeasonBadge amount={seasonBonuses} />
      </div>
      <div className={styles.panel}>
        <TasksTabs
          activeTab={tab}
          activeCount={tasks.length}
          onChange={setTab}
        />
        {isLoading ? (
          <p className={styles.subtitle}>Загрузка…</p>
        ) : errorMessage ? (
          <p className={styles.subtitle}>{errorMessage}</p>
        ) : tab === 'active' ? (
          <TasksList tasks={tasks} onTaskClick={setSelectedTask} />
        ) : (
          <RewardsList groups={rewardGroups} />
        )}
      </div>
      <TaskModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
      />
    </section>
  );
};
