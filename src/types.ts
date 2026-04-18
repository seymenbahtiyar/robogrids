export interface JobRecord {
  id: string;
  process: string;
  robot: string;
  state: 'Successful' | 'Faulted' | 'Stopped' | string;
  started: Date;
  ended: Date;
  durationMs: number;
}

export interface FilterState {
  process: string;
  robot: string;
  state: string;
  search: string;
}
