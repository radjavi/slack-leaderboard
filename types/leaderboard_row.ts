import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const LeaderboardRowType = DefineType({
  title: "Leaderboard Row",
  description: "A row in a leaderboard",
  name: "leaderboard_row",
  type: Schema.types.object,
  properties: {
    id: {
      type: Schema.types.string,
    },
    leaderboard_name: {
      type: Schema.types.string,
    },
    user_id: {
      type: Schema.slack.types.user_id,
    },
    wins: {
      type: Schema.types.integer,
    },
    losses: {
      type: Schema.types.integer,
    },
    rating: {
      type: Schema.types.integer,
    },
  },
  required: ["id", "leaderboard_name", "user_id", "wins", "losses", "rating"],
});
