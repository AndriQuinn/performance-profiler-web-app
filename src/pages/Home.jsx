import '../App.css'
import { Container, Button, Spinner } from "react-bootstrap";
import Header from '../components/Header';
import { useNavigate } from "react-router-dom";
import Header2 from '../components/Header2';
import { useEffect, useState } from "react";
import { useRef } from 'react';
import { useGenerate } from '../hooks/useGenerate';

const Home = () => {

    const navigate = useNavigate();  // Manual page navigation

    return (
        <>
            <Container fluid className="min-vh-100 max-vw-100 d-flex flex-column justify-content-center gray-bg p-1 p-md-2 p-lg-3 p-xl-5">
                <Header/>
                <Container fluid className="white-bg p-3 p-md-5 my-3 ">
                    <Pages/>
                    <InstructionSection/>
                    <ImportDatasetSection/>
                    <SampleDataSection navigate={navigate}/>
                </Container>
            </Container>    
            
        </>
    )
}

const Pages = () => {
    return (
        <>
            <div className='d-flex flex-column flex-lg-row justify-content-between px-5 align-items-center'>
                <div className='d-flex d-none d-md-block flex-row align-items-center justify-content-center my-2 my-lg-0'>
                    <Button className='me-2' style={{borderRadius: "50%", width: "40px", height: "40px",padding: 0,}} variant="primary">
                        1
                    </Button>
                    Import Dataset 
                </div>
                {/* <div className="step-line d-none d-md-block"></div> */}
                <div className='d-flex d-none d-md-block flex-row align-items-center justify-content-center my-2 my-lg-0'>
                    <Button className='me-2' style={{borderRadius: "50%", width: "40px", height: "40px",padding: 0,}} variant="primary">
                        2
                    </Button>
                    Run Benchmarks
                </div>
                {/* <div className="step-line d-none d-md-block"></div> */}
                <div className='d-flex d-none d-md-block flex-row align-items-center justify-content-center my-2 my-lg-0'>
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
        <Container fluid className='border-blue blue-bg p-4 my-4'>
            <div className='d-flex flex-column justify-content-start '>
                <Header2 
                    headerText={"Dataset Instruction"}
                    imagePath={"information.svg"}
                    size={25}
                />
                <p className='my-2'>This system evaluates the performance of search algorithms using an e-commerce dataset. </p>
                <p>You can either: </p>
                <ul>
                    <li> Upload your own dataset (CSV or JSON) </li>
                    <li> Generate a sample dataset automatically </li>
                </ul>
                {/* <p> Each dataset record should contain the following fields: <b> SKU, Name, Category, Price, Stock </b> </p> */}
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
                        size={25}
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

const SampleDataSection = ( {
    navigate,
} ) => {
    const { dataset, generate } = useGenerate() // Data context
    const [loading, setLoading] = useState(null); // Loading state

    // Generate data handler
    const handleGenerateDate = (size) => {
        setLoading(size)
        generate(size)
    }

    useEffect(() => {
        if (dataset) { navigate('/runBenchmark') }
    },[dataset])

    return (
        <>
            <Container fluid className='border-gray my-4 p-4'>
                <div className='d-flex flex-column justify-content-start '>
                    <Header2 
                        headerText={"Generate Sample Dataset"}
                        imagePath={"/table-gray.svg"}
                        size={25}
                    />      
                    <div>
                        <p className='my-2 second-font-color'> Quickly generate synthetic e-commerce data for testing </p>
                    </div>
                    <div  className='d-flex flex-column flex-lg-row justify-content-between align-items-center my-3'>

                        {/* Generate Data Buttons */}
                        <Button className='border-gray d-flex justify-content-center button-default' onClick={ () => handleGenerateDate(1e3) }>
                            {loading === 1e3 ? (<Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />)
                             : (
                                <div className='py-3 d-flex flex-column justify-content-center align-items-center px-5'>
                                    <h4 className='mb-2'>1k </h4>
                                    <p className='my-0 second-font-color'> Records </p>
                                </div>    
                             )}
                        </Button>
                        <Button className='d-flex justify-content-center button-default' onClick={ () => handleGenerateDate(1e4) }>
                            {loading === 1e4 ? (<Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />)
                             : (
                                <div className='py-3 d-flex flex-column justify-content-center align-items-center px-5'>
                                    <h4 className='mb-2'> 10k </h4>
                                    <p className='my-0 second-font-color'> Records </p>
                                </div>    
                             )}
                        </Button>
                        <Button className='d-flex justify-content-center button-default' onClick={ () => handleGenerateDate(1e5) }>
                            {loading === 1e5? (<Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />)
                             : (
                                <div className='py-3 d-flex flex-column justify-content-center align-items-center px-5'>
                                    <h4 className='mb-2'>100k </h4>
                                    <p className='my-0 second-font-color'> Records </p>
                                </div>    
                             )}
                        </Button>
                        <Button className='d-flex justify-content-center button-default' onClick={ () => handleGenerateDate(1e6) }>
                             {loading === 1e6? (<Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                
                            />)
                             : (
                                <div className='py-3 d-flex flex-column justify-content-center align-items-center px-5'>
                                    <h4 className='mb-2'>1M </h4>
                                    <p className='my-0 second-font-color'> Records </p>
                                </div>    
                             )}
                        </Button>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Home