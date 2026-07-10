import { useRef } from 'react';

import Article from '../Article.mdx';

import ConsumerProtectionExplorer from './components/ConsumerProtectionExplorer.jsx';

import './../styles/styles.css';

const components = {
  ConsumerProtectionExplorer
};

const App = () => {
  const appRef = useRef();

  window.appRef = appRef;

  return (
    <div className="app" ref={appRef}>
      <Article components={components} />
    </div>
  );
};

export default App;
