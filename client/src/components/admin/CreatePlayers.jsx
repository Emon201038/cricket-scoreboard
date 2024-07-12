import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleMatcheQuery,
  useUpdateMatchPlayersMutation,
} from "../../features/matches/matchesApi";
import { useEffect, useState } from "react";

const CreatePlayers = () => {
  const { playerNumber, matchId } = useParams();
  const { isLoading, isError, error, data } = useGetSingleMatcheQuery(matchId);
  const [
    updateMatch,
    {
      isLoading: updateLoading,
      isError: updateIsError,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateMatchPlayersMutation();
  const navigate = useNavigate();

  const initializeFormData = () => {
    const defaultFormData = [];
    for (let i = 0; i < Number(playerNumber); i++) {
      defaultFormData.push({
        name: "",
        battingStyle: "right-handed",
        bowlingStyle: "right-handed",
      });
    }
    return defaultFormData;
  };

  const [team1FormData, setTeam1FormData] = useState(initializeFormData());
  const [team2FormData, setTeam2FormData] = useState(initializeFormData());
  const handleInputChange = (team, index, field, value) => {
    const newData = [...team];
    newData[index] = { ...newData[index], [field]: value };
    return newData;
  };

  const handleInputChange1 = (index, field, value) => {
    setTeam1FormData((prevData) =>
      handleInputChange(prevData, index, field, value)
    );
  };

  const handleInputChange2 = (index, field, value) => {
    setTeam2FormData((prevData) =>
      handleInputChange(prevData, index, field, value)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMatch({
      id: matchId,
      team1: {
        teamName: data?.payload?.data?.teams[0]?.teamName,
        _id: data?.payload?.data?.teams[0]?._id,
        players: team1FormData,
      },
      team2: {
        teamName: data?.payload?.data?.teams[1]?.teamName,
        _id: data?.payload?.data?.teams[1]?._id,
        players: team2FormData,
      },
    });
  };

  useEffect(() => {
    if (updateData) {
      navigate(`/match/update/opening-state/${matchId}`);
    }
  }, [updateData, navigate, matchId]);

  //decide what to render
  let content = null;
  if (isLoading) {
    content = "Match is loading";
  }
  if (!isLoading && isError) {
    content = error;
  }
  if (!isLoading && !isError && data) {
    content = (
      <form onSubmit={handleSubmit} className="w-full center flex-col py-4">
        <div className="center gap-2 lg:w-1/2 md:w-1/2 sm:w-[95%] max-sm:w-[97%]">
          <div className="flex flex-col gap-2">
            <h1 className=" uppercase font-semibold">
              {data?.payload?.data?.teams[0]?.teamName} players:
            </h1>
            {[...Array(Number(playerNumber))].map((_, index) => (
              <div key={index}>
                <p>{`player-${index + 1}`}:</p>
                <div className="space-x-2 bg-gray-700 p-2">
                  <label className="text-[12px]">Name:</label>
                  <input
                    required
                    name={`player-${index + 1}-name`}
                    id={`player-${index + 1}`}
                    type="text"
                    value={team1FormData[index]?.name || ""}
                    onChange={(e) =>
                      handleInputChange1(index, "name", e.target.value)
                    }
                    placeholder="name"
                    className="text-white bg-gray-700 outline-none border-b px-2 w-2/3"
                  />
                </div>
                <div className="space-x-2 bg-gray-700 p-2">
                  <label className="text-[12px]">Batting-Style:</label>
                  <select
                    name={`player-${index + 1}-batting-style`}
                    id={`player-${index + 1}`}
                    value={team1FormData[index]?.battingStyle || "right-handed"}
                    onChange={(e) => {
                      handleInputChange1(index, "battingStyle", e.target.value);
                    }}
                    className="w-2/5 bg-gray-700 text-white text-[12px]"
                  >
                    <option value="right-handed">Right handed</option>
                    <option value="left-handed">Left handed</option>
                  </select>
                </div>
                <div className="space-x-2 bg-gray-700 p-2">
                  <label className="text-[12px]">Bowling-Style:</label>
                  <select
                    name={`player-${index + 1}-bowling-style`}
                    id={`player-${index + 1}`}
                    value={team1FormData[index]?.bowlingStyle || "right-handed"}
                    onChange={(e) =>
                      handleInputChange1(index, "bowlingStyle", e.target.value)
                    }
                    className="w-[35%] bg-gray-700 text-white text-[12px]"
                  >
                    <option value="right-handed">Right handed</option>
                    <option value="left-handed">Left handed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="uppercase font-semibold">
              {data?.payload?.data?.teams[1]?.teamName} players:
            </h1>
            {[...Array(Number(playerNumber))].map((_, index) => (
              <div key={index}>
                <p>{`player-${index + 1}`}</p>
                <div className="space-x-2 bg-gray-700 p-2">
                  <label className="text-[12px]">Name:</label>
                  <input
                    required
                    name={`player-${index + 1}-name`}
                    id={`player-${index + 1}`}
                    type="text"
                    value={team2FormData[index]?.name || ""}
                    onChange={(e) =>
                      handleInputChange2(index, "name", e.target.value)
                    }
                    placeholder="name"
                    className="text-white bg-gray-700 outline-none border-b px-2 w-3/5"
                  />
                </div>
                <div className="space-x-2 bg-gray-700 p-2">
                  <label className="text-[12px]">Batting-Style:</label>
                  <select
                    name={`player-${index + 1}-batting-style`}
                    id={`player-${index + 1}`}
                    value={team2FormData[index]?.battingStyle || "right-handed"}
                    onChange={(e) =>
                      handleInputChange2(index, "battingStyle", e.target.value)
                    }
                    className="w-2/5 bg-gray-700 text-white text-[12px]"
                  >
                    <option value="right-handed">Right handed</option>
                    <option value="left-handed">Left handed</option>
                  </select>
                </div>
                <div className="space-x-2 bg-gray-700 p-2">
                  <label className="text-[12px]">Bowling-Style:</label>
                  <select
                    name={`player-${index + 1}-bowling-style`}
                    id={`player-${index + 1}`}
                    value={team2FormData[index]?.bowlingStyle || "right-handed"}
                    onChange={(e) =>
                      handleInputChange2(index, "bowlingStyle", e.target.value)
                    }
                    className="w-[35%] bg-gray-700 text-white text-[12px]"
                  >
                    <option value="right-handed">Right handed</option>
                    <option value="left-handed">Left handed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
        {updateIsError && <div>{updateError}</div>}
        <button
          disabled={updateLoading}
          type="submit"
          className="lg:w-[512px] md:w-1/2 sm:w-[95%] max-sm:w-[97%] my-3 p-2 bg-green-600 rounded-sm"
        >
          {updateLoading ? "loading" : " Next"}
        </button>
      </form>
    );
  }

  return (
    <div className=" bg-gray-900 text-white flex justify-center items-center">
      {content}
    </div>
  );
};

export default CreatePlayers;
