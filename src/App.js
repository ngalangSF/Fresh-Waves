import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav className="Nav-bar">
            <Link className=".App-logo" to='/'>
              <img src="/assets/images/fresh-waves-logo.jpg" alt="Fresh Waves Logo" width="160" height="100"/>
            </Link>
            <Link className="Home" to='/'>Home</Link>
            <Link className="Library" to='/library'>Library</Link>
          </nav>
          <h1 className="App-title">Fresh Waves</h1>
        </header>
        <main>
          <Route exact path="/" component={Landing} />
          <Route path="/library" component={Library} />
          <Route path="/album/:slug" component={Album} />
        </main>
      </div>
    );
  }
}

export default App;
