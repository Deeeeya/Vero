export type Project = {
  id: string;
  name: string;
  description: string;
  platform: string;
  accessTTL: number;
  refreshTTL: number;
  singleSession: boolean;
  userId: string;
  _count: { users: number };
};
