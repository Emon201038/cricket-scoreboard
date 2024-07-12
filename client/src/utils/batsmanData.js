export const currentBattingTeam = (data) => {
  const tossWinnerTeam = data?.teams?.find(
    (t) => t?.teamName === data?.tossWinner
  );

  const tossLosserTeam = data?.teams?.find(
    (t) => t?.teamName !== data?.tossWinner
  );
  return data?.electedTo === "batting" ? tossWinnerTeam : tossLosserTeam;
};

export const currentBowlingTeam = (data) => {
  const tossWinnerTeam = data?.teams?.find(
    (t) => t?.teamName === data?.tossWinner
  );

  const tossLosserTeam = data?.teams?.find(
    (t) => t?.teamName !== data?.tossWinner
  );
  return data?.electedTo === "bowling" ? tossWinnerTeam : tossLosserTeam;
};
