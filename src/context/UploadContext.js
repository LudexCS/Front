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
    gameFile: null,
  });
  const [resourceForm, setResourceForm] = useState({
    gameId: 0,
    allowDerivation: true,
    sellerRatio: 30,
    creatorRatio: 60,
    additionalCondition: "",
    description: "",
    imageFiles: [],
    resourceFile: null,
  })

  return (
    <UploadContext.Provider value={{ gameForm, setGameForm, resourceForm, setResourceForm }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);