import '../App.css'
import { Container, Button, Row, Col } from "react-bootstrap";
import Header from '../components/Header';
import { Link } from "react-router-dom";
import "uplot/dist/uPlot.min.css";
import Header2 from '../components/Header2';
import Graph from '../components/Graph';


const ViewResults = () => {
    return (
        <>
            <Container fluid className="min-vh-100 max-vw-100 d-flex flex-column justify-content-center gray-bg p-1 p-md-2 p-lg-3 p-xl-5">
                <Header/>
                <Container fluid className="white-bg p-4 p-md-5 my-3 ">
                    <Pages/>
                    <Body/>
                </Container>
            </Container>    
            
        </>
    )
}

const Pages = () => {
    return (
        <>
            <div className='d-flex flex-column flex-lg-row justify-content-between px-5'>
                <div className='d-flex flex-row align-items-center justify-content-center my-2 my-lg-0'>
                    <Button className='me-2' style={{borderRadius: "50%", width: "40px", height: "40px",padding: 0,}} variant="primary">
                        1
                    </Button>
                    Import Dataset 
                </div>
                
                <div className='d-flex flex-row align-items-center justify-content-center my-2 my-lg-0'>
                    <Button className='me-2' style={{borderRadius: "50%", width: "40px", height: "40px",padding: 0,}} variant="primary">
                        2
                    </Button>
                    Run Benchmarks
                </div>
                <div className='d-flex flex-row align-items-center justify-content-center my-2 my-lg-0'>
                    <Button className='me-2' style={{borderRadius: "50%", width: "40px", height: "40px",padding: 0,}} variant="primary">
                        3
                    </Button>
                    View Results
                </div>
            </div>
        </>
    )
}

const Body = () => {
    return (<>
        <Container fluid className=' my-5'>
            <div className='d-flex flex-row justify-content-start'>
                <div className='d-flex flex-row align-items-center justify-content-center my-3 my-lg-0'>
                    <Button as={Link} to="/runBenchmark" className='d-flex flex-row justify-content-center align-items-center py-2 px-3 button-transparent'  >
                        <img src='/arrow.svg' className='me-2 ' height={15}/>
                        Run Another Benchmark
                    </Button>
                </div>
            </div>

            <MetricsPanel/>
            <ImplementationUsed/>
            <BenchmarkAnalysis/>
            <GraphPanels/>
            <SubmitResultSection/>

        </Container>
    </>)    
}

const MetricsPanel = () => {
    return (<>
        <Container fluid className='my-4'>
            <Row g={3} >
                <Col className='my-2 p-4 border-gray me-3'>
                    <p className='second-font-color' style={{fontWeight: "500"}}> Total Execution Time </p>
                    <div className='d-flex justify-content-start align-items-center'>
                        <h4 className='my-0 me-2' style={{fontWeight: "700"}}> 6.9 </h4>
                        <p className='second-font-color my-0'> ms </p>
                    </div>
                </Col>
                <Col className='my-2 p-4 border-gray me-3'>
                    <p className='second-font-color ' style={{fontWeight: "500"}}> Average Time </p>
                    <div className='d-flex justify-content-start align-items-center'>
                        <h4 className='my-0 me-2' style={{fontWeight: "700"}}> 6.9 </h4>
                        <p className='second-font-color my-0'> ms </p>
                    </div>
                </Col>
                <Col className='my-2 p-4 green-border green-bg'>
                    <div className='d-flex justify-content-start align-items-center mb-2'>
                        <img src='/check-mark.svg' alt='' height={16} className='me-1'/>
                        <p className='second-font-color green-font-color my-0' style={{fontWeight: "500"}}> Fastest Operation  </p>
                    </div>
                    
                    <div className='d-flex justify-content-start align-items-center'>
                        <div className=' darkgreen-bg me-2 '>
                            <p className='my-0' style={{fontSize: "8"}}> SEARCH </p>
                        </div>
                        <h4 className='my-0 me-2' style={{fontWeight: "700"}}> 6.9 </h4>
                        <p className='second-font-color my-0'> ms </p>
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
                <p className='m-0' style={{color: "blue"}}> <b> Implementation Used: </b> Interpolation-Binary Search </p>
            </div>
        </Container>
    </>)
}

const BenchmarkAnalysis = () => {
    return (<>
        <Container fluid  className='px-0'>
            <div className='p-4 border-gray'>
                {/* <div className='d-flex flex-row justify-content-start align-items-center '>
                    <img src='/pie-chart.svg' height={20} alt='' className='me-2'/>   
                    <h5 className='my-0'> Benchmark Result Analysis </h5>
                </div> */}
                <Header2
                    headerText={"Benchmark Result Analysis"}
                    imagePath={"/pie-chart.svg"}
                    size={25}
                />
                <p className='my-2 second-font-color'> AI-driven insights into the current run </p>
                <p className='mt-4 my-0 py-0'> The Hashing-based Indexing provided extremely fast insertion and deletion times (O(1) complexity), 
                    making it highly efficient for dynamic datasets. 
                    However, memory overhead was slightly higher due to hash table allocation, and range queries were not supported optimally.
                </p>
            </div>

        </Container>
    </>)
}

const GraphPanels = () => {    

    const x = [1, 2, 3, 4, 5];
    const y = [10, 15, 8, 20, 18];

    return (<>
        <Container fluid className='my-3'>
            <Row className='d-flex justify-content-between'>
                <Col sm={12} className='my-2 p-4 border-gray '>
                    <Header2
                        headerText={"Execution Time Comparison"}
                        imagePath={"/chart.svg"}
                        size={20}
                    />
                    <p className='my-2 second-font-color'> Time taken for each operation in nanoseconds </p>
                    <Graph 
                        x={x}
                        y={y}
                    />
                </Col>

                <Col sm={12} className='my-2 p-4 border-gray '>
                    <Header2
                        headerText={"Memory Usage Comparison"}
                        imagePath={"/chart.svg"}
                        size={20}
                    />
                    <p className='my-2 second-font-color'> Memory consumption during operations in MB </p>
                    <Graph 
                        x={x}
                        y={y}
                    />
                </Col>
            </Row>
            <Row>
                <Col sm={12} className='my-2 p-4 border-gray w-100'>
                    <h5 > Detailed Performance Metrics </h5>
                    <p > Comprehensive breakdown of all benchmark results </p>
                    <Graph 
                        x={x}
                        y={y}
                    />
                </Col>
            </Row>
        </Container>
    </>)
}

const SubmitResultSection = () => {
    return (<>
        <Container fluid className='my-3 px-0'>
            <div className='p-4 border-gray d-flex flex-column justify-content-start w-100 gray-bg'>
                <div className='d-flex align-items-center'>
                    <img src='/upload.svg' alt='' height={20} className='me-2'/>
                    <h5 className='my-0'> Submit Results </h5>
                </div>
                <p > Submit the performance data for further analysis </p>
                <Button className='black-button p-2 justfiy-content-center align-items-center'>
                    <img src='/upload-white.svg' className='me-2 ' height={20}/>
                    Submit Performance Results
                </Button>
            </div>
        </Container>
    </>)
}
export default ViewResults
