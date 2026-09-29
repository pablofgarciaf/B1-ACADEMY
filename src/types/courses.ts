export type TrackCode = 
  | 'SAP-B1-LOGISTICS'
  | 'SAP-B1-FINANCIALS'
  | 'SAP-B1-IMPLEMENTATION'
  | 'SAP-B1-PRODUCTION'
  | 'SAP-LOC-EC' 
  | 'B1-NOM-EC' 
  | 'B1-HCM-TALENT' 
  | 'SAP-VERT-EXP';

export type SubmoduleLevel = 'OP' | 'ARQ';

export interface SubmoduleItem {
  id: string;
  code: string;
  title: string;
  level: SubmoduleLevel;
  durationHours: number;
  description: string;
  keyTopics: string[];
}

export interface TrainingTrack {
  id: string;
  code: TrackCode;
  title: string;
  shortTitle: string;
  category: string;
  iconName: string;
  badge: string;
  description: string;
  targetAudience: string;
  totalDurationHours: number;
  submodulesCount: number;
  submodules: SubmoduleItem[];
}
