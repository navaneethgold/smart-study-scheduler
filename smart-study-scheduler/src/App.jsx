import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import AddTaskForm from "./pages/newtask";
import Home from "./pages/home";
import Myprofile from "./pages/profile";
import Signup from "./pages/signup";
import Login from "./pages/login";
import NewExam from "./pages/newexam";
import Logout from "./pages/logout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/add-task" element={<AddTaskForm />} />
          <Route path="/profile" element={<Myprofile />} />
          <Route path="/newexam" element={<NewExam />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
