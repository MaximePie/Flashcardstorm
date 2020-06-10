import React from 'react';
import { LinearProgress } from '@material-ui/core';
import heroSprite from '../../../images/owl.png';
import monsterSprite from '../../../images/monster.png';
import QuestionCard from '../molecule/QuestionCard';
import server from '../../server';

export default function Quest() {
  const [hero, setHero] = React.useState({
    currentLife: 100,
  });

  const [monster, setMonster] = React.useState({
    currentLife: 100,
  });

  const [questions, setQuestions] = React.useState([]);

  const [displayedText, setDisplayedText] = React.useState('');

  React.useEffect(() => {
    if (hero.currentLife <= 0) {
      alert("Vous êtes mort... Déso !");
      window.reload();
    }
  }, [hero]);


  React.useEffect(() => {
    if (monster.currentLife <= 0) {
      alert("Vous avez gagné, wouhou !");
      window.reload();
    }
  }, [monster]);

  React.useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="Quest">
      {questions[0] && (
        <>
          <div className="Quest__entities">
            <div className="Quest__entity">
              <img src={heroSprite} alt="Le héros" className="Quest__hero" />
              <LinearProgress className="Quest__bar" variant="determinate" value={hero.currentLife} />
            </div>
            <QuestionCard
              question={questions[0] || undefined}
              onSubmit={(answer) => submitAnswer(answer, questions[0])}
              key={`QuestionCard-${questions[0].id}`}
              isQuest
            />
            <div className="Quest__entity">
              <img src={monsterSprite} alt="Le méchant" className="Quest__meany" />
              <LinearProgress
                className="Quest__bar"
                variant="determinate"
                value={monster.currentLife}
                color="secondary"
              />
            </div>
          </div>
          <div className="Quest__text">
            {displayedText}
          </div>
        </>
      )}
    </div>
  );


  /**
   * Fetch the users daily questions in the database
   */
  function fetchQuestions() {
    server.get('allDailyQuestions')
      .then((response) => {
        setQuestions(response.data.questions);
      });
  }

  /**
   * Submit the answer to the backoffice
   * @param answer
   * @param question
   */
  function submitAnswer(answer, question) {
    server.post(
      'question/submit_answer',
      {
        id: question.id,
        answer,
        mode: 'soft',
        is_golden_card: false,
        is_reverse_question: question.is_reverse,
      },
    )
      .then((response) => {
        if (response.data.status === 200) {
          setDisplayedText('Le monstre perd 10 PV');
          setMonsterLife(monster.currentLife - 10);
        } else if (response.data.status === 500) {
          setDisplayedText('Le hero perd 10 PV');
          setHeroLife(hero.currentLife - 10);
        }
      });

    const questionsList = [...questions];
    questionsList.shift();
    setQuestions(questionsList);
  }

  /**
   * Set the hero's current life
   * @param life the amount of life we want to give the hero
   */
  function setHeroLife(life) {
    setHero({
      ...hero,
      currentLife: life,
    });
  }

  /**
   * Set the monster's current life
   * @param life the amount of life we want to give the hero
   */
  function setMonsterLife(life) {
    setMonster({
      ...monster,
      currentLife: life,
    });
  }
}
