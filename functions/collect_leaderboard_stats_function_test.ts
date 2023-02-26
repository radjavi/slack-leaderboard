import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import CollectLeaderboardStatsFunction from "./collect_leaderboard_stats_function.ts";

const { createContext } = SlackFunctionTester("update_leaderboard_function");

// Replaces globalThis.fetch with the mocked copy
mf.install();

Deno.test("Should return empty leaderboard stats", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{"ok": true, "items": []}`,
      {
        status: 200,
      },
    );
  });

  const inputs = { leaderboard_name: "pingpong" };
  const { outputs } = await CollectLeaderboardStatsFunction(
    createContext({ inputs }),
  );
  await assertEquals(
    outputs?.leaderboard_stats,
    [],
  );
});

Deno.test("Should return stats for given existing leaderboard", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{
        "ok": true, 
        "items": [
          {
            "id": "d908f8bd-00c6-43f0-9fc3-4da3c2746e14",
            "leaderboard_name": "pingpong",
            "user_id": "U0000001",
            "wins": 2,
            "losses": 0,
            "rating": 0
          },
          {
            "id": "7272b492-e67a-4bac-974c-74087a2a14e0",
            "leaderboard_name": "pingpong",
            "user_id": "U0000002",
            "wins": 0,
            "losses": 2,
            "rating": 0
          }
        ]
      }`,
      {
        status: 200,
      },
    );
  });

  const inputs = { leaderboard_name: "pingpong" };
  const { outputs } = await CollectLeaderboardStatsFunction(
    createContext({ inputs }),
  );
  await assertEquals(
    outputs?.leaderboard_stats,
    [
      {
        id: "d908f8bd-00c6-43f0-9fc3-4da3c2746e14",
        leaderboard_name: "pingpong",
        user_id: "U0000001",
        wins: 2,
        losses: 0,
        rating: 0,
      },
      {
        id: "7272b492-e67a-4bac-974c-74087a2a14e0",
        leaderboard_name: "pingpong",
        user_id: "U0000002",
        wins: 0,
        losses: 2,
        rating: 0,
      },
    ],
  );
});
