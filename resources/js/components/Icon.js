import React from 'react';

export default function Icon(props) {

  let containerClassName = "Icon__container " + props.className;
  let className="Icon far fas";
  className += " fa-" + props.name + " ";

  let color = props.color && {color: props.color};

  return props.badge ? (
    <div className={containerClassName} style={color}>
      <i className={className}/>
      <span className="Icon__badge badge badge-secondary">{props.badge}</span>
    </div>
    )
    : (
    <i className={className}/>
  );
}

