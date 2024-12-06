import axios from "axios";
import { NonSensitiveDiaryEntry, NewDiaryEntry } from "./types";

const baseUrl = 'http://localhost:3000/api/diaries'

export const getDiaries = async () => {
    try {
      const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl)
      return response.data
    } catch (error) {
      console.error('Error fetching diaries:', error)
      throw error
    }
  }

  export const addDiary = async (newDiary: NewDiaryEntry) => {
    try {
        const response = await axios.post<NonSensitiveDiaryEntry>(baseUrl, newDiary);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Throw a more specific error message
            throw new Error(error.response?.data || 'Failed to add diary entry');
        } else {
          console.error(error);
        }
    }
}