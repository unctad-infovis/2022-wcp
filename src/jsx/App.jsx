import React, { useState, useEffect } from 'react';
import '../styles/styles.less';

// https://d3js.org/
import * as d3 from 'd3';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import IsVisible from 'react-is-visible';

// https://www.npmjs.com/package/react-tooltip
import ReactTooltip from 'react-tooltip';

import CountryButton from './helpers/CountryButton.jsx';

function App() {
  // Data states.
  const [data, setData] = useState(false);
  const [countries, setCountries] = useState(false);
  const [selectedCountry, setselectedCountry] = useState(false);

  const cleanData = (json_data) => {
    const tmp_data = {
      'Countries that carry out information and education initiatives(q71)': [],
      'Countries that conduct research and analysis on consumer protection issues(q77)': [],
      'Countries that have designated a consumer protection contact point(q0)': [],
      'Countries where the agency carries out initiatives for vulnerable and disadvantaged consumers(q73)': [],
      'Countries whose Constitution contains a provision on consumer protection(q7)': [],
      'Countries with Cross-border out-of-court alternative consumer dispute resolution initiatives(q53)': [],
      'Countries with a law/decree that governs the main consumer protection authority/agency(q26)': [],
      'Countries with a main consumer protection authority/agency (q19)': [],
      'Countries with a specific law(s) on consumer protection(q9)': [],
      'Countries with experience in cross-border cooperation on enforcement(q67)': [],
      'Countries with non-governmental consumer organizations/associations(q39)': []
    };

    json_data.forEach((el) => {
      Object.keys(tmp_data).forEach(element => {
        tmp_data[element].push({
          answer: el[element],
          country: el['Country name'],
          country_code: el.Code2Digit
        });
      });
    });
    return tmp_data;
  };

  const getCountries = (json_data) => json_data.map((el) => Object(
    {
      country_code: el.Code2Digit,
      country: el['Country name']
    }
  ));

  useEffect(() => {
    const data_file = (window.location.href.includes('unctad.org')) ? '/sites/default/files/data-file/2022-wcp.json' : './assets/data/data.json';
    try {
      d3.json(data_file).then((json_data) => {
        setData(cleanData(json_data));
        setCountries(getCountries(json_data));
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const createVis = (container) => {
    if (container) {
      const vis_container = d3.select(`.${container}:not(.visualised)`);
      ['answer_yes', 'answer_no', 'no_answer'].forEach(el => {
        vis_container.selectAll(`.${el} img`)
          .style('height', 0)
          .style('width', 0)
          .style('opacity', 0)
          .transition()
          .duration(500)
          .delay((d, i) => 30 * i)
          .style('height', '50px')
          .style('width', '50px')
          .ease(d3.easeBounceOut)
          .transition()
          .duration(200)
          .delay((d, i) => 30 * i)
          .style('height', '30px')
          .style('width', '30px')
          .ease(d3.easeBounceOut)
          .style('opacity', 1);
      });
      vis_container.classed('visualised', true);
    }
  };

  useEffect(() => {
    ReactTooltip.rebuild();
    createVis();
  }, [data]);

  const changeHighlight = (event) => {
    document.querySelectorAll('.flag_container').forEach((el) => {
      el.classList.remove('highlighted');
      if (event.target.value === selectedCountry) {
        el.classList.remove('background');
      } else if (el.classList.contains(event.target.value)) {
        el.classList.remove('background');
        el.classList.add('highlighted');
      } else if (event.target.value !== '') {
        el.classList.add('background');
      } else {
        el.classList.remove('background');
      }
    });
    setselectedCountry((event.target.value === selectedCountry) ? '' : event.target.value);
  };

  return (
    <div className="app">
      <div className="search_container">
        <h3>Highlight a country</h3>
        <select onChange={(event) => changeHighlight(event)} value={selectedCountry}>
          <option value={false}>Select a country to highlight</option>
          <option value={false} disabled="disabled">??? ??? ??? ??? ???</option>
          {
            countries && countries.map(el => (
              <option key={el.country_code} value={el.country_code}>{el.country}</option>
            ))
          }
        </select>
      </div>
      <div className="vis_container">
        {
          data && Object.keys(data).map((element, i) => (
            <div key={element} className={`element_${i} element_container`}>
              <h3>{element}</h3>
              <IsVisible once>
                {(isVisible) => (
                  <div className="answer_yes">
                    {isVisible && createVis(`element_${i}`)}
                    <h4>{`Yes, ${data[element].filter(el => el.answer === 1).length} countries`}</h4>
                    {
                      data[element].map(el => ((el.answer === 1) ? <CountryButton key={el.country_code} el={el} changeHighlight={changeHighlight} /> : null))
                    }
                  </div>
                )}
              </IsVisible>
              <div className="answer_no">
                <h4>{`No, ${data[element].filter(el => el.answer === 0).length} countries`}</h4>
                {
                  data[element].map(el => ((el.answer === 0) ? <CountryButton key={el.country_code} el={el} changeHighlight={changeHighlight} /> : null))
                }
              </div>
              <div className="no_answer">
                <h4>{`No answer, ${data[element].filter(el => el.answer === null).length} countries`}</h4>
                {
                  data[element].map(el => ((el.answer === null) ? <CountryButton key={el.country_code} el={el} changeHighlight={changeHighlight} /> : null))
                }
              </div>
            </div>
          ))
        }
      </div>
      <ReactTooltip place="top" type="dark" effect="solid" />
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
