import { useEffect, useState } from "react";

const Bowler = ({ matchId, inningsId }) => {
  const [innings, setInnings] = useState([]);
  const [overs, setOvers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchInnings = async () => {
      setIsLoading(true);
      try {
        const buffer = await fetch(
          `http://localhost:3001/api/v1/innings/${matchId}`
        );
        const res = await buffer.json();
        if (res.success) {
          setInnings(res.payload);
        } else {
          setError(res.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInnings();
    return () => {
      /* cleanup code */
    };
  }, [matchId]);

  useEffect(() => {
    const overs = async () => {
      setIsLoading(true);
      try {
        const buffer = await fetch(
          `http://localhost:3001/api/v1/bowler/${inningsId}`
        );
        const res = await buffer.json();
        if (res.success) {
          setOvers(res.payload);
        } else {
          setError(res.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    overs();
    return () => {
      /* cleanup code */
    };
  }, [inningsId]);

  const lastTwoOvers = () => {
    if (overs?.length <= 2) {
      return overs;
    }
    return overs?.slice(-2);
  };

  // const formatStats = (over) => {
  //   const bowler = over.bowler.name;
  //   const totalRuns = over.balls.reduce(
  //     (sum, ball) =>
  //       sum +
  //       ball.runs +
  //       (ball.extras && ball.extras.runs ? ball.extras.runs : 0),
  //     0
  //   );
  //   const totalWickets = over.balls.reduce(
  //     (sum, ball) => sum + (ball.wicket ? 1 : 0),
  //     0
  //   );
  //   const legalBalls = over.balls.reduce(
  //     (sum, ball) =>
  //       sum +
  //       (!ball.extras ||
  //       ball.extras.type === "byes" ||
  //       ball.extras.type === "leg-byes"
  //         ? 1
  //         : 0),
  //     0
  //   );
  //   const overs = Math.floor(legalBalls / 6);
  //   const balls = legalBalls % 6;

  //   return `${bowler}: ${totalWickets}/${totalRuns} (${overs}.${balls})`;
  // };

  return (
    <div>
      {lastTwoOvers()?.map((over, index) => (
        <div key={over?._id} className="flex items-center gap-3">
          <p className="text-[12px]">
            {over?.player?.name +
              " :  " +
              over?.wicketTaken +
              "/" +
              over?.runsConceded +
              "  (" +
              Math.floor(over?.overBowled / 6) +
              "." +
              (over?.overBowled % 6) +
              ")"}
          </p>
          {lastTwoOvers()?.length > 0 && lastTwoOvers()?.length === 1 ? (
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          ) : (
            index === 1 && (
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Bowler;
