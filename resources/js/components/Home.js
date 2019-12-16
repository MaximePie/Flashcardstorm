import React from 'react';
import QuestionCard from "./QuestionCard";
import server from '../server'
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {useSnackbar} from "notistack";

export default function Home(props) {
  const [question, updateQuestion] = React.useState(undefined);

  const [switchStatus, setSwitchStatus] = React.useState(true);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  React.useEffect(() => {
    updateQuestionsBag()
  }, [switchStatus]);

  return (
    <>
      <div className="jumbotron Home__title">
        <h1>Mode tempête !</h1>
        <p>Répondez à un maximum de question toutes catégories confondues sans limite de temps ni d'essai</p>
        <p>Attention, en mode tempête les questions ne rapportent que 10 points chacunes !</p>
        {props.is_connected && (
          <FormControlLabel
            control={
              <Switch checked={switchStatus} onChange={() => setSwitchStatus(!switchStatus)}/>
            }
            label="Afficher seulement mes questions"
          />
        )}
      </div>
      <div className="container Home">
        <div className="row">
          {question && (
            <QuestionCard
              question={question || undefined}
              onSubmit={submitAnswer}
              onSkip={() => updateQuestionsBag()}
            />
          )}
        </div>
      </div>
    </>
  );

  // TODO - Create import from Excel feature, the program can take a csv file with 2 columns : Question,Answer 

  function submitAnswer(answer) {
    event.preventDefault();
    server.post(
      'question/submit_answer', {
        id: question.id,
        answer: answer,
        mode: "storm",
        is_golden_card: question.is_golden_card,
        is_reverse_question: question.is_reverse,
      }
      ).then(response => {
        let snackbar_text = response.data.text;
        if (response.data.status !== 200) {
          snackbar_text += " Réponses correctes : " + response.data.correct_answer
        }

        let score = response.data.status === 200 && response.data.earned_points > 0 ? response.data.earned_points : undefined

        enqueueSnackbar(
          <div className="Home__snackbar">
            {snackbar_text}
            {score && (
              <span className="Home__snackbar-score">
                +{score}
              </span>
            )}
          </div>
          ,
          {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: response.data.status === 200 ? 'success' : 'warning',
          }
        );

        if (response.data.status === 200) {
          props.updateUserScore();
        }
        updateQuestionsBag();
    });
  }

  function updateQuestionsBag() {
    const url = switchStatus === true ? 'question/for_user' : 'question/all';
    server.get(url).then(response => {
      updateQuestion(response.data.question || undefined)
    })
  }
}

