import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IListaProductos } from "../../Model/IListaProductos";
import { Container, Row, Col, Table, Button } from "reactstrap";

export function ListaProductos() {
  const [productos, setProductos] = useState<IListaProductos[]>([]);
  const navigate = useNavigate();

  const obtenerProductos = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Producto/ObtenerTodo`);
      const data = await response.json();

      if (data.codigo === 1) {
        Swal.fire("Éxito", "Productos obtenidos exitosamente", "success");
        setProductos(data.selectResultado);
      } else if (data.codigo === 0) {
        Swal.fire("Error", "No se encontraron productos", "error");
      } else {
        Swal.fire("Error", "Ocurrió un error", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al obtener los productos", "error");
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const botonEliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Eliminar producto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${appsettings.apiUrl}Producto/Eliminar/${id}`, { method: "DELETE" });
          const data = await response.json();

          if (data.codigo === 1) {
            await obtenerProductos();
            Swal.fire("Eliminado", "El producto ha sido eliminado", "success");
          } else {
            Swal.fire("Error", "No se pudo eliminar el producto", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Ocurrió un error al eliminar el producto", "error");
        }
      }
    });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Lista de Productos</h4>
          <hr />
          <Link className="btn btn-success mb-3" to="/crearProducto">
            Nuevo Producto
          </Link>
          <Table bordered>
            <thead>
              <tr>
                <th>Nombre Producto</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((item) => (
                <tr key={item.idProducto}>
                  <td>{item.nombreProducto}</td>
                  <td>{item.descripcionProducto}</td>
                  <td>{item.nombreCategoria}</td>
                  <td>{item.precio}</td>
                  <td>
                    <Link to={`/detalleProducto/${item.idProducto}`} className="btn btn-info me-2">Detalles</Link>
                    <Link to={`/editarProducto/${item.idProducto}`} className="btn btn-primary me-2">Editar</Link>
                    <Button color="danger" onClick={() => botonEliminar(item.idProducto)}>Eliminar</Button>
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
