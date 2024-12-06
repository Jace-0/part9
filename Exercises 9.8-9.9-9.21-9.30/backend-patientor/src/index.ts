import express, { Request, Response } from 'express';
import cors from 'cors';
import { v1 as uuid } from 'uuid';const app = express();
import { PatientorDiagnoses, NonSensitivePatientInfo } from './types';
import Diagnosesdata from '../data/diagnoses';
import Patientsdata from '../data/patients';
import { toNewPatient, toNewEntry } from './utils';
import patientorService from './services/patientorService';

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res: Response<PatientorDiagnoses[]>) =>{
  res.send(Diagnosesdata);
});

const getNonSensitivePatientInfo = (): NonSensitivePatientInfo[] => {
  const p =  Patientsdata.map(({ id, name , dateOfBirth, gender, occupation, entries}) => ({
    id, name , dateOfBirth, gender, occupation, entries
  }));
  return p;
};
app.get('/api/patients', (_req, res: Response<NonSensitivePatientInfo[]>) =>{
  res.send(getNonSensitivePatientInfo());
});

app.post('/api/patients', (req, res) => {
  const newPatient = toNewPatient(req.body);

  const addedPatient = patientorService.addPatients(newPatient);
  res.json(addedPatient);
});

app.get('/api/patients/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const patient = patientorService.getPatientById(id);

  if (patient) {
      res.json(patient);
  } else {
      res.status(404).send({ error: "Patient not found" });
  }
});


app.post('/api/patients/:id/entries', (req, res) => {
  try {
    const patient = Patientsdata.find(p => p.id === req.params.id);
    if (!patient) {
      res.status(404).send({ error: 'Patient not found' });
      return;
    }

    const newEntry = toNewEntry(req.body);
    const addedEntry = {
      id: uuid(),
      ...newEntry
    };
    patient.entries = patient.entries.concat(addedEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
