// getSakAgent.test.js
import {
  deployTokenToPumpFun,
  getOrCreateGoal,
  getSakAgent,
} from "../src/pumpfun";
import { IAgentRuntime } from "@ai16z/eliza";
import { PumpFunAgentKit } from "pumpfun-kit";

jest.mock("pumpfun-kit");

describe("getSakAgent", () => {
  it("should initialize PumpFunAgentKit with correct settings", () => {
    const mockRuntime = {
      getSetting: jest.fn((key) => {
        switch (key) {
          case "pumpfun.apiKey":
            return "testApiKey";
          case "pumpfun.secretKey":
            return "testSecretKey";
          case "pumpfun.agentId":
            return "testAgentId";
          default:
            return null;
        }
      }),
    };

    const agent = getSakAgent(mockRuntime);
    expect(PumpFunAgentKit).toHaveBeenCalledWith(
      "testApiKey",
      "testSecretKey",
      "testAgentId",
    );
  });
});

describe("getOrCreateGoal", () => {
  it("should return existing goal if available", async () => {
    const mockGoal = [{ id: "goal1" }];
    const mockRuntime = {
      agentId: "agentId",
      databaseAdapter: {
        getGoals: jest.fn().mockResolvedValue(mockGoal),
      },
    };
    const mockMessage = {
      roomId: "roomId",
      userId: "userId",
    };

    const result = await getOrCreateGoal(mockRuntime, mockMessage, "goal1");
    expect(result).toEqual(mockGoal[0]);
  });
});

jest.mock("pumpfun-kit");
jest.mock("@ai16z/eliza");

describe("deployTokenToPumpFun", () => {
  it("should deploy token and log success message", async () => {
    const mockAgent = {
      deployToken: jest.fn().mockResolvedValue(),
    };
    PumpFunAgentKit.mockImplementation(() => mockAgent);

    const mockRuntime = {
      /* ... */
    };
    const mockOwner = "owner";
    const mockToken = "token";

    await deployTokenToPumpFun(mockRuntime, mockOwner, mockToken);

    expect(mockAgent.deployToken).toHaveBeenCalledWith(mockToken, mockOwner);
    expect(elizaLogger.info).toHaveBeenCalledWith(
      "token deployed successfuly!",
    );
  });
});

jest.mock("pumpfun-kit");

describe("getPumpFunToken", () => {
  it("should retrieve the token using the agent", async () => {
    const mockToken = "mockToken";
    const mockAgent = {
      getToken: jest.fn().mockResolvedValue(mockToken),
    };
    PumpFunAgentKit.mockImplementation(() => mockAgent);

    const mockRuntime = {
      /* ... */
    };

    const result = await getPumpFunToken(mockRuntime);

    expect(mockAgent.getToken).toHaveBeenCalled();
    expect(result).toBe(mockToken);
  });
});
