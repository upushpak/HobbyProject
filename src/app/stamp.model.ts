export interface Stamp {
  id: number;
  name: string;
  dateOfIssue: string;
  value: number;
  releaseYear?: number;
  stampSubHeader?: string;
  specificStampDetails?: string;
  celebratingYear?: string;
  extraDetails?: string;
  categoryType1?: string;
  categoryType2?: string;
  categoryType3?: string;
  comments?: string;
  location?: string;
  referenceLinks?: string[];
  files?: string[]; // Assuming files are stored as an array of strings (e.g., file paths or URLs)
  createdAt?: Date;
  fieldTimestamps?: { [key: string]: Date };
}
