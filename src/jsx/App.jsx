import React, { useState, useEffect, useRef } from 'react';
import './../styles/styles.less';

// https://d3js.org/
import * as d3 from 'd3';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import IsVisible from 'react-is-visible';

// https://www.npmjs.com/package/react-tooltip
import ReactTooltip from 'react-tooltip';

// https://www.npmjs.com/package/react-circle-flags
import { CircleFlag } from 'react-circle-flags'

// https://www.highcharts.com/
// import Highcharts from 'highcharts';
// import highchartsAccessibility from 'highcharts/modules/accessibility';
// highchartsAccessibility(Highcharts);
// import highchartsExporting from 'highcharts/modules/exporting';
// highchartsExporting(Highcharts);

// Load helpers.
import formatNr from './helpers/formatNr.js';
import roundNr from './helpers/roundNr.js';

const App = () => {
  // Data states.
  const [data, setData] = useState(false);
  const [countries, setCountries] = useState(false);
  const [selectedCountry, setselectedCountry] = useState(false);
  
  useEffect(() => {
    const data_file = (window.location.href.includes('unctad.org')) ? '/sites/default/files/data-file/2022-wcp.json' : './media/data/data.json';
    try {
      d3.json(data_file).then((json_data) => {
        setData(cleanData(json_data));
        setCountries(getCountries(json_data));
      });
    }
    catch (error) {
      console.error(error);
    }
  }, []);

  const getCountries = (json_data) => {
    return json_data.map((el) => {
      return {
        country_code: el['Code2Digit'],
        country: el['Country name']
      }
    });
  }

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
    }

    json_data.forEach((el) => {
      Object.keys(tmp_data).forEach(element => {
        tmp_data[element].push({
          answer: el[element],
          country: el['Country name'],
          country_code: el['Code2Digit']
        });
      });
    });
    return tmp_data;
  }

  useEffect(() => {
    ReactTooltip.rebuild();
    createVis();
  }, [data]);

  const createVis = (container) => {
    if (container) {
      const vis_container = d3.select('.' + container + ':not(.visualised)');
      ['answer_yes', 'answer_no', 'no_answer'].forEach(el => {
        vis_container.selectAll('.' + el + ' img')
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
          .style('opacity', d => 1);
      });
      vis_container.classed('visualised', true);
    }
  }

  const changeHighlight = () => {
    document.querySelectorAll('.' + 'flag_container').forEach((el) => {
      el.classList.remove('highlighted');
      if (event.target.value === selectedCountry) {
        el.classList.remove('background');
      }
      else if (el.classList.contains(event.target.value)) {
        el.classList.remove('background');
        el.classList.add('highlighted');
      }
      else if (event.target.value !== '') {
        el.classList.add('background');
      }
      else {
        el.classList.remove('background');
      }
    });
    setselectedCountry((event.target.value === selectedCountry) ? '' : event.target.value);
  }

  return (
    <div className={'app'}>
      <div className={'search_container'}>
        <h3>Highlight a country</h3>
        <select onChange={() => changeHighlight()} value={selectedCountry}>
          <option value={''}>Select a country to highlight</option>
          <option value={''} disabled={true}>– – – – –</option>
          {
            countries && countries.map((el, i) => <option key={i} value={el.country_code}>{el.country}</option>)
          }
        </select>
      </div>
      <div className={'vis_container'}>
        {
          data && Object.keys(data).map((element, i) => {
            return (
              <div key={element} className={'element_' + i + ' ' + 'element_container'}>
                <h3>{element}</h3>
                <IsVisible once>
                  {(isVisible) => 
                    <div className={'answer_yes'}>
                      {isVisible && createVis('element_' + i)}
                      <h4>Yes, {data[element].filter(el => el.answer === 1).length} countries</h4>
                      {
                        data[element].map((el, j) => {
                          if (el.answer === 1) {
                            return <button className={'flag_container' + ' ' + el.country_code} key={i + '_' + j} data-tip={el.country} onClick={() => changeHighlight()} value={el.country_code}><CircleFlag data-tip={el.country} height={0} countryCode={el.country_code.toLowerCase()} value={el.country_code} /></button>
                          }
                        })
                      }
                    </div>
                  }
                </IsVisible>
                <div className={'answer_no'}>
                  <h4>No, {data[element].filter(el => el.answer === 0).length} countries</h4>
                  {
                    data[element].map((el, j) => {
                      if (el.answer === 0) {
                        return <button className={'flag_container' + ' ' + el.country_code} key={i + '_' + j} data-tip={el.country} onClick={() => changeHighlight()} value={el.country_code}><CircleFlag data-tip={el.country} height={0} countryCode={el.country_code.toLowerCase()} value={el.country_code} /></button>
                      }
                    })
                  }
                </div>
                <div className={'no_answer'}>
                  <h4>No answer, {data[element].filter(el => el.answer === null).length} countries</h4>
                  {
                    data[element].map((el, j) => {
                      if (el.answer === null) {
                        return <button className={'flag_container' + ' ' + el.country_code} key={i + '_' + j} data-tip={el.country} onClick={() => changeHighlight()} value={el.country_code}><CircleFlag data-tip={el.country} height={0} countryCode={el.country_code.toLowerCase()} value={el.country_code} /></button>
                      }
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      <ReactTooltip place="top" type="dark" effect="solid"/>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
};

export default App;
