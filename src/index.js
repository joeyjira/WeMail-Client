import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Components/root.js';

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");

  ReactDOM.render(
    <Root />,
    root
  )
})
