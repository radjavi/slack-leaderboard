import { Trigger } from "deno-slack-api/types.ts";
import ReportWorkflow from "../workflows/report_workflow.ts";
/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const reportTrigger: Trigger<typeof ReportWorkflow.definition> = {
  type: "shortcut",
  name: "Report match",
  description: "Report a match for the leaderboard in this channel.",
  workflow: "#/workflows/report_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    triggered_user: {
      value: "{{data.user_id}}",
    },
    triggered_channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default reportTrigger;
