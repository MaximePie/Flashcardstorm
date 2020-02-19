import React from 'react';
import { PropTypes } from 'prop-types';
import { isMobile } from '../helper';

Icon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  badge: PropTypes.string,
  name: PropTypes.string.isRequired,
};

Icon.defaultProps = {
  badge: '',
  className: '',
  color: '#000000',
};

export default function Icon(props) {
  const {
    className: outerClassName, name, color: propsColor, badge,
  } = props;
  const containerClassName = `Icon__container ${outerClassName}`;
  let className = 'Icon far fas';
  className += ` fa-${name} `;

  const color = propsColor && { color: propsColor };
  const backgroundColor = propsColor && { backgroundColor: propsColor };

  return badge ? (
    <>
      {!isMobile() && (
      <div className={containerClassName} style={color}>
        <i className={className} />
        <span className="Icon__badge badge badge-secondary">{badge}</span>
      </div>
      )}
      {isMobile() && (
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
