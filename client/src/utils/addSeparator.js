export function addSeparatorAfterSixLegalBalls(arr) {
  let legalBallCount = 0;
  let result = [];

  for (let i = 0; i < arr?.length; i++) {
    result.push(arr[i]);
    if (arr[i]?.ballCount) {
      legalBallCount++;
    }
    if (legalBallCount === 6) {
      result?.push({ separator: true });
      legalBallCount = 0;
    }
  }

  return result;
}
