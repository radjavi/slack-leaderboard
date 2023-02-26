import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const MatchReportType = DefineType({
  title: "Match Report",
  description: "Use this custom type for creating a match report",
  name: "match_report",
  type: Schema.types.object,
  properties: {
    leaderboard_name: {
      type: Schema.types.string,
    },
    me: {
      type: Schema.slack.types.user_id,
    },
    my_opponent: {
      type: Schema.slack.types.user_id,
    },
    i_am_winner: {
      type: Schema.types.boolean,
    },
  },
  required: ["leaderboard_name", "me", "my_opponent", "i_am_winner"],
});
