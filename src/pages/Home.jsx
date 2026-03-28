import '../App.css'
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from '../components/Header';
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <Container fluid className="min-vh-100 max-vw-100 d-flex flex-column justify-content-center gray-bg p-1 p-md-2 p-lg-3 p-xl-5">
                <Header/>
                <Container fluid className="white-bg p-3 p-md-5 my-3 ">
                    <Pages/>
                    <InstructionSection/>
                    <ImportDatasetSection/>
                    <SampleDataSection/>
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

const InstructionSection = () => {
    return (<>
        <Container fluid className='border-blue blue-bg p-4 p-lg-5 my-4'>
            <div className='d-flex flex-column justify-content-start '>
                <div className=' mb-3 d-flex flex-column flex-md-row d-flex align-items-center justify-content-start text-center'> 
                    <div className=' rounded d-flex align-items-center justify-content-center' >
                        <img src="information.svg" alt="" height={25}/>
                    </div>
                    <h5 className='mx-2 mb-0'> Dataset Instruction </h5>
                </div>
                <p>This system evaluates the performance of search algorithms using an e-commerce dataset. </p>
                <p>You can either: </p>
                <ul>
                    <li> Upload your own dataset (CSV or JSON) </li>
                    <li> Generate a sample dataset automatically </li>
                </ul>
                <p> Each dataset record should contain the following fields: <b> SKU, Name, Category, Price, Stock </b> </p>
                <p> Recommended dataset sizes: </p>
                <ul>
                    <li> <b> 1,000 records </b> (small test) </li>
                    <li> <b> 10,000 records </b> (medium test) </li>
                    <li> <b> 100,000 records </b> (large test) </li>
                    <li> <b> 1,000,000 records </b> (stress test) </li>
                </ul>
            </div>
        </Container>
    </>)
}

const ImportDatasetSection = () => {
    return (
        <>
            <Container fluid className='border-gray my-4 p-4'>
                <div className='d-flex flex-column justify-content-start '>
                    <div className="d-flex flex-row justify-content-start align-items-center">
                        <img src="database-gray.svg" style={{height: 25}} className='pe-3'/>
                        <h5 className='my-0'> Import E-commerce Dataset </h5>
                    </div>
                    <div>
                        <p className='my-2 second-font-color'> Upload your dataset file (JSON or CSV format) or generate sample data </p>
                    </div>
                </div>
                <Button className='button-max gray-bg-2 gray-border-2 d-flex flex-column justify-content-center align-items-center p-5 my-3'>
                    <img src='https://cdn-icons-png.flaticon.com/128/3097/3097412.png' style={{height: 30}} alt=''/>
                    <p> <b> Click to upload or drag and drop </b> </p>
                    <p className='second-font-color'> Supports JSON and CSV files </p>
                </Button>   
            </Container>
        </>
    )
}

const SampleDataSection = () => {
    return (
        <>
            <Container fluid className='border-gray my-4 p-4'>
                <div className='d-flex flex-column justify-content-start '>
                    <div className="d-flex flex-row justify-content-start align-items-center">
                        <img src="/table-gray.svg" style={{height: 25}} className='pe-3'/>
                        <h5 className='my-0'> Generate Sample Dataset </h5>
                    </div>
                    <div>
                        <p className='my-2 second-font-color'> Quickly generate synthetic e-commerce data for testing </p>
                    </div>
                    <div  className='d-flex flex-column flex-lg-row justify-content-between align-items-center my-3'>
                        <Button to="/runBenchmark" as={Link} className='border-gray d-flex justify-content-center button-default'>
                            <div className='py-3 d-flex flex-column justify-content-center align-items-center px-5'>
                                <h4>1K </h4>
                                <p className='second-font-color'> Records </p>
                            </div>
                        </Button>
                        <Button to="/runBenchmark" as={Link} className='d-flex justify-content-center button-default'>
                            <div className='py-3 d-flex flex-column justify-content-center align-items-center px-5'>
                                <h4>10K </h4>
                                <p className='second-font-color'> Records </p>
                            </div>
                        </Button>
                        <Button to="/runBenchmark" as={Link} className='d-flex justify-content-center button-default'>
                            <div className='py-3 d-flex flex-column justify-content-center align-items-center px-5'>
                                <h4>100K </h4>
                                <p className='second-font-color'> Records </p>
                            </div>
                        </Button>
                        <Button to="/runBenchmark" as={Link} className='d-flex justify-content-center button-default'>
                            <div className='py-3 d-flex flex-column justify-content-center align-items-center px-5'>
                                <h4>1M </h4>
                                <p className='second-font-color'> Records </p>
                            </div>
                        </Button>
                    </div>
                </div>
            </Container>
        </>
    )
}
export default Home
