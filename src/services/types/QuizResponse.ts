export interface QuizItem {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  penaltyRatio?: number;
  timeWeight?: number;
  id?: string;
}

export interface QuizResponse {
  response_code: number;
  results: QuizItem[];
}
