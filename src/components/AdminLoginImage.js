import React, { useEffect } from 'react';
import { MDBCol } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

function AdminLoginImage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if(token) {
      navigate('/admin/dashboard');
    }
  },[]);
  return (
    <MDBCol sm='6' className='d-none d-sm-block px-0'>
      <input type="image" img src="https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148887720.jpg"
        alt="Admin Login" className="w-100" style={{ objectFit: 'fit', objectPosition: 'left', height: '100vh', border: 'none' }} />
    </MDBCol>
  )
}

export default AdminLoginImage;