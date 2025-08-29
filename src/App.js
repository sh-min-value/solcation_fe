import { Routes, Route } from "react-router-dom";
import Main from "./features/main/Main.js";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  );
}

export default App;
