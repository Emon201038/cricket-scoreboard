import Head from "./Head";
import Select from "./Select";
import Batsman from "./Batsman";
import Bowler from "./Bowler";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMatch } from "../utils/fetchData";

const Match = () => {
  const { id } = useParams();
  const [match, setMatch] = useState();
  const [innings, setInnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchInnings = async () => {
      try {
        setIsLoading(true);
        setError();
        const buffer = await fetch(
          `http://localhost:3001/api/v1/innings/${id}`
        );
        const res = await buffer.json();
        if (!res.success) {
          setError(res.message);
        } else {
          setInnings(res.payload);
          // const batsmanRes = await fetchBatsmans(res.payload);
        }
      } catch (error) {
        // console.log(error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInnings();
    fetchMatch(setIsLoading, setError, setMatch, id);
  }, [id]);

  const tossWinnerTeam = match?.toss?.winner?._id;

  const battingTeam =
    match?.toss?.decision === "bat"
      ? match?.teams?.find((t) => t?.team?._id === tossWinnerTeam)
      : match?.teams?.find((t) => t?.team?._id !== tossWinnerTeam);

  const [selectedTeam, setSelectedTeam] = useState(battingTeam);
  useEffect(() => {
    setSelectedTeam(battingTeam);
    return () => {
      /* cleanup code */
    };
  }, [battingTeam]);

  const currentInnings = innings.find(
    (t) => t?.teamId === selectedTeam?.team?._id
  );
  let content;
  if (isLoading) {
    content = <div>Loading</div>;
  }
  if (!isLoading && error) {
    content = <div>{error}</div>;
  }
  if (!isLoading && !error) {
    content = (
      <div>
        <div className=" bg-[#202124] text-white text-opacity-75 w-[600px] shadow-md ">
          <Head innings={innings} match={match} />
          <Select
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            match={match}
            inningsId={
              innings?.length > 0 && innings?.length === 1
                ? innings[0]?._id
                : innings[1]?._id
            }
          />
          <div className="px-4 py-2">
            {!currentInnings ? (
              <table className="w-full">
                <thead className="border-b-[1px] border-slate-700 font-semibold">
                  {selectedTeam?.team?.name + " " + " Line up"}
                </thead>
                {selectedTeam?.playingXi?.map((p, index) => (
                  <tr
                    key={p?._id}
                    className={`align-top ${
                      selectedTeam?.playingXi?.length === index + 1
                        ? ""
                        : "border-b-[1px]"
                    } border-slate-700`}
                  >
                    <td className="py-2 w-2/3">{p?.name}</td>
                  </tr>
                ))}
              </table>
            ) : (
              <>
                <Batsman match={currentInnings} />
                <Bowler innigsId={currentInnings?._id} />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-950 w-full flex justify-center items-center">
      {content}
    </div>
  );
};

export default Match;
