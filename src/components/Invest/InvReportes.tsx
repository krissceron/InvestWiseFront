import { Container, Row, Col, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

export function InvReportes() {
    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }} className="text-center">
                    <h4>Home Inversionista</h4>
                    <hr />
                       <Button color="info" className="m-2" onClick={() => navigate("/porcGananUsuReco")}>
                        Mis Ganancias y Recomendaciones
                    </Button>
                    <Button color="info" className="m-2" onClick={() => navigate("/productosRentables")}>
                        Mis productos más rentables
                    </Button>
                    <Button color="success" className="m-2" onClick={() => navigate("/HomeInvest")}>
                        Volver
                    </Button>
                    
                </Col>
            </Row>
        </Container>
    );
}
