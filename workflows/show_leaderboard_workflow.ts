import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CollectLeaderboardStatsDefinition } from "../functions/collect_leaderboard_stats_function.ts";
import { FormatLeaderboardStatsDefinition } from "../functions/format_leaderboard_stats_function.ts";

const ShowLeaderboardWorkflow = DefineWorkflow({
  callback_id: "show_leaderboard_workflow",
  title: "Show leaderboard",
  description: "Show this channel's leaderboard",
  input_parameters: {
    properties: {
      triggered_channel: { type: Schema.slack.types.channel_id },
      triggered_user: { type: Schema.slack.types.user_id },
    },
    required: ["triggered_channel", "triggered_user"],
  },
});

const leaderboardStats = ShowLeaderboardWorkflow.addStep(
  CollectLeaderboardStatsDefinition,
  {
    leaderboard_name: ShowLeaderboardWorkflow.inputs.triggered_channel,
  },
);

const leaderboard = ShowLeaderboardWorkflow.addStep(
  FormatLeaderboardStatsDefinition,
  {
    leaderboard_stats: leaderboardStats.outputs.leaderboard_stats,
  },
);

ShowLeaderboardWorkflow.addStep(Schema.slack.functions.SendEphemeralMessage, {
  channel_id: ShowLeaderboardWorkflow.inputs.triggered_channel,
  user_id: ShowLeaderboardWorkflow.inputs.triggered_user,
  message: leaderboard.outputs.formatted_leaderboard,
});

export default ShowLeaderboardWorkflow;
