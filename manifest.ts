import { Manifest } from "deno-slack-sdk/mod.ts";
import ReportWorkflow from "./workflows/report_workflow.ts";
import ShowLeaderboardWorkflow from "./workflows/show_leaderboard_workflow.ts";
import LeaderboardDatastore from "./datastores/leaderboard_datastore.ts";
import { MatchReportType } from "./types/match_report.ts";
import { LeaderboardRowType } from "./types/leaderboard_row.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "Leaderboard",
  description: "Keeping track of leaders",
  icon: "assets/default_new_app_icon.png",
  workflows: [ReportWorkflow, ShowLeaderboardWorkflow],
  outgoingDomains: [],
  types: [MatchReportType, LeaderboardRowType],
  datastores: [LeaderboardDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
