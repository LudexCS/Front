import React, { createContext, useContext, useEffect, useState } from "react";
import { getConfig } from "../api/walletAuth";
import * as ludex from "ludex";

const ConfigContext = createContext({
    chainConfig: null,
    ludexConfig: null,
});

const ConfigProvider = ({ children }) => {
    const [chainConfig, setChainConfig] = useState<ludex.configs.ChainConfig | null>null;
    const [ludexConfig, setLudexConfig] = useState<ludex.configs.LudexConfig | null>null;

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