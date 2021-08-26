import {
  BrowserRouter as Router, 
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import './App.css';
import Catalog from './Catalog.js'

function App() {
  return (
    <Router> <div className="App">
      <Switch>
        <Route path='/catalog'>
          <Catalog isLibrarian={false} />
        </Route>
        <Route path='/librarian'>
          <Catalog isLibrarian={true} />
        </Route>
        <Redirect to='/catalog' />
      </Switch>
    </div> </Router>
  );
}

export default App;
