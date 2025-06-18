// src/context/RecordContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getTradeInfo } from "../api/recordApi";
import { useUser } from "./UserContext";

const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
  const { isLoggedIn } = useUser();
  const [recordData, setRecordData] = useState({
    purchased: {
      games: [],
      resources: []
    },
    sold: {
      games: []
    }
  });
  const [isFetch, setIsFetch] = useState(false);// 게임등록, 게임구매 시 변경

  useEffect(() => {
    const fetchTradeInfo = async () => {
      if (!isLoggedIn) return;
      try {
        const data = await getTradeInfo();
        setRecordData(data);
      } catch (err) {
        // console.error("거래 정보 조회 실패:", err);
      }
    };

    fetchTradeInfo();
  }, [isLoggedIn, isFetch]);

  return (
    <RecordContext.Provider value={{ recordData, setIsFetch, isFetch }}>
      {children}
    </RecordContext.Provider>
  );
};

export const useRecord = () => useContext(RecordContext);