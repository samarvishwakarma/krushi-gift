import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Landour from "./pages/Landour";
import Navsari from "./pages/Navsari";
import Morse from "./pages/Morse";
import RandomDay from "./pages/RandomDay";
import Calendar from "./pages/Calendar";
import MissMe from "./pages/MissMe";
import Homesick from "./pages/Homesick";
import Truce from "./pages/Truce";
import FoundOne from "./pages/FoundOne";
import FinalSecret from "./pages/FinalSecret";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/landour-9af3d2" element={<Landour />} />
        <Route path="/navsari-b8k1p4" element={<Navsari />} />
        <Route path="/morse-c7x9q1" element={<Morse />} />
        <Route path="/random-f2m8z5" element={<RandomDay />} />
        <Route path="/calendar-k9r4w2" element={<Calendar />} />
        <Route path="/missme-p8d4x7" element={<MissMe />} />
        <Route path="/homesick-m3z7k1" element={<Homesick />} />
        <Route path="/truce-h5v2q9" element={<Truce />} />
        <Route path="/foundone-j8w6n3" element={<FoundOne />} />
        <Route path="/finalsecret-x4r7t2" element={<FinalSecret />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;