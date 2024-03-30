import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TasksContextProvider } from './context/TaskContext';
import { AuthContextProvider } from './context/AuthContext';
import { ThemeProvider } from "@material-tailwind/react";
import '../src/style/App.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <TasksContextProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </TasksContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

