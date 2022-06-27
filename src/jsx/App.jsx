import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'
import style from './../styles/styles.less';

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
  
  useEffect(() => {
    const data_file = (window.location.href.includes('unctad.org')) ? '/sites/default/files/data-file/2022-wcp.json' : './data/data.json';
    try {
      d3.json(data_file).then((json_data) => {
        setData(cleanData(json_data));
      });
    }
    catch (error) {
      console.error(error);
    }
  }, []);

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
      Object.keys(tmp_data).forEach(question => {
        tmp_data[question].push({
          answer: el[question],
          country: el['Country name'],
          country_code: el['Code2Digit']
        });
      });
    });
    return tmp_data;
  }

  useEffect(() => {
    createVis();
  }, [data]);

  const createVis = (container) => {
    ReactTooltip.rebuild()
    const vis_container = d3.select('.' + container);
    [style.answer_yes, style.answer_no, style.no_answer].forEach(el => {
      vis_container.selectAll('.' + el + ' img')
        .style('opacity', 0)
        .style('height', 0)
        .style('width', 0)
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
        .style('opacity', d => 1)
    });
  }

  return (
    <div className={style.app}>
      <div className={style.vis_container}>
        {
          data && Object.keys(data).map((question, i) => {
            return (
              <div key={question} className={'question_' + i + ' ' + style.question_container}>
                <h3>{question}</h3>
                <IsVisible once>
                  {(isVisible) => 
                    <div className={style.answer_yes}>
                      {isVisible && createVis('question_' + i)}
                      <h4>Yes, {data[question].filter(el => el.answer === 1).length} countries</h4>
                      {
                        data[question].map((el, j) => {
                          if (el.answer === 1) {
                            return <div className={style.flag_container} key={i + '_' + j} data-tip={el.country}><CircleFlag data-tip={el.country} height={0} countryCode={el.country_code.toLowerCase()} /></div>
                          }
                        })
                      }
                    </div>
                  }
                </IsVisible>
                <div className={style.answer_no}>
                  <h4>No, {data[question].filter(el => el.answer === 0).length} countries</h4>
                  {
                    data[question].map((el, j) => {
                      if (el.answer === 0) {
                        return <div className={style.flag_container} key={i + '_' + j} data-tip={el.country}><CircleFlag data-tip={el.country} height={0} countryCode={el.country_code.toLowerCase()} /></div>
                      }
                    })
                  }
                </div>
                <div className={style.no_answer}>
                  <h4>No answer, {data[question].filter(el => el.answer === null).length} countries</h4>
                  {
                    data[question].map((el, j) => {
                      if (el.answer === null) {
                        return <div className={style.flag_container} key={i + '_' + j} data-tip={el.country}><CircleFlag data-tip={el.country} height={0} countryCode={el.country_code.toLowerCase()} /></div>
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
