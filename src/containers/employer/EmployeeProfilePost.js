import React from 'react';
import EachPost from './EachPost';
import { Col } from 'react-bootstrap';

function EmployeeProfilePost({ data, empName, profileImage }) {
  return (
    <>
      <Col md={6} className="overflow-auto p-3" style={{ maxHeight: '80vh' }}>
        {data.length < 1 && <img src="https://res.cloudinary.com/dyff453oq/image/upload/v1675172748/Jobsolutions/iggddcehyhutyzgjom8o.png" alt="No Posts" style={{width:'90%',height:'auto'}} className="m-4"/>}
        {data &&
          data.map((post, index) => {
            return (
              <><EachPost data={{ post }} key={index} empName={empName} profileImage={profileImage} /><hr /></>
            );
          })
        }
      </Col>
    </>
  )
}

export default EmployeeProfilePost;