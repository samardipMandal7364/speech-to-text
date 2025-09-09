import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en-US');
  const [audioLevel, setAudioLevel] = useState(0);
  const [threshold, setThreshold] = useState(0.1); // Default threshold (0-1 scale)
  const [isThresholdMode, setIsThresholdMode] = useState(false);
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);
  
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
    } else {
      setIsSupported(false);
      setError('Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }
  }, []);

  // Initialize audio context for level monitoring
  const initializeAudioContext = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      microphoneRef.current = microphone;
      
      return true;
    } catch (err) {
      setError('Failed to access microphone for audio level monitoring');
      return false;
    }
  }, []);

  // Monitor audio levels
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate RMS (Root Mean Square) for more accurate volume detection
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / bufferLength);
      const normalizedLevel = rms / 255; // Normalize to 0-1 range
      
      setAudioLevel(normalizedLevel);
      
      // Check threshold
      const aboveThreshold = normalizedLevel > threshold;
      setIsAboveThreshold(aboveThreshold);
      
      // Auto-start/stop recognition based on threshold
      if (isThresholdMode && recognitionRef.current) {
        if (aboveThreshold && !isListening) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            // Recognition might already be starting, ignore this error
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  }, [threshold, isThresholdMode, isListening]);

  // Start audio monitoring
  const startAudioMonitoring = useCallback(async () => {
    if (!audioContextRef.current) {
      const success = await initializeAudioContext();
      if (!success) return false;
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    monitorAudioLevel();
    return true;
  }, [initializeAudioContext, monitorAudioLevel]);

  // Stop audio monitoring
  const stopAudioMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioLevel(0);
    setIsAboveThreshold(false);
  }, []);

  // Configure speech recognition
  useEffect(() => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let interimTranscriptTemp = '';
      let finalTranscriptTemp = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptTemp += transcript + ' ';
        } else {
          interimTranscriptTemp += transcript;
        }
      }

      finalTranscriptRef.current = finalTranscriptTemp;
      setTranscript(finalTranscriptTemp);
      setInterimTranscript(interimTranscriptTemp);
    };

    return () => {
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
    };
  }, [language]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || !isSupported) return;
    
    try {
      setError(null);
      
      if (isThresholdMode) {
        // In threshold mode, start audio monitoring and let it trigger recognition
        const success = await startAudioMonitoring();
        if (!success) return;
      } else {
        // In manual mode, start recognition immediately
        recognitionRef.current.start();
      }
    } catch (err) {
      setError('Failed to start speech recognition');
    }
  }, [isSupported, isThresholdMode, startAudioMonitoring]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    recognitionRef.current.stop();
    
    if (isThresholdMode) {
      stopAudioMonitoring();
    }
  }, [isThresholdMode, stopAudioMonitoring]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
  }, []);

  const changeLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    if (isListening) {
      stopListening();
    }
  }, [isListening, stopListening]);

  const setThresholdMode = useCallback((enabled) => {
    setIsThresholdMode(enabled);
    if (isListening) {
      stopListening();
    }
  }, [isListening, stopListening]);

  const updateThreshold = useCallback((newThreshold) => {
    setThreshold(Math.max(0, Math.min(1, newThreshold))); // Clamp between 0 and 1
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
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
    updateThreshold
  };
};

export default useSpeechRecognition;
