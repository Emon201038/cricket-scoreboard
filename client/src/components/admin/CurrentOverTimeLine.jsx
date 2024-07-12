const CurrentOverTimeLine = ({ data }) => {
  return (
    <div className="w-full flex gap-3 justify-start items-center h-9 my-5">
      <h2 className="w-[80px]">This over :</h2>
      <div className=" flex gap-2 overflow-x-auto">
        {data?.payload?.data?.score[0]?.firstInnings?.currentBowler?.timeLine?.map(
          (ball, index) => (
            <div
              key={index}
              className={`size-6 border border-slate-400 rounded-full flex justify-center items-center text-[10px] ${
                ball?.runsTaken === 6
                  ? "bg-green-700 font-bold"
                  : ball?.runsTaken === 4
                  ? "bg-sky-700 font-bold"
                  : "bg-slate-700"
              } ${ball?.isWicket && "bg-red-500"}`}
            >
              {ball?.extra !== null && ball?.extra}
              {ball?.runsTaken}
              {ball?.isWicket && "W"}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CurrentOverTimeLine;
