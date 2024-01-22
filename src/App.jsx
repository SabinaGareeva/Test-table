import { Link, Routes, Route } from "react-router-dom";
import { About } from "./pages/About";
import { Welcome } from "./pages/Welcome";
import { Card } from "./components/Card/Card";

export const App = () => {
  return (
    <div>
      <Card />

      <div style={{ display: "flex", gap: 15 }}>
        <Link to={"about"}>about</Link>
        <Link to={"welcome"}>welcome</Link>
      </div>

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </div>
  );
};
