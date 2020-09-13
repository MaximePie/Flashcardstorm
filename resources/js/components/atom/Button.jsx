import React from 'react';
import classNames from 'classnames';
import { PropTypes } from 'prop-types';

require('../../../sass/Button.scss');

Button.propTypes = {
  variant: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

Button.defaultProps = {
  variant: '',
  className: '',
  isDisabled: false,
};

export default function Button({
  variant, onClick, text, isDisabled, className,
}) {
  const classes = classNames({
    'Button btn btn-primary': true,
    'Button--big': variant === 'big',
    'Button--small': variant === 'small',
    'Button--disabled': isDisabled,
    'Button--inactive': variant === 'inactive',
  }, className);

  return (
    <button disabled={isDisabled} type="button" className={classes} onClick={onClick}>{text}</button>
  );
}
