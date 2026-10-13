import axios from "axios";
import type { QuizResponse } from "./types/QuizResponse";

const getFilmQuiz = async (
  questionNum: number = 10,
): Promise<QuizResponse | undefined> => {
  const baseUrl = `https://opentdb.com/api.php?amount=${questionNum}&category=11&difficulty=medium`;

  try {
    const { data } = await axios.get(baseUrl);
    return data;
  } catch (err) {
    console.error(`Error getting film quiz data ${err}`);
    throw err;
  }
};

export default getFilmQuiz;
