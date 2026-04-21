import { Container } from "react-bootstrap"

export default function Header() {
    return (
        <>
        <Container fluid className="d-flex flex-row align-items-center mb-3">
            <div className="pe-3">
                <img src="/logo.svg" style={{height: 35}}/>
            </div>
            <div>
                <h4 className="fw-semibold"> E-Commerce Performance Profiler </h4>
                <p className="mb-0 second-font-color"> Import datasets, execute benchmarks, and analyze performance metrics </p>
            </div>
        </Container>
        </>
    )
}

