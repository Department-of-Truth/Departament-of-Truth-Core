import { IAgentRuntime, Memory } from "@ai16z/eliza";
import { PumpFunAgentKit } from "pumpfun-kit";

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
