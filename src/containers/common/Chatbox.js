import React, { useEffect, useRef, useState } from 'react';
import { addMessage, getMessages, getUser } from '../../apis/ChatRequests';
import { format } from 'timeago.js';
import { BsFillCursorFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../apis/Logout';
import { useNavigate } from 'react-router-dom';

function Chatbox({ chat, currentUserId, setSendMessage, receivedMessage }) {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const senderData = useSelector((store) => store.allUsers.user);
  const scroll = useRef();
  useEffect(() => {
    const otherUserId = chat?.members?.find((id) => id !== currentUserId);
    const getUserData = async () => {
      try {
        const token = localStorage.getItem('empToken');
        const headers = { 'X-Custom-Header': `${token}` }
        const { data } = await getUser(otherUserId, headers);
        setUserData(data.userDetails);
      } catch (err) {
      }
    }
    if (chat) {
      getUserData();
    }
  }, [chat, currentUserId]);
  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('empToken');
        const headers = { 'X-Custom-Header': `${token}` };
        const { data } = await getMessages(chat._id, headers);
        setMessages(data);
      } catch (err) {
      }
    }
    if (chat) {
      fetchMessages();
    }
  }, [chat]);
  const _handleKeyDown = function(e) {
    console.log(e.key)
    if (e.key === 'Enter') {
      handleSend();
    }}
  const handleChange = (e) => {
    setNewMessage(e.target.value);
  }
  const handleSend = async (e) => {
    if(newMessage.trim() === "") {
      return;
    }
    const token = localStorage.getItem('empToken');
    if(!token) {
      Logout(dispatch, navigate);
    }
    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat._id
    }
    try {
      const token = localStorage.getItem('empToken');
        const headers = { 'X-Custom-Header': `${token}` };
      const { data } = await addMessage(message, headers);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (err) {
    }
    const receiverId = chat.members.find((id) => id !== currentUserId);
    setSendMessage({ ...message, receiverId });
  }
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])
  return (
    <>
      {chat ? <h2 style={{ background: "#A1C2D5", borderRadius: '20px', paddingLeft: '20px', paddingBottom: '5px', paddingTop: '5px', color: 'white' }}>
        {userData && ((userData.companyName) ? userData.companyName : userData.firstName + " " + userData.lastName)}
      </h2> : ''}
      <div className="overflow-auto pt-3 pe-3" style={{ height: '70vh' }}>
        {
          messages.map((message) => {
            return (
              <div ref={scroll}>
                {message.senderId !== currentUserId ?
                  (<div className="d-flex flex-row justify-content-start">
                    {userData &&
                      <img src={userData && userData.profileImage ? userData.profileImage : 'https://job-solutions-server.onrender.com/images/default.webp'}
                        className="rounded-circle d-flex align-self-center me-3" alt="Avatar" style={{ width: '45px', height: '45px' }} />
                    }
                    <div>
                      <p
                        className="small p-2 ms-3 mb-1 rounded-3"
                        style={{ backgroundColor: "#f5f6f7" }}
                      >
                        {message.text}
                      </p>
                      <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                        {format(message.createdAt)}
                      </p>
                    </div>
                  </div>) :
                  (<div className="d-flex flex-row justify-content-end">
                    <div>
                      <p className="small p-2 me-3 mb-1 text-white rounded-3" style={{backgroundColor:'#F1CEBC'}}>
                        {message.text}
                      </p>
                      <p className="small me-3 mb-3 rounded-3 text-muted">
                        {format(message.createdAt)}
                      </p>
                    </div>
                    <img src={senderData && senderData.profileImage ? senderData.profileImage : 'https://job-solutions-server.onrender.com/images/default.webp'}
                      className="rounded-circle d-flex align-self-center me-3" alt="Avatar" style={{ width: '45px', height: '45px' }} />
                  </div>)

                }
              </div>
            )
          })


        }
      </div>
      {chat ?
        (<div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
          <img src={senderData && senderData.profileImage ? senderData.profileImage : 'https://job-solutions-server.onrender.com/images/default.webp'}
            className="rounded-circle d-flex align-self-center me-3" alt="Avatar" style={{ width: '45px', height: '45px' }} />
          <input
            type="text"
            className="form-control form-control-lg"
            id="exampleFormControlInput2"
            placeholder="Type message"
            onChange={handleChange} value={newMessage}
            onKeyUp={_handleKeyDown}
          />
          <span className="ms-3" onClick={handleSend}>
            <BsFillCursorFill />
          </span>
        </div>) :
        <p>Tap on chat to start to start converstations...</p>}
    </>
  )
}

export default Chatbox;