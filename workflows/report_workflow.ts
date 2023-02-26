import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { UpdateLeaderboardDefinition } from "../functions/update_leaderboard_function.ts";

const ReportWorkflow = DefineWorkflow({
  callback_id: "report_workflow",
  title: "Report a match",
  description: "Report a win/loss in a match between you and an opponent.",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      triggered_channel: { type: Schema.slack.types.channel_id },
      triggered_user: { type: Schema.slack.types.user_id },
    },
    required: ["interactivity", "triggered_channel", "triggered_user"],
  },
});

const inputForm = ReportWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Report a match",
    description:
      ":trophy: Report a win/loss in a match between you and an opponent.",
    interactivity: ReportWorkflow.inputs.interactivity,
    submit_label: "Report match",
    fields: {
      elements: [
        {
          name: "my_opponent",
          title: "Who did you play against?",
          type: Schema.slack.types.user_id,
        },
        {
          name: "i_am_winner",
          title: "Did you win?",
          type: Schema.types.boolean,
          default: true,
        },
      ],
      required: ["my_opponent", "i_am_winner"],
    },
  },
);

const updateLeaderboardStep = ReportWorkflow.addStep(
  UpdateLeaderboardDefinition,
  {
    match_report: {
      leaderboard_name: ReportWorkflow.inputs.triggered_channel,
      me: ReportWorkflow.inputs.triggered_user,
      my_opponent: inputForm.outputs.fields.my_opponent,
      i_am_winner: inputForm.outputs.fields.i_am_winner,
    },
  },
);

ReportWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: ReportWorkflow.inputs.triggered_channel,
  message: updateLeaderboardStep.outputs.updatedMsg,
});

export default ReportWorkflow;
