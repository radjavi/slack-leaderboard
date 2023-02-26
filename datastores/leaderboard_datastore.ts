import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Datastores are a Slack-hosted location to store
 * and retrieve data for your app.
 * https://api.slack.com/future/datastores
 */
const LeaderboardDatastore = DefineDatastore({
  name: "Leaderboard",
  primary_key: "id",
  attributes: {
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
});

export default LeaderboardDatastore;
