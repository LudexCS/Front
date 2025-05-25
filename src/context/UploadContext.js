import React, { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [gameForm, setGameForm] = useState({
    title: "",
    titleKo: "",
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
    creatorRatio: 70,
    additionalCondition: "",
    description: "",
    imageFiles: [],
    resourceFile: null,
  })
  const [sharerIds, setSharerIds] = useState([]);

  return (
    <UploadContext.Provider value={{ gameForm, setGameForm, resourceForm, setResourceForm, sharerIds, setSharerIds }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);