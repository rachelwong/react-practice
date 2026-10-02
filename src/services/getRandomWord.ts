import axios from "axios";

interface GetRandomWordsRequestProps {
  maxNumber?: number;
  maxLength?: number;
}

// default to English
const getRandomWords = async ({
  maxNumber,
  maxLength,
}: GetRandomWordsRequestProps): Promise<string[] | undefined> => {
  try {
    const baseUrl = `https://random-word-api.herokuapp.com/word`;
    const { data } = await axios.get(baseUrl, {
      params: {
        length: maxLength,
        number: maxNumber,
      },
    });
    return data;
  } catch (err) {
    console.error(`Error at get random words service ${err}`);
    throw err;
  }
};

export default getRandomWords;
