export const getBattingBowlingTeam = (match, decision) => {
  return match.toss.decision === decision
    ? match.teams.find(
        (t) => t.team.toString() === match.toss.winner.toString()
      )
    : match.teams.find(
        (t) => t.team.toString() !== match.toss.winner.toString()
      );
};
