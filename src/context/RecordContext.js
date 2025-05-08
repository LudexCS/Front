// src/context/RecordContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getTradeInfo } from "../api/recordApi";
import { useUser } from "./UserContext";

const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
  const { user } = useUser();
  const [recordData, setRecordData] = useState(null);
  const [isFetch, setIsFetch] = useState(false);

  useEffect(() => {
    const fetchTradeInfo = async () => {
      if (!user?.email) return;
      try {
        const data = await getTradeInfo(user.email);
        setRecordData(data);
      } catch (err) {
        console.error("거래 정보 조회 실패:", err);
      }
    };

    fetchTradeInfo();
  }, [user, isFetch]);

  return (
    <RecordContext.Provider value={{ recordData, setIsFetch }}>
      {children}
    </RecordContext.Provider>
  );
};

export const useRecord = () => useContext(RecordContext);