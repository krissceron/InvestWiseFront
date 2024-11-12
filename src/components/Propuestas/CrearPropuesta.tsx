import { ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import { IPropuesta } from "../../Model/IPropuesta";
import Swal from "sweetalert2";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

// Definir interfaces para la propuesta y el producto
interface IProducto {
  idProducto: number;
  nombreProducto: string;
}

// Propuesta inicial con fecha en formato "yyyy-MM-dd" para el input de tipo date
const initialPropuesta = {
  idProducto: 0,
  numInversionistasPropuesta: 0,
  presupuestoGastoPropuesta: 0,
  fechaInicioPropuesta: new Date().toISOString().split("T")[0], // Formato "YYYY-MM-DD"
};

export function CrearPropuesta() {
  const [propuesta, setPropuesta] = useState<IPropuesta>(initialPropuesta);
  const [productos, setProductos] = useState<IProducto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch productos al montar el componente
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Producto/ObtenerTodo`);
        const data = await response.json();
        setProductos(data.selectResultado); // Suponiendo que los productos vienen en esta propiedad
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductos();
  }, []);

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const inputName = event.target.name;
    let inputValue: string | number = event.target.value;

    if (inputName === "presupuestoGastoPropuesta") {
      // Convertir el valor a número flotante con máximo de 2 decimales
      inputValue = parseFloat(parseFloat(inputValue).toFixed(2)) || 0;
    }

    setPropuesta({ ...propuesta, [inputName]: inputValue });
  };

  const botonVolver = () => {
    navigate("/listaPropuestas");
  };

  const botonGuardar = async () => {
    // Crear una copia de la propuesta con fecha en formato "yyyymmdd"
    const propuestaAEnviar = {
      ...propuesta,
      fechaInicioPropuesta: propuesta.fechaInicioPropuesta.replace(/-/g, ""), // Eliminar guiones
    };

    try {
      const response = await fetch(`${appsettings.apiUrl}Propuesta/Crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propuestaAEnviar),
      });
      const data = await response.json();

      if (data.codigo === 1) {
        Swal.fire("Éxito", "Propuesta creada exitosamente", "success");
        navigate("/listaPropuestas");
      } else {
        Swal.fire("Error", "No se pudo crear la propuesta", "error");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      Swal.fire("Error", "Ocurrió un error al crear la propuesta", "error");
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Crear Propuesta</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label>Producto</Label>
              <Input type="select" name="idProducto" onChange={inputChangeValue} value={propuesta.idProducto}>
                <option value="0">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto}>
                    {producto.nombreProducto}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Número de Inversionistas</Label>
              <Input
                type="number"
                name="numInversionistasPropuesta"
                onChange={inputChangeValue}
                value={propuesta.numInversionistasPropuesta}
              />
            </FormGroup>
            <FormGroup>
              <Label>Presupuesto de Gasto</Label>
              <Input
                type="number"
                name="presupuestoGastoPropuesta"
                onChange={inputChangeValue}
                value={propuesta.presupuestoGastoPropuesta}
                step="0.01" // Permitir incremento de dos decimales
              />
            </FormGroup>
            <FormGroup>
              <Label>Fecha de Inicio de la Propuesta</Label>
              <Input
                type="date"
                name="fechaInicioPropuesta"
                onChange={inputChangeValue}
                value={propuesta.fechaInicioPropuesta}
              />
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
