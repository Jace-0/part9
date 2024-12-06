
interface HeaderProps {
  courseName: string 
}

interface ContentProps {
  courseParts: CoursePart[]
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: "background"
}


interface  CoursePartSpecial extends CoursePartWithDescription {
  requirements: string[]
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial



const Header = (props: HeaderProps) => {
  return <h1>{props.courseName}</h1>
}

const Content = (props: ContentProps) => {
  return (
    <>
    {props.courseParts.map(part => (
      <Part key={part.name} part={part} />
    ))}
  </>
  )
}

const Total = ({ totalExercises }: { totalExercises: number }) => (
  <>
  Number of exercise {totalExercises}
  </>
);


const Part = ({ part }: { part: CoursePart }) => {
  // Use switch case to handle each type of course part
  switch(part.kind) {
    case "basic":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p><i>{part.description}</i></p>
        </div>
      );
    case "group":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>project exercises {part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p><i>{part.description}</i></p>
          <p>submit to {part.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return(
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p><i>{part.description}</i></p>
          <p>required skills {part.requirements.join(', ')}</p>
        </div>
      )
    default:
      // This ensures exhaustive type checking
      { const exhaustiveCheck: never = part;
      return exhaustiveCheck; }
  }
};const App = () => {

  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    },
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName}/>
      <Content  courseParts={courseParts}/>
      <Total totalExercises={totalExercises}/>
    </div>
  );
};

export default App;