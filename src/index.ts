import {
    TransactionId,
    Wormhole,
    amount,
    signSendWait,
  } from "@wormhole-foundation/sdk";
  import evm from "@wormhole-foundation/sdk/platforms/evm";
  
  // register protocol implementations
  import "@wormhole-foundation/sdk-evm-ntt";
  import { NTT_TOKENS } from "./utils/const";
  import { getSigner } from "./utils/helpers";


  (async function () {
    // Testnet or Mainnet
    const network = "Mainnet";
    // change between "Sepolia" and "Ethereum"
    const chain0 = "Ethereum";
    // "Mezo" is same for testnet and mainnet
    const chain1 = "Mezo";
    // change to token amount that should be transferred
    const MUSD_AMOUNT = "1.03";
    
    const wh = new Wormhole(network, [evm.Platform], {
      "chains": {
        [chain0]: {
          "rpc": process.env.ETHEREUM_RPC_URL
        },
        [chain1]: {
          "rpc": process.env.MEZO_RPC_URL
        }
      }
    });
    // change accordingly
    const src = wh.getChain(chain1);
    const dst = wh.getChain(chain0);

    const srcSigner = await getSigner(src);
    const dstSigner = await getSigner(dst);
  
    const srcNtt = await src.getProtocol("Ntt", {
      ntt: NTT_TOKENS[src.chain],
    });
    const dstNtt = await dst.getProtocol("Ntt", {
      ntt: NTT_TOKENS[dst.chain],
    });
  
    //TODO: change to token amount that should be transferred
    const amt = amount.units(
      amount.parse(MUSD_AMOUNT, await srcNtt.getTokenDecimals())
    );
  
    const xfer = () =>
      srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
        queue: false,
        automatic: false,
      });

    // Get calldata for simulation on tenderly (optional)
    const firstTx = await xfer().next();
    if (!firstTx.done) {
      const txData = firstTx.value.transaction.data;
      console.log("Transfer Calldata for EVM simulation:", txData);
    }
  
    // Initiate the transfer
    const txids: TransactionId[] = await signSendWait(src, xfer(), srcSigner.signer);
    console.log("Source txs", txids);
  
    const vaa = await wh.getVaa(
      txids[txids.length - 1]!.txid,
      "Ntt:WormholeTransfer",
      25 * 60 * 1000
    );
    console.log(vaa);
  
    const dstTxids = await signSendWait(
      dst,
      dstNtt.redeem([vaa!], dstSigner.address.address),
      dstSigner.signer
    );
    console.log("dstTxids", dstTxids);
  })();