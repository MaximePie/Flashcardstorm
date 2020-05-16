import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { PropTypes } from 'prop-types';
import { DialogTitle } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import Button from './Button';
import server from '../../server';
import CloseIcon from '../atom/CloseIcon';

HintDialog.propTypes = {
  questionId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function HintDialog(props) {
  const { onClose, questionId } = props;

  const [question, setQuestion] = React.useState(undefined);
  const [memo, setMemo] = React.useState('');
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    fetchQuestion();
  }, []);


  return (
    <Dialog open onClose={onClose} className="HintDialog">
      <DialogTitle className="HintDialog__header">
        Ajouter un mémo
        <CloseIcon onClick={onClose} />
      </DialogTitle>
      {question && (
        <DialogContent className="HintDialog__content">
          <form onSubmit={submitMemo} className="HintDialog__form">
            <h3 className="HintDialog__wording">{question.wording}</h3>
            <TextField
              className="HintDialog__form-field"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              label={"Mémo"}
            >
              {question.wording}
            </TextField>
            <h3 className="HintDialog__wording">{question.answer}</h3>
            <Button variant="small" onClick={submitMemo} text="Envoyer" />
          </form>
        </DialogContent>
      )}
    </Dialog>
  );


  /**
   * Send the memo value to back office to register it as a Mnemonic for this question
   */
  function submitMemo() {
    server.post('mnemonics', {
      wording: memo,
      questionId,
    })
      .then(() => {
        enqueueSnackbar('Le mémo a bien été ajoutée !',
          {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'success',
          });
        setMemo('');
        onClose();
      });
  }

  /**
   * Fetches the data of the question based on its ID.
   */
  function fetchQuestion() {
    server.get(`showQuestion/${questionId}`)
      .then((response) => {
        setQuestion(response.data);
      });
  }
}
