export interface SimuladorUser {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  company?: string;
  level: number;
  xp: number;
  totalMissions: number;
  completedMissions: number;
  badges: Badge[];
  createdAt: Date;
  lastLogin: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface SimuladorSession {
  windowsOpen: number;
  currentModule?: string;
  sandboxMode: boolean;
  missionInProgress?: string;
  startTime: Date;
  lastActivity: Date;
}

export interface CompletedMission {
  id: string;
  name: string;
  module: string;
  completedAt: Date;
  score: number;
  xp: number;
}
