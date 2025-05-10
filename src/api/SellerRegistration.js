// import * as ludex from "ludex";

// const chainConfig = {
//   chainId: `0x${(31337).toString(16)}`,
//   chainName: "Hardhat",
//   rpcUrls: ["http://localhost:8545"],
//   nativeCurrency: {
//     name: "ETH",
//     symbol: "ETH",
//     decimals: 18
//   }
// };

// let contractsMap = null;
// let ludexConfig = null;

// export async function ensureSellerRegistration(sellerAddress) {
//   if (!contractsMap) {
//     const res = await fetch("http://localhost:3000/contracts");
//     contractsMap = await res.json();

//     ludexConfig = {
//       storeAddress: contractsMap["Store"].address,
//       priceTableAddress: contractsMap["PriceTable"].address,
//       ledgerAddress: contractsMap["Ledger"].address,
//       sellerRegistryAddress: contractsMap["SellerRegistry"].address,
//       itemRegistryAddress: contractsMap["ItemRegistry"].address
//     };
//   }

//   const connection = await ludex.BrowserWalletConnection.create(chainConfig);
//   const signer = await connection.getSigner();

//   const facade = ludex.facade.createWeb3UserFacade(
//     chainConfig,
//     ludexConfig,
//     signer,
//     ludex.Address.create(contractsMap["ERC2771Forwarder"].address)
//   );

//   const sellerRegistry = facade.metaTXAccessSellerRegistry();

//   const isActive = await sellerRegistry
//     .isActiveSeller(ludex.Address.create(sellerAddress))
//     .catch(() => false);

//   if (isActive) return true;

//   const relayRequest = await sellerRegistry.registerSellerRequest(
//     [ludex.Address.create(contractsMap["MockUSDC"].address)],
//     BigInt(3_000_000)
//   );

//   const relayResponse = await fetch("/api/relay", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: ludex.relay.serializeRelayRequest(relayRequest)
//   });

//   const { args, error } = await relayResponse.json();

//   if (error) {
//     console.error("Relay registration failed:", error.message);
//     return false;
//   }

//   const success = relayRequest.onResponse(args);
//   return success;
// }