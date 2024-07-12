export const handleNormalRun = (runs = {}, setRuns) => {
  if (runs.runsTaken !== null) {
    const run = runs.runsTaken !== 0 ? runs.runsTaken : 0;

    // const ballInfo = {
    //   runs: run,
    //   totalRuns: totalRuns,
    //   extra: null,
    //   ballCount: true,
    // };
    setRuns((prev) => ({
      ...prev,
      runsTaken: run,
      extra: null,
      ballCount: true,
    }));
  }
};

export const handleExtraRun = (runs, setRuns) => {
  if (runs.extra === "w" || runs.extra === "nb") {
    handleWideOrNoBall(runs, setRuns);
  } else {
    handleByesOrLegByes(runs, setRuns);
  }
};

const handleWideOrNoBall = (runs = {}, setRuns) => {
  if (runs.runsTaken !== 0 || runs.runsTaken !== null) {
    setRuns((prev) => ({
      ...prev,
      ballCount: false,
    }));
  }
};

const handleByesOrLegByes = (runs = {}, setRuns) => {
  if (runs.runsTaken !== null) {
    const run = runs.runsTaken !== 0 ? runs.runsTaken : 0;

    // const ballInfo = {
    //   runs: runs,
    //   totalRuns: totalRuns,
    //   extra: extraType,
    //   ballCount: true,
    // };
    setRuns((prev) => ({
      ...prev,
      runsTaken: run,
      ballCount: true,
    }));
  }
};
