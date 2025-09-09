# Speech to Text React App

A modern, responsive React application that converts speech to text using the Web Speech API. Features real-time transcription, multiple language support, and a beautiful user interface.

## Features

- 🎤 **Real-time Speech Recognition**: Convert speech to text in real-time
- 🌍 **Multi-language Support**: Support for 13+ languages including English, Spanish, French, German, Japanese, Chinese, and more
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 💾 **Export Options**: Copy to clipboard or download transcript as text file
- ⚙️ **Customizable Settings**: Change recognition language on the fly
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🔍 **Word/Character Count**: Real-time statistics of your transcript
- ⚠️ **Error Handling**: Comprehensive error handling and browser compatibility checks

## Browser Compatibility

This app uses the Web Speech API, which is supported in:
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Safari
- ❌ Firefox (limited support)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd speech-scynthesis
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Usage

1. **Start Recording**: Click the "Start Recording" button to begin speech recognition
2. **Speak**: Start speaking clearly into your microphone
3. **View Transcript**: Your speech will appear in real-time in the transcript area
4. **Stop Recording**: Click "Stop Recording" when finished
5. **Copy/Download**: Use the action buttons to copy text or download as a file
6. **Change Language**: Use the settings panel to switch between supported languages
7. **Clear**: Use the clear button to reset the transcript

## Supported Languages

- English (US/UK)
- Spanish
- French
- German
- Italian
- Japanese
- Korean
- Chinese (Simplified)
- Portuguese (Brazil)
- Russian
- Arabic
- Hindi

## Technical Details

### Architecture

- **Custom Hook**: `useSpeechRecognition` encapsulates all speech recognition logic
- **Component-based**: Modular React components for maintainability
- **Error Boundaries**: Comprehensive error handling for better UX
- **Responsive CSS**: Mobile-first design with modern CSS features

### Key Files

- `src/hooks/useSpeechRecognition.js` - Custom hook for speech recognition
- `src/components/SpeechToText.js` - Main UI component
- `src/components/SpeechToText.css` - Styling and responsive design

### Web Speech API Features Used

- **Continuous Recognition**: Keeps listening until manually stopped
- **Interim Results**: Shows partial results while speaking
- **Language Support**: Dynamic language switching
- **Error Handling**: Comprehensive error event handling

## Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

## Customization

### Adding New Languages

To add support for additional languages, update the `languages` array in `SpeechToText.js`:

```javascript
const languages = [
  // ... existing languages
  { code: 'your-language-code', name: 'Your Language Name' }
];
```

### Styling

The app uses CSS custom properties and modern CSS features. Key styling files:
- `src/index.css` - Global styles and CSS reset
- `src/App.css` - App-level styling
- `src/components/SpeechToText.css` - Component-specific styles

## Troubleshooting

### Common Issues

1. **Microphone not working**: Ensure you've granted microphone permissions
2. **No speech detected**: Check microphone settings and speak clearly
3. **Browser not supported**: Use Chrome, Edge, or Safari for best results
4. **Recognition stops unexpectedly**: This can happen due to network issues or browser limitations

### Tips for Better Recognition

- Speak clearly and at a moderate pace
- Use a good quality microphone
- Minimize background noise
- Ensure stable internet connection
- Use supported browsers for best results

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with React and the Web Speech API
- Inspired by modern voice-to-text applications
- Uses Create React App for development setup
