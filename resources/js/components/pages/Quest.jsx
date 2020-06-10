import React from 'react';
import { LinearProgress } from '@material-ui/core';
import heroSprite from '../../../images/owl.png';
import monsterSprite from '../../../images/monster.png';
import QuestionCard from '../molecule/QuestionCard';
import server from '../../server';

export default function Quest() {
  const [hero, setHero] = React.useState({
    current_health: 100,
  });

  const [monster, setMonster] = React.useState({
    current_health: 100,
  });

  const [questions, setQuestions] = React.useState([]);

  const [displayedText, setDisplayedText] = React.useState('');

  React.useEffect(() => {
    if (hero.current_health <= 0) {
      alert('Vous êtes mort... Déso !');
      window.reload();
    }
  }, [hero]);


  React.useEffect(() => {
    if (monster.current_health <= 0) {
      alert('Vous avez gagné, wouhou !');
      window.reload();
    }
  }, [monster]);

  React.useEffect(() => {
    initializeHero();
    fetchQuestions();
    fetchEntitiesInfo();
  }, []);

  return (
    <div className="Quest">
      {questions[0] && (
        <>
          <div className="Quest__entities">
            <div className="Quest__entity">
              <img src={heroSprite} alt="Le héros" className="Quest__hero" />
              <LinearProgress
                className="Quest__bar"
                variant="determinate"
                value={(hero.current_health / hero.max_health) * 100}
              />
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
                value={(monster.current_health / monster.max_health) * 100}
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
   * Fetch the entities info
   */
  function fetchEntitiesInfo() {
    server.get('quest')
      .then((response) => {
        setHero({ ...response.data.hero });
        setMonster(response.data.monster);
      });
  }


  /**
   * Fetch the hero info and set it to initial values
   */
  function initializeHero() {
    server.get('initialQuest');
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
          server.post('quest_attack', {
            attacker: hero.id,
            victim: monster.id,
          }).then((attackResponse) => {
            setDisplayedText(`Le monstre perd ${attackResponse.lostHealth} PV`);
            fetchEntitiesInfo();
          });
        } else if (response.data.status === 500) {
          server.post('quest_attack', {
            attacker: monster.id,
            victim: hero.id,
          }).then((attackResponse) => {
            setDisplayedText(`Le héros perd ${attackResponse.lostHealth} PV`);
            fetchEntitiesInfo();
          });
        }
      });

    const questionsList = [...questions];
    questionsList.shift();
    setQuestions(questionsList);
  }
}
