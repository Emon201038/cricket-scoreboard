export const isPlayerPlaying = (team, id) => {
  for (const player of team.playingXi) {
    if (player._id.toString() === id.toString()) {
      return true;
    }
  }

  return false;
};
