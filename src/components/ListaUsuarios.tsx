import { useEffect, useState } from "react";
import { appsettings } from "../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { IListaUsuarios } from "../Model/IListaUsuarios.ts";
import { Container, Row, Col, Table, Button } from "reactstrap";

export function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<IListaUsuarios[]>([]);

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Usuario/ObtenerTodo`);
      const data = await response.json();

      if (data.codigo === 1) {
        Swal.fire("Éxito", "Usuarios obtenidos exitosamente", "success");
        setUsuarios(data.selectResultado); // Asegúrate de que `selectResultado` contenga una lista de usuarios
      } else if (data.codigo === 0) {
        Swal.fire("Error", "No se encontraron usuarios", "error");
      } else {
        Swal.fire("Error", "Ocurrió un error", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al obtener los usuarios", "error");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const botonEliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Eliminar usuario",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${appsettings.apiUrl}Usuario/Eliminar/${id}`, { method: "DELETE" });
          const data = await response.json();

          if (data.codigo === 1) {
            await obtenerUsuarios();
            Swal.fire("Eliminado", "El usuario ha sido eliminado", "success");
          } else {
            Swal.fire("Error", "No se pudo eliminar el usuario", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Ocurrió un error al eliminar el usuario", "error");
        }
      }
    });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Lista de Usuarios</h4>
          <hr />
          <Link className="btn btn-success mb-3" to="/crearUsuario">
            Nuevo Usuario
          </Link>
          <Table bordered>
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Cédula</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((item) => (
                <tr key={item.idUsuario}>
                  <td>{item.nombreApellido}</td>
                  <td>{item.nombreUsuario}</td>
                  <td>{item.nombreRol}</td> 
                  <td>{item.cedulaUsuario}</td>
                  <td>{item.telefonoUsuario}</td>
                  <td>{item.correoUsuario}</td>
                  <td >
                    <Link to={`/editarUsuario/${item.idUsuario}`} className="btn btn-primary me-2">Editar</Link>
                    <Button color="danger" onClick={() => botonEliminar(item.idUsuario)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
