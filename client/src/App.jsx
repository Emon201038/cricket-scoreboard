import Match from "./components/Match";
import Matches from "./components/Matches";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Admin from "./components/admin/admin";
import CreatePlayers from "./components/admin/CreatePlayers";
import SetOpeningStat from "./components/admin/SetOpeningStat";
import MatchCreate from "./components/admin/MatchCreate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Matches />} />
        <Route path="/match/:id" exact element={<Match />} />
        <Route path="/create" exact element={<MatchCreate />} />
        <Route
          path="/match/update/players/:playerNumber/:matchId"
          element={<CreatePlayers />}
        />
        <Route
          path="/match/update/opening-state/:matchId"
          element={<SetOpeningStat />}
        />
        <Route path="/match/update/score/:id" exact element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
