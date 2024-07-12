import { currentBowlingTeam } from "../../utils/batsmanData";

const UpdateSection = ({
  updateCurrentOver,
  updateIsError,
  updateError,
  isLoading,
  match,
  wicket,
  setWicket,
  runs,
  setRuns,
}) => {
  const fieldingTeam = currentBowlingTeam(match?.data);
  const currentInnings =
    match?.data?.currentInnings === 1 ? "firstInnings" : "secondInnings";
  const currentBastman = match?.data?.score[0]?.[
    currentInnings
  ]?.batting?.filter((b) => b?.status === "batting");
  const { isWicket, wicketType, helpedBy } = wicket || {};
  const { extra, runsTaken } = runs || {};

  const handleExtraChange = (e) => {
    const value = e.target.id;
    const ball = value === null || value === "b" || value === "lb";

    setRuns((prev) => ({
      ...prev,
      extra: prev.extra === value ? null : value,
      ballCount: ball,
    }));
  };

  const handleRunChange = (value) => {
    if (runsTaken === value) {
      if (extra) {
        if (extra === "w" || extra === "nb") {
          setRuns((prev) => ({ ...prev, runsTaken: null, ballCount: false }));
        }
        setRuns((prev) => ({ ...prev, runsTaken: null, ballCount: true }));
      } else {
        setRuns((prev) => ({ ...prev, runsTaken: null, extra: null }));
      }
    } else {
      if (extra) {
        if (extra === "w" || extra === "nb") {
          setRuns((prev) => ({ ...prev, runsTaken: value, ballCount: false }));
        }
        setRuns((prev) => ({ ...prev, runsTaken: value, ballCount: true }));
      } else {
        setRuns((prev) => ({ ...prev, runsTaken: value, extra: null }));
      }
    }
  };

  return (
    <form
      onSubmit={updateCurrentOver}
      className="border border-slate-700 flex flex-col justify-center items-start p-2 mb-2"
    >
      <h1 className="font-semibold text-emerald-400">Update section</h1>
      <div className="py-4 flex gap-2">
        <p>Extras type:</p>
        <div className="flex gap-6">
          {["wd", "nb", "b", "lb"].map((extraRun, index) => {
            let extraType;
            if (extraRun === "wd") {
              extraType = "wide";
            } else if (extraRun === "nb") {
              extraType = "no-ball";
            } else if (extraRun === "b") {
              extraType = "byes";
            } else if (extraRun === "lb") {
              extraType = "lef-byes";
            }
            return (
              <div className="flex gap-2" key={index}>
                <input
                  type="checkbox"
                  id={extraRun}
                  checked={extraRun === extra}
                  onChange={handleExtraChange}
                />
                <label htmlFor={extraRun}>{extraType}</label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 items-center py-3">
        <p>Runs:</p>
        <div className="flex gap-4">
          {[0, 1, 2, 3, 4, 5, 6].map((value) => (
            <div
              key={value}
              onClick={() => {
                handleRunChange(value);
              }}
              className={`size-6 rounded-full border border-slate-400 flex justify-center items-center cursor-pointer  ${
                runsTaken === value ? "bg-emerald-500" : ""
              }`}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
      <div className="space-x-4">
        <label htmlFor="wicket">Wicket:</label>
        <input
          type="checkbox"
          name="wicket"
          id=""
          value={isWicket}
          checked={isWicket}
          onChange={(e) => setWicket({ ...wicket, isWicket: e.target.checked })}
        />
      </div>
      {isWicket && (
        <div className=" flex flex-col justify-center items-center py-2 mb-2">
          <div className="py-2 flex items-center gap-2">
            <label htmlFor="wicketType">Wicket Type:</label>
            <select
              id="wicketType"
              value={wicketType}
              onChange={(e) =>
                setWicket({ ...wicket, wicketType: e.target.value })
              }
              className="text-gray-700 rounded-sm appearance-none pl-2"
              required={isWicket}
            >
              <option value="">select type</option>
              {[
                "caught",
                "bowled",
                "run out striker",
                "run out non-striker",
                "stamping",
                "hit wicket",
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {(wicketType === "caught" ||
            wicketType === "run out striker" ||
            wicketType === "run out non-striker" ||
            wicketType === "stamping") && (
            <div>
              <label htmlFor="helpedBy">
                {wicketType === "caught"
                  ? "Catch"
                  : wicketType === "stamping"
                  ? "Stamping"
                  : "Run out"}{" "}
                by:{" "}
              </label>
              <select
                name="helpedBy"
                id="helpedBy"
                className="text-gray-700 rounded-sm appearance-none px-2"
                required={wicketType === "caught" || wicketType === "stamping"}
                onChange={(e) => {
                  const selectedPlayer = fieldingTeam?.players?.find(
                    (p) => p?.name === e.target.value
                  );
                  setWicket({
                    ...wicket,
                    helpedBy: {
                      name: selectedPlayer?.name,
                      id: selectedPlayer?._id,
                    },
                  });
                }}
                value={helpedBy?.name}
              >
                <option value="">select catcher</option>
                {fieldingTeam?.players?.map((p) => (
                  <option key={p?._id} value={p?.name}>
                    {p?.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-5">
        <button
          disabled={isLoading}
          type="submit"
          className="py-0 px-3 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white h-[30px] transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-sm max-w-md"
        >
          {isLoading ? (
            <>
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="mr-2 animate-spin"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
              </svg>
              loading{" "}
            </>
          ) : (
            "Update ball"
          )}
        </button>
        <button disabled className=" bg-red-600 p-1 rounded-sm my-2">
          Undo
        </button>
      </div>
      {updateIsError && (
        <div className="text-red-500">{updateError?.data?.message}</div>
      )}
      {currentBastman?.length !== 2 && <h1> Next batsman</h1>}
    </form>
  );
};

export default UpdateSection;
