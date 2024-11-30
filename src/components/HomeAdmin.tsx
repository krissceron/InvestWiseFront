import { Container, Row, Col, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

export function HomeAdmin() {
    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }} className="text-center">
                    <h4>Página Principal</h4>
                    <hr />
                    <Button color="primary" className="m-2" onClick={() => navigate("/listaUsuarios")}>
                        Usuarios
                    </Button>
                    <Button color="success" className="m-2" onClick={() => navigate("/listaProductos")}>
                        Productos
                    </Button>
                    <Button color="info" className="m-2" onClick={() => navigate("/listaPropuestas")}>
                        Propuestas
                    </Button>
                    <Button color="success" className="m-2" onClick={() => navigate("/")}>
                        Cerrar Sesión
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
