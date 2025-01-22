import { elizaLogger, IAgentRuntime, Memory } from "@ai16z/eliza";
import { PumpFunAgentKit } from "pumpfun-kit";
import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export function getSakAgent(runtime: IAgentRuntime) {
  return new PumpFunAgentKit(
    runtime.getSetting("pumpfun.apiKey"),
    runtime.getSetting("pumpfun.secretKey"),
    runtime.getSetting("pumpfun.agentId"),
  );
}

export async function getOrCreateGoal(
  runtime: IAgentRuntime,
  message: Memory,
  goalId: string,
) {
  const goal = await runtime.databaseAdapter.getGoals({
    agentId: runtime.agentId,
    roomId: message.roomId,
    userId: message.userId,
    onlyInProgress: true,
    count: 1,
  });

  if (goal.length > 0) {
    return goal[0];
  }
}

export const deployTokenToPumpFun = async (
  runtime: IAgentRuntime,
  owner: string,
  token: string,
) => {
  const agent = getSakAgent(runtime);
  await agent.deployToken(token, owner);
  elizaLogger.info("token deployed successfuly!");
};

export const getPumpFunToken = async (runtime: IAgentRuntime) => {
  const agent = getSakAgent(runtime);
  return agent.getToken();
};

const RPC_ENDPOINT = "Your RPC Endpoint";
const web3Connection = new Connection(RPC_ENDPOINT, "confirmed");

async function sendPortalTransaction() {
  const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicKey: process.env.PUBLIC_KEY,
      action: "buy",
      mint: "dot",
      denominatedInSol: "false",
      amount: 1000,
      slippage: 10,
      priorityFee: 0.00001,
      pool: "pump",
    }),
  });
  if (response.status === 200) {
    const data = await response.arrayBuffer();
    const tx = VersionedTransaction.deserialize(new Uint8Array(data));
    const signerKeyPair = Keypair.fromSecretKey(
      bs58.decode(process.env.PRIVATE_KEY),
    );
    tx.sign([signerKeyPair]);
    const signature = await web3Connection.sendTransaction(tx);
    console.log("Transaction: https://solscan.io/tx/" + signature);
  } else {
    console.log(response.statusText); // log error
  }
}

sendPortalTransaction();
