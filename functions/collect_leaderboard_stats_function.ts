import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import LeaderboardDatastore from "../datastores/leaderboard_datastore.ts";
import { LeaderboardRowType } from "../types/leaderboard_row.ts";

export const CollectLeaderboardStatsDefinition = DefineFunction({
  callback_id: "collect_leaderboard_stats_function",
  title: "Collect leaderboard stats",
  description: "Function to collect the stats of a leaderboard",
  source_file: "functions/collect_leaderboard_stats_function.ts",
  input_parameters: {
    properties: {
      leaderboard_name: { type: Schema.slack.types.channel_id },
    },
    required: ["leaderboard_name"],
  },
  output_parameters: {
    properties: {
      leaderboard_stats: {
        type: Schema.types.array,
        items: { type: LeaderboardRowType },
        description: "List of stats in this leaderboard",
      },
    },
    required: ["leaderboard_stats"],
  },
});

export default SlackFunction(
  CollectLeaderboardStatsDefinition,
  async ({ inputs, client }) => {
    const query = await client.apps.datastore.query<
      typeof LeaderboardDatastore.definition
    >({
      datastore: "Leaderboard",
      expression: "#leaderboard_name = :leaderboard_name",
      expression_attributes: {
        "#leaderboard_name": "leaderboard_name",
      },
      expression_values: {
        ":leaderboard_name": inputs.leaderboard_name,
      },
    });

    if (!query.ok) {
      return { error: `Failed to retrieve leaderboard stats: ${query.error}` };
    }

    const leaderboard_stats = query.items.map((item) => {
      return {
        id: item.id,
        leaderboard_name: item.leaderboard_name,
        user_id: item.user_id,
        wins: item.wins,
        losses: item.losses,
        rating: item.rating,
      };
    });

    return { outputs: { leaderboard_stats } };
  },
);
