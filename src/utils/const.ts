import { Ntt } from "@wormhole-foundation/sdk-definitions-ntt";
import { Chain, encoding } from "@wormhole-foundation/sdk";

export type NttContracts = {
  [key in Chain]?: Ntt.Contracts;
};

export const DEVNET_SOL_PRIVATE_KEY = encoding.b58.encode(
  new Uint8Array(
    [218,95 //.. rest of the key
    ])
);
export const DEVNET_ETH_PRIVATE_KEY =
  "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"; // Ganache default private key

export const TEST_NTT_TOKENS: NttContracts = {
  Sepolia: {
    token: "0xeB5a5d39dE4Ea42C2Aa6A57EcA2894376683bB8E",
    manager: "0x1Ca5060BF142c58168aEdb974aABb020BC081A56",
    transceiver: {
      wormhole: "0x62d1286683507939c065C12f2d1E80cCa8CCD125",
    }
  },
  Mezo: {
    token: "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503",
    manager: "0x20888B20e2F5F405d44261dA96467a1b1acE15be",
    transceiver: { 
      wormhole: "0x3106675EDE4A64d70131247466FD8704A3d42123" 
    },
  },
};