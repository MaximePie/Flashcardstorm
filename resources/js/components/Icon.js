import React from 'react';

export default function Icon(props) {

  let className="Icon far";
  className += " fa-" + props.name + " ";
  className += props.className;

  return (
    <i className={className}/>
  );
}

