export interface IPatient {
    id: string;
    firstName: string;
    lastName: string;
    fatherName?: string; // Optional
    description?: string; // Optional additional information about the patient
  }