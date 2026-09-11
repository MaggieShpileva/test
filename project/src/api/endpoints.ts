export const ENDPOINTS = {
  auth: {
    login: '/v1/user/access-token',
  },
  tasks: {
    list: '/v1/tasks',
  },
  bonuses: {
    history: '/v1/bonuses/history',
  },
} as const;
