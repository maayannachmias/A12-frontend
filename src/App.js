import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import MainPage from "./pages/Main";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import MyTasks from "./pages/MyTasks";
import CompletedTasks from "./pages/CompletedTasks";
import CalendarPage from "./pages/CalendarPage";
import { useState } from "react";

function App() {
  const { user } = useAuthContext();
  const [sideBarToggle, setSideBarToggle] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!user ? <MainPage /> : <Navigate to="/mytasks" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/mytasks" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/mytasks" />}
        />
        {user && (
          <Route
            path="/"
            element={
              <div className="flex">
                <SideBar sideBarToggle={sideBarToggle} />
                <Dashboard
                  sideBarToggle={sideBarToggle}
                  setSideBarToggle={setSideBarToggle}
                />
              </div>
            }
          >
            <Route path="mytasks" element={<MyTasks />} />
            <Route path="completed-tasks" element={<CompletedTasks />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/mytasks" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;