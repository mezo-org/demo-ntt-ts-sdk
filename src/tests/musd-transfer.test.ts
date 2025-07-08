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

      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });

      // Check ERC20 token balance using EVM platform contract call
      const rpc = await src.getRpc();
      const tokenAddress = TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS]!.token;
      const userAddress = srcSigner.address.address.address;
      
      // ERC20 balanceOf function call
      const balanceOfData = "0x70a08231" + (userAddress as string).slice(2).padStart(64, "0");
      const balanceResult = await rpc.call({
        to: tokenAddress,
        data: balanceOfData
      });
      const balance = BigInt(balanceResult);
      const balanceInUnits = balance;
      const requiredAmount = amount.units(
        amount.parse("1.5", await srcNtt.getTokenDecimals())
      );

      const decimals = await srcNtt.getTokenDecimals();
      const balanceFormatted = Number(balance) / Math.pow(10, decimals);
      console.log(`Account balance: ${balanceFormatted} MUSD`);
      console.log(`Required amount: 1.5 MUSD`);

      // Verify account has at least 1.5 MUSD
      expect(balanceInUnits).toBeGreaterThanOrEqual(requiredAmount);
    }, 30 * 60 * 1000);

    it("should check if account has at least 1.5 MUSD on Mezo Testnet", async () => {
      const src = wh.getChain("Mezo");
      const srcSigner = await getSigner(src);

      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });

      // Check ERC20 token balance using EVM platform contract call
      const rpc = await src.getRpc();
      const tokenAddress = TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS]!.token;
      const userAddress = srcSigner.address.address.address;
      
      // ERC20 balanceOf function call
      const balanceOfData = "0x70a08231" + (userAddress as string).slice(2).padStart(64, "0");
      const balanceResult = await rpc.call({
        to: tokenAddress,
        data: balanceOfData
      });
      const balance = BigInt(balanceResult);
      const balanceInUnits = balance;
      const requiredAmount = amount.units(
        amount.parse("1.5", await srcNtt.getTokenDecimals())
      );

      const decimals = await srcNtt.getTokenDecimals();
      const balanceFormatted = Number(balance) / Math.pow(10, decimals);
      console.log(`Account balance: ${balanceFormatted} MUSD`);
      console.log(`Required amount: 1.5 MUSD`);

      // Verify account has at least 1.5 MUSD
      expect(balanceInUnits).toBeGreaterThanOrEqual(requiredAmount);
    }, 30 * 60 * 1000);
  });

  describe.only("Sepolia to Mezo Transfer", () => {
    it("should transfer 1 MUSD from Sepolia to Mezo", async () => {
      const src = wh.getChain("Sepolia");
      const dst = wh.getChain("Mezo");

      const srcSigner = await getSigner(src);
      const dstSigner = await getSigner(dst);

      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });
      const dstNtt = await dst.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[dst.chain as keyof typeof TEST_NTT_TOKENS],
      });

      const amt = amount.units(
        amount.parse("1.0", await srcNtt.getTokenDecimals())
      );

      const xfer = () =>
        srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
          queue: false,
          automatic: false,
          gasDropoff: 0n,
        });

      const txids: TransactionId[] = await signSendWait(src, xfer(), srcSigner.signer);
      expect(txids).toBeDefined();
      expect(txids.length).toBeGreaterThan(0);

      const vaa = await wh.getVaa(
        txids[txids.length - 1]!.txid,
        "Ntt:WormholeTransfer",
        25 * 60 * 1000
      );
      expect(vaa).toBeDefined();

      const dstTxids = await signSendWait(
        dst,
        dstNtt.redeem([vaa!], dstSigner.address.address),
        dstSigner.signer
      );
      expect(dstTxids).toBeDefined();
      expect(dstTxids.length).toBeGreaterThan(0);
    }, 30 * 60 * 1000);

    it("should transfer 0.5 MUSD from Sepolia to Mezo", async () => {
      const src = wh.getChain("Sepolia");
      const dst = wh.getChain("Mezo");

      const srcSigner = await getSigner(src);
      const dstSigner = await getSigner(dst);

      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });
      const dstNtt = await dst.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[dst.chain as keyof typeof TEST_NTT_TOKENS],
      });

      const amt = amount.units(
        amount.parse("0.5", await srcNtt.getTokenDecimals())
      );

      const xfer = () =>
        srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
          queue: false,
          automatic: false,
          gasDropoff: 0n,
        });

      const txids: TransactionId[] = await signSendWait(src, xfer(), srcSigner.signer);
      expect(txids).toBeDefined();
      expect(txids.length).toBeGreaterThan(0);

      const vaa = await wh.getVaa(
        txids[txids.length - 1]!.txid,
        "Ntt:WormholeTransfer",
        25 * 60 * 1000
      );
      expect(vaa).toBeDefined();

      const dstTxids = await signSendWait(
        dst,
        dstNtt.redeem([vaa!], dstSigner.address.address),
        dstSigner.signer
      );
      expect(dstTxids).toBeDefined();
      expect(dstTxids.length).toBeGreaterThan(0);
    }, 30 * 60 * 1000);
  });

  describe("Mezo to Sepolia Transfer", () => {
    it("should transfer 1 MUSD from Mezo to Sepolia", async () => {
      const src = wh.getChain("Mezo");
      const dst = wh.getChain("Sepolia");

      const srcSigner = await getSigner(src);
      const dstSigner = await getSigner(dst);

      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });
      const dstNtt = await dst.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[dst.chain as keyof typeof TEST_NTT_TOKENS],
      });

      const amt = amount.units(
        amount.parse("1.0", await srcNtt.getTokenDecimals())
      );

      const xfer = () =>
        srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
          queue: false,
          automatic: false,
          gasDropoff: 0n,
        });

      const txids: TransactionId[] = await signSendWait(src, xfer(), srcSigner.signer);
      expect(txids).toBeDefined();
      expect(txids.length).toBeGreaterThan(0);

      const vaa = await wh.getVaa(
        txids[txids.length - 1]!.txid,
        "Ntt:WormholeTransfer",
        25 * 60 * 1000
      );
      expect(vaa).toBeDefined();

      const dstTxids = await signSendWait(
        dst,
        dstNtt.redeem([vaa!], dstSigner.address.address),
        dstSigner.signer
      );
      expect(dstTxids).toBeDefined();
      expect(dstTxids.length).toBeGreaterThan(0);
    }, 30 * 60 * 1000);

    it("should transfer 0.5 MUSD from Mezo to Sepolia", async () => {
      const src = wh.getChain("Mezo");
      const dst = wh.getChain("Sepolia");

      const srcSigner = await getSigner(src);
      const dstSigner = await getSigner(dst);

      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });
      const dstNtt = await dst.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[dst.chain as keyof typeof TEST_NTT_TOKENS],
      });

      const amt = amount.units(
        amount.parse("0.5", await srcNtt.getTokenDecimals())
      );

      const xfer = () =>
        srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
          queue: false,
          automatic: false,
          gasDropoff: 0n,
        });

      const txids: TransactionId[] = await signSendWait(src, xfer(), srcSigner.signer);
      expect(txids).toBeDefined();
      expect(txids.length).toBeGreaterThan(0);

      const vaa = await wh.getVaa(
        txids[txids.length - 1]!.txid,
        "Ntt:WormholeTransfer",
        25 * 60 * 1000
      );
      expect(vaa).toBeDefined();

      const dstTxids = await signSendWait(
        dst,
        dstNtt.redeem([vaa!], dstSigner.address.address),
        dstSigner.signer
      );
      expect(dstTxids).toBeDefined();
      expect(dstTxids.length).toBeGreaterThan(0);
    }, 30 * 60 * 1000);
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle very small transfer amounts", async () => {
      const src = wh.getChain("Sepolia");
      const dst = wh.getChain("Mezo");

      const srcSigner = await getSigner(src);
      const dstSigner = await getSigner(dst);

      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });
      const dstNtt = await dst.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[dst.chain as keyof typeof TEST_NTT_TOKENS],
      });

      const amt = amount.units(
        amount.parse("0.001", await srcNtt.getTokenDecimals())
      );

      const xfer = () =>
        srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
          queue: false,
          automatic: false,
          gasDropoff: 0n,
        });

      const txids: TransactionId[] = await signSendWait(src, xfer(), srcSigner.signer);
      expect(txids).toBeDefined();
      expect(txids.length).toBeGreaterThan(0);

      const vaa = await wh.getVaa(
        txids[txids.length - 1]!.txid,
        "Ntt:WormholeTransfer",
        25 * 60 * 1000
      );
      expect(vaa).toBeDefined();

      const dstTxids = await signSendWait(
        dst,
        dstNtt.redeem([vaa!], dstSigner.address.address),
        dstSigner.signer
      );
      expect(dstTxids).toBeDefined();
      expect(dstTxids.length).toBeGreaterThan(0);
    }, 30 * 60 * 1000);

    it("should validate transfer with maximum precision", async () => {
      const src = wh.getChain("Sepolia");
      const dst = wh.getChain("Mezo");

      const srcSigner = await getSigner(src);
      const dstSigner = await getSigner(dst);

      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain as keyof typeof TEST_NTT_TOKENS],
      });
      const dstNtt = await dst.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[dst.chain as keyof typeof TEST_NTT_TOKENS],
      });

      const amt = amount.units(
        amount.parse("1.12345678", await srcNtt.getTokenDecimals())
      );

      const xfer = () =>
        srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
          queue: false,
          automatic: false,
          gasDropoff: 0n,
        });

      const txids: TransactionId[] = await signSendWait(src, xfer(), srcSigner.signer);
      expect(txids).toBeDefined();
      expect(txids.length).toBeGreaterThan(0);

      const vaa = await wh.getVaa(
        txids[txids.length - 1]!.txid,
        "Ntt:WormholeTransfer",
        25 * 60 * 1000
      );
      expect(vaa).toBeDefined();

      const dstTxids = await signSendWait(
        dst,
        dstNtt.redeem([vaa!], dstSigner.address.address),
        dstSigner.signer
      );
      expect(dstTxids).toBeDefined();
      expect(dstTxids.length).toBeGreaterThan(0);
    }, 30 * 60 * 1000);

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
    }, 30 * 60 * 1000);
  });
});