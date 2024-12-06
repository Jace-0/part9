import express, { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
// import { Result } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        res.status(400).json({ error: "malformatted parameters" });
        return;
    }

    const bmiResult = calculateBmi(height, weight);

    res.json({
        weight,
        height,
        bmi: bmiResult
    });
});



app.post('/exercise', (req: Request, res:Response) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if (!Array.isArray(daily_exercises) || typeof target !== 'number' ) {
        res.status(400).send({ error: '"malformatted parameters'});
      }
    
    // assert Type
    const result = calculateExercises(daily_exercises as number [], Number(target));
    res.send({ result});

});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});