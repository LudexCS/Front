import React, { createContext, useContext, useEffect, useState } from "react";
import { getConfig } from "../api/walletAuth";

const ConfigContext = createContext({
    chainConfig: null,
    ludexConfig: null,
});

const ConfigProvider = ({ children }) => {
    const [chainConfig, setChainConfig] = useState(null);
    const [ludexConfig, setLudexConfig] = useState(null);

    useEffect(() => {
        (async () => {
            const config = await getConfig();
            if (config) {
                setChainConfig(config.chainConfig);
                setLudexConfig(config.ludexConfig);
            }
        })();
    }, []);

    return (
        <ConfigContext.Provider value={{ chainConfig, ludexConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export default ConfigProvider;

export const useConfig = () => useContext(ConfigContext);