import '../App.css'
import { Container, Button , Dropdown, Form, Spinner } from "react-bootstrap";
import Header from '../components/Header';
import { Link } from "react-router-dom";
import { useState } from 'react';
import Header2 from '../components/Header2';
import { useNavigate } from "react-router-dom";

const RunBenchamark = ({
    performBenchmark
}) => {

    const [attempts,setAttempts] = useState(1e3)
    const navigate = useNavigate(); 
    const [selectedAlgo,setSelectedAlgo] = useState("Interpolation-Binary")

    return (
        <>
            <Container fluid className="min-vh-100 max-vw-100 d-flex flex-column justify-content-center gray-bg p-1 p-md-2 p-lg-3 p-xl-5">
                <Header/>
                <Container fluid className="white-bg p-4 p-md-5 my-3 ">
                    <Pages/>
                    <ExecuteBenchmarkSection 
                        selectedAlgo={selectedAlgo}
                        setSelectedAlgo={setSelectedAlgo}
                        navigate={navigate}
                        performBenchmark={performBenchmark}
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
    selectedAlgo,
    setSelectedAlgo,
    navigate,
    performBenchmark,
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
                    <p className='my-2 second-font-color'> Run comprehensive tests to measure search, insert, and delete operations </p>
                </div>
            </div>
            <StartBenchmarkSection 
                selectedAlgo={selectedAlgo}
                navigate={navigate}
                attempts={attempts}
                performBenchmark={performBenchmark}
            />
            <ImplmentationSection 
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
    selectedAlgo,
    attempts,
    performBenchmark,
    navigate
   }) => {

    const [loading, setLoading] = useState(false);

    const handlePerform = (attempts) => {
        console.log("Attemps to be made: " + attempts)
           setLoading(true)
            

         setTimeout(() => {
            performBenchmark(attempts,selectedAlgo); // synchronous code
            setLoading(false);
            navigate("/viewResults");
        }, 50);
    }

    return (<>
        <div className='d-flex flex-column flex-lg-row justify-content-between align-items-center my-4 p-4 border-gray'> 
            <div className='d-flex justify-content-start align-items-center'>
                <img src='/database.svg' className='me-3' height={35} />
                <div className='d-flex flex-column justify-content-start'>
                    <h6> Dataset Loaded </h6>
                    <h4 className='text-primary'> {sessionStorage.getItem("size")} </h4>
                    <p className='my-0 second-font-color'> Total Records </p> 
                </div>
            </div>

            <div className='d-flex flex-row align-items-center justify-content-center mt-3 my-lg-0'>
                <Button className='d-flex flex-row justify-content-center align-items-center p-2 black-button my-0' onClick={() => handlePerform(attempts)}>
                        
                    {loading ? (
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
                    )
                            : (
                            <div>
                                <img src='/play-button.svg' className='me-2 ' height={15}/>
                                Start Benchmark        
                            </div>
                            )}
                </Button>
            </div>

        </div>
    </>)
}

const ImplmentationSection = ( {
    selectedAlgo,
    setSelectedAlgo,
    attempts,
    setAttempts
} ) => {

    return (<>
            <div className='d-flex flex-column justify-content-start p-3 p-md-4 my-3 border-gray'> 
            <Header2 
                headerText={"Implementation Section"}
                imagePath={"information-muted.svg"}
                size={25}
            />      
                
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

            <div className='mt-3'>
                <div className='d-flex flex-row justify-content-start'>
                    <img src='search.svg' className='me-3' height={20} />
                    <h6> Search </h6>
                </div>
                    
                <Form className='my-0'>
                    <Form.Group  >
                    <Form.Label className='dark-secondary-h'>Number of Search Operations</Form.Label>
                        <Form.Control
                            type={"number"}
                            value={attempts}
                            onChange={(e) => setAttempts(e.target.value)}
                            placeholder={attempts}
                            className='bg-transparent rounded green-border-panel custom-placeholder my-input'
                            required
                        />
                    </Form.Group>
                </Form>

                <p className='second-font-color my-0 '> Max: 1,000,000 </p>
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
