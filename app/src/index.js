import React from "react";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import ReactDOM from "react-dom/client";
import App from "./App";
import ContextWrapper from "./ContextWrapper";

const theme = responsiveFontSizes(createTheme());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ContextWrapper>
        <App />
      </ContextWrapper>
    </ThemeProvider>
  </React.StrictMode>
);
