import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { instance, socketUrl } from '../../apis/JobSolutionApi';
import Header from '../../containers/common/Header';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

function EmprNotification() {
    const socket = useRef();
    const user = useSelector((store) => store.allUsers.user);
    const [notification, setNotification] = useState();
    useEffect(() => {
        const token = localStorage.getItem('empToken');
        const headers = { 'X-Custom-Header': `${token}` };
        instance.get('/jobs/notification/' + user._id, { headers }).then((res) => {
            setNotification(res.data.notifications);
        }).catch((err) => {});
    }, [])
    useEffect(() => {
        socket.current = io(socketUrl);
        socket.current.emit("user-add", user._id);
      }, []);
    useEffect(()=> {
        socket.current.on("recieve-notification", (data) => {
            const token = localStorage.getItem('empToken');
        const headers = { 'X-Custom-Header': `${token}` };
        instance.get('/jobs/notification/' + user._id, { headers }).then((res) => {
            setNotification(res.data.notifications);
        }).catch((err) => {});
        });
    },[]);
    return (
        <>
            <Header />
            <Row>
                <Col md={2}></Col>
                <Col md={8}>
                    <div className="m-4 p-4" style={{ border: '1px solid black', borderRadius: '20px' }}>
                        {notification && notification.map((val) => {
                            return (
                                <>
                                <Link to={`/jobApplications/${val.jobId}`} style={{textDecoration:'none',cursor:'pointer'}}>
                                    <p>{val.message} - <span style={{ color: 'blue' }}><i>{format(val.createdAt)}</i></span></p>
                                    <hr />
                                </Link>
                                </>
                            )
                        })}
                        {
                            notification && notification.length < 1 &&
                            <>
                                <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-notifications-5795923-4841580.png" alt="No notificaitons" style={{width:'50%',height:'auto'}}/>
                                <span style={{fontSize:'30px',color:'#7c848b'}}>No notificaitons</span>
                            </>
                        }
                    </div>
                </Col>
                <Col md={2}></Col>
            </Row>
        </>
    )
}

export default EmprNotification;