import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { PropTypes } from 'prop-types';
import { DialogTitle } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import CloseIcon from '../atom/CloseIcon';
import server from '../../server';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '../atom/Button';
import { useSnackbar } from 'notistack';

QuestionDetailsDialog.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.number,
    wording: PropTypes.string,
    answer: PropTypes.string,
    isSetForUser: PropTypes.bool,
    has_reverse: PropTypes.bool,
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function QuestionDetailsDialog({
  onClose, question, onUpdate, onDelete, categories
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [isQuestionSetForUser, setIsQuestionSetForUser] = React.useState(question.isSetForUser);
  const [hasReverseQuestion, setHasReverseQuestion] = React.useState(question.has_reverse);
  const [selectedCategory, setSelectedCategory] = React.useState(question.category?.id);
  const [questionWording, setQuestionWording] = React.useState(question.wording);
  const [questionAnswer, setQuestionAnswer] = React.useState(question.answer);

  return (
    <Dialog open onClose={onClose} className="QuestionDetailsDialog">
      <DialogTitle className="QuestionDetailsDialog__header">
        <input
          className="QuestionDetailsDialog__text-input"
          type="text"
          onChange={(event) => setQuestionWording(event.target.value)}
          value={questionWording}
        />
        <i className="QuestionDetailsDialog__delete-button fas fa-trash" onClick={deleteQuestion}/>
        <CloseIcon className="QuestionDetailsDialog__close-button" onClick={onClose}/>
      </DialogTitle>
      <DialogContent className="QuestionDetailsDialog__content">
        <span className="QuestionDetailsDialog__answer">
          <input
            className="QuestionDetailsDialog__text-input QuestionDetailsDialog__text-input--secondary"
            type="text"
            onChange={(event) => setQuestionAnswer(event.target.value)}
            value={questionAnswer}
          />
        </span>
        <div className="QuestionDetailsDialog__actions">
          <div className="QuestionDetailsDialog__field">
            <FormControlLabel
              control={(
                <Switch
                  checked={isQuestionSetForUser}
                  onChange={() => setIsQuestionSetForUser(!isQuestionSetForUser)}
                />
              )}
              label="Apprendre cette question"
            />
          </div>
          <div className="QuestionDetailsDialog__field">
            <RadioGroup
              className="Addknowledge__radiogroup"
              aria-label="Catégorie"
              name="category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(parseInt(event.target.value, 10))}
            >
              <FormControlLabel value={0} control={<Radio/>} label="Sans catégorie"/>
              {categories && categories.map((category) => (
                <FormControlLabel
                  key={`category-${category.id}`}
                  value={category.id}
                  control={<Radio/>}
                  label={category.name}
                />
              ))}
            </RadioGroup>
          </div>
          <div className="QuestionDetailsDialog__field">
            <FormControlLabel
              control={(
                <Switch
                  checked={hasReverseQuestion}
                  onChange={() => setHasReverseQuestion(!hasReverseQuestion)}
                />
              )}
              label="Question inverse"
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} text="Annuler" variant="secondary"/>
        <Button onClick={updateQuestion} text="Enregistrer"/>
      </DialogActions>
    </Dialog>
  );

  /**
   * Call the delete route for the given question
   */
  function deleteQuestion() {
    onClose();
    onDelete(question.id);
  }

  /**
   * Update the question and close
   */
  function updateQuestion() {
    server.post(`question/update`, {
      questionId: question.id,
      isSetForUser: isQuestionSetForUser,
      shouldHaveReverseQuestion: hasReverseQuestion,
      category: selectedCategory,
      question: questionWording,
      answer: questionAnswer,
    }).then(() => {
      enqueueSnackbar(
        'Votre sélection a bien été enregistrée !', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          }
        }
      );
      onUpdate();
    })
  }
}
