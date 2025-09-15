export type Project = {
  accessTTL: number;
  description: string;
  id: string;
  name: string;
  platform: string;
  refreshTTL: number;
  singleSession: boolean;
  userId: string;
  _count: { users: number };
};
