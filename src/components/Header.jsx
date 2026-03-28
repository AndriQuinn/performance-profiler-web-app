import { Container } from "react-bootstrap"

const Header = () => {
    return (
        <>
        <Container fluid className="d-flex flex-row align-items-center">
            <div className="pe-3">
                <img src="https://cdn-icons-png.flaticon.com/128/8140/8140054.png" style={{height: 50}}/>
            </div>
            <div>
                <h4> E-Commerce Performance Profiler </h4>
                <p> Import datasets, execute benchmarks, and analyze performance metrics </p>
            </div>
        </Container>
        </>
    )
}

export default Header