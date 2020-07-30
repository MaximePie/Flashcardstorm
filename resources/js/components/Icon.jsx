import React from 'react';
import { PropTypes } from 'prop-types';
import { isMobile } from '../helper';

Icon.propTypes = {
  className: PropTypes.string,
  isSmall: PropTypes.bool,
  color: PropTypes.string,
  badge: PropTypes.string,
  name: PropTypes.string.isRequired,
};

Icon.defaultProps = {
  badge: '',
  className: '',
  color: '#000000',
  isSmall: false,
};

export default function Icon(props) {
  const {
    className: outerClassName, name, color: propsColor, badge, isSmall,
  } = props;
  const containerClassName = `Icon__container ${outerClassName}`;
  let className = 'Icon far fas';
  className += ` fa-${name} `;

  const isSmallFormat = isMobile() || isSmall;

  if (isSmallFormat) {
    className += ' Icon--small';
  }

  const color = propsColor && { color: propsColor };
  const backgroundColor = propsColor && { backgroundColor: propsColor };

  return badge ? (
    <>
      {!isSmallFormat && (
        <div className={containerClassName} style={color}>
          <i className={className} />
          <span className="Icon__badge badge badge-secondary">{badge}</span>
        </div>
      )}
      {isSmallFormat && (
        <span
          style={backgroundColor}
          className="Icon__badge badge badge-secondary"
        >
          <i className={className} />
          {badge}
        </span>
      )}
    </>
  ) : (
    <span className={containerClassName}>
      <i className={className} />
    </span>
  );
}
