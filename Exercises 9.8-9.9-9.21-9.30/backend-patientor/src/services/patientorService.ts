import { newPatient, PatientorPatients } from "../types";
import { v1 as uuid } from 'uuid';
import Patientsdata from "../../data/patients";

const addPatients = (entry: newPatient ): PatientorPatients => {
    const newPatient = {
        id: uuid(),
        ...entry
    };
    Patientsdata.push(newPatient);

    return newPatient;
};


const getPatientById = (id: string): PatientorPatients | undefined => {
    const patient =  Patientsdata.find(patient => patient.id === id);
    return patient;
};


export default {
    addPatients,
    getPatientById
};