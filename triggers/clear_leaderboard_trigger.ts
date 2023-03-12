import { Trigger } from "deno-slack-api/types.ts";
import ClearLeaderboardWorkflow from "../workflows/clear_leaderboard_workflow.ts";
/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const clearLeaderboardTrigger: Trigger<
  typeof ClearLeaderboardWorkflow.definition
> = {
  type: "shortcut",
  name: "Clear leaderboard",
  description: "Clear the leaderboard in this channel.",
  workflow: "#/workflows/clear_leaderboard_workflow",
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

export default clearLeaderboardTrigger;
