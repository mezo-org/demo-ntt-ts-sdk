import { Ntt } from "@wormhole-foundation/sdk-definitions-ntt";
import { Chain } from "@wormhole-foundation/sdk";

export type NttContracts = {
  [key in Chain]?: Ntt.Contracts;
};

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

export const NTT_TOKENS: NttContracts = {
  Ethereum: {
    token: "0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186",
    manager: "0x5293158bf7a81ED05418DA497a80F7e6Dbf4477E",
    transceiver: {
      wormhole: "0x76ddB3f1dDe02391Ef0A28664499B74C29d18d3E",
    }
  },
  Mezo: {
    token: "0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186",
    manager: "0x7efb386675d75280D39Aae42964A6776DE0ee0bD",
    transceiver: { 
      wormhole: "0x56E27f1A8425515FFD4BD76A254Ac1a5c0B66D71" 
    },
  },
};