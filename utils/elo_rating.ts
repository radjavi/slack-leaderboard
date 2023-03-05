const K = 32;

/**
 * Based on Elo rating system
 * https://en.wikipedia.org/wiki/Elo_rating_system#Mathematical_details
 *
 * @param R_A Rating of Player A
 * @param R_B Rating of Player B
 * @param S_A Score of Player A (Win = 1, Loss = 0)
 */
export default function calculateRating(
  R_A: number,
  R_B: number,
  S_A: number,
): [number, number] {
  const E_A = 1 / (1 + 10 ** ((R_B - R_A) / 400));

  const diff = Math.round(K * (S_A - E_A));
  const R_A2 = R_A + diff;
  const R_B2 = R_B - diff;

  return [R_A2, R_B2];
}
