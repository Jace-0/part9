
export interface PatientorDiagnoses {
    code: string,
    name: string,
    latin?: string
}

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other'
}


export interface PatientorPatients {
    id: string,
    name: string,
    dateOfBirth: string,
    ssn: string,
    gender: Gender,
    occupation: string,
    entries: Entry[];
}

export type NonSensitivePatientInfo = Omit<PatientorPatients, 'ssn'>;

export type newPatient = Omit<PatientorPatients, 'id'>;


// Base Entry
interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<PatientorDiagnoses['code']>;
}
  
export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}

  // Health Check Entry
export  interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
  }
  
  // Hospital Entry
export  interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: {
      date: string;
      criteria: string;
    };
  }
  
  // Occupational Healthcare Entry
export interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: {
      startDate: string;
      endDate: string;
    };
  }
  
  // Combined Entry type
  export type Entry = 
    | HospitalEntry 
    | OccupationalHealthcareEntry 
    | HealthCheckEntry;

// First, define the UnionOmit utility type
type UnionOmit<T, K extends string | number | symbol> = 
  T extends unknown ? Omit<T, K> : never;

export  type EntryWithoutId = UnionOmit<Entry, 'id'>;