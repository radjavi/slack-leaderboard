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

    const headers = ["#", "Rating", "Won", "Lost", "Name"];
    const rows: string[][] = inputs.leaderboard_stats
      .sort((r1, r2) => r2.rating - r1.rating)
      .map((row, index) => [
        `${index + 1}.`,
        (row.rating | 0).toString(),
        row.wins.toString(),
        row.losses.toString(),
        `<@${row.user_id}>`,
      ]);
    const matrix_with_headers: string[][] = [headers, ...rows];

    const max_length_in_columns: number[] = headers.map((_, column_index) => {
      const column = matrix_with_headers.map((row) => row[column_index]);
      return Math.max(...column.map((value) => value.length));
    });

    const formatted_rows: string[] = matrix_with_headers.map((row) =>
      row.flatMap((column, column_index) =>
        column_index < headers.length - 1
          ? [
            column,
            " ".repeat(max_length_in_columns[column_index] + 2 - column.length),
          ]
          : [column]
      )
    ).map((rows) => rows.join(""));

    const formatted_leaderboard = [
      "```",
      ...formatted_rows,
      "```",
    ].join("\n");

    return { outputs: { formatted_leaderboard } };
  },
);
