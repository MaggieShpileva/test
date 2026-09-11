import WEBP_TASK_CODE from '@assets/images/tasks/task-code.webp';
import WEBP_TASK_GROUP from '@assets/images/tasks/task-group.webp';
import WEBP_TASK_PURCHASE from '@assets/images/tasks/task-purchase.webp';
import type { BonusHistoryItem, Task, TaskStatus } from '@/types';
import type {
  RewardItem,
  RewardMonthGroup,
  TaskChild,
  TaskItem,
  TaskModalData,
} from '../types';

const STATUS_LABELS: Record<TaskStatus, string> = {
  available: 'доступно',
  completed: 'выполнено',
  in_progress: 'в процессе',
  credited: 'начислено',
};

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const formatTimeLeft = (task: Task): string | undefined => {
  const days = task.days_remaining;
  const hours = task.hours_remaining;

  if (days == null && hours == null) return undefined;

  if (days != null && days > 0) {
    return hours != null && hours > 0 ? `${days}д ${hours}ч` : `${days}д`;
  }

  if (hours != null && hours > 0) {
    return `${hours}ч`;
  }

  return undefined;
};

const formatCompletedTag = (completedAt?: string | null): string => {
  if (!completedAt) return '';

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(completedAt));
};

const formatRewardDate = (iso: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

const formatExpires = (iso?: string | null): string => {
  if (!iso) return '';

  const formatted = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(iso));

  return `до ${formatted}`;
};

const getTaskImage = (task: Task): string => {
  if (task.icon) return task.icon;
  if (task.is_group) return WEBP_TASK_GROUP;
  if (task.type === 'codeword') return WEBP_TASK_CODE;
  return WEBP_TASK_PURCHASE;
};

const buildModal = (task: Task, timeLeft?: string): TaskModalData => {
  const isCompleted = task.status === 'completed' || task.status === 'credited';
  const howToSteps = task.steps?.filter(Boolean) ?? [];

  return {
    statusLabel: STATUS_LABELS[task.status],
    secondaryTag: isCompleted
      ? formatCompletedTag(task.completed_at)
      : (timeLeft ?? ''),
    showHowTo: !isCompleted && howToSteps.length > 0,
    rewardCaption: isCompleted
      ? 'Получено бонусов за выполнение задания'
      : 'Бонусов за выполнение задания',
    note: isCompleted
      ? 'Бонусы действуют 30 дней, можно списать до 50% от стоимости покупки'
      : undefined,
    howToSteps: howToSteps.length > 0 ? howToSteps : undefined,
    ctaLabel: task.button_label || 'За покупками!',
  };
};

const mapChild = (task: Task): TaskChild => ({
  id: task.id,
  title: task.title,
  description: task.short_description || task.description || '',
  isCompleted:
    task.status === 'completed' || task.status === 'credited',
});

const mapTaskItem = (task: Task, children: Task[] = []): TaskItem => {
  const timeLeft = formatTimeLeft(task);
  const sortedChildren = [...children].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return {
    id: task.id,
    title: task.title,
    description: task.short_description || task.description || '',
    reward: task.bonus,
    image: getTaskImage(task),
    timeLeft: task.is_group ? undefined : timeLeft,
    canClaim: task.status === 'completed',
    progress:
      task.is_group &&
      task.progress_done != null &&
      task.progress_total != null
        ? { done: task.progress_done, total: task.progress_total }
        : undefined,
    children: task.is_group ? sortedChildren.map(mapChild) : undefined,
    modal: buildModal(task, timeLeft),
  };
};

export const mapApiTasksToUi = (tasks: Task[]): TaskItem[] => {
  const childrenByGroup = new Map<string, Task[]>();
  const roots: Task[] = [];

  for (const task of tasks) {
    if (task.group?.id) {
      const groupChildren = childrenByGroup.get(task.group.id) ?? [];
      groupChildren.push(task);
      childrenByGroup.set(task.group.id, groupChildren);
      continue;
    }

    roots.push(task);
  }

  return roots.map((task) =>
    mapTaskItem(task, childrenByGroup.get(task.id) ?? [])
  );
};

const mapHistoryItem = (item: BonusHistoryItem): RewardItem => ({
  id: item.id,
  title: item.title,
  date: formatRewardDate(item.created_at),
  amount: item.amount,
  expires: formatExpires(item.promo_expires_at),
});

export const mapApiHistoryToUi = (
  items: BonusHistoryItem[]
): RewardMonthGroup[] => {
  const groups = new Map<string, RewardItem[]>();

  for (const item of items) {
    const monthLabel = capitalize(
      new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(
        new Date(item.created_at)
      )
    );
    const list = groups.get(monthLabel) ?? [];
    list.push(mapHistoryItem(item));
    groups.set(monthLabel, list);
  }

  return Array.from(groups.entries()).map(([month, groupItems]) => ({
    month,
    items: groupItems,
  }));
};
