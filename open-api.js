import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const apikey = process.env.OPENAI_API_KEY;

console.log("Api key is: ", apikey);
if (!apikey) {
  console.log("OPEN_AI_API_ Key is not present");
  process.exit(1);
}

const configuration = new Configuration({
  apiKey: apikey,
});
const openai = new OpenAIApi(configuration);

export default openai;
