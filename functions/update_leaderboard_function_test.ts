import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import UpdateLeaderboardFunction from "./update_leaderboard_function.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester("update_leaderboard_function");

// Replaces globalThis.fetch with the mocked copy
mf.install();

mf.mock("POST@/api/apps.datastore.query", () => {
  return new Response(
    `{"ok": true, "items": []}`,
    {
      status: 200,
    },
  );
});

mf.mock("POST@/api/apps.datastore.put", () => {
  return new Response(
    `{"ok": true, "item": {"id": "d908f8bd-00c6-43f0-9fc3-4da3c2746e14"}}`,
    {
      status: 200,
    },
  );
});

Deno.test("Should report myself as winner", async () => {
  const inputs = {
    match_report: {
      leaderboard_name: "pingpong",
      me: "U0000001",
      my_opponent: "U0000002",
      i_am_winner: true,
    },
  };
  const { outputs } = await UpdateLeaderboardFunction(
    createContext({ inputs }),
  );
  await assertEquals(
    outputs?.updatedMsg,
    ":tada: <@U0000001> won against <@U0000002>",
  );
});

Deno.test("Should report myself as loser", async () => {
  const inputs = {
    match_report: {
      leaderboard_name: "pingpong",
      me: "U0000001",
      my_opponent: "U0000002",
      i_am_winner: false,
    },
  };
  const { outputs } = await UpdateLeaderboardFunction(
    createContext({ inputs }),
  );
  await assertEquals(
    outputs?.updatedMsg,
    ":tada: <@U0000002> won against <@U0000001>",
  );
});

Deno.test("Should not be able to report against myself", async () => {
  const inputs = {
    match_report: {
      leaderboard_name: "pingpong",
      me: "U0000001",
      my_opponent: "U0000001",
      i_am_winner: true,
    },
  };
  const { outputs } = await UpdateLeaderboardFunction(
    createContext({ inputs }),
  );
  await assertEquals(
    outputs?.updatedMsg,
    ":warning: You can't report a game against yourself!",
  );
});
