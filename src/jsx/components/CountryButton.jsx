import CircleFlag from './general/CircleFlag.jsx';

function CountryButton({ el, changeHighlight }) {
  return (
    <button className={`flag_container ${el.country_code}`} title={el.country} aria-label={`Highlight ${el.country}`} type="button" onClick={event => changeHighlight(event)} value={el.country_code}>
      <CircleFlag height={0} countryCode={el.country_code} />
    </button>
  );
}

export default CountryButton;
