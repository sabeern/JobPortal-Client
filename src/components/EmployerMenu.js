import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { instance, socketUrl } from '../apis/JobSolutionApi';
import { io } from 'socket.io-client';

function EmployerMenu() {
  const [notficationCount, setNotificationCount] = useState(0);
  const user = useSelector((store) => store.allUsers.user);
  const socket = useRef();
  useEffect(() => {
    const token = localStorage.getItem('empToken');
    const headers = { 'X-Custom-Header': `${token}` }
    instance.get('jobs/notificationCount/' + user._id, { headers }).then((res) => {
      setNotificationCount(res.data.notCount);
    }).catch((err) => {

    });
  }, []);
  useEffect(() => {
    socket.current = io(socketUrl);
    socket.current.emit("user-add", user._id);
  }, []);
  useEffect(() => {
    socket.current.on("recieve-notification", (data) => {
      const token = localStorage.getItem('empToken');
      const headers = { 'X-Custom-Header': `${token}` }
      instance.get('jobs/notificationCount/' + user._id, { headers }).then((res) => {
        setNotificationCount(res.data.notCount);
      }).catch((err) => {});
    });
  }, []);
  return (
    <>
      <Link to="/empProfile" className='nav-link'>Dashboard</Link>
      <Link to="/postJob" className='nav-link'>Post Job</Link>
      <Link to="/notification" className='nav-link'>Notifications
        <span className="badge bg-danger rounded-pill float-end">{notficationCount}</span>
      </Link>
      <Link to="/chat" className='nav-link'>Chats</Link>
    </>
  )
}

export default EmployerMenu;