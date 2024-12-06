import { useEffect, useState } from "react"
import { NonSensitiveDiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types"
import { addDiary, getDiaries } from "./diaryService"



const Diary = ({ diaries }: { diaries: NonSensitiveDiaryEntry[] }): JSX.Element => {
  return (
    <div>
      {diaries.map(diary => (
        <div key={diary.date}>
          <div>
            <h3>{diary.date}</h3>
          </div>
          <div>
            <p>Visibility: {diary.visibility}</p>
            <p>Weather: {diary.weather}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const AddNewEntry = ({ setNotification }: { setNotification: (message: string | null) => void }) => {  const [newEntry, setNewEntry] = useState<NewDiaryEntry>({
    date: '',
    visibility: Visibility.Good,
    weather: Weather.Sunny,
    comment: ''
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewEntry({
      ...newEntry,
      [name]: value
    })

    console.log('handleEntry', name, value )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await addDiary(newEntry)
      setNotification('Entry added successfully!')
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      setNewEntry({
        date: '',
        visibility: Visibility.Good,
        weather: Weather.Sunny,
        comment: ''
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setNotification(`Error: ${errorMessage}`);      
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input 
            type="date"
            id="date"
            name="date"
            value={newEntry.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Visibility:</label>
          {Object.values(Visibility).map(v => (
            <label key={v} style={{ marginRight: '1rem' }}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={newEntry.visibility === v}
                onChange={handleInputChange}
                required
              />
              {v}
            </label>
          ))}
        </div>

        <div>
          <label>Weather:</label>
          {Object.values(Weather).map(w => (
            <label key={w} style={{ marginRight: '1rem' }}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={newEntry.weather === w}
                onChange={handleInputChange}
                required
              />
              {w}
            </label>
          ))}
        </div>

        <div>
          <label htmlFor="comment">Comments:</label>
          <input 
            type="text"
            id="comment"
            name="comment"
            value={newEntry.comment}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Add Entry</button>
      </form>
    </div>
  )}


const NotificationComponent = ({ message }: { message: string | null }) => {
  if (!message) return null

  const notificationStyle = {
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e9',
    color: message.includes('Error') ? '#c62828' : '#2e7d32',
    border: `1px solid ${message.includes('Error') ? '#ef9a9a' : '#a5d6a7'}`,
  }

  return <div style={notificationStyle}>{message}</div>
}

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([])
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    getDiaries().then(data => setDiaries(data))
  }, [])




  return (
    <>
    <NotificationComponent message={notification} />
    <AddNewEntry setNotification={setNotification}/>
    <h2>Diary entries</h2>
    <Diary diaries={diaries}/>

    </>
  )

}


export default App