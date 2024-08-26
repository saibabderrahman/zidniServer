export class CreateQuizDto {
    title: string;
    questions: CreateQuestionDto[];
  }
  
  export class CreateQuestionDto {
    question: string;
    choices: string[];
    answer: string;
    points: number;

  }
  