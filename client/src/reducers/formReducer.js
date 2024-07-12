/* eslint-disable no-case-declarations */
export const formInitialState = {
  stepper: {
    currentStep: 1,
    complete: false,
  },
  step1: {
    hostTeam: "",
    visitorTeam: "",
    teams: [
      {
        teamName: "",
        players: [],
      },
      {
        teamName: "",
        players: [],
      },
    ],
    tossWinner: "",
    electedTo: "",
    overLimit: "",
    playersNumber: "",
    maxOverPerBowler: "",
  },
  stage2: {
    opening: {},
  },
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        stepper: {
          ...state.stepper,
          currentStep: action.payload.step,
        },
      };
    case "STEP_1":
      return {
        ...state,
        step1: {
          ...action.payload,
          teams: [
            {
              teamName: action.payload.hostTeam,
              players: [],
            },
            {
              teamName: action.payload.visitorTeam,
              players: [],
            },
          ],
        },
      };
    case "STEP_2":
      return {
        ...state,
        step1: {
          ...state.step1,
          teams: state.step1.teams.map((team, index) => {
            if (index === 0) {
              return { ...team, players: action.payload.host };
            } else if (index === 1) {
              return { ...team, players: action.payload.visitor };
            } else {
              return team;
            }
          }),
        },
      };
    case "STEP_3":
      return {
        ...state,
        stage2: {
          opening: {
            ...action.payload,
          },
        },
      };

    default:
      return state;
  }
};

export default formReducer;
