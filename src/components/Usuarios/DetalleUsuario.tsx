import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appsettings } from "../../settings/appsettings.ts";
import Swal from "sweetalert2";
import { IListaUsuarios } from "../../Model/IListaUsuarios.ts";
import { Container, Row, Col, Button } from "reactstrap";

export function DetalleUsuario() {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<IListaUsuarios | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Usuario/ObtenerPorId/${id}`);
        const data = await response.json();

        if (data.codigo === 1) {
          setUsuario(data.selectResultado[0]); // Asumiendo que los detalles están en el primer elemento de selectResultado
        } else {
          Swal.fire("Error", "No se pudo obtener los detalles del usuario", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Ocurrió un error al obtener los detalles del usuario", "error");
      }
    };

    obtenerUsuario();
  }, [id]);

  if (!usuario) return <p>Cargando detalles del usuario...</p>;

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Detalles del Usuario</h4>
          <hr />
          <p><strong>Nombre Completo:</strong> {usuario.nombreApellido}</p>
          <p><strong>Usuario:</strong> {usuario.nombreUsuario}</p>
          <p><strong>Rol:</strong> {usuario.nombreRol}</p>
          <p><strong>Cédula:</strong> {usuario.cedulaUsuario}</p>
          <p><strong>Teléfono:</strong> {usuario.telefonoUsuario}</p>
          <p><strong>Correo:</strong> {usuario.correoUsuario}</p>
          <Button color="secondary" onClick={() => navigate(-1)} className="mt-3">
            Volver
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
