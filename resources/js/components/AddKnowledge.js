import React from 'react';
import axios from "axios";
export default function AddKnowledge() {

  const [form, setForm] = React.useState({
    question: '',
    answer: ''
  });

  return (
    <div className="container">
      <div className="row justify-content-center">
        <form onSubmit={printValues}>
          <label>
            Question
            <input
              value={form.question}
              name="question"
              onChange={updateForm}
            />
          </label>
          <br />
          <label>
            Answer
            <input
              value={form.answer}
              name="answer"
              onChange={updateForm}
            />
          </label>
          <br />
          <button>Submit</button>
        </form>
      </div>
    </div>
  );

  function updateForm (e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function printValues(event) {
    event.preventDefault();
    axios.post('/api/question', form).then(response => {
      console.log(response)
    })
  }

}
