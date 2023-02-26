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
  const S_B = 1 - S_A;

  const E_A = 1 / (1 + 10 ** ((R_B - R_A) / 400));
  const E_B = 1 / (1 + 10 ** ((R_A - R_B) / 400));

  const R_A2 = R_A + K * (S_A - E_A);
  const R_B2 = R_B + K * (S_B - E_B);

  return [R_A2, R_B2];
}
