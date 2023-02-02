import React, { useEffect, useRef, useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon, MDBTypography, MDBInputGroup } from "mdb-react-ui-kit";
import '../../stylesheet/chatStyle.css';
import { useDispatch, useSelector } from 'react-redux';
import { userChats } from '../../apis/ChatRequests';
import Converstations from '../../containers/common/Converstations';
import Chatbox from '../../containers/common/Chatbox';
import { io } from 'socket.io-client';
import { instance, socketUrl } from '../../apis/JobSolutionApi';
import Header from '../../containers/common/Header';
import { Logout } from '../../apis/Logout';
import { useNavigate } from 'react-router-dom';

function EmployerChat() {
  const user = useSelector((store) => store.allUsers.user);
  const [chats, setChats] = useState();
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket = useRef();
  useEffect(() => {
    const token = localStorage.getItem('empToken');
    const headers = { 'X-Custom-Header': `${token}` };
    const getChat = async () => {
      try {
        const { data } = await userChats(user._id, headers);
        console.log('data'+data);
        setChats(data);
      } catch (err) {
        console.log('err'+err.response.data)
      }
    }
    getChat();
  }, [user._id])
  useEffect(() => {
    socket.current = io(socketUrl);
    socket.current.emit("new-user-add", user._id);
    socket.current.on('get-users', (users) => {
      setOnlineUsers(users);
    });
  }, [user]);
  useEffect(()=> {
    return() => {
      socket.current.close();
    }
  },[]);
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit('send-message', sendMessage);
    }
  }, [sendMessage]);
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      const token = localStorage.getItem('empToken');
      const headers = { 'X-Custom-Header': `${token}` };
      userChats(user._id, headers).then((res) => {
        setChats(res.data);
      }).catch((err) => { });
      setReceivedMessage(data);
    });
  }, []);
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };
  const [search, setSearch] = useState();
  const searchedUser = async () => {
    try {
      const token = localStorage.getItem('empToken');
      const headers = { 'X-Custom-Header': `${token}` }
      const { data } = await instance.get(`/jobs/getTagedUser/${search}`, { headers });
      const usersList = data.tagedUsers.selectedApplicant;
      let temp = 0;
      const newChat = chats.filter((val) => {
        temp = 0;
        usersList.forEach((user) => {
          if (val.members[0] === user || val.members[1] === user) {
            temp = 1;
          }
        })
        if (temp === 1) {
          return val;
        }
      })
      setChats(newChat);
    } catch (err) {
      try {
        const token = localStorage.getItem('empToken');
      const headers = { 'X-Custom-Header': `${token}` };
        const { data } = await userChats(user._id, headers);
        setChats(data);
      } catch (err) {
      }
    }
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutFunction = () => {
    const token = localStorage.getItem('empToken');
    if(!token) {
      Logout(dispatch, navigate);
    }
  }
  return (
    <>
    <Header/>
      <MDBContainer fluid style={{ backgroundColor: "#CDC4F9" }} >
        <MDBRow>
          <MDBCol md="12">
            <MDBCard id="chat3" style={{ borderRadius: "15px" }}>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                    <div className="p-3">
                      <MDBInputGroup className="rounded mb-3">
                        <input
                          className="form-control rounded"
                          placeholder="Search by job id"
                          type="search"
                          onChange={(e) => { setSearch(e.target.value); }}
                          onKeyUp={searchedUser}
                        />
                        <span
                          className="input-group-text border-0"
                          id="search-addon"
                        >
                          <MDBIcon fas icon="search" />
                        </span>
                      </MDBInputGroup>
                      <div className="overflow-auto pt-3 pe-3" style={{ height: '70vh' }}>
                        <MDBTypography listUnStyled className="mb-0" style={{ position: "relative", height: '300px' }}>
                          {chats &&
                          chats.length > 0 ?
                            chats.map((chat) => {
                              return (
                                <div onClick={() =>{ logoutFunction();setCurrentChat(chat)}}>
                                  <Converstations data={chat} currentUserId={user._id} currentChat={currentChat} online={checkOnlineStatus(chat)} receivedMessage={receivedMessage}/>
                                </div>
                              )
                            }) :
                            <>
                            <img src="https://static.thenounproject.com/png/791662-200.png" alt="No chat"/>
                            <p className='m-4' style={{fontSize:'25px'}}>No chat avalable</p>
                            </>
                          }
                        </MDBTypography>
                      </div>
                    </div>
                  </MDBCol>
                  <MDBCol md="6" lg="7" xl="8">
                    {currentChat ? <Chatbox chat={currentChat} currentUserId={user._id} setSendMessage={setSendMessage}
                      receivedMessage={receivedMessage} />:
                      <>
                      <img src="https://www.popsci.com/uploads/2019/03/18/X2ST3NHAKDVHO4YSEC4Q2VNSVE.jpg?auto=webp" alt="Tap to continue"
                        style={{width:'60%',height:'auto'}}/>
                          <p className="m-4" style={{color:'#728487'}}>Tap on chat to start to start converstations...</p>
                      </>
                      }
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  )
}

export default EmployerChat;