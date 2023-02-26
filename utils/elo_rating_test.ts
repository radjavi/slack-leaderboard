import calculateRating from "./elo_rating.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";

Deno.test("Should calculate elo rating for two equally rated players", () => {
  const [R_A2, R_B2] = calculateRating(1000, 1000, 1);

  assertEquals(R_A2, 1016);
  assertEquals(R_B2, 984);
});

Deno.test("Should calculate elo rating for two unequally rated players", () => {
  const [R_A2, R_B2] = calculateRating(984, 1016, 1);

  assertEquals(R_A2.toFixed(1), "1001.5");
  assertEquals(R_B2.toFixed(1), "998.5");
});
