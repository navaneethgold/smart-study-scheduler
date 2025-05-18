import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import AddTaskForm from "./pages/newtask";
import Home from "./pages/home";
import Myprofile from "./pages/profile";
import Signup from "./pages/signup";
import Login from "./pages/login";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";

function App() {
  // const [count, setCount] = useState(0)

  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/add-task" element={<AddTaskForm />} />
          <Route path="/profile" element={<Myprofile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
