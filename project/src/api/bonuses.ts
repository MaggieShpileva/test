import type { BonusHistoryItem, BonusesHistoryParams } from '@/types';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

export const bonusesApi = {
  getHistory: (params?: BonusesHistoryParams) =>
    apiClient.get<BonusHistoryItem[]>(ENDPOINTS.bonuses.history, { params }),
};
