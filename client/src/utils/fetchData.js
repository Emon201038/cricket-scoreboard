export const fetchBatsmans = async (inningsId) => {
  const buffer = await fetch(
    `http://localhost:3001/v1/api/batsman/${inningsId}`
  );
  const res = await buffer.json();
  return res;
};

export const fetchMatch = async (setIsLoading, setError, setMatch, matchId) => {
  setIsLoading(true);
  setError();
  try {
    const buffer = await fetch(
      `http://localhost:3001/api/v1/matches/${matchId}`
    );
    const res = await buffer.json();
    if (res.success) {
      setMatch(res.payload);
    } else {
      setError(res.message);
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

export const fetchNotOutBatsman = async (inningsId) => {
  try {
    const buffer = await fetch(
      `http://localhost:3001/api/v1/batsman/not_out/${inningsId}`
    );
    const res = await buffer.json();
    if (res.success) {
      return res.payload;
    } else {
      console.log(res.message);
    }
  } catch (error) {
    console.log(error.message);
  }
};
