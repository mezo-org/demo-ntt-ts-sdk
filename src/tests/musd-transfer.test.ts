import {
  TransactionId,
  Wormhole,
  amount,
  signSendWait,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/platforms/evm";

import "@wormhole-foundation/sdk-evm-ntt";
import { TEST_NTT_TOKENS } from "../utils/const";
import { getSigner } from "../utils/helpers";

describe("MUSD Token Transfer Tests", () => {
  let wh: Wormhole<"Testnet">;
  
  beforeAll(() => {
    wh = new Wormhole("Testnet", [evm.Platform], {
      chains: {
        Sepolia: {
          rpc: process.env.SEPOLIA_RPC_URL
        },
        Mezo: {
          rpc: process.env.MEZO_TESTNET_RPC_URL
        }
      }
    });
  });

  describe("Check Balances", () => {
    it("should check if account has at least 1.5 MUSD on Sepolia", async () => {
      const src = wh.getChain("Sepolia");
      const srcSigner = await getSigner(src);
      const requiredAmount = "1.5"; //MUSD
      const ntt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });

      const balance = await getTokenBalance(src, srcSigner);
      const requiredAmountUnits = amount.units(
        amount.parse(requiredAmount, await ntt.getTokenDecimals())
      );
  
      const decimals = await ntt.getTokenDecimals();
      const balanceFormatted = Number(balance) / Math.pow(10, decimals);
      
      console.log(`Account balance: ${balanceFormatted} MUSD`);
      console.log(`Required amount: ${requiredAmount} MUSD`);
      
      // Verify account has at least 1.5 MUSD
      expect(balance).toBeGreaterThanOrEqual(requiredAmountUnits);
    });

    it("should check if account has at least 1.5 MUSD on Mezo Testnet", async () => {
      const src = wh.getChain("Mezo");
      const srcSigner = await getSigner(src);
      const requiredAmount = "1.5"; //MUSD
      const ntt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });

      const balance = await getTokenBalance(src, srcSigner);
      const requiredAmountUnits = amount.units(
        amount.parse(requiredAmount, await ntt.getTokenDecimals())
      );
  
      const decimals = await ntt.getTokenDecimals();
      const balanceFormatted = Number(balance) / Math.pow(10, decimals);
      
      console.log(`Account balance: ${balanceFormatted} MUSD`);
      console.log(`Required amount: ${requiredAmount} MUSD`);
      
      // Verify account has at least 1.5 MUSD
      expect(balance).toBeGreaterThanOrEqual(requiredAmountUnits);
    });
  });

  describe("Sepolia to Mezo Transfer", () => {
    it("should transfer 1 MUSD from Sepolia to Mezo", async () => {
      const { src, dst, srcSigner, dstSigner } = await setupChainsAndSigners("Sepolia", "Mezo");
      
      const srcInitialBalance = await getTokenBalance(src, srcSigner);
      const dstInitialBalance = await getTokenBalance(dst, dstSigner);
      console.log(`Initial balances - Source: ${srcInitialBalance}, Destination: ${dstInitialBalance}`);
      
      const amt = amount.units(
        amount.parse("1.0", 18)
      );

      await performTransfer(src, dst, srcSigner, dstSigner, amt);

      await validateBalanceChanges(src, dst, srcSigner, dstSigner, srcInitialBalance, dstInitialBalance, amt);
    });

    it("should transfer 0.5 MUSD from Sepolia to Mezo", async () => {
      const { src, dst, srcSigner, dstSigner } = await setupChainsAndSigners("Sepolia", "Mezo");
      
      const srcInitialBalance = await getTokenBalance(src, srcSigner);
      const dstInitialBalance = await getTokenBalance(dst, dstSigner);
      console.log(`Initial balances - Source: ${srcInitialBalance}, Destination: ${dstInitialBalance}`);
      
      const amt = amount.units(
        amount.parse("0.5", 18)
      );
      
      await performTransfer(src, dst, srcSigner, dstSigner, amt);

      await validateBalanceChanges(src, dst, srcSigner, dstSigner, srcInitialBalance, dstInitialBalance, amt);
    });
  });

  describe("Mezo to Sepolia Transfer", () => {
    it("should transfer 1 MUSD from Mezo to Sepolia", async () => {
      const { src, dst, srcSigner, dstSigner } = await setupChainsAndSigners("Mezo", "Sepolia");
      
      const srcInitialBalance = await getTokenBalance(src, srcSigner);
      const dstInitialBalance = await getTokenBalance(dst, dstSigner);
      console.log(`Initial balances - Source: ${srcInitialBalance}, Destination: ${dstInitialBalance}`);
      
      const amt = amount.units(
        amount.parse("1.0", 18)
      );
      
      await performTransfer(src, dst, srcSigner, dstSigner, amt);

      await validateBalanceChanges(src, dst, srcSigner, dstSigner, srcInitialBalance, dstInitialBalance, amt);
    });

    it("should transfer 0.5 MUSD from Mezo to Sepolia", async () => {
      const { src, dst, srcSigner, dstSigner } = await setupChainsAndSigners("Mezo", "Sepolia");

      const srcInitialBalance = await getTokenBalance(src, srcSigner);
      const dstInitialBalance = await getTokenBalance(dst, dstSigner);
      console.log(`Initial balances - Source: ${srcInitialBalance}, Destination: ${dstInitialBalance}`);
      
      const amt = amount.units(
        amount.parse("0.5", 18)
      );
      
      await performTransfer(src, dst, srcSigner, dstSigner, amt);

      await validateBalanceChanges(src, dst, srcSigner, dstSigner, srcInitialBalance, dstInitialBalance, amt);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle very small transfer amounts", async () => {
      const { src, dst, srcSigner, dstSigner } = await setupChainsAndSigners("Sepolia", "Mezo");

      const srcInitialBalance = await getTokenBalance(src, srcSigner);
      const dstInitialBalance = await getTokenBalance(dst, dstSigner);
      console.log(`Initial balances - Source: ${srcInitialBalance}, Destination: ${dstInitialBalance}`);
      
      const amt = amount.units(
        amount.parse("0.001", 18)
      );

      await performTransfer(src, dst, srcSigner, dstSigner, amt);

      await validateBalanceChanges(src, dst, srcSigner, dstSigner, srcInitialBalance, dstInitialBalance, amt);
    });

    it("should validate transfer with maximum precision", async () => {
      const { src, dst, srcSigner, dstSigner } = await setupChainsAndSigners("Mezo", "Sepolia");
      const srcInitialBalance = await getTokenBalance(src, srcSigner);
      const dstInitialBalance = await getTokenBalance(dst, dstSigner);
      console.log(`Initial balances - Source: ${srcInitialBalance}, Destination: ${dstInitialBalance}`);
      const amt = amount.units(
        amount.parse("0.12345678", 18)
      );
      await performTransfer(src, dst, srcSigner, dstSigner, amt);

      await validateBalanceChanges(src, dst, srcSigner, dstSigner, srcInitialBalance, dstInitialBalance, amt);
    });

    it("should handle zero amount transfer (should fail)", async () => {
      const src = wh.getChain("Sepolia");
      const dst = wh.getChain("Mezo");

      const srcSigner = await getSigner(src);
      const dstSigner = await getSigner(dst);

      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });

      const amt = amount.units(
        amount.parse("0", await srcNtt.getTokenDecimals())
      );

      const xfer = () =>
        srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
          queue: false,
          automatic: false,
          gasDropoff: 0n,
        });

      await expect(signSendWait(src, xfer(), srcSigner.signer)).rejects.toThrow();
      });
  });

  // Helper function to check token balance of an account
  async function getTokenBalance(chain: any, signer: any) {
    const rpc = await chain.getRpc();
    const tokenAddress = TEST_NTT_TOKENS[chain.chain as keyof typeof TEST_NTT_TOKENS]!.token;
    const userAddress = signer.address.address.address;
    
    // ERC20 balanceOf function call
    const balanceOfData = "0x70a08231" + (userAddress as string).slice(2).padStart(64, "0");
    const balanceResult = await rpc.call({
      to: tokenAddress,
      data: balanceOfData
    });
    const balance = BigInt(balanceResult);
    

    return balance;
  }

  // Helper function to perform a complete transfer
  async function performTransfer(
    srcChain: any, 
    dstChain: any, 
    srcSigner: any, 
    dstSigner: any, 
    amt: any
  ) {
    const srcNtt = await srcChain.getProtocol("Ntt", {
      ntt: TEST_NTT_TOKENS[srcChain.chain as keyof typeof TEST_NTT_TOKENS],
    });
    const dstNtt = await dstChain.getProtocol("Ntt", {
      ntt: TEST_NTT_TOKENS[dstChain.chain as keyof typeof TEST_NTT_TOKENS],
    });

    const xfer = () =>
      srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
        queue: false,
        automatic: false,
        gasDropoff: 0n,
      });
      
    const txids: TransactionId[] = await signSendWait(srcChain, xfer(), srcSigner.signer);
    expect(txids).toBeDefined();
    expect(txids.length).toBeGreaterThan(0);
      
    const vaa = await wh.getVaa(
      txids[txids.length - 1]!.txid,
      "Ntt:WormholeTransfer",
      25 * 60 * 1000
    );
    expect(vaa).toBeDefined();

    const dstTxids = await signSendWait(
      dstChain,
      dstNtt.redeem([vaa!], dstSigner.address.address),
      dstSigner.signer
    );
    expect(dstTxids).toBeDefined();
    expect(dstTxids.length).toBeGreaterThan(0);
  }

  // Helper function to setup chains and signers
  async function setupChainsAndSigners(srcChainName: "Sepolia" | "Mezo", dstChainName: "Sepolia" | "Mezo") {
    const src = wh.getChain(srcChainName);
    const dst = wh.getChain(dstChainName);
    const srcSigner = await getSigner(src);
    const dstSigner = await getSigner(dst);
    return { src, dst, srcSigner, dstSigner };
  }

  // Helper function to validate balance changes after transfer
  async function validateBalanceChanges(
    srcChain: any,
    dstChain: any,
    srcSigner: any,
    dstSigner: any,
    srcInitialBalance: bigint,
    dstInitialBalance: bigint,
    transferAmount: bigint
  ) {
    // Get final balances
    const srcFinalBalance = await getTokenBalance(srcChain, srcSigner);
    const dstFinalBalance = await getTokenBalance(dstChain, dstSigner);

    console.log(`Final balances - Source: ${srcFinalBalance}, Destination: ${dstFinalBalance}`);

    // Validate that amount was subtracted from source
    const expectedSrcBalance = srcInitialBalance - transferAmount;
    expect(srcFinalBalance).toBe(expectedSrcBalance);
    console.log(`Source balance validation: ${srcFinalBalance} = ${srcInitialBalance} - ${transferAmount} ✓`);

    // Validate that amount was added to destination
    const expectedDstBalance = dstInitialBalance + transferAmount;
    expect(dstFinalBalance).toBe(expectedDstBalance);
    console.log(`Destination balance validation: ${dstFinalBalance} = ${dstInitialBalance} + ${transferAmount} ✓`);
  }
});