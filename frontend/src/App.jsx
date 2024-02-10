import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Send } from "./pages/Send";
import { Singin } from "./pages/Singin";
import { Signup } from "./pages/Singup";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={Singin} />
          <Route path="/signup" element={Signup} />
          <Route path="/send" element={Send} />
          <Route path="/Dashboard" element={Dashboard} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
