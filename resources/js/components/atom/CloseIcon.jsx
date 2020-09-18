import React from 'react';
import { PropTypes } from 'prop-types';

CloseIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

CloseIcon.defaultProps = {
  className: '',
};

export default function CloseIcon(props) {
  const { onClick, className } = props;

  return (
    <i
      className={`CloseIcon fas fa-times ${className}`}
      onClick={onClick}
    />
  );
}
