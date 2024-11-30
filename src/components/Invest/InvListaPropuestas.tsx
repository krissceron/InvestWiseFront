import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Row, Col, Table, Button } from "reactstrap";
import { IListaPropuesta } from "../../Model/IListaPropuesta";

export function InvListaPropuestas() {
  const [propuestas, setPropuestas] = useState<IListaPropuesta[]>([]);
  const navigate = useNavigate();

  const obtenerPropuestas = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Propuesta/ObtenerTodo`);
      const data = await response.json();

      if (data.codigo === 1) {
        Swal.fire("Éxito", "Propuestas obtenidas exitosamente", "success");
        setPropuestas(data.selectResultado);
      } else if (data.codigo === 0) {
        Swal.fire("Error", "No se encontraron propuestas", "error");
      } else {
        Swal.fire("Error", "Ocurrió un error", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al obtener las propuestas", "error");
    }
  };

  useEffect(() => {
    obtenerPropuestas();
  }, []);

  

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Lista de Propuestas</h4>
          <hr />
          <Table bordered>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Presupuesto de Gasto</th>
                <th>Número de Inversionistas</th>
                <th>Estado de la Propuesta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propuestas.map((item) => (
                <tr key={item.idPropuesta}>
                  <td>{item.nombreProducto}</td>
                  <td>${item.precioProducto.toFixed(2)}</td>
                  <td>${item.presupuestoGastoPropuesta.toFixed(2)}</td>
                  <td>{item.numInversionistasPropuesta}</td>
                  <td>{item.estadoPropuesta}</td>
                  <td>
                    <Link to={`/invDetallePropuesta/${item.idPropuesta}`} className="btn btn-info me-2">Detalles</Link>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button color="secondary" onClick={() => navigate(-1)} className="mt-3">
            Volver
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
