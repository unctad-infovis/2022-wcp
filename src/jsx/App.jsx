import React, { useState, useEffect } from 'react';
import '../styles/styles.less';

// https://d3js.org/
import * as d3 from 'd3';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import IsVisible from 'react-is-visible';

// https://www.npmjs.com/package/react-tooltip
import ReactTooltip from 'react-tooltip';

// Load helpers.
import ChartContainer from './components/ChartContainer.jsx';
import CountryButton from './helpers/CountryButton.jsx';

const appID = '#app-root-2022-wcp';

function App() {
  // Data states.
  const [data, setData] = useState(false);
  const [countries, setCountries] = useState(false);
  const [selectedCountry, setselectedCountry] = useState(false);
  const [visualisationID, setVisualisationID] = useState('PlvBz');

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions,func-names
    !(function () {
      // eslint-disable-next-line no-restricted-syntax,no-void,guard-for-in
      window.addEventListener('message', ((e) => { if (void 0 !== e.data['datawrapper-height']) { const t = document.querySelectorAll(`${appID} iframe`); for (const a in e.data['datawrapper-height']) for (let r = 0; r < t.length; r++) { if (t[r].contentWindow === e.source)t[r].style.height = `${e.data['datawrapper-height'][a]}px`; } } }));
    }());
  }, []);

  const cleanData = (json_data) => {
    const tmp_data = {
      'Countries that have designated a consumer protection contact point': [],
      'Countries whose Constitution contains a provision on consumer protection': [],
      'Countries with a specific law(s) on consumer protection': [],
      'Countries with a main consumer protection authority/agency': [],
      'Countries with a law/decree that governs the main consumer protection authority/agency': [],
      'Countries with non-governmental consumer organizations/associations': [],
      'Countries with experience in cross-border cooperation on enforcement': [],
      'Countries that carry out information and education initiatives': [],
      'Countries that conduct research and analysis on consumer protection issues': [],
      'Countries with Cross-border out-of-court alternative consumer dispute resolution initiatives': [],
      'Countries where the agency carries out initiatives for vulnerable and disadvantaged consumers': []
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
    const data_file = (window.location.href.includes('unctad.org')) ? 'https://storage.unctad.org/2022-wcp/assets/data/2022-wcp_data.json' : './assets/data/2022-wcp_data.json';
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

  const changeQuestion = (event_target) => {
    document.querySelectorAll(`${appID} .element_container`).forEach(el => {
      el.style.display = 'none';
      el.style.opacity = 0;
    });
    if (document.querySelector(`${appID} .element_${event_target.value}`) !== null) {
      document.querySelector(`${appID} .element_${event_target.value}`).style.display = 'block';
      document.querySelector(`${appID} .element_${event_target.value}`).style.opacity = 1;
      setVisualisationID(document.querySelector(`${appID} .option_${event_target.value}`).dataset.vis);
    }
  };
  window.changeQuestion = changeQuestion;

  const changeHighlight = (event) => {
    document.querySelectorAll(`${appID} .flag_container`).forEach((el) => {
      el.classList.remove('highlighted');
      if (event.target.value === selectedCountry) {
        el.classList.remove('background');
      } else if (el.classList.contains(event.target.value)) {
        el.classList.remove('background');
        el.classList.add('highlighted');
      } else if (event.target.value !== '' && event.target.value !== 'false') {
        el.classList.add('background');
      } else {
        el.classList.remove('background');
      }
    });
    setselectedCountry((event.target.value === selectedCountry) ? '' : event.target.value);
  };

  return (
    <div className="app">
      <h2>Analysis per Yes/No questions</h2>
      <div className="change_question">
        <select onChange={(event) => window.changeQuestion(event.target)}>
          <option value="0" className="option_0" data-vis="PlvBz">Countries that have designated a consumer protection contact point</option>
          <option value="1" className="option_1" data-vis="IZqad">Countries whose Constitution contains a provision on consumer protection</option>
          <option value="2" className="option_2" disabled>Countries with a specific law(s) on consumer protection</option>
          <option value="3" className="option_3" disabled>Countries with a main consumer protection authority/agency</option>
          <option value="4" className="option_4" disabled>Countries with a law/decree that governs the main consumer protection authority/agency</option>
          <option value="5" className="option_5" disabled>Countries with non-governmental consumer organizations/associations</option>
          <option value="6" className="option_6" disabled>Countries with Cross-border out-of-court alternative consumer dispute resolution initiatives</option>
          <option value="7" className="option_7" disabled>Countries that carry out information and education initiatives</option>
          <option value="8" className="option_8" disabled>Countries that conduct research and analysis on consumer protection issues</option>
          <option value="9" className="option_9" disabled>Countries with experience in cross-border cooperation on enforcement</option>
          <option value="10" className="option_10" disabled>Countries where the agency carries out initiatives for vulnerable and disadvantaged consumers</option>
        </select>
        <div className="instructions">Change the question above to see the answers in the visualisations below.</div>
      </div>
      <div className="map_container">
        <ChartContainer src={`https://datawrapper.dwcdn.net/${visualisationID}`} title="" />
      </div>
      <div className="search_container hidden">
        <select onChange={(event) => changeHighlight(event)} value={selectedCountry}>
          <option value={false}>Select a country to highlight</option>
          <option value={false} disabled="disabled">– – – – –</option>
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
