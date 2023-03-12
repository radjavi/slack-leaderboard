import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { LeaderboardRowType } from "../types/leaderboard_row.ts";

export const ClearLeaderboardDefinition = DefineFunction({
  callback_id: "clear_leaderboard_function",
  title: "Clear leaderboard",
  description: "Clear a leaderboard",
  source_file: "functions/clear_leaderboard_function.ts",
  input_parameters: {
    properties: {
      leaderboard_stats: {
        type: Schema.types.array,
        items: { type: LeaderboardRowType },
      },
    },
    required: ["leaderboard_stats"],
  },
  output_parameters: {
    properties: {
      success: {
        type: Schema.types.boolean,
      },
      message: {
        type: Schema.types.string,
      },
    },
    required: ["success"],
  },
});

export default SlackFunction(
  ClearLeaderboardDefinition,
  async ({ inputs, client }) => {
    const leaderboard_stats = inputs.leaderboard_stats;

    if (leaderboard_stats.length == 0) {
      return {
        outputs: { success: false, message: "Leaderboard is already empty" },
      };
    }

    for (const item of leaderboard_stats) {
      const deleted = await client.apps.datastore.delete({
        datastore: "Leaderboard",
        id: item.id,
      });
      if (!deleted.ok) {
        return {
          error: `Failed to delete item from leaderboard: ${deleted.error}`,
        };
      }
    }

    return { outputs: { success: true } };
  },
);
