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
  const [resourceForm, setResourceForm] = useState({
    allowDerivation: true,
    sellerRatio: 30,
    creatorRatio: 60,
    additionalCondition: "",
    description: ""
  })

  return (
    <UploadContext.Provider value={{ gameForm, setGameForm, resourceForm, setResourceForm }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);