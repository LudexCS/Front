import React, { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [gameForm, setGameForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "origin",
    tags: [],
    requirements: [],
    originGameIds: [],
    thumbnail: null, // { url, description }
    mediaFiles: [],  // [{ url, description }]
  });

  return (
    <UploadContext.Provider value={{ gameForm, setGameForm }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);