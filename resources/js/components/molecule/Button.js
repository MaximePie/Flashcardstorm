import React from 'react';
import classNames from 'classnames'
require ("../../../sass/Button.scss");

export default function Button(props) {

  let classnames = classNames({
    "Button btn btn-primary": true,
    "Button--big": props.variant === "big",
    "Button--small": props.variant === "small",
  });

  return (
      <button className={classnames} onClick={props.onClick}>{props.text}</button>
  );
}

