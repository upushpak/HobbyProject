export interface Audit {
  id: number;
  action: string;
  stampId: number;
  stampName: string;
  timestamp: Date;
  details?: any;
}
