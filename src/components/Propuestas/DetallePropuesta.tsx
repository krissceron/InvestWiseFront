import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appsettings } from "../../settings/appsettings.ts";
import Swal from "sweetalert2";
import { Container, Row, Col, Button, Table } from "reactstrap";
import { IListaPropuesta } from "../../Model/IListaPropuesta.ts";
import { IListaUsuarioPropuesta } from "../../Model/IListaUsuarioPropuesta.ts";

export function DetallePropuesta() {
  const { id } = useParams<{ id: string }>();
  const [propuesta, setPropuesta] = useState<IListaPropuesta | null>(null);
  const [usuarios, setUsuarios] = useState<IListaUsuarioPropuesta[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Propuesta/ObtenerPorId/${id}`);
        const data = await response.json();

        if (data.codigo === 1) {
          
            setPropuesta(data.selectResultado[0]); // Asumiendo que los detalles están en el primer elemento de selectResultado
        } else {
          Swal.fire("Error", "No se pudo obtener los detalles del usuario", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Ocurrió un error al obtener los detalles del usuario", "error");
      }
    };

    obtenerUsuario();
  }, [id]);

  // Obtener usuarios asociados a la propuesta
  useEffect(() => {
    const obtenerUsuariosPorPropuesta = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Propuesta/ObtenerUsuariosPorPropuesta/${id}`);
        const data = await response.json();

        if (data.codigo === 1) {
          setUsuarios(data.selectResultado);
        } else {
          Swal.fire("Error", "No se pudo obtener los usuarios de la propuesta", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Ocurrió un error al obtener los usuarios de la propuesta", "error");
      }
    };

    obtenerUsuariosPorPropuesta();
  }, [id]);

  if (!propuesta) return <p>Cargando detalles del usuario...</p>;

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Detalles de la Propuesta</h4>
          <hr />
          <p><strong>Producto:</strong> {propuesta.nombreProducto}</p>
          <p><strong>Precio:</strong> ${propuesta.precioProducto}</p>
          <p><strong>Num de Inversionistas:</strong> {propuesta.numInversionistasPropuesta}</p>
          <p><strong>Presupuesto de Gasto:</strong> ${propuesta.presupuestoGastoPropuesta}</p>
          <h5 className="mt-4">Usuarios Participantes</h5>
          <Table bordered>
            <thead>
              <tr>
                <th>Nombre de Usuario</th>
                <th>Porcentaje de Participación</th>
                <th>Monto de Inversión</th>
                <th>Utilidad por Usuario</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr key={`${usuario.idUsuario}-${usuario.idUsuarioPropuesta}`}>
                    <td>{usuario.nombreApellido}</td>
                    <td>{usuario.porcentPartiUsuProp.toFixed(2)}%</td>
                    <td>${usuario.montoInversion.toFixed(2)}</td>
                    <td>${usuario.utilidadPorUsuario.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">No hay usuarios participantes</td>
                </tr>
              )}
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
