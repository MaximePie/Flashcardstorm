import React from 'react';
import { isMobile } from "../helper";

export default function Icon(props) {

  let containerClassName = "Icon__container" + props.className;
  let className="Icon far fas";
  className += " fa-" + props.name + " ";

  let color = props.color && {color: props.color};
  let backgroundColor = props.color && {backgroundColor: props.color};

  return props.badge ? (
    <>
      {!isMobile() && (
        <div className={containerClassName} style={color}>
          <i className={className}/>
          <span className="Icon__badge badge badge-secondary">{props.badge}</span>
        </div>
      )}
      {isMobile() && (
        <span
          style={backgroundColor}
          className="Icon__badge badge badge-secondary"
        >
          <i className={className}/>
          {props.badge}
        </span>
      )}
    </>
    )
    : (
    <i className={className}/>
  );
}

