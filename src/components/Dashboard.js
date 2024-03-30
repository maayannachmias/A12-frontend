import React from 'react'
import Navbar from './Navbar'
import { useAuthContext } from "../hooks/useAuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from '../pages/Main';
import MyTasks from "../pages/MyTasks";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CalendarPage from "../pages/CalendarPage";
import CompletedTasks from "../pages/CompletedTasks";
import SharedDoc from '../pages/SharedDoc';

const Dashboard = ({sideBarToggle, setSideBarToggle}) => {
  const { user } = useAuthContext();

  return (
    <div className={`${sideBarToggle ? "" : " md:ml-64 "} w-full`}> {/* this is the main compartment */}
      {user && <Navbar
        sideBarToggle={sideBarToggle}
        setSideBarToggle={setSideBarToggle}/>
      }
      <Routes>
        <Route
          path='/'
          element={<MyTasks/>}
        />
        <Route
          path='/mytasks'
          element={<MyTasks />}
        />
        <Route
          path='/completed-tasks'
          element={<CompletedTasks />}
        />
        <Route
          path='/calendar'
          element={<CalendarPage />}
        />
        <Route
          path='/shareddoc'
          element={<SharedDoc />}
        />
      </Routes>

    </div>
  )
}

export default Dashboard