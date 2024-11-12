import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appsettings } from "../../settings/appsettings.ts";
import Swal from "sweetalert2";
import { IListaProductos } from "../../Model/IListaProductos.ts";
import { Container, Row, Col, Button } from "reactstrap";

export function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<IListaProductos | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Producto/ObtenerPorId/${id}`);
        const data = await response.json();

        if (data.codigo === 1) {
          setProducto(data.selectResultado[0]); // Asume que `selectResultado` contiene los detalles del producto
        } else {
          Swal.fire("Error", "No se pudo obtener los detalles del producto", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Ocurrió un error al obtener los detalles del producto", "error");
      }
    };

    obtenerProducto();
  }, [id]);

  if (!producto) return <p>Cargando detalles del producto...</p>;

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Detalles del Producto</h4>
          <hr />
          <p><strong>Nombre del Producto:</strong> {producto.nombreProducto}</p>
          <p><strong>Categoría:</strong> {producto.nombreCategoria}</p>
          <p><strong>Descripción:</strong> {producto.descripcionProducto}</p>
          <p><strong>Precio:</strong> ${producto.precio}</p>
          <Button color="secondary" onClick={() => navigate(-1)} className="mt-3">
            Volver
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
