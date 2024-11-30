import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appsettings } from "../../settings/appsettings.ts";
import Swal from "sweetalert2";
import { Container, Row, Col, Button, Table } from "reactstrap";
import { IListaPropuesta } from "../../Model/IListaPropuesta.ts";
import { IListaUsuarioPropuesta } from "../../Model/IListaUsuarioPropuesta.ts";

export function InvDetallePropuesta() {
  const { id } = useParams<{ id: string }>();
  const [propuesta, setPropuesta] = useState<IListaPropuesta | null>(null);
  const [usuarios, setUsuarios] = useState<IListaUsuarioPropuesta[]>([]);
  const navigate = useNavigate();

  // Obtener detalles de la propuesta
  useEffect(() => {
    const obtenerPropuesta = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Propuesta/ObtenerPorId/${id}`);
        const data = await response.json();

        if (data.codigo === 1) {
          setPropuesta(data.selectResultado[0]); // Asumiendo que los detalles están en el primer elemento
        } else {
          Swal.fire("Error", "No se pudo obtener los detalles de la propuesta", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Ocurrió un error al obtener los detalles de la propuesta", "error");
      }
    };

    obtenerPropuesta();
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

  // Función para aceptar propuesta
  const aceptarPropuesta = async () => {
    const idUsuario = localStorage.getItem("userId");
    const rolUsuario = localStorage.getItem("userRole");

    console.log("ID de usuario desde localStorage:", idUsuario);
    console.log("Rol de usuario desde localStorage:", rolUsuario);

    if (!idUsuario) {
      Swal.fire("Error", "Usuario no logueado correctamente", "error");
      return;
    }

    try {
      const response = await fetch(`${appsettings.apiUrl}Propuesta/AceptarPropuesta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idUsuario: parseInt(idUsuario, 10),
          idPropuesta: parseInt(id!, 10),
        }),
      });

      const data = await response.json();

      console.log("Respuesta completa del backend:", data);

      if (data.codigo === 1) {
        Swal.fire("Éxito", "Propuesta aceptada correctamente", "success");
        const obtenerUsuariosPorPropuesta = async () => {
          const response = await fetch(`${appsettings.apiUrl}Propuesta/ObtenerUsuariosPorPropuesta/${id}`);
          const data = await response.json();
          if (data.codigo === 1) setUsuarios(data.selectResultado);
        };
        obtenerUsuariosPorPropuesta();
      } else if (data.codigo === 2) {
        Swal.fire("Atención", "Ya aceptaste esta propuesta", "warning");
      } else if (data.codigo === -1 ) {
        Swal.fire("Atención", "Límite de inversionistas alcanzado", "warning");
      } else {
        Swal.fire("Error", "Error al aceptar la propuesta", "error");
      }
    } catch (error) {
      console.error("Error al aceptar la propuesta:", error);
      Swal.fire("Error", "Ocurrió un problema al conectar con el servidor", "error");
    }
  };

  const salirPropuesta = async () => {
    const idUsuario = localStorage.getItem("userId");
    if (!idUsuario) {
        Swal.fire("Error", "Usuario no logueado correctamente", "error");
        return;
    }

    try {
        const response = await fetch(`${appsettings.apiUrl}Propuesta/SalirPropuesta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idUsuario: parseInt(idUsuario, 10),
                idPropuesta: parseInt(id!, 10),
            }),
        });

        const data = await response.json();

        if (data.codigo === 1) {
            Swal.fire("Éxito", "Saliste de la propuesta correctamente", "success");

            // Actualizar la lista de usuarios participantes después de salir
            const obtenerUsuariosPorPropuesta = async () => {
                const response = await fetch(`${appsettings.apiUrl}Propuesta/ObtenerUsuariosPorPropuesta/${id}`);
                const data = await response.json();
                if (data.codigo === 1) setUsuarios(data.selectResultado);
            };
            obtenerUsuariosPorPropuesta();
        } else if (data.codigo === 0) {
            Swal.fire("Error", "No estabas asociado a esta propuesta", "warning");
        } else {
            Swal.fire("Error", "Ocurrió un error al salir de la propuesta", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrió un problema al conectar con el servidor", "error");
    }
};



  if (!propuesta) return <p>Cargando detalles de la propuesta...</p>;

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Detalles de la Propuesta</h4>
          <hr />
          <p><strong>Producto:</strong> {propuesta.nombreProducto}</p>
          <p><strong>Precio:</strong> ${propuesta.precioProducto.toFixed(2)}</p>
          <p><strong>Número de Inversionistas:</strong> {propuesta.numInversionistasPropuesta}</p>
          <p><strong>Presupuesto de Gasto:</strong> ${propuesta.presupuestoGastoPropuesta.toFixed(2)}</p>
          
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

          <Button color="secondary" onClick={() => navigate(-1)} className="mt-3 me-2">
            Volver
          </Button>
          <Button color="success" onClick={aceptarPropuesta} className="mt-3 me-2">
            Aceptar
          </Button>
          <Button color="primary" onClick={salirPropuesta} className="mt-3">
            Cancelar
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
