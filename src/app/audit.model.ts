export interface Audit {
  action: string;
  stampId: number;
  stampName: string;
  timestamp: Date;
  details?: any;
}
