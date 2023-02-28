import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPIClient } from "deno-slack-sdk/deps.ts";
import LeaderboardDatastore from "../datastores/leaderboard_datastore.ts";
import { MatchReportType } from "../types/match_report.ts";
import calculateRating from "../utils/elo_rating.ts";
/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const UpdateLeaderboardDefinition = DefineFunction({
  callback_id: "update_leaderboard_function",
  title: "Update leaderboard",
  description: "Function to update the leaderboard given a match report",
  source_file: "functions/update_leaderboard_function.ts",
  input_parameters: {
    properties: {
      match_report: {
        type: MatchReportType,
      },
    },
    required: ["match_report"],
  },
  output_parameters: {
    properties: {
      updatedMsg: {
        type: Schema.types.string,
        description: "Updated message to be posted",
      },
    },
    required: ["updatedMsg"],
  },
});

interface LeaderboardRow {
  id: string;
  leaderboard_name: string;
  user_id: string;
  wins: number;
  losses: number;
  rating: number;
}

async function getStatsForUser(
  client: SlackAPIClient,
  leaderboard_name: string,
  user_id: string,
): Promise<LeaderboardRow> {
  const user_stats_query = await client.apps.datastore.query<
    typeof LeaderboardDatastore.definition
  >({
    datastore: "Leaderboard",
    expression: "#leaderboard_name = :leaderboard_name AND #user_id = :user_id",
    expression_attributes: {
      "#leaderboard_name": "leaderboard_name",
      "#user_id": "user_id",
    },
    expression_values: {
      ":leaderboard_name": leaderboard_name,
      ":user_id": user_id,
    },
  });
  const user_stats = user_stats_query.items.length > 0
    ? user_stats_query.items[0]
    : null;

  return {
    id: user_stats?.id ?? crypto.randomUUID(),
    leaderboard_name: user_stats?.leaderboard_name ?? leaderboard_name,
    user_id: user_stats?.user_id ?? user_id,
    wins: user_stats?.wins ?? 0,
    losses: user_stats?.losses ?? 0,
    rating: user_stats?.rating ?? 1000,
  };
}

// This function takes the input from the open form step, adds formatting, saves our
// updated object into the Slack hosted datastore, and returns the updated message.
export default SlackFunction(
  UpdateLeaderboardDefinition,
  async ({ inputs, client }) => {
    const { leaderboard_name, me, my_opponent, i_am_winner } =
      inputs.match_report;

    if (me == my_opponent) {
      return {
        outputs: {
          updatedMsg: ":warning: You can't report a game against yourself!",
        },
      };
    }

    const my_stats = await getStatsForUser(client, leaderboard_name, me);
    const opponent_stats = await getStatsForUser(
      client,
      leaderboard_name,
      my_opponent,
    );

    const [my_new_rating, opponent_new_rating] = calculateRating(
      my_stats.rating,
      opponent_stats.rating,
      i_am_winner ? 1 : 0,
    );

    const my_new_stats = {
      ...my_stats,
      wins: i_am_winner ? my_stats.wins + 1 : my_stats.wins,
      losses: i_am_winner ? my_stats.losses : my_stats.losses + 1,
      rating: my_new_rating,
    };
    const opponent_new_stats = {
      ...opponent_stats,
      wins: i_am_winner ? opponent_stats.wins : opponent_stats.wins + 1,
      losses: i_am_winner ? opponent_stats.losses + 1 : opponent_stats.losses,
      rating: opponent_new_rating,
    };

    const response1 = await client.apps.datastore.put<
      typeof LeaderboardDatastore.definition
    >(
      {
        datastore: "Leaderboard",
        item: my_new_stats,
      },
    );

    if (!response1.ok) {
      console.error(response1.errors);
      return { error: `Failed to put leaderboard stats: ${response1.error}` };
    }

    const response2 = await client.apps.datastore.put<
      typeof LeaderboardDatastore.definition
    >(
      {
        datastore: "Leaderboard",
        item: opponent_new_stats,
      },
    );

    if (!response2.ok) {
      console.error(response2.errors);
      return { error: `Failed to put leaderboard stats: ${response2.error}` };
    }

    const updatedMsg = `:tada: <@${
      i_am_winner ? me : my_opponent
    }> won against <@${i_am_winner ? my_opponent : me}>`;

    return { outputs: { updatedMsg } };
  },
);
