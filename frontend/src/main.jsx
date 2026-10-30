// The first file that runs. It puts the <App/> into index.html.
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { applyPreferences } from './api.js';
import './style.css';

applyPreferences(); // sets saved theme (light/dark) and font size
createRoot(document.getElementById('root')).render(<App />);
