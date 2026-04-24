import '../App.css'
import { Container, Button, Row, Col, Table } from "react-bootstrap";
import Header from '../components/Header';
import Header2 from '../components/Header2';
import Graph from '../components/Graph';
import { downloadFromSessionStorage } from '../utils/downloadResult';
import { useData } from '../hooks/useData';
import { useNavigate, useLocation } from "react-router-dom";
import PageRow from '../components/PageRow';
import PageTransition from '../components/PageTransition';
import { Fragment } from 'react';

const ViewResults = () => {

    const { pathname } = useLocation(); // Get current path
    
    return (<>
        <Container fluid className="min-vh-100 max-vw-100 d-flex flex-column justify-content-center custom-padding gray-bg shadow-lg">
            <Header/>
            <Container fluid className="white-bg p-2 p-md-5 my-3 ">
                <PageRow currentPage={pathname}/>
                <PageTransition>
                    <Body/>
                </PageTransition>
            </Container>
        </Container>
    </>)
}

// --- Section Components ---

const Body = () => {

    const { setBenchmarkResult, setFinishBenchmark } = useData()
    const navigate = useNavigate()

    const anotherBenchmarkHandler = () => {
        navigate("/runBenchmark")
    }

    return (<>
        <Container fluid className=' my-5'>
            <div className='d-flex flex-row justify-content-start'>
                <div className='d-flex flex-row align-items-center justify-content-center my-3 my-lg-0'>
                    <Button className='d-flex flex-row justify-content-center align-items-center py-2 px-3 button-transparent' onClick={() => anotherBenchmarkHandler()}>
                        <img src='/arrow.svg' className='me-2 ' height={15}/>
                        Run Another Benchmark
                    </Button>
                </div>
            </div>

            <MetricsPanel/>
            <ImplementationUsed/>
            <BenchmarkAnalysis/>
            <GraphPanels/>
            <DownloadResultSection/>
        </Container>
    </>)    
}

const MetricsPanel = () => {

    const { metrics } = useData()

    return (<>
        <Container fluid className='my-4'>
            <Row g={3} >

                {/* Total Execution Time panel */}
                <Col className='my-2 p-4 border-gray me-3'>
                    <p className='second-font-color' style={{fontWeight: "500"}}> Total Execution Time </p>
                    <div className='d-flex justify-content-start align-items-center'>
                        <h4 className='my-0 me-2' style={{fontWeight: "700"}}> {(metrics.totalExecutionTime).toFixed(2)} </h4>
                        
                        <p className='second-font-color my-0'> ns </p>
                    </div>
                </Col>

                {/* Average Time panel */}
                <Col className='my-2 p-4 border-gray me-3'>
                    <p className='second-font-color ' style={{fontWeight: "500"}}> Average Time </p>
                    <div className='d-flex justify-content-start align-items-center'>
                        <h4 className='my-0 me-2' style={{fontWeight: "700"}}> {(metrics.averageTime).toFixed(2)} </h4>
                        <p className='second-font-color my-0'> ns </p>
                    </div>
                </Col>

                {/* Fastest Execution Time panel */}
                <Col className='my-2 p-4 green-border green-bg'>
                    <div className='d-flex justify-content-start align-items-center mb-2'>
                        <img src='/check-mark.svg' alt='' height={16} className='me-1'/>
                        <p className='second-font-color green-font-color my-0' style={{fontWeight: "500"}}> Fastest Operation  </p>
                    </div>
                    
                    <div className='d-flex justify-content-start align-items-center'>
                        <div className=' darkgreen-bg me-2 '>
                            <p className='my-0' style={{fontSize: "8"}}> SEARCH </p>
                        </div>
                        <h4 className='my-0 me-2' style={{fontWeight: "700"}}> {(metrics.fastestOperation).toFixed(2)} </h4>
                        <p className='second-font-color my-0'> ns </p>
                    </div>
                </Col>
            </Row>

        </Container>
    </>)
}

const ImplementationUsed = () => {
    return (<>
        <Container fluid  className='w-100 px-0'>
            <div className='border-blue blue-bg px-3 py-2 my-4'>
                <p className='m-0' style={{color: "blue"}}> <b> Algorithm Used: Interpolation-Binary, Interpolation-Fibonacci, Interpolation-Exponential </b>  </p>
            </div>
        </Container>
    </>)
}

const BenchmarkAnalysis = () => {

    const { metrics } = useData()

    return (<>
        <Container fluid  className='px-0'>
            <div className='p-4 border-gray'>
                <Header2
                    headerText={"Benchmark Result Analysis"}
                    imagePath={"/pie-chart.svg"}
                    size={20}
                />
                <p className='my-2 second-font-color'> AI-driven insights into the current run </p>
                <p className='mt-4 my-0 py-0'> "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                </p>
                <Table bordered hover responsive className='p-5 my-4'>
                    <thead>
                        <tr className='table-secondary'>
                            <th> Algorithms </th>
                            <th> Ops </th>
                            <th> Total Time {"(ns)"} </th>
                            <th> Avg Time {"(ns)"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.byAlgorithms.map((algorithms,i) => (
                            <tr key={i}>
                                <td> {algorithms.name} </td>
                                <td> {Number(sessionStorage.getItem("size")).toLocaleString()} </td>
                                <td> {(algorithms.total).toFixed(2)} </td>
                                <td> {(algorithms.total / 30 / 2).toFixed(2)} </td>
                            </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        </Container>
    </>)
}

const GraphPanels = () => {    

    const { benchmarkResult } = useData()
    console.log(benchmarkResult)

    return (<>
        <Container fluid className='my-3 px-0 px-lg-3'>
            <Row className='g-0 gx-lg-4 border-gray p-3 my-4'>
                <Header2
                    headerText={"Execution Time Progression"}
                    imagePath={"/chart.svg"}
                    size={20}
                />
                <p className='my-2 second-font-color'> Time taken for each operation in nanoseconds </p>

                {/* Uniform graph */}
                <Col className='ps-lg-0' sm={12} lg={6}>
                    <GraphContainer
                        data={benchmarkResult.uniform.executionTime}
                        title={"Uniform Distribution"}
                        description={"Execution time per operation batch ns"}
                    />
                </Col>

                {/* Non-Uniform graph */}
                <Col className='pe-lg-0' sm={12} lg={6}>
                    <GraphContainer 
                        data={benchmarkResult.nonUniform.executionTime}
                        title={"Non - Uniform Distribution"}
                        description={"Execution time per operation batch ns"}
                    />
                </Col>
            </Row>

            <Row className='g-0 gx-lg-4 border-gray p-3 my-4'>
                <Header2
                    headerText={"Memory Usage Analysis"}
                    imagePath={"/chart.svg"}
                    size={20}
                />
                <p className='my-2 second-font-color'> Memory consumption across search operation batches (MB) </p>
                
                <Col className='ps-lg-0' sm={12} lg={6}>
                    <GraphContainer
                        data={benchmarkResult.uniformMemory}
                        title={"Uniform Distribution"}
                        description={"Memory usage per operation batch MB "}
                    />
                </Col>
                <Col className='pe-lg-0' sm={12} lg={6}>
                    <GraphContainer
                        data={benchmarkResult.nonUniformMemory}
                        title={"Non - Uniform Distribution"}
                        description={"Memory usage per operation batch MB "}
                    />
                </Col>
            </Row>

        </Container>
    </>)
}

const DownloadResultSection = () => {
    return (<>
        <Container fluid className='my-3 px-0'>
            <div className='p-4 border-gray d-flex flex-column justify-content-start w-100 gray-bg'>
                <div className='d-flex align-items-center'>
                    <img src='/upload.svg' alt='' height={20} className='me-2'/>
                    <h5 className='my-0'> Export Results </h5>
                </div>
                <p > Download performance data for further analysis </p>

                {/* Download results */}
                <Button className='black-button p-2 justfiy-content-center align-items-center' onClick={() => downloadFromSessionStorage("downSampling")}>
                    <img src='/upload-white.svg' className='me-2 ' height={20}/>
                    Download JSON Reports
                </Button>
            </div>
        </Container>
    </>)
}

// --- Smaller Components ---

const GraphContainer = ({
    data, title, description
}) => {
    return (<>
        <div className='my-2 p-4 border-gray '>
            <Header2
                headerText={title}
                imagePath={"/chart.svg"}
                size={20}
            />
            <p className='my-2 second-font-color'> {description} </p>
            <Graph data={data}/>
        </div>                
    </>)
}


export default ViewResults
