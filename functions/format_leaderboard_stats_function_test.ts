import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import FormatLeaderboardStatsFunction from "./format_leaderboard_stats_function.ts";

const { createContext } = SlackFunctionTester("update_leaderboard_function");

Deno.test("Should format empty leaderboard", async () => {
  const inputs = { leaderboard_stats: [] };
  const { outputs } = await FormatLeaderboardStatsFunction(
    createContext({ inputs }),
  );
  await assertEquals(
    outputs?.formatted_leaderboard,
    "There is no leaderboard in this channel - report a match first.",
  );
});

Deno.test("Should format existing leaderboard", async () => {
  const inputs = {
    leaderboard_stats: [
      {
        id: "d908f8bd-00c6-43f0-9fc3-4da3c2746e14",
        leaderboard_name: "pingpong",
        user_id: "U0000001",
        wins: 2,
        losses: 0,
        rating: 1030.51,
      },
      {
        id: "7272b492-e67a-4bac-974c-74087a2a14e0",
        leaderboard_name: "pingpong",
        user_id: "U0000002",
        wins: 0,
        losses: 2,
        rating: 969.49,
      },
    ],
  };
  const { outputs } = await FormatLeaderboardStatsFunction(
    createContext({ inputs }),
  );
  await assertEquals(
    outputs?.formatted_leaderboard,
    "```\n" +
      "#   Rating  Won  Lost  Name\n" +
      "1.  1030    2    0     <@U0000001>\n" +
      "2.  969     0    2     <@U0000002>\n" +
      "```",
  );
});
