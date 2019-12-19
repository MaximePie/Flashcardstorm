import React from 'react';
import { isMobile, toLocale} from "../../helper";
import Icon from "../Icon";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";


export default function QuestionsListItem(props) {
  const [expanded, setExpanded] = React.useState(false);

  const question = props.question;
  const key = props.questionKey
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <li key={`question${question.id}`} className="QuestionsList__question list-group-item">
      {questionIcon(question)}
      <div>
        <h3 className="QuestionsList__question-wording">{question.wording}</h3>
        <div className="QuestionsList__question-answer">{question.answer}</div>
        {props.is_connected && !isMobile() && (
          <>
            {question.score && (
              <div className="QuestionsList__question-score">Prochain gain : +{question.score}</div>
            )}
            {question.next_question_at && (
              <div className="QuestionsList__question-next">Prochaine question le {toLocale(question.next_question_at)}</div>
            )}
          </>
        )}
        {isMobile() && collapsibleForDetails(question)}
      </div>
      {questionActions(question, key)}
    </li>
  );

  function questionIcon(question) {
    return (
      <>
        {question.category && (
          <Icon
            className={"QuestionsList__category-icon"}
            name={question.category.icon}
            badge={question.category.name}
            color={question.category.color}
          />
        )}
        {!question.category && (
          <Icon
            className={"QuestionsList__category-icon"}
            name={'question'}
            badge={'divers'}
            color={'grey'}
          />
        )}
      </>
    )
  }

  function questionActions(question, key) {
    return (
      <div className="QuestionsList__actions">
        {props.is_connected && (
          <>
            <input
              type="checkbox"
              value={question.id}
              checked={question.is_set_for_user}
              onChange={(event) => props.toggleQuestionForUser(event, question.id, key)}
              className="QuestionsList__toggle-button"
            />
            <IconButton
              aria-label="delete"
              color="primary"
              className="QuestionsList__delete-button"
              onClick={() => props.deleteQuestion(question.id)}
            >
              <i className="far fa-trash-alt QuestionsList__delete-icon"/>
            </IconButton>
          </>
        )}
      </div>
    )
  }

  function collapsibleForDetails(question) {

    return (
      <>
        <div className="QuestionsList__collapsible-trigger" onClick={handleExpandClick}>
          <Icon
            name={expanded ? "angle-up" : "angle-down"}
          />
        </div>
        <Collapse in={expanded}>
          {props.is_connected && isMobile() && (
            <>
              {question.score && (
                <div className="QuestionsList__question-score">Prochain gain : +{question.score}</div>
              )}
              {question.next_question_at && (
                <div className="QuestionsList__question-next">Prochaine question le {toLocale(question.next_question_at)}</div>
              )}
            </>
          )}
        </Collapse>
      </>
    )
  }
}

