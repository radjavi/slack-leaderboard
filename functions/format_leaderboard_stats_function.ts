import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { LeaderboardRowType } from "../types/leaderboard_row.ts";

export const FormatLeaderboardStatsDefinition = DefineFunction({
  callback_id: "format_leaderboard_stats_function",
  title: "Format leaderboard stats",
  description:
    "Function to format the stats of a leaderboard to a slack message",
  source_file: "functions/format_leaderboard_stats_function.ts",
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
      formatted_leaderboard: {
        type: Schema.types.string,
      },
    },
    required: ["formatted_leaderboard"],
  },
});

export default SlackFunction(
  FormatLeaderboardStatsDefinition,
  ({ inputs }) => {
    if (inputs.leaderboard_stats.length == 0) {
      return {
        outputs: {
          formatted_leaderboard:
            "There is no leaderboard in this channel - report a match first.",
        },
      };
    }

    const formatted_rows = inputs.leaderboard_stats.sort((r1, r2) =>
      r2.rating - r1.rating
    ).map((row, index) => {
      return `${index + 1}.\t${
        row.rating.toFixed(1)
      }\t${row.wins}\t${row.losses}\t<@${row.user_id}>`;
    });

    const formatted_leaderboard = [
      "```",
      "#\tRating\tWon\tLost\tName",
      ...formatted_rows,
      "```",
    ].join("\n");

    return { outputs: { formatted_leaderboard } };
  },
);
