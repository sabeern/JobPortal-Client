import React, { useEffect, useState } from 'react';
import Header from '../../containers/common/Header';
import JobCards from '../../containers/employee/JobCards';
import EachJobDetails from '../../containers/employee/EachJobDetails';
import { Row, Container, Col } from 'react-bootstrap';
import SearchBox from '../../containers/employee/SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedJob } from '../../redux/actions/UserAction';
import Pagination from '../../components/Pagination';

function Home() {
  const dispatch = useDispatch();
  const [totalJobs, setToalJobs] = useState(useSelector((store) => store.allJobs.jobs));
  const [allJobs, setAllJobs] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const indexOfLastPost = currentPage * jobsPerPage;
  const indexOfFirstPost = indexOfLastPost - jobsPerPage;
  useEffect(() => {
    const jobs = totalJobs.slice(indexOfFirstPost, indexOfLastPost);
    setAllJobs(jobs);
  }, [currentPage,totalJobs]);
  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);
  if (allJobs && allJobs.length > 0) {
    dispatch(setSelectedJob(allJobs[0]));
  }
  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Header />
          </Col>
        </Row>
      </Container>
      <Container>
        <hr />
        <SearchBox setToalJobs={setToalJobs}/>
        <Row>
          <Col md={6} className="overflow-auto" style={{ height: '70vh' }}>
            {allJobs &&
              allJobs.map((job, index) => {
                return (
                  <JobCards key={index} data={job} />
                );
              })
            }
            {allJobs && allJobs.length > 0 &&
              <Pagination
                jobsPerPage={jobsPerPage}
                jobCount={totalJobs.length}
                paginate={paginate}
                currentPage={currentPage}
              />}
          </Col>
          <Col md={6}>
            {allJobs && allJobs.length > 0 && <EachJobDetails />}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home;