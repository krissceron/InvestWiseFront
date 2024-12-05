import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Row, Col, Table, Button, Input } from "reactstrap";
import { appsettings } from "../../../settings/appsettings";

interface IReportePorUsuario {
  producto: string;
  inversionTotalPropuesta: number;
  precioDeVenta: number;
  participantes: number;
  inversionIndividual: number;
  ingresoPropuestaPorUsuario: number;
  porcentajeGananciaFinal: number;
  mensajeResultado: string;
  rotacionDias: number | null;
  rentabilidadPorDia: number;
  analisisRentabilidad: string;
}

interface ICategoria {
  idCategoria: number;
  nombreCategoria: string;
}

export function ReporteProductoRentablePorUsuario() {
  const [reporte, setReporte] = useState<IReportePorUsuario[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Categoria/ObtenerTodo`);
        const data = await response.json();

        if (data.codigo === 1) {
          setCategorias(data.selectResultado);
        } else {
          Swal.fire("Error", "No se pudieron cargar las categorías", "error");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire("Error", "Ocurrió un error al cargar las categorías", "error");
      }
    };

    obtenerCategorias();
  }, []);

  const obtenerReporte = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      Swal.fire("Error", "No se encontró un usuario autenticado", "error");
      return;
    }

    if (categoriaSeleccionada === null) {
      Swal.fire("Aviso", "Seleccione una categoría antes de generar el reporte", "info");
      return;
    }

    try {
      const response = await fetch(
        `${appsettings.apiUrl}Reportes/ReportePorcentajeGananciaPorUsuarioYCategoria/${userId}/${categoriaSeleccionada}`
      );
      const data = await response.json();

      if (response.ok) {
        setReporte(data);
        Swal.fire("Éxito", "Reporte obtenido exitosamente", "success");
      } else if (data.mensaje) {
        Swal.fire("Aviso", data.mensaje, "info");
      } else {
        Swal.fire("Error", "Ocurrió un error al obtener el reporte", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al conectar con el servidor", "error");
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Reporte de Porcentaje de Ganancia por Usuario</h4>
          <hr />
          <Row className="mb-3">
            <Col sm="6">
              <label htmlFor="categoria">Seleccione una Categoría:</label>
              <Input
                type="select"
                id="categoria"
                value={categoriaSeleccionada || ""}
                onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
              >
                <option value="" disabled>
                  -- Seleccione una Categoría --
                </option>
                {categorias.map((categoria) => (
                  <option key={categoria.idCategoria} value={categoria.idCategoria}>
                    {categoria.nombreCategoria}
                  </option>
                ))}
              </Input>
            </Col>
            <Col sm="6" className="d-flex align-items-end">
              <Button color="primary" onClick={obtenerReporte}>
                Generar Reporte
              </Button>
            </Col>
          </Row>
          <Table bordered>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Inversión Total</th>
                <th>Precio Venta</th>
                <th>Participantes</th>
                <th>Inversión Individual</th>
                <th>Ingreso por Usuario</th>
                <th>% Ganancia Final</th>
                <th>Cumplimiento de Objetivo</th>
                <th>Rotación (días)</th>
                <th>Rentabilidad por Día</th>
                <th>Análisis</th>
              </tr>
            </thead>
            <tbody>
              {reporte.map((item, index) => (
                <tr key={index}>
                  <td>{item.producto}</td>
                  <td>${item.inversionTotalPropuesta.toFixed(2)}</td>
                  <td>${item.precioDeVenta.toFixed(2)}</td>
                  <td>{item.participantes}</td>
                  <td>${item.inversionIndividual.toFixed(2)}</td>
                  <td>${item.ingresoPropuestaPorUsuario.toFixed(2)}</td>
                  <td>{item.porcentajeGananciaFinal.toFixed(2)}%</td>
                  <td>{item.mensajeResultado}</td>
                  <td>{item.rotacionDias !== null ? item.rotacionDias : "N/A"}</td>
                  <td>{item.rentabilidadPorDia.toFixed(2)}%</td>
                  <td>{item.analisisRentabilidad}</td>
                </tr>
              ))}
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
