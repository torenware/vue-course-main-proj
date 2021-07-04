export interface CoachAttribs {
  firstName: string;
  lastName: string;
  areas: string[];
  description: string;
  hourlyRate: number;
}

export interface Coach extends CoachAttribs {
  id: string;
}
