import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { instance } from '../../apis/JobSolutionApi';
import EmprJobCard from './EmprJobCard';

function CompanyDashboard() {
  //const jobs = useSelector((store) => store.allJobs.jobs);
  const [jobs,setJobs] = useState([]);
  useEffect(()=> {
    const token = localStorage.getItem('empToken');
    const headers = { 'X-Custom-Header': `${token}` };
    instance.get('/jobs/employerJobs', { headers: headers }).then((res)=> {
      setJobs(res.data.employerJobs);
    }).catch((err)=>setJobs([]));
  },[]);
  let jobStatus = false;
  if (jobs) {
    if (jobs.length > 0) {
      jobStatus = true;
    }
  }
  return (
    <div className='mt-3'>
      {jobStatus ?
        (
          <Container>
            <Row>
              <Col md={10}>
                {jobs.map((job, index) => {
                  return (<EmprJobCard key={index} jobDetails={job} />);
                })}
              </Col>
            </Row>
          </Container>
        ) : <>
          <img src="https://d341ezm4iqaae0.cloudfront.net/assets/2016/06/19163422/indeed-Hub-illustrations-09.png" alt="Add Job" style={{width:'80%',height:'auto'}}/>
          <p className="m-4" style={{color:'#7C848B',fontSize:'30px'}}>Currently not posted sny jobs...</p>
        </>
      }
    </div>
  )
}

export default CompanyDashboard;