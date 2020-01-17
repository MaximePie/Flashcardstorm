import React from 'react';
import classNames from 'classnames';
import { PropTypes } from 'prop-types';

require('../../../sass/Button.scss');

Button.propTypes = {
  variant: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  variant: '',
};

export default function Button(props) {
  const { variant, onClick, text } = props;
  const classes = classNames({
    'Button btn btn-primary': true,
    'Button--big': variant === 'big',
    'Button--small': variant === 'small',
  });

  return (
    <button type="button" className={classes} onClick={onClick}>{text}</button>
  );
}
