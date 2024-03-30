import React, { useState } from 'react'
import {FaTasks  } from 'react-icons/fa'
import { MdTaskAlt } from "react-icons/md";
import { FaRegCalendarAlt, FaRegShareSquare, FaPlus } from "react-icons/fa";
import tLetter from '../assets/t_letter.png'
import { Link } from 'react-router-dom'
import TaskForm from '../components/TasksForm'
import ProgressBar from './ProgressBar';

const SideBar = ({sideBarToggle}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className={`${sideBarToggle? "hidden" : "block"} w-64 bg-gray-100 dark:bg-slate-900 fixed h-full dark:text-white px-4 py-2`}>
      <div>
        <img src={tLetter} className='w-20 mx-auto mt-10 mb-6' alt='Logo'/>
        <hr />
        <ul className='mt-3'>
        <li className='cursor-pointer mt-2 mb-9 text-violet-900 dark:text-violet-300 rounded hover:shadow hover:bg-violet-800 hover:text-white py-2 dark:hover:bg-violet-400 dark:hover:text-violet-950'
            onClick={toggleModal}>
              <FaPlus  className='inline-block w-6 h-6 mx-2 -mt-1'></FaPlus>
              Add a New Task
          </li>
          <li className='mb-2 rounded hover:shadow hover:bg-violet-800 hover:text-white py-2 dark:hover:bg-violet-400 dark:hover:text-violet-950'>
            <Link to="/mytasks" className='px-3'>
              <FaTasks  className='inline-block w-6 h-6 mr-2 -mt-1'></FaTasks>
              My Tasks
            </Link>
          </li>
          <li className='mb-2 rounded hover:shadow hover:bg-violet-800 hover:text-white py-2 dark:hover:bg-violet-400 dark:hover:text-violet-950'>
            <Link to="/completed-tasks" className='px-3'>
              <MdTaskAlt  className='inline-block w-6 h-6 mr-2 -mt-1'></MdTaskAlt>
              My Completed Tasks
            </Link>
          </li>
          <li className='mb-2 rounded hover:shadow hover:bg-violet-800 hover:text-white py-2 dark:hover:bg-violet-400 dark:hover:text-violet-950'>
            <Link to="/calendar" className='px-3'>
              <FaRegCalendarAlt  className='inline-block w-6 h-6 mr-2 -mt-2'></FaRegCalendarAlt>
              My Calender
            </Link>
          </li>
          <li className='mb-2 rounded hover:shadow hover:bg-violet-800 hover:text-white py-2 dark:hover:bg-violet-400 dark:hover:text-violet-950'>
            <Link to="/shareddoc" className='px-3'>
              <FaRegShareSquare  className='inline-block w-6 h-6 mr-2 -mt-2'></FaRegShareSquare>
              New Shared Document
            </Link>
          </li>
        </ul>
        <TaskForm isOpen={isModalOpen} onClose={toggleModal} />
        <ProgressBar/>
      </div>

      

    </div>
  )
}

export default SideBar
