interface BmiValues {
    heightCm: number;
    weightKg: number;
}

const parseArguments = (args: string[]): BmiValues => {
    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            heightCm: Number(args[2]),
            weightKg: Number(args[3])
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

export const calculateBmi = (heightCm: number, weightKg: number): string => {
    if (heightCm <= 0) {
        throw new Error("Height must be greater than zero");
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    if (bmi < 18.5) {
        return "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        return "Normal range";
    } else if (bmi >= 25 && bmi < 29.9) {
        return "Overweight";
    } else {
        return "Obese";
    }
};

if (require.main === module) {
    try {
        const { heightCm, weightKg } = parseArguments(process.argv);
        console.log(calculateBmi(heightCm, weightKg));
    } catch (error: unknown) {
        let errorMessage = 'Something bad happened.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        console.log(errorMessage);
    }
}