import { ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { IPropuesta } from "../../Model/IPropuesta";



const initialPropuesta: IPropuesta = {
  idPropuesta: 0,
  idProducto: 0,
  numInversionistasPropuesta: 0,
  presupuestoGastoPropuesta: 0,
  precioVentaPropuesta: 0,
  fechaInicioPropuesta: new Date().toISOString().split("T")[0], // Formato "YYYY-MM-DD",
};

export function EditarPropuesta() {
  const { id } = useParams<{ id: string }>();
  const [propuesta, setPropuesta] = useState<IPropuesta>(initialPropuesta);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPropuesta = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Propuesta/ObtenerPorId/${id}`);
        const data = await response.json();

        if (data.codigo === 1) {
          Swal.fire("Éxito", "Propuesta obtenida exitosamente", "success");

          const propuestaObtenida = data.selectResultado[0];

          // Convertir la fecha al formato "YYYY-MM-DD" si es necesario
          if (propuestaObtenida.fechaInicioPropuesta) {
            if (propuestaObtenida.fechaInicioPropuesta.length === 8) {
              // Convertir de "YYYYMMDD" a "YYYY-MM-DD"
              propuestaObtenida.fechaInicioPropuesta =
                propuestaObtenida.fechaInicioPropuesta.slice(0, 4) + "-" +
                propuestaObtenida.fechaInicioPropuesta.slice(4, 6) + "-" +
                propuestaObtenida.fechaInicioPropuesta.slice(6, 8);
            }
          }

          setPropuesta(propuestaObtenida);
        } else {
          Swal.fire("Error", "No se encontró la propuesta", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Ocurrió un error al obtener la propuesta", "error");
      }
    };

    obtenerPropuesta();
  }, [id]);

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setPropuesta({ ...propuesta, [inputName]: inputValue });
  };

  const botonGuardar = async () => {
    try {
      const propuestaAEnviar = {
        ...propuesta,
        fechaInicioPropuesta: propuesta.fechaInicioPropuesta.replace(/-/g, ""), // Convertir "YYYY-MM-DD" a "YYYYMMDD"
      };

      const response = await fetch(`${appsettings.apiUrl}Propuesta/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propuestaAEnviar),
      });

      const data = await response.json();
      if (data.codigo === 1) {
        Swal.fire("Éxito", "Propuesta editada exitosamente", "success");
        navigate("/listaPropuestas");
      } else {
        Swal.fire("Error", "No se pudo editar la propuesta", "error");
      }
    } catch (error) {
      console.error("Error al editar propuesta:", error);
      Swal.fire("Error", "Ocurrió un error al editar la propuesta", "error");
    }
  };

  const botonVolver = () => {
    navigate("/listaPropuestas");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Editar Propuesta</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label htmlFor="idProducto">Producto</Label>
              <Input
                type="number"
                name="idProducto"
                id="idProducto"
                onChange={inputChangeValue}
                value={propuesta.idProducto}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="numInversionistasPropuesta">Número de Inversionistas</Label>
              <Input
                type="number"
                name="numInversionistasPropuesta"
                id="numInversionistasPropuesta"
                onChange={inputChangeValue}
                value={propuesta.numInversionistasPropuesta}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="presupuestoGastoPropuesta">Presupuesto de Gasto</Label>
              <Input
                type="number"
                name="presupuestoGastoPropuesta"
                id="presupuestoGastoPropuesta"
                onChange={inputChangeValue}
                value={propuesta.presupuestoGastoPropuesta}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="fechaInicioPropuesta">Fecha de Inicio</Label>
              <Input
                type="date"
                name="fechaInicioPropuesta"
                id="fechaInicioPropuesta"
                onChange={inputChangeValue}
                value={propuesta.fechaInicioPropuesta}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="precioVentaPropuesta">Precio de Venta</Label>
              <Input
                type="number"
                name="precioVentaPropuesta"
                id="precioVentaPropuesta"
                onChange={inputChangeValue}
                value={propuesta.precioVentaPropuesta}
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
