import '../App.css'
import { Container, Button, Spinner } from "react-bootstrap";
import Header from '../components/Header';
import { useNavigate, useLocation } from "react-router-dom";
import Header2 from '../components/Header2';
import { useEffect, useState, useRef } from "react";
import { useGenerate } from '../hooks/useGenerate';
import PageRow from '../components/PageRow';
import PageTransition from '../components/PageTransition';

const Home = () => {

    const { pathname } = useLocation();

    return ( <>
        <Container fluid className="min-vh-100 max-vw-100 d-flex flex-column justify-content-center custom-padding gray-bg custom-container">
            <Header/>
                <Container fluid className="white-bg p-2 p-md-5 my-3 ">
                    <PageRow currentPage={pathname}/>
                    <PageTransition>
                        <InstructionSection/>
                        <ImportDatasetSection/>
                        <SampleDataSection/>
                    </PageTransition>
                </Container>    
        </Container>    
    </>)
}

// --- Section Components ---

const InstructionSection = () => {
    return (<>
        <Container fluid className='border-blue blue-bg p-4 my-4'>
            <div className='d-flex flex-column justify-content-start '>
                <Header2 
                    headerText={"Dataset Instruction"}
                    imagePath={"information.svg"}
                    size={20}
                />
                <p className='my-2'>This system evaluates the performance of search algorithms using an e-commerce dataset. </p>
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

    // Upload dataset handler
    const fileInputRef = useRef(null);
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
        const content = event.target.result;

        if (file.name.endsWith('.json')) {
            const data = JSON.parse(content);
            onDataLoaded(data.sort((a, b) => a - b));
        }

        if (file.name.endsWith('.csv')) {
            const data = content
            .split('\n')
            .map(row => row.trim())
            .filter(row => row)
            .map(Number);
            onDataLoaded(data.sort((a, b) => a - b));
        }
        };
        reader.readAsText(file);
    };

    return (
        <>
            <Container fluid className='border-gray my-4 p-4'>
                <div className='d-flex flex-column justify-content-start '>
                    <Header2 
                        headerText={"Import E-commerce Dataset"}
                        imagePath={"database-gray.svg"}
                        size={20}
                    />
                    <div>
                        <p className='my-2 second-font-color'> Upload your dataset file (JSON or CSV format) or generate sample data </p>
                    </div>
                </div>
                <input
                    type="file"
                    accept=".json,.csv"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
                <Button className='button-max gray-bg-2 gray-border-2 d-flex flex-column justify-content-center align-items-center p-5 my-3' onClick={() => fileInputRef.current.click()}>
                    <img src='/upload.svg' style={{height: 30}} alt=''/>
                    <p> <b> Click to upload or drag and drop </b> </p>
                    <p className='second-font-color'> Supports JSON and CSV files </p>
                </Button>   
            </Container>
        </>
    )
}

const SampleDataSection = () => {

    const { datasetArr, generate } = useGenerate() // Data context
    const [isLoading, setLoading] = useState(null); // Loading state
    const navigate = useNavigate();  // Manual page navigation

    // Generate data handler
    const handleGenerateData = (size) => {
        setLoading(size)
        generate(size)
    }

    useEffect(() => {
        if (!datasetArr) return; 
        navigate('/runBenchmark') 
    },[datasetArr])

    return (
        <>
            <Container fluid className='border-gray my-4 p-4'>
                <div className='d-flex flex-column justify-content-start '>
                    <Header2 
                        headerText={"Generate Sample Dataset"}
                        imagePath={"/table-gray.svg"}
                        size={20}
                    />      
                    <div>
                        <p className='my-2 second-font-color'> Quickly generate synthetic e-commerce data for testing </p>
                    </div>
                    <div  className='d-flex flex-column flex-xl-row justify-content-between align-items-center my-3'>
                        <GenerateDataButton
                            label={"1K"}
                            handleGenerateData={handleGenerateData}
                            size={1e3}
                            isLoading={isLoading}
                        />
                        <GenerateDataButton
                            label={"10K"}
                            handleGenerateData={handleGenerateData}
                            size={1e4}
                            isLoading={isLoading}
                        />
                        <GenerateDataButton
                            label={"100K"}
                            handleGenerateData={handleGenerateData}
                            size={1e5}
                            isLoading={isLoading}
                        />
                        <GenerateDataButton
                            label={"1M"}
                            handleGenerateData={handleGenerateData}
                            size={1e6}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </Container>
        </>
    )
}

// --- Smaller Components ---

const GenerateDataButton = ({ label, handleGenerateData, size, isLoading }) => {
    return(<>
        <Button disabled={isLoading !== null} className='d-flex justify-content-center button-default' onClick={ () => handleGenerateData(size) }>
            {isLoading === size? 
            (
                <div className='py-4 d-flex flex-column justify-content-center align-items-center px-5'>
                    <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
                </div>
            )
            : (
                <div className='py-3 d-flex flex-column justify-content-center align-items-center px-5'>
                    <h4 className='mb-2'>{label} </h4>
                    <p className='my-0 second-font-color'> Records </p>
                </div>    
                )}
        </Button>
    
    </>)
}

export default Home
