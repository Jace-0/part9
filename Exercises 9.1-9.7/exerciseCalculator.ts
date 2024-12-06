export interface Result { 
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number,
}

interface Argument {
    exerciseData: number[],
    target: number
}

const parseArgument = (args: string[]): Argument => {
    const inputArgs = args.slice(2);
    //how do i check if all values are numbers 
    if (args.length < 2) {
        throw new Error('Not enough arguments');
    }

    const numbers = inputArgs.map(arg => Number(arg));

    if (numbers.every(num => !isNaN(num))) {
        const target = numbers[0]; 
        return {
            exerciseData: numbers.slice(1),
            target: target
        };
    }
    
    else {
        throw new Error('Provided values were not numbers!');
    }
};

export const calculateExercises = (arr: number[], target: number): Result =>{
    const periodLength: number = arr.length;
    const trainingDays : number = arr.filter(day => day > 0).length;
    const totalHours: number = arr.reduce((sum, day) => sum + day, 0);
    const average: number = totalHours / periodLength;
    const success: boolean = average >= target;

    let rating: number;
    let ratingDescription: string;

    
    if (average >= target) {
        rating = 3;
        ratingDescription = 'great job, target met!';
    } else if (average >= target * 0.75) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    } else {
        rating = 1;
        ratingDescription = 'you need to work harder';
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

const {exerciseData, target} = parseArgument(process.argv);
// const exerciseData = [3, 0, 2, 4.5, 0, 3, 1];
// const target = 2;

const result = calculateExercises(exerciseData, target);
console.log(result);