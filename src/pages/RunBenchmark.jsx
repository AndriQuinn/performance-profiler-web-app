import '../App.css'
import { Container, Button , Dropdown, Form, Spinner } from "react-bootstrap";
import Header from '../components/Header';
import { useEffect, useState, useRef } from 'react';
import Header2 from '../components/Header2';
import { useNavigate } from "react-router-dom";
import { useData } from '../hooks/useData';
import { useBenchmark } from '../hooks/useBenchmark';

const RunBenchamark = () => {

    const [attempts,setAttempts] = useState(1e4) // Default Search Attempts
    const navigate = useNavigate(); // Manual page navigation
    const [selectedAlgo,setSelectedAlgo] = useState("Interpolation-Binary") // Selected algorithm state
    // Temporarily Removed - Switch Metric Feature - Memory Usage
    // const [selectedMetric,setSelectedMetric] = useState("Execution Time")

    return (
        <>
            <Container fluid className="min-vh-100 max-vw-100 d-flex flex-column justify-content-center gray-bg p-1 p-md-2 p-lg-3 p-xl-5">
                <Header/>
                <Container fluid className="white-bg p-4 p-md-5 my-3 ">
                    <Pages/>
                    <ExecuteBenchmarkSection 
                        // Temporarily Removed - Switch Metric Feature - Memory Usage
                        // selectedMetric={selectedMetric}
                        // setSelectedMetric={setSelectedMetric}
                        selectedAlgo={selectedAlgo}
                        setSelectedAlgo={setSelectedAlgo}
                        attempts={attempts}
                        setAttempts={setAttempts}
                    />
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

const ExecuteBenchmarkSection = ({
    // Temporarily Removed - Switch Metric Feature - Memory Usage
    // selectedMetric,
    // setSelectedMetric,
    selectedAlgo,
    setSelectedAlgo,
    attempts,
    setAttempts
}) => {
    return (<>
        <Container fluid className='border-gray p-4 my-4'>
            <div className='d-flex flex-column justify-content-start'>
                <Header2 
                    headerText={"Execute Performance Benchmark"}
                    imagePath={"/thunder.svg"}
                    size={25}
                />      
                <div>
                    <p className='my-2 second-font-color'> Run comprehensive tests to measure search operations </p>
                </div>
            </div>
            <StartBenchmarkSection 
                // Temporarily Removed - Switch Metric Feature - Memory Usage
                // selectedMetric={selectedMetric}
                // setSelectedMetric={setSelectedMetric}
                selectedAlgo={selectedAlgo}
                attempts={attempts}
            />
            <ImplmentationSection 
                // Temporarily Removed - Switch Metric Feature - Memory Usage
                // selectedMetric={selectedMetric}
                // setSelectedMetric={setSelectedMetric}
                selectedAlgo={selectedAlgo}
                setSelectedAlgo={setSelectedAlgo}
                attempts={attempts} 
                setAttempts={setAttempts}
            />
            <BenchmarkInformationSection/>
        </Container>
    </>)
}

const StartBenchmarkSection = ({
    selectedMetric,
    selectedAlgo,
    attempts,
   }) => {


    const { benchmarkResult } = useData()
    const navigate = useNavigate()
    const { runBenchmark } = useBenchmark()
    const [ isloading, setLoading ] = useState(false); // Loading state


    const benchmarkHandler = (attempts,hybridSearch,selectedMetric) => {
        setLoading(true)
        runBenchmark(attempts, hybridSearch)
    }

    useEffect(() => {
        if (!benchmarkResult) return;
        setLoading(false)
        navigate("/viewResults")
    },[benchmarkResult])

    return (<>
        <div className='d-flex flex-column flex-lg-row justify-content-between align-items-center my-4 p-4 border-gray'> 
            <div className='d-flex justify-content-start align-items-center'>
                <img src='/database.svg' className='me-3' height={35} />
                <div className='d-flex flex-column justify-content-start'>
                    <h6> Dataset Loaded </h6>
                    <h4 className='text-primary fw-bold'> {Number(sessionStorage.getItem("size")).toLocaleString()} </h4>
                    <p className='my-0 second-font-color'> Total Records </p> 
                </div>
            </div>

            {/* Start Benchmarking Button */}
            <div className='d-flex flex-column flex-lg-row align-items-center justify-content-center mt-3 my-lg-0'>
                <Button className='d-flex flex-row justify-content-center align-items-center py-2 px-4 transparent border-gray-hover-gray my-0 me-3 black-font'>
                    <div className='d-flex flex-row align-items-center'>
                        <img src='/view.svg' className='me-2 my-0' height={15}/>
                        View Dataset
                    </div>
                </Button>
                <Button className='d-flex flex-row justify-content-center align-items-center  black-button my-0' onClick={() => benchmarkHandler(attempts,selectedAlgo)}>
                        
                    {isloading ? (
                        <div>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className='me-2'
                            /> 
                            Benchmarking...
                        </div>
                    ) : (
                            <div className='d-flex flex-row align-items-center'>
                                <img src='/play-button.svg' className='me-2 my-0' height={15}/>
                                Start Benchmark        
                            </div>
                            )}
                </Button>
            </div>

        </div>
    </>)
}

const ImplmentationSection = ( {
    // Temporarily Removed - Switch Metric Feature - Memory Usage
    // selectedMetric, // 
    // setSelectedMetric,
    selectedAlgo,
    setSelectedAlgo,
    attempts,
    setAttempts
} ) => {

    const [warningState, setWarningState] = useState(false)
    const [warning, setWarning] = useState(false)

    const setAttemptsHander = (value) => {
        if (value >= 1e6+1) { // No more than 1M
            setWarningState(true)
            setWarning(true)
        } 
        else if (value <= 1e4-1) { // No less than 10k
            setWarningState(false) 
            setWarning(true)
        } 
        else {
            setWarning(false)
            setAttempts(value)
        }
    }

    return (<>
            <div className='d-flex flex-column justify-content-start p-3 p-md-4 my-3 border-gray'> 
            <Header2 
                headerText={"Implementation Section"}
                imagePath={"information-muted.svg"}
                size={25}
            />      
            
            {/* Algorithm Picker */}
            <div className='my-1 d-flex flex-column' >
                <p className='second-font-color'> Implementation </p>
                <Dropdown className='my-0 w-100 gray-bg-2'>
                    <Dropdown.Toggle className='w-100 gray-bg-2' variant="secondary" id="dropdown-basic">
                        {selectedAlgo}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='w-100 gray-bg-2'>
                        <Dropdown.Item onClick={() => setSelectedAlgo("Interpolation-Binary")}>Interpolation-Binary</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedAlgo("Interpolation-Fibonacci")}>Interpolation-Fibonacci</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedAlgo("Interpolation-Exponential")}>Interpolation-Exponential</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Temporarily Removed */}
            {/* Switch Metric Feature - Memory Usage*/}
        
            {/* 
            <div className='my-1 d-flex flex-column' >
                <p className='second-font-color'> Metrics </p>
                <Dropdown className='my-0 w-100 gray-bg-2'>
                    <Dropdown.Toggle className='w-100 gray-bg-2' variant="secondary" id="dropdown-basic">
                        {selectedMetric}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='w-100 gray-bg-2'>
                        <Dropdown.Item onClick={() => setSelectedMetric("Execution Time")}>Execution Time</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedMetric("Memory Usage")}>Memory Usage</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div> */}

            <div className='mt-3'>
                <div className='d-flex flex-row justify-content-start'>
                    <img src='search.svg' className='me-3' height={20} />
                    <h6> Search </h6>
                </div>
                
                {/* Search attempt setter */}
                <Form className='my-0'>
                    <Form.Group  >
                    <Form.Label className='dark-secondary-h'>Number of Search Operations</Form.Label>
                        <Form.Control
                            type={"number"}
                            value={attempts}
                            onChange={(e) => setAttemptsHander(e.target.value)}
                            placeholder={attempts.toLocaleString()}
                            className='bg-transparent rounded green-border-panel custom-placeholder my-input'
                            required
                        />
                    </Form.Group>
                </Form>

                {/* Warning labels */}
                <p className='second-font-color my-0 '> Max: 1,000,000 </p>
                {
                    warning ?  
                        warningState ? 
                            <p className='text-danger my-0'> Cannot exceed 1,000,000 </p> :
                            <p className='text-danger my-0'> Cannot go below 10,000 </p> 
                    : <p className='my-0 invisible'> {"Hi? Youre not suppose to see me actually :)"} </p>
                }
                    
            </div>    
        </div>
    </>)
}

const BenchmarkInformationSection = () => {
    return (<>
        <div className='d-flex flex-column  justify-content-start my-4 p-4 yellow-bg'> 
            <div className=' mb-3 d-flex flex-column flex-md-row d-flex align-items-center justify-content-start text-center'> 
                <div className=' rounded d-flex align-items-center justify-content-center' >
                    <img src="/information-brown.svg" alt="" height={20}/>
                </div>
                <h5 className='mx-2 mb-0'> Benchmark Information </h5>
            </div>
            <ul className='my-0 d-flex flex-column justify-content-start'>
                <li> <p  className='my-0' style={{color: "#654321"}}> <b>Search Test: </b> Performs random SKU lookups to measure search performance </p> </li>
                <li> <p  className='my-0' style={{color: "#654321"}}> All operations are performed in-memory to ensure accurate timing measurements </p> </li>
                <li> <p  className='my-0' style={{color: "#654321"}}> <b> Implementation: </b> Interpolation Hybrid Algorithms </p> </li>
            </ul>
        </div>
    </>)
}

export default RunBenchamark