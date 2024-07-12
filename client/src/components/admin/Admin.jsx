import { useEffect, useState } from "react";
import { connectSocket, socket } from "../../socket";
import { useParams } from "react-router-dom";
import {
  useGetSingleMatcheQuery,
  useUpdateBallMutation,
} from "../../features/matches/matchesApi";
import Bowler from "../Bowler";
import Batsman from "../Batsman";
import NextBowlerModal from "./NextBowlerModal";
import CurrentOverTimeLine from "./CurrentOverTimeLine";
import UpdateSection from "./UpdateSection";
import Head from "../Head";

const Admin = () => {
  const [runs, setRuns] = useState({
    extra: null,
    ballCount: false,
    runsTaken: null,
  });
  const [wicket, setWicket] = useState({
    isWicket: false,
    wicketType: "",
    helpedBy: {
      name: "",
      id: "",
    },
  });
  const [openModal, setOpenModal] = useState({ type: "", status: false });

  const { id } = useParams();
  const { isLoading, data, isError, error } = useGetSingleMatcheQuery(id);
  const [
    updateBall,
    {
      isLoading: updateLoading,
      isError: updateIsError,
      error: updateError,
      data: updateResponse,
    },
  ] = useUpdateBallMutation();

  useEffect(() => {
    if (!socket) {
      connectSocket();
    }
  }, []);

  useEffect(() => {
    if (updateIsError) {
      if (updateError?.data?.message === "update next batsman") {
        setOpenModal((prev) => ({ ...prev, type: "batsman", status: true }));
      }
      if (
        updateError?.data?.message ===
        "current bowler has already bowled 6 balls. Please select next bowler"
      ) {
        setOpenModal((prev) => ({ ...prev, type: "bowler", status: true }));
      }
    }
  }, [updateIsError, updateError]);
  useEffect(() => {
    if (updateResponse) {
      const currentInnings =
        updateResponse?.payload?.data?.currentInnings === 1
          ? "firstInnings"
          : "secondInnings";
      const currentBatsman = updateResponse?.payload?.data?.score[0]?.[
        currentInnings
      ]?.batting?.filter((b) => b.status === "batting");

      if (
        updateResponse?.payload?.data?.score[0]?.[currentInnings]?.currentBowler
          ?.ball === 6
      ) {
        setOpenModal((prev) => ({ ...prev, type: "bowler", status: true }));
      }
      if (currentBatsman?.length === 1) {
        setOpenModal((prev) => ({ ...prev, type: "batsman", status: true }));
      }
    }
  }, [updateResponse]);

  const updateCurrentOver = (e) => {
    e.preventDefault();

    let run = runs.runsTaken !== null ? runs.runsTaken : 0;
    let totalRuns = 0;

    if (runs.extra === "wd" || runs.extra === "nb") {
      totalRuns = run + 1;
    } else {
      totalRuns = run;
    }

    if (runs.runsTaken || runs.extra || wicket.isWicket) {
      updateBall({
        ballInfo: {
          runsTaken: runs.runsTaken,
          ballCount: !runs.extra || ["b", "lb"].includes(runs.extra),
          totalRuns: totalRuns,
          extra: runs.extra,
        },
        id: id,
        wicket: wicket,
      });
      setRuns({
        ballCount: false,
        extras: null,
        runsTaken: null,
        totalRuns: 0,
      });
      setWicket({
        isWicket: false,
        wicketType: "",
        helpedBy: {
          name: "",
          id: "",
        },
      });
    }
  };

  let content = null;

  if (isLoading) {
    content = "Match is loading";
  }
  if (!isLoading && isError) {
    content = error;
  }
  if (!isLoading && !isError && data) {
    content = (
      <>
        <Head match={data?.payload} />
        <div className="px-4 py-2">
          <CurrentOverTimeLine data={data} />
          <UpdateSection
            updateCurrentOver={updateCurrentOver}
            updateIsError={updateIsError}
            updateError={updateError}
            isLoading={updateLoading}
            match={data?.payload}
            wicket={wicket}
            setWicket={setWicket}
            runs={runs}
            setRuns={setRuns}
          />
          <Batsman match={data?.payload} />
          <Bowler match={data?.payload} />
        </div>
        {openModal.status && (
          <NextBowlerModal
            match={data}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        )}
      </>
    );
  }
  return (
    <div className="bg-[rgba(0,0,0,0.9)] w-screen  flex justify-center items-center">
      <div className=" bg-[rgb(32,33,36)] text-white text-opacity-75 w-[600px] shadow-md ">
        {content}
      </div>
    </div>
  );
};

export default Admin;
