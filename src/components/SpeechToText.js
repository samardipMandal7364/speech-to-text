import React, { useState } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import './SpeechToText.css';

const SpeechToText = () => {
  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    language,
    audioLevel,
    threshold,
    isThresholdMode,
    isAboveThreshold,
    startListening,
    stopListening,
    resetTranscript,
    changeLanguage,
    setThresholdMode,
    updateThreshold,
    setManualTranscript
  } = useSpeechRecognition();

  const [showSettings, setShowSettings] = useState(false);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'hi-IN', name: 'Hindi' }
  ];

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTranscriptChange = (e) => {
    if (!isListening) {
      // Allow manual editing only when not listening
      const newValue = e.target.value;
      setManualTranscript(newValue);
    }
  };

  // const handleCopyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(transcript);
  //     // You could add a toast notification here
  //     alert('Text copied to clipboard!');
  //   } catch (err) {
  //     console.error('Failed to copy text: ', err);
  //     alert('Failed to copy text to clipboard');
  //   }
  // };

  // const handleDownloadText = () => {
  //   if (!transcript.trim()) return;
    
  //   const element = document.createElement('a');
  //   const file = new Blob([transcript], { type: 'text/plain' });
  //   element.href = URL.createObjectURL(file);
  //   element.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // };

  if (!isSupported) {
    return (
      <div className="speech-to-text">
        <div className="error-container">
          <div className="error-icon">🚫</div>
          <h2>Speech Recognition Not Supported</h2>
          <p>
            Your browser doesn't support the Web Speech API. 
            Please use a supported browser like Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="speech-to-text">
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button 
            className="error-close"
            onClick={() => window.location.reload()}
          >
            ↻ Retry
          </button>
        </div>
      )}

      <div className="controls-section">
        <div className="main-controls">
          <button
            className={`record-button ${isListening ? 'recording' : ''}`}
            onClick={handleToggleListening}
            disabled={!!error}
          >
            <span className="record-icon">
              {isListening ? '⏹️' : '🎤'}
            </span>
            {isListening ? 'Stop Recording' : 'Start Recording'}
          </button>

          <button
            className="reset-button"
            onClick={resetTranscript}
            disabled={!transcript.trim()}
          >
            🗑️ Clear
          </button>

          {/* <button
            className="settings-button"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️ Settings
          </button> */}
        </div>

        {/* {showSettings && (
          <div className="settings-panel">
            <div className="setting-group">
              <label htmlFor="language-select">Language:</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isThresholdMode}
                  onChange={(e) => setThresholdMode(e.target.checked)}
                  className="threshold-checkbox"
                />
                <span className="checkmark"></span>
                Threshold Mode (Auto-start on sound)
              </label>
            </div>
            
            {isThresholdMode && (
              <div className="setting-group">
                <label htmlFor="threshold-slider">
                  Sensitivity Threshold: {Math.round(threshold * 100)}%
                </label>
                <input
                  id="threshold-slider"
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={threshold}
                  onChange={(e) => updateThreshold(parseFloat(e.target.value))}
                  className="threshold-slider"
                />
                <div className="threshold-help">
                  Lower values = more sensitive to quiet sounds
                </div>
              </div>
            )}
          </div>
        )} */}

        <div className="status-indicator">
          <div className={`status-dot ${isListening ? 'listening' : 'idle'}`}></div>
          <span className="status-text">
            {isThresholdMode 
              ? (isAboveThreshold ? 'Sound detected!' : 'Waiting for sound...') 
              : (isListening ? 'Listening...' : 'Ready to listen')
            }
          </span>
        </div>

        {/* {isThresholdMode && (
          <div className="audio-level-display">
            <div className="level-label">Audio Level:</div>
            <div className="level-bar-container">
              <div 
                className="level-bar"
                style={{ width: `${audioLevel * 100}%` }}
              ></div>
              <div 
                className="threshold-line"
                style={{ left: `${threshold * 100}%` }}
                title={`Threshold: ${Math.round(threshold * 100)}%`}
              ></div>
            </div>
            <div className="level-status">
              <span className={`threshold-status ${isAboveThreshold ? 'active' : 'inactive'}`}>
                {isAboveThreshold ? '🔊' : '🔇'} 
                {isAboveThreshold ? ' Above threshold' : ' Below threshold'}
              </span>
            </div>
          </div>
        )} */}
      </div>

        <div className="transcript-section">
          <div className="transcript-header">
            <h3>Speech to Text</h3>
          </div>

          <div className="input-container">
            <textarea
              className="transcript-input"
              value={transcript + (interimTranscript ? ` ${interimTranscript}` : '')}
              onChange={handleTranscriptChange}
              placeholder={isListening ? "Listening... speak now" : "Click 'Start Recording' and begin speaking. Your speech will appear here."}
              rows={8}
              readOnly={isListening} // Make read-only while listening to prevent conflicts
            />
            
            {/* {interimTranscript && (
              <div className="interim-indicator">
                <span className="interim-text">Processing: "{interimTranscript}"</span>
              </div>
            )} */}
          </div>

          {transcript && (
            <div className="transcript-stats">
              <span>Words: {transcript.trim().split(/\s+/).filter(word => word.length > 0).length}</span>
              <span>Characters: {transcript.length}</span>
            </div>
          )}
        </div>
    </div>
  );
};

export default SpeechToText;
