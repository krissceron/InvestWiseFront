import { ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IProducto } from "../../Model/IProducto";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

interface ICategoria {
  idCategoria: number;
  nombreCategoria: string;
}

const initialProducto = {
  idCategoria: 0,
  nombreProducto: "",
  descripcionProducto: "",
  precio: 0,
};

export function CrearProducto() {
  const [producto, setProducto] = useState<IProducto>(initialProducto);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Categoria/ObtenerTodo`);
        const data = await response.json();
        setCategorias(data.selectResultado); // Assuming the response has 'selectResultado' with a list of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategorias();
  }, []);

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setProducto({ ...producto, [inputName]: inputValue });
  };

  const botonGuardar = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Producto/Crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
      const data = await response.json();
      if (data.codigo === 1) {
        Swal.fire("Éxito", "Producto creado exitosamente", "success");
        navigate("/listaProductos");
      } else {
        Swal.fire("Error", "No se pudo crear el producto", "error");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      Swal.fire("Error", "Ocurrió un error al crear el producto", "error");
    }
  };

  const botonVolver = () => {
    navigate("/listaProductos");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Crear Producto</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label>Categoría</Label>
              <Input type="select" name="idCategoria" onChange={inputChangeValue} value={producto.idCategoria}>
                <option value="0">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.idCategoria} value={categoria.idCategoria}>
                    {categoria.nombreCategoria}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Nombre del Producto</Label>
              <Input type="text" name="nombreProducto" onChange={inputChangeValue} value={producto.nombreProducto} />
            </FormGroup>
            <FormGroup>
              <Label>Descripción del Producto</Label>
              <Input type="text" name="descripcionProducto" onChange={inputChangeValue} value={producto.descripcionProducto} />
            </FormGroup>
            <FormGroup>
              <Label>Precio</Label>
              <Input type="number" name="precio" onChange={inputChangeValue} value={producto.precio} />
            </FormGroup>
            <Button color="primary" className="me-4" onClick={botonGuardar}>
              Guardar
            </Button>
            <Button color="secondary" onClick={botonVolver}>
              Volver
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
