import React from 'react';

export default function Button(props) {

  let variant = "btn-primary";

  if (props.variant) {
    variant = props.variant;
  }

  return (
      <button className={"Button btn " + variant} onClick={props.onClick}>{props.text}</button>
  );
}

