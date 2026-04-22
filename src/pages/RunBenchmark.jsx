import '../App.css'
import { Container, Button , Dropdown, Form, Spinner, Modal, Table } from "react-bootstrap";
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import Header2 from '../components/Header2';
import { data, useNavigate, useLocation } from "react-router-dom";
import { useData } from '../hooks/useData';
import { useBenchmark } from '../hooks/useBenchmark';
import { useTable } from '../hooks/useTable'
import { useGenerateTable } from '../hooks/useGenerateTable';
import PageRow from '../components/PageRow';
import PageTransition from '../components/PageTransition';


const RunBenchamark = () => {

    const { pathname } = useLocation(); // Get current path

    // -- State --
    const [attempts,setAttempts] = useState(1e4) // Default Search Attempts 10k

    return (
        <>
        <PageTransition>
            <Container fluid className="min-vh-100 max-vw-100 d-flex flex-column justify-content-center custom-padding gray-bg shadow-lg">
                <Header/>
                <Container fluid className="white-bg p-2 p-md-5 my-3 ">
                    <PageRow currentPage={pathname}/>
                    <ExecuteBenchmarkSection 
                        attempts={attempts}
                        setAttempts={setAttempts}
                    />
                </Container>
            </Container>    
        </PageTransition>
        </>
    )
}

// --- Section Components ---

const ExecuteBenchmarkSection = ({
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
                    size={20}
                />      
                <div>
                    <p className='my-2 second-font-color'> Run comprehensive tests to measure search operations </p>
                </div>
            </div>
            <StartBenchmarkSection 
                selectedAlgo={selectedAlgo}
                attempts={attempts}
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
    attempts
}) => {
    
    // -- Use Data --
    const { benchmarkResult, datasetArr, datasetTable } = useData()
    const { generateTable } = useGenerateTable()
    const { getTable } = useTable()    
    const { runBenchmark } = useBenchmark()
    const navigate = useNavigate()

    // -- State -- 
    const [ isloading, setLoading ] = useState(false); // Loading state
    const [ isShow, setShow] = useState(false)
    const [limiter, setLimiter] = useState(1)

    // Handler
    const benchmarkHandler = ( attempts ) => {
        setLoading(true)
        runBenchmark(attempts)
    }

    // -- Side Effects -- 

    // Watch Limiter - Get the new table when limiter changed
    useEffect(() => {
        getTable(limiter)
    }, [limiter])
    
    // Generate the table + Get the 100 rows
    useEffect(() => {
        if (datasetArr) { 
            generateTable(datasetArr)
            getTable(limiter)
        }
      },[datasetArr])

    // Navigate to result page after benchmark
    useEffect(() => {
        if (!benchmarkResult) return;
        setLoading(false)
        navigate("/viewResults")
    },[benchmarkResult])

    return (<>
        <div className='d-flex flex-column flex-lg-row justify-content-between align-items-center my-4 p-4 border-gray'> 
            <div className='d-flex justify-content-start align-items-center'>
                <img src='/database.svg' className='me-3' height={30} />
                <div className='d-flex flex-column justify-content-start'>
                    <h6> Dataset Loaded </h6>
                    <h4 className='text-primary fw-bold'> {Number(sessionStorage.getItem("size")).toLocaleString()} </h4>
                    <p className='my-0 second-font-color'> Total Records </p> 
                </div>
            </div>

            <div className='d-flex flex-column flex-lg-row align-items-center justify-content-center mt-3 my-lg-0'>
                {/* View Dataset Button */}
                <Button className='d-flex flex-row justify-content-center align-items-center py-2 px-4 transparent border-gray-hover-gray my-3 my-lg-0 mx-0 mx-lg-3 black-font' onClick={() => setShow(true)}>
                    {!datasetTable ?
                    (
                      <div>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className='me-2'
                        /> 
                        Loading...
                    </div>  
                    ) : 
                    <div className='d-flex flex-row align-items-center'>
                        <img src='/view.svg' className='me-2 my-0' height={15}/>
                        View Dataset
                    </div>
                    }
                    
                </Button>
                {/* Modal for viewing dataset */}
                <DatasetModal show={isShow} setShow={setShow} dataset={datasetTable} limiter={limiter} setLimiter={setLimiter} />
                
                {/* Start Benchmarking Button */}
                <Button className='d-flex flex-row justify-content-center align-items-center  black-button my-0' onClick={() => benchmarkHandler(attempts)}>
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
    attempts,
    setAttempts
} ) => {

    // -- State --
    const [warningState, setWarningState] = useState(false)
    const [warning, setWarning] = useState(false)

    // Handler
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
                size={20}
            />      

            <div className='mt-4'>
                <div className='d-flex flex-row justify-content-start align-items-center mb-2 '>
                    <img src='search.svg' className='me-2' height={15} />
                    <h6 className='my-0'> Search </h6>
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
                <h5 className='mx-2 my-0'> Benchmark Information </h5>
            </div>
            <ul className='my-0 d-flex flex-column justify-content-start'>
                <li> <p  className='my-0' style={{color: "#654321"}}> <b>Search Test: </b> Performs random SKU lookups to measure search performance </p> </li>
                <li> <p  className='my-0' style={{color: "#654321"}}> All operations are performed in-memory to ensure accurate timing measurements </p> </li>
                <li> <p  className='my-0' style={{color: "#654321"}}> <b> Implementation: </b> Interpolation Hybrid Algorithms </p> </li>
            </ul>
        </div>
    </>)
}

// --- Smaller Components ---

const DataTable = ({ table }) => {
    const headers = ['SKU', 'Name', 'Category', 'Price', 'Stock'] // Headers
    const rows = table.slice(0)     // Rest are data rows

    return (
        <Table striped bordered hover responsive className='p-5'>
            <thead>
                {/* Headers */}
                <tr>
                {headers.map((header, i) => (
                    <th key={i}>{header}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                {/* Rows */}
                {rows.map((row, i) => (
                <tr key={i}>
                    {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                    ))}
                </tr>
                ))}
            </tbody>
        </Table>
    )
}

const DatasetModal = ({ show, setShow, dataset, limiter, setLimiter }) => {
    if (!dataset) return null;

    // -- Datasets -- 
    const uniformDataset = dataset.uniformTable
    const nonUniformDataset = dataset.nonUniformTable
    
    // -- State -- eg. uniform or non uniform
    const [mode, setMode] = useState('uniform')
    const table = mode === 'uniform' ? dataset.uniformTable : dataset.nonUniformTable

    // -- Config -- 
    const SIZE = Number(sessionStorage.getItem("size"))
    const ROW_NUM = 100
    
    return (<>
    
        <Modal 
            show={show} 
            size="xl"         
            onHide={() => setShow(false)} 
        >
            <Modal.Header closeButton>
                <Modal.Title className='w-100'> 
                    <div className='d-flex flex-column flex-md-row align-items-center my-3'>
                        <h4 className='my-0 mx-0 me-md-3'> Dataset Preview </h4>
                        <p className='my-0 second-font-color'> ({Number(sessionStorage.getItem("size")).toLocaleString()}) rows  </p>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {/* Uniform and Non Uniform Toggle */}
                <div className='d-flex w-100 gap-2 mb-3'>
                    <Button className='flex-fill transparent border-gray-hover-gray'  onClick={() => setMode('uniform')}>Uniform </Button>
                    <Button className='flex-fill transparent border-gray-hover-gray'  onClick={() => setMode('nonUniform')}>Non-Uniform </Button>
                </div>
                {/* Render Table */}
                <DataTable table={table}/> 
            </Modal.Body>

            <Modal.Footer className='d-flex justify-content-between '>
                <Button className={ limiter <= 1 ? "invisible disabled" : 'transparent border-gray-hover-gray' } onClick={() => setLimiter(limiter - 1)}>
                    {"<"} Previous
                </Button>
                <p className='second-font-color'> Page {limiter} of {SIZE / ROW_NUM} </p>
                <Button className={ limiter >= (SIZE / ROW_NUM) ? "invisible disabled" : 'transparent border-gray-hover-gray' } onClick={() => setLimiter(limiter + 1)}>
                    Next {">"} 
                </Button>
            </Modal.Footer>
        </Modal>

    </>)
}

export default RunBenchamark
