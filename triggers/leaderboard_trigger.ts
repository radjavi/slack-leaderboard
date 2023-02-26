import { Trigger } from "deno-slack-api/types.ts";
import ShowLeaderboardWorkflow from "../workflows/show_leaderboard_workflow.ts";
/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const leaderboardTrigger: Trigger<typeof ShowLeaderboardWorkflow.definition> = {
  type: "shortcut",
  name: "Show leaderboard",
  description: "Show this channel's leaderboard.",
  workflow: "#/workflows/show_leaderboard_workflow",
  inputs: {
    triggered_channel: {
      value: "{{data.channel_id}}",
    },
    triggered_user: {
      value: "{{data.user_id}}",
    },
  },
};

export default leaderboardTrigger;
