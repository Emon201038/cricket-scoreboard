import { useState } from "react";

export default function useGetOver(match) {
  const [over, setOver] = useState(0);

  setOver(
    Math.floor(match?.data?.score[0]?.firstInnings?.totals?.B / 6) +
      "." +
      (match?.data?.score[0]?.firstInnings?.totals?.B % 6)
  );

  return over;
}
