import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ClearLeaderboardDefinition } from "../functions/clear_leaderboard_function.ts";
import { CollectLeaderboardStatsDefinition } from "../functions/collect_leaderboard_stats_function.ts";
import { FormatLeaderboardStatsDefinition } from "../functions/format_leaderboard_stats_function.ts";

const ClearLeaderboardWorkflow = DefineWorkflow({
  callback_id: "clear_leaderboard_workflow",
  title: "Clear leaderboard",
  description: "Clear the leaderboard in this channel",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      triggered_channel: { type: Schema.slack.types.channel_id },
      triggered_user: { type: Schema.slack.types.user_id },
    },
    required: ["interactivity", "triggered_channel", "triggered_user"],
  },
});

const inputForm = ClearLeaderboardWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Clear leaderboard",
    description: ":broom: Clear the leaderboard in this channel.",
    interactivity: ClearLeaderboardWorkflow.inputs.interactivity,
    submit_label: "Clear leaderboard",
    fields: {
      elements: [
        {
          name: "reason",
          title: "Reason for clearing leaderboard",
          type: Schema.types.string,
        },
      ],
      required: ["reason"],
    },
  },
);

const leaderboardStats = ClearLeaderboardWorkflow.addStep(
  CollectLeaderboardStatsDefinition,
  {
    leaderboard_name: ClearLeaderboardWorkflow.inputs.triggered_channel,
  },
);

const leaderboard = ClearLeaderboardWorkflow.addStep(
  FormatLeaderboardStatsDefinition,
  {
    leaderboard_stats: leaderboardStats.outputs.leaderboard_stats,
  },
);

ClearLeaderboardWorkflow.addStep(
  ClearLeaderboardDefinition,
  {
    leaderboard_stats: leaderboardStats.outputs.leaderboard_stats,
  },
);

const message =
  `:broom: <@${ClearLeaderboardWorkflow.inputs.triggered_user}> cleared the leaderboard with the following reason: ` +
  "`" + inputForm.outputs.fields.reason + "`\n" +
  `Final state was:\n` +
  leaderboard.outputs.formatted_leaderboard;

ClearLeaderboardWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: ClearLeaderboardWorkflow.inputs.triggered_channel,
  message,
});

export default ClearLeaderboardWorkflow;
