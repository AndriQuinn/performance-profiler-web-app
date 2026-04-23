import { Button } from "react-bootstrap"
import { Fragment } from "react"
import '../App.css'

export default function PageRow({
    currentPage
}) {

      const steps = [
            { label: 'Import Dataset',  number: '1', activeOn: ['/', '/runBenchmark', '/viewResults'] },
            { label: 'Run Benchmarks',  number: '2', activeOn: ['/runBenchmark', '/viewResults'] },
            { label: 'View Results',    number: '3', activeOn: ['/viewResults'] },
        ];

    return (<>

        <div className='d-flex flex-column flex-lg-row justify-content-between px-5 align-items-center my-4 mb-5'>
            {steps.map((step, i) => (
                (
                    <Fragment key={i}>
                        <PageMarker
                            currentPage={currentPage}
                            acitvePage={step.activeOn}
                            label={step.label}
                            number={step.number}
                        />    
                        {i < steps.length - 1 && (
                            <div className="step-line"></div>
                        )}
                    </Fragment>      
                )
            ))
            }    
        </div>
    </>)
}

// --- Smaller Component --- 

const PageMarker = ({
    currentPage,
    acitvePage,
    label,
    number = ""
}) => {
    return (<>
        <div className='d-flex d-none d-md-flex flex-row align-items-center justify-content-start my-2 my-lg-0'>
            <Button className='me-2' style={{borderRadius: "50%", width: "30px", height: "30px",padding: 0,}} variant={acitvePage.includes(currentPage) ? "primary" : "outline-secondary"}>
                {number}
            </Button>
            <p className={acitvePage.includes(currentPage) ? "m-0 p-0 fw-semibold" : "m-0 p-0"}  > {label} </p>
        </div>
    </>)
}
