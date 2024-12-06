/* eslint-disable no-useless-catch */
import axios from "axios";
import { Entry, Patient, PatientFormValues, EntryWithoutId } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};


const addEntry = async (patientId: string, entry: EntryWithoutId): Promise<Entry> => {
  try {
    const { data } = await axios.post<Entry>(
      `${apiBaseUrl}/patients/${patientId}/entries`,
      entry
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  getAll, create, addEntry
};

