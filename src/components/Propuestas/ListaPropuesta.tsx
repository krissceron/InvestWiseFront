import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Row, Col, Table, Button } from "reactstrap";
import { IListaPropuesta } from "../../Model/IListaPropuesta";



export function ListaPropuestas() {
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

  const botonEliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Eliminar propuesta",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${appsettings.apiUrl}Propuesta/Eliminar/${id}`, { method: "DELETE" });
          const data = await response.json();

          if (data.codigo === 1) {
            await obtenerPropuestas();
            Swal.fire("Eliminado", "La propuesta ha sido eliminada", "success");
          } else {
            Swal.fire("Error", "No se pudo eliminar la propuesta", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Ocurrió un error al eliminar la propuesta", "error");
        }
      }
    });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Lista de Propuestas</h4>
          <hr />
          <Link className="btn btn-success mb-3" to="/crearPropuesta">
            Nueva Propuesta
          </Link>
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
                  <td>{item.precioProducto.toFixed(2)}</td>
                  <td>{item.presupuestoGastoPropuesta.toFixed(2)}</td>
                  <td>{item.numInversionistasPropuesta}</td>
                  <td>{item.estadoPropuesta}</td>
                  <td>
                    <Link to={`/detallePropuesta/${item.idPropuesta}`} className="btn btn-info me-2">Detalles</Link>
                    <Link to={`/editarPropuesta/${item.idPropuesta}`} className="btn btn-primary me-2">Editar</Link>
                    <Button color="danger" onClick={() => botonEliminar(item.idPropuesta)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button color="secondary" onClick={() => navigate("/paginaPrincipal")} className="mt-3">
            Volver
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
