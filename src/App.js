import React from 'react';
import './App.css';
import SpeechToText from './components/SpeechToText';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Speech to Text</h1>
        <p>Convert your speech to text using the Web Speech API</p>
      </header>
      <main>
        <SpeechToText />
      </main>
    </div>
  );
}

export default App;
