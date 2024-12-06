

import { Gender , PatientorPatients, Entry, HospitalEntry, HealthCheckEntry, OccupationalHealthcareEntry, EntryWithoutId, HealthCheckRating, PatientorDiagnoses } from './types';
import { z } from 'zod';


// const isString = (param: unknown): param is string => {
//     return typeof param === 'string' || param instanceof String;
// };

// const parseName = (name: unknown): string => {
//     if(!isString(name)){
//         throw new Error('Incorrect or missing name');
//     }
//     return name;
// };

// const isDate = (date: string): boolean => {
//     return Boolean(Date.parse(date));
// };

// const parseDateofBirth = (date: unknown): string => {
//     if (!isString(date) ||!isDate(date)){
//         throw new Error('Incorrect or missing date: ' + date);
//     }
    
//     return date;

// };


// const isGender = (param : string ): param is Gender => {
//     return Object.values(Gender).map(g => g.toString()).includes(param);};


// const parseGender = (gender: unknown): Gender => {
//     if (!isString(gender) || !isGender(gender) ) {
//         throw new Error('Incorrect or missing Gender');
//     }

//     return gender;
// };


// const parseOccupation = (occupation: unknown): string => {
//     if (!isString(occupation)){
//         throw new Error('Incorrect or missing gender');
//     }

//     return occupation;
// };

// const parseSSN = (ssn: unknown): string => {
//     if (!isString(ssn)){
//         throw new Error('Incorrect or missing gender');
//     }

//     return ssn;
// };


const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseEntry = (entry: unknown): Entry => {
  if (!entry || typeof entry !== 'object') {
    throw new Error('Invalid entry');
  }

  if (!('type' in entry)) {
    throw new Error('Missing entry type');
  }

  switch (entry.type) {
    case 'Hospital':
      if ('discharge' in entry && 
          typeof entry.discharge === 'object' && 
          entry.discharge &&
          'date' in entry.discharge &&
          'criteria' in entry.discharge) {
        return entry as HospitalEntry;
      }
      throw new Error('Invalid hospital entry');

    case 'OccupationalHealthcare':
      if ('employerName' in entry && isString(entry.employerName)) {
        return entry as OccupationalHealthcareEntry;
      }
      throw new Error('Invalid occupational healthcare entry');

    case 'HealthCheck':
      if ('healthCheckRating' in entry && 
          typeof entry.healthCheckRating === 'number') {
        return entry as HealthCheckEntry;
      }
      throw new Error('Invalid health check entry');

    default:
      throw new Error('Invalid entry type');
  }
};


export const toNewPatient = (object: unknown): PatientorPatients => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ( 'id' in object && 'name' in object && 'dateOfBirth' in object && 'gender' in object && 'occupation' in object && 'ssn' in object && 'entries' in object) {

    const entries = Array.isArray(object.entries ) 
      ? object.entries.map(entry => parseEntry(entry))
      : [];
    
    const newPatient: PatientorPatients = {
        id: z.string().parse(object.id),
        name: z.string().parse(object.name),
        dateOfBirth: z.string().date().parse(object.dateOfBirth),
        gender: z.nativeEnum(Gender).parse(object.gender),
        occupation: z.string().parse(object.occupation),
        ssn: z.string().parse(object.ssn),
        entries: entries
        
    };

    return newPatient;
  };

  throw new Error('Incorrect data: some fields Are missing');
};

//  create type guards for different entry types
// Type guards
// const isString = (text: unknown): text is string => {
//   return typeof text === 'string' || text instanceof String;
// };

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};


// Helper to check if array contains only strings
const isStringArray = (array: unknown): array is string[] => {
  return Array.isArray(array) && array.every(item => typeof item === 'string');
};

const parseDiagnosisCodes = (object: unknown): Array<PatientorDiagnoses['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // If no codes provided, return empty array
    return [];
  }

  const codes = object.diagnosisCodes;
  
  // Check if it's an array of strings
  if (!isStringArray(codes)) {
    throw new Error('Diagnosis codes must be an array of strings');
  }

  // // Optional: Validate against known diagnosis codes
  // const validDiagnosisCodes = ['Z57.1', 'Z74.3', 'M51.2', /* ... other valid codes */];
  // if (!codes.every(code => validDiagnosisCodes.includes(code))) {
  //   throw new Error('Invalid diagnosis code provided');
  // }

  return codes;
};

// Type guard for Discharge
const isDischarge = (discharge: unknown): discharge is { date: string; criteria: string } => {
  if (!discharge || typeof discharge !== 'object') return false;
  return 'date' in discharge && 
         'criteria' in discharge && 
         isString(discharge.date) && 
         isString(discharge.criteria) &&
         isDate(discharge.date);
};


//  Create parsers for each entry type:

const parseHealthCheckEntry = (object: unknown): Omit<HealthCheckEntry, 'id'> => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('type' in object && 'description' in object && 'date' in object && 
        'specialist' in object && 'healthCheckRating' in object)) {
    throw new Error('Missing required fields');
  }

  if (!isString(object.description) || !(isString(object.date) &&isDate(object.date)) || 
      !isString(object.specialist) || 
      !isHealthCheckRating(Number(object.healthCheckRating))) {
    throw new Error('Incorrect data format');
  }

  const newEntry: Omit<HealthCheckEntry, 'id'> = {
    type: 'HealthCheck',
    description: object.description,
    date: object.date,
    specialist: object.specialist,
    healthCheckRating: Number(object.healthCheckRating),
    diagnosisCodes: parseDiagnosisCodes(object)
  };
  console.log('Finished Entry', newEntry);
  return newEntry;
};


const parseHospitalEntry = (object: unknown): Omit<HospitalEntry, 'id'> => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('type' in object && 
        'discharge' in object && 
        'description' in object && 
        'date' in object && 
        'specialist' in object)) {
    throw new Error('Missing required fields');
  }

  // Validate discharge
  if (!isDischarge(object.discharge)) {
    throw new Error('Invalid discharge data');
  }

  // Validate other fields
  if (!isString(object.description) || 
      !isString(object.date) || 
      !isString(object.specialist)) {
    throw new Error('Incorrect data format');
  }

  const newEntry: Omit<HospitalEntry, 'id'> = {
    type: 'Hospital',
    description: object.description,
    date: object.date,
    specialist: object.specialist,
    diagnosisCodes: parseDiagnosisCodes(object),
    discharge: object.discharge
  };

  return newEntry;
};

const isSickLeave = (sickLeave: unknown): sickLeave is {startDate: string, endDate: string} => {
  if (!sickLeave || typeof sickLeave !== 'object') return false;
  return 'startDate' in sickLeave && 
          'endDate' in sickLeave && 
          isString(sickLeave.startDate) && 
          isString(sickLeave.endDate) &&
          isDate(sickLeave.startDate) &&
          isDate(sickLeave.endDate);
};
    

const parseOccupationalHealthcareEntry = (object: unknown): Omit<OccupationalHealthcareEntry, 'id'> => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('type' in object && 
    'employerName' in object && 
    'description' in object && 
    'date' in object && 
    'specialist' in object)) {
  throw new Error('Missing required fields');
  }

  // Type assertion after checking properties
  const entry = object as {
    type: unknown;
    employerName: unknown;
    description: unknown;
    date: unknown;
    specialist: unknown;
    sickLeave?: unknown;
  };

  // Validate other fields
  if (!isString(entry.description) || 
      !isString(entry.date) || 
      !isDate(entry.date) ||
      !isString(entry.specialist)||
      !isString(entry.employerName))  {
    throw new Error('Incorrect data format');
  }



  let sickLeaveData;
  if (entry.sickLeave) {
    if (!isSickLeave(entry.sickLeave)) {
      throw new Error('Invalid sickLeave data format');
    }
    sickLeaveData = entry.sickLeave;
  }


  const newEntry: Omit<OccupationalHealthcareEntry, 'id'> = {
    type: 'OccupationalHealthcare',
    description: entry.description,
    date: entry.date,
    specialist: entry.specialist,
    diagnosisCodes: parseDiagnosisCodes(object),
    employerName: entry.employerName,
    sickLeave: sickLeaveData 
  };

  return newEntry;
};


export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object' || !('type' in object)) {
    throw new Error('Incorrect or missing data');
  }

  switch (object.type) {
    case 'HealthCheck':
      return parseHealthCheckEntry(object);
    case 'Hospital':
      return parseHospitalEntry(object);
    case 'OccupationalHealthcare':
      return parseOccupationalHealthcareEntry(object);
    default:
      throw new Error('Invalid entry type');
  }
};