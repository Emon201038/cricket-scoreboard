import { Fragment, useEffect, useState } from "react";
import { getFormatedOvr } from "../utils/getFormatedOvr";

/* eslint-disable react/prop-types */
const Batsman = ({ match }) => {
  const [batsmans, setBatsmans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchNotOutBatsman = async () => {
      setError();
      setIsLoading(true);
      try {
        const buffer = await fetch(
          `http://localhost:3001/api/v1/batsman/${match?._id}`
        );
        const res = await buffer.json();
        if (res.success) {
          setBatsmans(res.payload);
        } else {
          setError(res.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotOutBatsman();
    return () => {
      /* cleanup code */
    };
  }, [match]);

  const tossWinnerTeam = match?.matchId?.toss?.winner;

  const battingTeam =
    match?.matchId?.toss?.decision === "bat"
      ? match?.matchId?.teams?.find((t) => t?.team === tossWinnerTeam)
      : match?.matchId?.teams?.find((t) => t?.team !== tossWinnerTeam);

  const notBatPlayers = battingTeam?.playingXi?.filter(
    (p) => !batsmans?.some((b) => b?.player?._id === p?._id)
  );
  if (isLoading) {
    return <div>Loading batsman....</div>;
  }
  if (!isLoading && error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <table className="w-full text-sm">
        <tbody>
          <tr className="text-left border-b-[1px] border-slate-700">
            <td className="pb-2">
              <h3 className="font-semibold">Batting</h3>
            </td>
            <td className="pb-2">R</td>
            <td className="pb-2">B</td>
            <td className="pb-2">4s</td>
            <td className="pb-2">6s</td>
            <td className="pb-2">S/R</td>
          </tr>
          {batsmans?.map((b) => {
            return (
              <Fragment key={b?._id}>
                <tr
                  key={b?._id}
                  className="align-top border-b-[1px] border-slate-700"
                >
                  <td className="py-2 w-2/3">
                    <div>
                      <div>
                        {b?.player?.name}
                        {b?.isStriker && <sup>*</sup>}
                      </div>
                      {b?.status === "out" ? (
                        <p className="text-[12px]">{b?.out?.dismissalText}</p>
                      ) : (
                        <p className="text-[12px]">Not out</p>
                      )}
                    </div>
                  </td>
                  <td className="py-2">{b?.runs}</td>
                  <td className="py-2">{b?.ballsFaced}</td>
                  <td className="py-2">{b["4s"]}</td>
                  <td className="py-2">{b["6s"]}</td>
                  <td className="py-2">{b?.strikeRate}</td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="w-full flex justify-between mb-4 py-3 pr-[68px] text-[14px] border-b-[1px] border-slate-700">
        <p className=" mb-2">Extras</p>
        <p className="pr-10">
          {match?.extras?.wides +
            match?.extras?.legByes +
            match?.extras?.noBalls +
            match?.extras?.byes}{" "}
          (WD {match?.extras?.wides}, LB {match?.extras?.legByes}, NB{" "}
          {match?.extras?.noBalls}, B {match?.extras?.byes})
        </p>
      </div>
      <div className="w-full flex justify-between mb-4 pb-3 pr-8 border-b-[1px] border-slate-700">
        <h3 className="mb-2">Total runs</h3>
        <p className="pr-6">
          {match?.runs} ({match?.wickets} wkts,{" "}
          {Math.floor(match?.balls) + "." + (match?.balls % 6)} ov)
        </p>
      </div>
      <div className="mb-3 border-b-[1px] border-slate-700 pb-3">
        <h3 className="font-semibold mb-2">Yet to bat</h3>
        <div className="flex flex-wrap gap-2">
          {notBatPlayers?.map((p, index) => (
            <p
              className="
            "
              key={p.name}
            >
              {p.name} {notBatPlayers?.length === index + 1 ? "" : "•"}
            </p>
          ))}
        </div>
      </div>
      <div className="mb-3 pb-3 border-b-[1px] border-slate-700">
        <div>Fall of wickets</div>
        <div className="flex flex-wrap gap-2 items-center text-sm">
          {match?.fallsOfWicket?.map((wicket, index) => (
            <div key={wicket?._id}>
              {wicket?.run + "/" + Number(index + 1)}
              {"  (" +
                wicket?.batsman?.player?.name +
                ", " +
                getFormatedOvr(wicket?.over) +
                " ov" +
                ")"}
              {match?.fallsOfWicket?.length === index + 1 ? "" : "  •  "}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap">
          {match?.data?.score[0]?.firstInnings?.fallsOfWicket?.map((w) => (
            <div key={w?._id}>16/1 (R.Talukdar, 1.4 ov) .</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Batsman;
