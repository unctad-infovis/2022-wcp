// https://d3js.org/
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import loadFile from './../helpers/LoadFile.js';
import useIsVisible from '@unctad-infovis/general-tools/helpers/UseIsVisible.js';
import CountryButton from './CountryButton.jsx';
import ChartDataWrapper from './general/ChartDataWrapper.jsx';

import './ConsumerProtectionExplorer.css';

const appID = '#app-root-2022-wcp';

const QUESTIONS = [
  'Countries that have designated a consumer protection contact point',
  'Countries whose constitution contains a provision on consumer protection',
  'Countries with a specific law(s) on consumer protection',
  'Countries with a main consumer protection authority/agency',
  'Countries with a law/decree that governs the main consumer protection authority/agency',
  'Countries with non-governmental consumer organizations/associations',
  'Countries with experience in cross-border cooperation on enforcement',
  'Countries that carry out information and education initiatives',
  'Countries that conduct research and analysis on consumer protection issues',
  'Countries with cross-border out-of-court alternative consumer dispute resolution initiatives',
  'Countries where the agency carries out initiatives for vulnerable and disadvantaged consumers'
];

const VIS_IDS = ['PlvBz', 'jFPjd', 'sIY50', 'Xo8op', 'wSZ11', 'J3v5V', 'Hn4lH', 'NOJK0', 'XZyxw', '1fuTH', 'w9i80'];

const cleanData = json_data => {
  const tmp_data = {};
  QUESTIONS.forEach(question => {
    tmp_data[question] = [];
  });

  json_data.forEach(el => {
    QUESTIONS.forEach(question => {
      tmp_data[question].push({
        answer: el[question],
        country: el['Country name'],
        country_code: el.Code2Digit
      });
    });
  });
  return tmp_data;
};

const getCountries = json_data =>
  json_data.map(el =>
    Object({
      country_code: el.Code2Digit,
      country: el['Country name']
    })
  );

function QuestionBlock({ index, entries, changeHighlight }) {
  const [setBlockNode, isVisible, blockNode] = useIsVisible(0.3);

  useEffect(() => {
    if (!isVisible || !blockNode) return;
    ['answer_yes', 'answer_no', 'no_answer'].forEach(group => {
      d3.select(blockNode)
        .selectAll(`.${group} img`)
        .style('height', 0)
        .style('width', 0)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .delay((_d, i) => 30 * i)
        .style('height', '50px')
        .style('width', '50px')
        .ease(d3.easeBounceOut)
        .transition()
        .duration(200)
        .delay((_d, i) => 30 * i)
        .style('height', '30px')
        .style('width', '30px')
        .ease(d3.easeBounceOut)
        .style('opacity', 1);
    });
  }, [isVisible, blockNode]);

  const yes = entries.filter(el => el.answer === 1);
  const no = entries.filter(el => el.answer === 0);
  const noAnswer = entries.filter(el => el.answer === null);

  return (
    <div ref={setBlockNode} className={`element_${index} element_container`}>
      <div className="answer_yes">
        <h4>{`Yes, ${yes.length} countries`}</h4>
        {yes.map(el => (
          <CountryButton key={el.country_code} el={el} changeHighlight={changeHighlight} />
        ))}
      </div>
      <div className="answer_no">
        <h4>{`No, ${no.length} countries`}</h4>
        {no.map(el => (
          <CountryButton key={el.country_code} el={el} changeHighlight={changeHighlight} />
        ))}
      </div>
      <div className="no_answer">
        <h4>{`No answer, ${noAnswer.length} countries`}</h4>
        {noAnswer.map(el => (
          <CountryButton key={el.country_code} el={el} changeHighlight={changeHighlight} />
        ))}
      </div>
    </div>
  );
}

function ConsumerProtectionExplorer() {
  const [data, setData] = useState(null);
  const [countries, setCountries] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(false);
  const [visualisationID, setVisualisationID] = useState('PlvBz');

  useEffect(() => {
    loadFile('assets/data/2022-wcp_data.json').then(json => {
      if (json) {
        const json_data = JSON.parse(json);
        setData(cleanData(json_data));
        setCountries(getCountries(json_data));
      }
    });
  }, []);

  const changeQuestion = event_target => {
    document.querySelectorAll(`${appID} .element_container`).forEach(el => {
      el.style.display = 'none';
      el.style.opacity = 0;
    });
    if (document.querySelector(`${appID} .element_${event_target.value}`) !== null) {
      document.querySelector(`${appID} .element_${event_target.value}`).style.display = 'block';
      document.querySelector(`${appID} .element_${event_target.value}`).style.opacity = 1;
      setVisualisationID(VIS_IDS[event_target.value]);
    }
  };

  const changeHighlight = event => {
    document.querySelectorAll(`${appID} .flag_container`).forEach(el => {
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
    setSelectedCountry(event.target.value === selectedCountry ? '' : event.target.value);
  };

  return (
    <div className="consumer_protection_explorer">
      <h2>Highlighted questions</h2>
      <div className="change_question">
        <select onChange={event => changeQuestion(event.target)} defaultValue="0">
          {QUESTIONS.map((question, i) => (
            <option key={question} value={i} className={`option_${i}`}>
              {question}
            </option>
          ))}
        </select>
        <div className="instructions">Change the question above to see the answers in the visualisations below.</div>
      </div>
      <div className="map_container">{visualisationID !== 'false' && visualisationID !== '' && <ChartDataWrapper key={visualisationID} chart_id={visualisationID} />}</div>
      {/* Hidden for a reason */}
      <div className="search_container hidden">
        <select onChange={event => changeHighlight(event)} value={selectedCountry}>
          <option value={false}>Select a country to highlight</option>
          <option value={false} disabled="disabled">
            – – – – –
          </option>
          {countries?.map(el => (
            <option key={el.country_code} value={el.country_code}>
              {el.country}
            </option>
          ))}
        </select>
      </div>
      <div className="vis_container">{data && QUESTIONS.map((question, i) => <QuestionBlock key={question} index={i} entries={data[question]} changeHighlight={changeHighlight} />)}</div>
      <div className="chart_container">
        <ChartDataWrapper chart_id="8zI1Z" />
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default ConsumerProtectionExplorer;
