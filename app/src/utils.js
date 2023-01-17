import { useState, useEffect } from "react";

// TODO: update domain based on env
export const endpoint = (route) => "http://localhost:5050/" + route;

export const json = (res) => res.json();

export const useStorageState = (initialState, formKey) => {
  const existingState = JSON.parse(localStorage.getItem(formKey));
  const [state, setState] = useState(existingState || initialState);

  // Persist all state changes to localStorage
  useEffect(() => {
    localStorage.setItem(formKey, JSON.stringify(state));
  }, [state, formKey]);

  return [state, setState];
};

// TODO: transform from the server
export const transformId = (obj) => ({ ...obj, id: obj._id });
