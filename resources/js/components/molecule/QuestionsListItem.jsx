import React from 'react';
import { PropTypes } from 'prop-types';
import { toLocale } from '../../helper';
import Icon from '../Icon';
import { AuthenticationContext } from '../../Contexts/authentication';

QuestionsListItem.propTypes = {
  question: PropTypes.shape({
    score: PropTypes.number,
    next_question_at: PropTypes.string,
    id: PropTypes.number,
    isSetForUser: PropTypes.bool,
    wording: PropTypes.string,
    answer: PropTypes.string,
    has_reverse: PropTypes.bool,
    category: PropTypes.shape({
      icon: PropTypes.string,
      name: PropTypes.string,
      color: PropTypes.string,
    }),
  }).isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  toggleQuestionForUser: PropTypes.func.isRequired,
  questionKey: PropTypes.number.isRequired,
};

export default function QuestionsListItem(props) {
  const isConnected = React.useContext(AuthenticationContext);

  const {
    question,
    questionKey,
    toggleQuestionForUser,
    deleteQuestion,
  } = props;

  return (
    <div
      key={`question${question.id}`}
      className="QuestionsList__question list-group-item card"
      id={`question${question.id}`}
    >
      <span>{question.wording}</span>
      <span>{question.answer}</span>
      <span>{isConnected && question.score && `+${question.score}`}</span>
      <span>
        {isConnected && question.next_question_at && `${toLocale(question.next_question_at)}`}
      </span>
      <span>{questionIcon(question)}</span>
      <span>{isConnected && question.has_reverse && <i className="fas fa-sync"/>}</span>
      <span>{questionActions()}</span>
    </div>
  );

  function questionIcon() {
    return (
      <>
        {question.category && (
          <Icon
            name={question.category.icon}
            badge={question.category.name}
            color={question.category.color}
            isSmall
          />
        )}
        {!question.category && (
          <Icon
            name="question"
            badge="divers"
            color="grey"
            isSmall
          />
        )}
      </>
    );
  }

  function questionActions() {
    return (
      <div className="QuestionsListItem__actions">
        {isConnected && (
          <>
            <span
              className="QuestionsListItem__delete-button"
              onClick={() => deleteQuestion(question.id)}
            >
              <i className="far fa-trash-alt QuestionsListItem__delete-icon" />
            </span>
            <input
              type="checkbox"
              value={question.id}
              checked={question.isSetForUser}
              onChange={(event) => toggleQuestionForUser(event, question.id, questionKey)}
              className="QuestionsListItem__toggle-button"
            />
          </>
        )}
      </div>
    );
  }
}
