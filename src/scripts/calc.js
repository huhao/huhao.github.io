import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Import CSS
import '../styles/paper.css';
import '../styles/style.css';

// Import jQuery and attach to window
import $ from 'jquery';
window.jQuery = window.$ = $;

// Import html2canvas
import html2canvas from 'html2canvas';
window.html2canvas = html2canvas;

// Import plugins and scripts
import './jquery.PrintArea.js';
import './functions.js';
import './i.js';
