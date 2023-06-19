const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// Routes

app.post("/send", async (req, res) => {
  let input = req.body.inputFirst;
  let i = input.toLowerCase();

  let tone = ["happy", "sad", "angry", "confused", "nuteral", "inappropriate"];
  const curseWords = process.env.CURSEWORDS.split(",");

  if (i.includes(":)") || i.includes("lovely") || i.includes("great")) {
    tone = "happy";
  } else if (
    i.includes(":(") ||
    i.includes("sadly") ||
    i.includes("sad") ||
    i.includes("i am sad") ||
    i.includes("you are sad") ||
    i.includes("unhappy")
  ) {
    tone = "sad";
  } else if (i.includes("?")) {
    tone = "confused";
  } else if (curseWords.some((wordi) => i.includes(wordi))) {
    tone = "inappropriate";
  } else if (i.includes("!") && curseWords.some((wordi) => i.includes(wordi))) {
    tone = "angry";
  } else if (i.includes("!")) {
    tone = "happy";
  } else {
    tone = "nuteral";
  }

  let answer;

  const json = fs.readFileSync("answers.json");
  const data = JSON.parse(json);

  const matchingKeywords = data.keywords.filter((words) =>
    words.words.some((word) => i.includes(word))
  );

  answer = data.default_answer;

  if (matchingKeywords.length > 0) {
    const matchingCategory = matchingKeywords[0];
    const matchingAnswers = matchingCategory.answers;

    answer =
      matchingAnswers[Math.floor(Math.random() * matchingAnswers.length)];
  }

  if (tone === "happy") {
    answer = answer.replace(".", "!");
  } else if (tone === "angry") {
    answer = answer.replace(".", "!");
  } else if (tone === "sad") {
    const sadArray = [
      "I am happy to help with whatever you need :)",
      "I am happy to help out :)",
      "If you need me, I'm here for you!",
      "I am all yours!",
      "I am glad to assist you :)",
    ];
    answer =
      answer + " " + sadArray[Math.floor(Math.random() * sadArray.length)];
  }

  res.send(answer);
});

app.get("/listen", (req, res) => {
  res.send("Running");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
