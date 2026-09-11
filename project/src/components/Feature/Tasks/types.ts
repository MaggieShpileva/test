export type TaskTab = 'active' | 'rewards';

export type TaskChild = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

export type TaskModalData = {
  statusLabel: string;
  secondaryTag: string;
  showHowTo: boolean;
  rewardCaption: string;
  note?: string;
  howToSteps?: string[];
  ctaLabel: string;
};

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  reward: number;
  image: string;
  timeLeft?: string;
  canClaim?: boolean;
  progress?: { done: number; total: number };
  children?: TaskChild[];
  modal: TaskModalData;
};

export type RewardItem = {
  id: string;
  title: string;
  date: string;
  amount: number;
  expires: string;
};

export type RewardMonthGroup = {
  month: string;
  items: RewardItem[];
};
