import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Male, Female, Transgender } from '@mui/icons-material';
import axios from 'axios';
import { Patient, Entry, Diagnosis, EntryWithoutId} from '../../types';
import { apiBaseUrl } from '../../constants';
import AddEntryForm from './PatientEntry';
import patientService from '../../services/patients';

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        setPatient(response.data);
        const diagnosisData = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
        setDiagnosis(diagnosisData.data);
      } catch (e) {
        setError('Failed to fetch patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const renderGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return <Male />;
      case 'female':
        return <Female />;
      case 'transgender':
        return <Transgender />;
      default:
        return null;
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!patient) {
    return <Typography>No patient data available</Typography>;
  }


  const EntryDetails : React.FC<({entry : Entry})>  = ({ entry }) => {
    switch (entry.type) {
      case 'Hospital':
        return (
          <Box sx={{ border: '1px solid #ccc', padding: 2, margin: 1 }}>
            {/* <Typography variant="h6">Hospital Visit</Typography> */}
            <Typography>Date: {entry.date}</Typography>
            <Typography>Description: {entry.description}</Typography>
            {entry.diagnosisCodes && (
              <Box>
                <Typography>Diagnosis Codes:</Typography>
                <ul>
                  {entry.diagnosisCodes.map((code, index) => {
                    const diagnosisName = diagnosis.find(d => d.code === code) ?.name;
                    return (
                      <li key={index}>
                        {code} {diagnosisName}
                      </li>
                    );
                  })}
                </ul>
              </Box>
            )}

          <Typography>diagnose by {entry.specialist}</Typography>
          </Box>
        );
        
      case 'OccupationalHealthcare':
        return (
          <Box sx={{ border: '1px solid #ccc', padding: 2, margin: 1 }}>
            {/* <Typography variant="h6">Occupational Healthcare</Typography> */}
            <Typography>Employer: {entry.employerName}</Typography>
            <Typography>Date: {entry.date}</Typography>
            <Typography>Description: {entry.description}</Typography>
            {entry.diagnosisCodes && (
              <Box>
                <Typography>Diagnosis Codes:</Typography>
                <ul>
                  {entry.diagnosisCodes.map((code, index) => {
                    const diagnosisName = diagnosis.find(d => d.code === code) ?.name;
                    return (
                      <li key={index}>
                        {code} {diagnosisName}
                      </li>
                    );
                  })}
                </ul>
              </Box>
            )}
            <Typography>diagnose by {entry.specialist}</Typography>
          </Box>
        );
  
      case 'HealthCheck':
        return (
          <Box sx={{ border: '1px solid #ccc', padding: 2, margin: 1 }}>
            {/* <Typography variant="h6">Health Check</Typography> */}
            <Typography>Date: {entry.date}</Typography>
            <Typography>Description: {entry.description}</Typography>
            <Typography>Health Rating: {entry.healthCheckRating}</Typography>
            <Typography>diagnose by {entry.specialist}</Typography>

          </Box>
        );
  
      default:
        return null;
    }
};


const handleAddEntry = async (entry: EntryWithoutId) => {
  try {
    console.log('New Entry', entry);
    const addedEntry = await patientService.addEntry(patient.id, entry);
    setPatient({
      ...patient,
      entries: patient.entries.concat(addedEntry)
    });
  } catch (e: unknown) {
    // Type check for Axios error
    if (axios.isAxiosError(e)) {
      setError(e.response?.data?.error || 'Error adding entry');
    } else if (e instanceof Error) {
      setError(e.message);
    } else {
      setError('Unknown error occurred');
    }
  }
};
  
  return (
    <> 
    {/* Patient info */}
    <AddEntryForm 
      onSubmit={handleAddEntry}
      diagnoses={diagnosis}
      error={error}
    />
    
    <Box>
      <Typography variant="h4">{patient.name}</Typography>
      <Typography>
        Gender: {patient.gender} {renderGenderIcon(patient.gender)}
      </Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Entries:</Typography>
      {patient.entries && patient.entries.map((entry, index) => (
        <EntryDetails key={index} entry={entry} />
      ))}
    </Box></>
  );
  
};

export default PatientDetailsPage;