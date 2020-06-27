import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import { PropTypes } from 'prop-types';
import { isMobile, toLocale } from '../../helper';
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
  const [expanded, setExpanded] = React.useState(false);

  const {
    question,
    questionKey,
    toggleQuestionForUser,
    deleteQuestion,
  } = props;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <li key={`question${question.id}`} className="QuestionsList__question list-group-item card">
      {questionIcon(question)}
      <div className="QuestionsList__question-content">
        <h3 className="QuestionsList__question-wording">{question.wording}</h3>
        <div className="QuestionsList__question-answer">{question.answer}</div>
        {isConnected && (
          <>
            {question.score && (
              <div className="QuestionsList__question-score">
                Prochain gain : +
                {question.score}
              </div>
            )}
            {question.next_question_at && (
              <div className="QuestionsList__question-next">
                Prochaine question le
                {` ${toLocale(question.next_question_at)}`}
              </div>
            )}
            {question.has_reverse && (
              <div className="QuestionsList__has-reverse-text">
                Cette question a une version inversée
              </div>
            )}
          </>
        )}
      </div>
      {questionActions()}
    </li>
  );

  function questionIcon() {
    return (
      <>
        {question.category && (
          <Icon
            className="QuestionsList__category-icon"
            name={question.category.icon}
            badge={question.category.name}
            color={question.category.color}
          />
        )}
        {!question.category && (
          <Icon
            className="QuestionsList__category-icon"
            name="question"
            badge="divers"
            color="grey"
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
            <input
              type="checkbox"
              value={question.id}
              checked={question.isSetForUser}
              onChange={(event) => toggleQuestionForUser(event, question.id, questionKey)}
              className="QuestionsListItem__toggle-button"
            />
            <IconButton
              aria-label="delete"
              color="primary"
              className="QuestionsListItem__delete-button"
              onClick={() => deleteQuestion(question.id)}
            >
              <i className="far fa-trash-alt QuestionsListItem__delete-icon" />
            </IconButton>
          </>
        )}
      </div>
    );
  }

  function collapsibleForDetails() {
    return (
      <>
        <div className="QuestionsList__collapsible-trigger" onClick={handleExpandClick}>
          <Icon
            name={expanded ? 'angle-up' : 'angle-down'}
          />
        </div>
        <Collapse in={expanded}>
          {isConnected && isMobile() && (
            <>
              {question.score
                  && (
                  <div className="QuestionsList__question-score">
                      Prochain gain : +
                    {question.score}
                  </div>
                  )}
              {question.next_question_at && (
                <div className="QuestionsList__question-next">
                    Prochaine question le
                  {toLocale(question.next_question_at)}
                </div>
              )}
            </>
          )}
        </Collapse>
      </>
    );
  }
}
