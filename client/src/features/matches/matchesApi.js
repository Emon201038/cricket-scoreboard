import { socket } from "../../socket";
import { apiSlice } from "../api/apiSlice";

const matchesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMatch: builder.mutation({
      query: (data) => ({
        url: "/matches/create",
        method: "POST",
        body: data,
      }),
    }),
    getAllMatches: builder.query({
      query: () => ({
        url: "/matches",
        method: "GET",
      }),
      async onCacheEntryAdded(arg, { cacheDataLoaded, updateCachedData }) {
        await cacheDataLoaded;
        if (socket) {
          socket?.on("update-matches", (res) => {
            updateCachedData((draft) => {
              const targetedMatch = draft.payload.find(
                (m) => m?._id == res?.data?.payload?._id
              );
              targetedMatch.data.score[0].firstInnings.totals =
                res?.data?.payload?.data?.score[0]?.firstInnings?.totals;
              targetedMatch.data.score[0].firstInnings.currentBowler.timeLine =
                res?.data?.payload?.data?.score[0]?.firstInnings?.currentBowler?.timeLine;
              targetedMatch.data.score[0].firstInnings.bowling =
                res?.data?.payload?.data?.score[0]?.firstInnings?.bowling;
            });
          });
        }
      },
    }),
    getSingleMatche: builder.query({
      query: (id) => ({
        url: `/matches/${id}`,
        method: "GET",
      }),
      async onCacheEntryAdded(arg, { cacheDataLoaded, updateCachedData }) {
        await cacheDataLoaded;
        if (socket) {
          socket?.on("update-ui", (res) => {
            updateCachedData((draft) => {
              draft.payload = res?.data?.payload;
              // draft.payload.data.score[0].firstInnings.currentBowler.timeLine =
              //   res?.data?.payload?.data?.score[0]?.firstInnings?.currentBowler?.timeLine;
              // draft.payload.data.score[0].firstInnings.batting =
              //   res?.data?.payload?.data?.score[0]?.firstInnings?.batting;
              // draft.payload.data.score[0].firstInnings.bowling =
              //   res?.data?.payload?.data?.score[0]?.firstInnings?.bowling;
              // draft.payload.data.score[0].firstInnings.ballsTimeLine =
              //   res?.data?.payload?.data?.score[0]?.firstInnings?.ballsTimeLine;
            });
          });
          socket?.on("update-ui-bowler", (res) => {
            updateCachedData((draft) => {
              draft.payload = res.payload.updatedMatch;
            });
          });
        }
      },
    }),
    getSingleInnings: builder.query({
      query: (id) => ({
        url: `/innings/${id}`,
        method: "GET",
      }),
    }),
    getSingleMatcheForOpening: builder.query({
      query: (id) => ({
        url: `/matches/opening/${id}`,
        method: "GET",
      }),
    }),
    updateMatchPlayers: builder.mutation({
      query: (data) => ({
        url: `matches/update/players/${data?.id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData(
              "getSingleMatche",
              arg?.id,
              (draft) => {
                draft.payload = res?.data?.payload?.updatedMatch;
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateOpeningStat: builder.mutation({
      query: (data) => ({
        url: `matches/update/opening-stat/${data?.id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData(
              "getSingleMatche",
              arg?.id,
              (draft) => {
                draft.payload = res?.data?.payload?.updatedMatch;
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateBall: builder.mutation({
      query: (data) => ({
        url: `matches/update/ball/${data?.id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const response = await queryFulfilled;
          if (socket) {
            socket?.emit("update-ball", response);
          }
          dispatch(
            apiSlice.util.updateQueryData(
              "getSingleMatche",
              arg?.id,
              (draft) => {
                draft.payload.data.score[0].firstInnings.totals =
                  response?.data?.payload?.data?.score[0]?.firstInnings?.totals;
                draft.payload.data = response?.data?.payload?.data;
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateCurrentBowler: builder.mutation({
      query: (data) => ({
        url: `matches/update/currentBowler/${data.id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const response = await queryFulfilled;
          socket?.emit("update-bowler", response.data);

          dispatch(
            apiSlice.util.updateQueryData(
              "getSingleMatche",
              arg?.id,
              (draft) => {
                draft.payload = response?.data?.payload?.updatedMatch;
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateNextBatsman: builder.mutation({
      query: (data) => ({
        url: `matches/update/nextBatsman/${data.id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const response = await queryFulfilled;
          socket?.emit("update-batsman", response.data);

          dispatch(
            apiSlice.util.updateQueryData(
              "getSingleMatche",
              arg?.id,
              (draft) => {
                draft.payload = response?.data?.payload?.updatedMatch;
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});
export default matchesApi.reducer;
export const {
  useCreateMatchMutation,
  useGetAllMatchesQuery,
  useGetSingleMatcheForOpeningQuery,
  useGetSingleMatcheQuery,
  useGetSingleInningsQuery,
  useUpdateMatchPlayersMutation,
  useUpdateOpeningStatMutation,
  useUpdateBallMutation,
  useUpdateCurrentBowlerMutation,
  useUpdateNextBatsmanMutation,
} = matchesApi;
