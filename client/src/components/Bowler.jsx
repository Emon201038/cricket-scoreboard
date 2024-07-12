import { useEffect, useState } from "react";

const Bowler = ({ innigsId }) => {
  const [overs, setOvers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchBowler = async () => {
      setError();
      setIsLoading(true);
      try {
        const buffer = await fetch(
          `http://localhost:3001/api/v1/bowler/${innigsId}`
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

    fetchBowler();
    return () => {
      /* cleanup code */
    };
  }, [innigsId]);

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="text-left border-b-[1px] border-slate-700">
            <th className="pb-2">
              <h3 className="font-semibold">Bowler</h3>
            </th>
            <th className="pb-2">O</th>
            <th className="pb-2">M</th>
            <th className="pb-2">W</th>
            <th className="pb-2">R</th>
            <th className="pb-2">Ecn</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <div>Loading....</div>
          ) : (
            overs?.map((bowler) => (
              <tr
                key={bowler?._id}
                className="align-top border-b-[1px] border-slate-700"
              >
                <td className="py-2 flex gap-2 justify-start items-center">
                  <p>{bowler?.player?.name}</p>
                </td>
                <td className="py-2">
                  {Math.floor(bowler?.overBowled / 6) +
                    "." +
                    (bowler?.overBowled % 6)}
                </td>
                <td className="py-2">{bowler?.maidens}</td>
                <td className="py-2">{bowler?.wicketTaken}</td>
                <td className="py-2">{bowler?.runsConceded}</td>
                <td className="py-2">{bowler?.economy}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default Bowler;
