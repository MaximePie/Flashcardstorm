import React from 'react';
import classNames from 'classnames'
require ("../../../sass/TextField.scss");

export default function TextField(props) {
  let classnames = classNames({
    "TextField": true,
    "TextField--big": props.variant === "big",
  });

  return (
    <span className={classnames}>
      {props.label && (
        <label>{props.label}</label>
      )}
      <input
        className={"TextField__input"}
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    </span>
  );
}

