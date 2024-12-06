import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField,
  Alert,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@mui/material';
import { Entry, EntryWithoutId, HealthCheckRating, Diagnosis, HospitalEntry, OccupationalHealthcareEntry } from '../../types';



interface Props {
  onSubmit: (entry: EntryWithoutId) => void;
  diagnoses: Diagnosis[];
  error: string | null;
}

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Autocomplete } from '@mui/material';


const HealthCheckForm = ({ onSubmit, diagnoses }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<Array<Diagnosis['code']>>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const entry: EntryWithoutId = {
      type: 'HealthCheck',
      description,
      date: date?.toISOString().split('T')[0] || '',
      specialist,
      healthCheckRating,
      diagnosisCodes: selectedDiagnoses
    };

    onSubmit(entry);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        required
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Date"
        value={date}
        onChange={(newValue) => setDate(newValue)}
        slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              required: true
            }
          }}
      />
      </LocalizationProvider>

      <TextField
        fullWidth
        label="Specialist"
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
        margin="normal"
        required
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Health Check Rating</InputLabel>
        <Select
          value={healthCheckRating}
          onChange={(e) => setHealthCheckRating(Number(e.target.value))}
        >
          <MenuItem value={0}>Healthy</MenuItem>
          <MenuItem value={1}>Low Risk</MenuItem>
          <MenuItem value={2}>High Risk</MenuItem>
          <MenuItem value={3}>Critical Risk</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete
        multiple
        options={diagnoses}
        getOptionLabel={(option) => `${option.code} - ${option.name}`}
        value={diagnoses.filter(d => selectedDiagnoses.includes(d.code))}
        onChange={(_, newValue) => {
          setSelectedDiagnoses(newValue.map(v => v.code));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Diagnosis Codes"
            margin="normal"
          />
        )}
      />

      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
      >
        Add Entry
      </Button>
    </Box>
  );
};


const HospitalEntryForm = ({ onSubmit, diagnoses }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [specialist, setSpecialist] = useState('');
    const [selectedDiagnoses, setSelectedDiagnoses] = useState<Array<Diagnosis['code']>>([]);
    const [discharge, setDischarge] = useState<{ date: string; criteria: string }>({
      date: '',
      criteria: ''
    });
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
  
      const entry: Omit<HospitalEntry, 'id'> = {
        type: 'Hospital',
        description,
        date: date?.toISOString().split('T')[0] || '',
        specialist,
        diagnosisCodes: selectedDiagnoses,
        discharge: discharge
      };
  
      onSubmit(entry);
    };
  
    return (
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
        />
        
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              required: true
            }
          }}
        />
        </LocalizationProvider>
  
        <TextField
          fullWidth
          label="Specialist"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          margin="normal"
          required
        />
  
        <Autocomplete
          multiple
          options={diagnoses}
          getOptionLabel={(option) => `${option.code} - ${option.name}`}
          value={diagnoses.filter(d => selectedDiagnoses.includes(d.code))}
          onChange={(_, newValue) => {
            setSelectedDiagnoses(newValue.map(v => v.code));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Diagnosis Codes"
              margin="normal"
            />
          )}
        />
  
        {/* Discharge fields */}
        <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="subtitle1">Discharge Information</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Discharge Date"
            value={discharge.date ? new Date(discharge.date) : null}
            onChange={(newValue) => 
              setDischarge({
                ...discharge,
                date: newValue?.toISOString().split('T')[0] || ''
              })
            }
            slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  required: true
                }
              }}
          />
          </LocalizationProvider>
  
          <TextField
            fullWidth
            label="Discharge Criteria"
            value={discharge.criteria}
            onChange={(e) => 
              setDischarge({
                ...discharge,
                criteria: e.target.value
              })
            }
            margin="normal"
            required
          />
        </Box>
  
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          fullWidth
        >
          Add Hospital Entry
        </Button>
      </Box>
    );
  };



  const OccupationalHealthcareForm = ({ onSubmit, diagnoses }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [specialist, setSpecialist] = useState('');
    const [selectedDiagnoses, setSelectedDiagnoses] = useState<Array<Diagnosis['code']>>([]);
    const [employerName, setEmployerName] = useState('');
    const [sickLeave, setSickLeave] = useState<{ startDate: string, endDate: string }>({
      startDate: '',
      endDate: ''
    });
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
  
      const entry: Omit<OccupationalHealthcareEntry, 'id'> = {
        type: 'OccupationalHealthcare',
        description,
        date: date?.toISOString().split('T')[0] || '',
        specialist,
        diagnosisCodes: selectedDiagnoses,
        employerName,
        ...(sickLeave.startDate && sickLeave.endDate && { sickLeave })
      };
  
      onSubmit(entry);
    };
  
    return (
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
        />
  
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              required: true
            }
          }}
        />
        </LocalizationProvider>
  
        <TextField
          fullWidth
          label="Specialist"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          margin="normal"
          required
        />
  
        <TextField
          fullWidth
          label="Employer Name"
          value={employerName}
          onChange={(e) => setEmployerName(e.target.value)}
          margin="normal"
          required
        />
  
        <Autocomplete
          multiple
          options={diagnoses}
          getOptionLabel={(option) => `${option.code} - ${option.name}`}
          value={diagnoses.filter(d => selectedDiagnoses.includes(d.code))}
          onChange={(_, newValue) => {
            setSelectedDiagnoses(newValue.map(v => v.code));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Diagnosis Codes"
              margin="normal"
            />
          )}
        />
  
        {/* Sick Leave fields */}
        <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="subtitle1">Sick Leave (Optional)</Typography>
          

          <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={sickLeave.startDate ? new Date(sickLeave.startDate) : null}
            onChange={(newValue) => 
              setSickLeave({
                ...sickLeave,
                startDate: newValue?.toISOString().split('T')[0] || ''
              })
            }
            slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  required: true
                }
              }}
          />
          </LocalizationProvider>
  
          <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="End Date"
            value={sickLeave.endDate ? new Date(sickLeave.endDate) : null}
            onChange={(newValue) => 
              setSickLeave({
                ...sickLeave,
                endDate: newValue?.toISOString().split('T')[0] || ''
              })
            }
            slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  required: true
                }
              }}
          />
          </LocalizationProvider>
        </Box>

  
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          fullWidth
        >
          Add Occupational Healthcare Entry
        </Button>
      </Box>
    );
  };

  const AddEntryForm = ({ onSubmit, diagnoses, error }: Props) => {
    const [entryType, setEntryType] = useState<Entry['type']>('HealthCheck');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
  
    const handleOpen = (): void => setModalOpen(true);
    const handleClose = (): void => setModalOpen(false);
    
    return (
      <>
      <br/>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: '#FF69B4',
            // '&:hover': {
            //   backgroundColor: '#FF69B4' // darker pink on hover
            // }
          }}
          onClick={handleOpen}
        >
          Add New Entry
        </Button>
  
        <Dialog
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby="add-entry-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="add-entry-dialog-title">
            Add New Medical Entry
          </DialogTitle>
  
          <DialogContent>
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>
            )}
  
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Entry Type</InputLabel>
              <Select
                value={entryType}
                label="Entry Type"
                onChange={(e) => setEntryType(e.target.value as Entry['type'])}
              >
                <MenuItem value="HealthCheck">Health Check</MenuItem>
                <MenuItem value="Hospital">Hospital</MenuItem>
                <MenuItem value="OccupationalHealthcare">
                  Occupational Healthcare
                </MenuItem>
              </Select>
            </FormControl>
  
            {entryType === 'HealthCheck' && (
              <HealthCheckForm 
                onSubmit={onSubmit} 
                diagnoses={diagnoses} 
                error={error} 
              />
            )}
            {entryType === 'Hospital' && (
              <HospitalEntryForm 
                onSubmit={onSubmit} 
                diagnoses={diagnoses} 
                error={error} 
              />
            )}
            {entryType === 'OccupationalHealthcare' && (
              <OccupationalHealthcareForm 
                onSubmit={onSubmit} 
                diagnoses={diagnoses}  
                error={error}
              />
            )}
          </DialogContent>
  
          <DialogActions>
            <Button 
              onClick={handleClose} 
              color="secondary" 
              variant="outlined"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
export default AddEntryForm;