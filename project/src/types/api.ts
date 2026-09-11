export type AuthTokenResponse = {
  success: boolean;
  data: {
    access_token: string;
    status: number;
  };
};

export type AuthLoginRequest = {
  phone: string;
};

export type BonusSummary = {
  total: number;
  remaining: number;
  earned: number;
};

export type TaskStatus = 'available' | 'completed' | 'in_progress' | 'credited';

export type TaskType = 'codeword' | 'order' | 'condition';

export type PrizeType = 'bonus' | 'promo';

export type TaskGroupRef = {
  id: string;
  title: string;
};

export type Task = {
  id: string;
  is_group: boolean;
  type?: TaskType | null;
  icon?: string | null;
  title: string;
  short_description?: string | null;
  description?: string | null;
  steps?: string[] | null;
  button_label?: string | null;
  button_url?: string | null;
  requires_input?: boolean;
  input_placeholder?: string | null;
  active_from?: string | null;
  active_to?: string | null;
  days_remaining?: number | null;
  hours_remaining?: number | null;
  status: TaskStatus;
  completed_at?: string | null;
  bonus: number;
  prize_type?: PrizeType | null;
  group_bonus?: number | null;
  sort_order?: number | null;
  progress_done?: number | null;
  progress_total?: number | null;
  group?: TaskGroupRef | null;
};

export type TasksListResponse = {
  bonus_summary: BonusSummary;
  tasks: Task[];
};

export type BonusHistoryKind = 'task' | 'group';

export type BonusDeliveryStatus =
  | 'pending'
  | 'in_transit'
  | 'awarded'
  | 'failed'
  | 'expired';

export type BonusHistoryItem = {
  id: string;
  created_at: string;
  title: string;
  kind: BonusHistoryKind;
  task_id?: string;
  amount: number;
  prize_type?: PrizeType | null;
  promo_code?: string | null;
  promo_expires_at?: string | null;
  delivery_status?: BonusDeliveryStatus | null;
};

export type BonusesHistoryParams = {
  limit?: number;
  offset?: number;
};
