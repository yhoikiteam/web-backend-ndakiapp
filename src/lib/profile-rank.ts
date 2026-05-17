export function calculateRank(totalTrip: number) {
  if (totalTrip <= 3) {
    return {
      rank: "pemula",
      grade: 1,
    };
  }

  if (totalTrip <= 8) {
    return {
      rank: "berpengalaman",
      grade: 2,
    };
  }

  if (totalTrip <= 15) {
    return {
      rank: "sepuh",
      grade: 3,
    };
  }

  if (totalTrip <= 25) {
    return {
      rank: "senior adventurer",
      grade: 4,
    };
  }

  return {
    rank: "legend pendaki",
    grade: 5,
  };
}