import React from 'react';
import PropTypes from 'prop-types';

function ChartContainer({
  src, title
}) {
  return (
    <iframe loading="lazy" title={title} aria-label={title} src={src} scrolling="no" frameBorder="0" height="auto" />
  );
}

ChartContainer.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

ChartContainer.defaultProps = {
};

export default ChartContainer;
