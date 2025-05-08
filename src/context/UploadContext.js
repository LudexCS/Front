import React, { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [gameForm, setGameForm] = useState({
    title: "",
    price: "",
    description: "",
    tags: [],
    requirements: [],
    originGameIds: [],
  });

  return (
    <UploadContext.Provider value={{ gameForm, setGameForm }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);