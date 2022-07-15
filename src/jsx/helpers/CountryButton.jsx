import React from 'react';
import PropTypes from 'prop-types';

// https://www.npmjs.com/package/react-circle-flags
import { CircleFlag } from 'react-circle-flags';

function CountryButton({ el, changeHighlight }) {
  return (<button className={`flag_container ${el.country_code}`} data-tip={el.country} aria-label={`Highlight ${el.country}`} type="button" onClick={(event) => changeHighlight(event)} value={el.country_code}><CircleFlag data-tip={el.country} height={0} countryCode={el.country_code.toLowerCase()} value={el.country_code} /></button>);
}

CountryButton.propTypes = {
  el: PropTypes.instanceOf(Object).isRequired,
  changeHighlight: PropTypes.func.isRequired
};

// CountryButton.defaultProps = {
// };

export default CountryButton;
