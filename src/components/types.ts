export interface StudentData {
  regNo: string;
  name: string;
  boardRoll: string;
  classRoll: string;
  group: string;
  gender: string;
  serialNum: number;
  type: string;
  image: string;
}

export type SortMode = 'boardRoll' | 'serial' | 'roll';
export type GenderFilter = 'Female' | 'Male' | null;
export type GroupFilter = 'Science' | 'Humanities' | 'Business' | null;
