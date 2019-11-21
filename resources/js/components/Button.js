import React from 'react';

export default function Button(props) {

  return (
      <button className="Button btn btn-primary" onClick={props.onClick}>{props.text}</button>
  );
}

