import React from 'react';
import axios from "axios";
import QuestionCard from "./QuestionCard";
export default function Home() {

  const [questions, updateQuestions] = React.useState(undefined);

  React.useEffect(() => {
    updateQuestionsBag()
    // TODO Créer une méthode updateUserInfo pour récupérer les infos (dont le score)
  }, []);

  return (
    // TODO Afficher tous les composants sur la même page Home.js pour le moment puisqu'on n'a que très peu de contenu
      <div className="container Home">
        <div className="row">
            Bonjour et bienvenue sur FlashcardStorm
        </div>
        <div className="row">
          {questions && (
            <>
              <QuestionCard question={questions[0]} onSubmit={submitAnswer}/>
            </>
          )}
          </div>
      </div>
  );

  // TODO - Create import from Excel feature, the program can take a csv file with 2 columns : Question,Answer 

  function submitAnswer(answer) {
    console.log(answer);
    if (answer === questions[0].answer) {
      // TODO #20 - Send answer info
      axios.post('/api/question/submit_answer', {
        id: questions[0].id,
        is_valid: true,
      }).then(response => {
        console.log(response.data.Question);
      })

      // TODO - Fetch a new question and remove current question

      // TODO #13 - Display the score sent by the Backoffice
    }
  }

  function updateQuestionsBag() {
    axios.get('/question').then(response => {
      updateQuestions(response.data)
    })
  }
}

