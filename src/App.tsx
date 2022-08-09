import axios from "axios";
import { useState } from "react";
import {
  Container,
  Box,
  Divider,
  Typography,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

type WordMeaning = {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example: string;
  }[];
  synonyms: string[];
  antonyms: string[];
};

type WordDefinition = {
  word: string;
  phonetic: string;
  phonetics: {
    text: string;
    audio: string;
  }[];
  origin: string;
  meanings: WordMeaning[];
};

function App() {
  const [wordToDefine, setWordToDefine] = useState("");
  const [wordDefinitions, setWordDefinitions] = useState<
    undefined | WordDefinition[]
  >(undefined);
  const [requestIsPending, setRequestIsPending] = useState(false);
  const [wordNotFound, setWordNotFound] = useState(false);

  const FREE_DICTIONARY_BASE_URL =
    "https://api.dictionaryapi.dev/api/v2/entries/en/";

  function WordMeaning(props: { meaning: WordMeaning; addDivider: boolean }) {
    return (
      <div>
        {props.addDivider && <Divider sx={{ mt: 1.5, mb: 2 }} />}
        <Typography sx={{ mt: 1, mb: 0.5 }} color="text.secondary">
          {props.meaning.partOfSpeech}
        </Typography>
        {props.meaning.definitions.map((definition: any, i: number) => (
          <Typography
            key={`word-definition-${i}`}
            sx={{ mb: 0.5 }}
            variant="body2"
          >
            {definition.definition}
          </Typography>
        ))}
        {props.meaning.synonyms.length > 0 && (
          <span>
            <Typography sx={{ mt: 1, mb: 0.5 }} color="text.secondary">
              synonyms
            </Typography>
            <Typography sx={{ mb: 1 }} variant="body2">
              {props.meaning.synonyms.join(", ")}
            </Typography>
          </span>
        )}
      </div>
    );
  }

  function WordDefinitionCard(props: { wordDefinition: WordDefinition }) {
    return (
      <Card sx={{ minWidth: 275, mt: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {props.wordDefinition.word}
          </Typography>
          <Typography component="div" sx={{ mb: 1.5 }}>
            {props.wordDefinition.phonetic}
          </Typography>
          {props.wordDefinition.meanings.map((meaning, i) => (
            <WordMeaning
              key={`word-meaning-${i}`}
              meaning={meaning}
              addDivider={i > 0}
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mb: 4 }}>
      <Box sx={{ my: 2, textAlign: "center" }}>
        <img src="logo192.png" height="128px" alt="Logo" />
        <Typography sx={{ mt: 1 }} variant="h4" component="h1">
          Define-a-word
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Very Simple Dictionary
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TextField
          fullWidth
          id="word-to-search"
          label="A word to define"
          onChange={(prop) => {
            setWordToDefine(prop.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              getWordDefinition();
            }
          }}
          sx={{ mr: 1 }}
          variant="standard"
        />
        <LoadingButton
          disabled={wordToDefine.trim().length === 0}
          loading={requestIsPending}
          onClick={() => {
            getWordDefinition();
          }}
          size="small"
          sx={{ mt: 2 }}
          variant="outlined"
        >
          Define
        </LoadingButton>
      </Box>
      {wordDefinitions !== undefined
        ? wordDefinitions.map((wordDefinition, i) => (
            <WordDefinitionCard
              key={`word-definition-card-${i}`}
              wordDefinition={wordDefinition}
            />
          ))
        : wordNotFound && (
            <Box sx={{ my: 4, textAlign: "center" }}>
              <Typography>Word not found ¯\_(ツ)_/¯</Typography>
            </Box>
          )}
    </Container>
  );

  function getWordDefinition() {
    setRequestIsPending(true);
    axios
      .get(FREE_DICTIONARY_BASE_URL + wordToDefine.toLowerCase())
      .then((res) => {
        setWordNotFound(false);
        setWordDefinitions(res.data);
      })
      .catch((reason) => {
        setWordDefinitions(undefined);
        if (reason.response.status === 404) {
          setWordNotFound(true);
        } else {
          console.error(reason);
        }
      })
      .finally(() => {
        setRequestIsPending(false);
      });
  }
}

export default App;
