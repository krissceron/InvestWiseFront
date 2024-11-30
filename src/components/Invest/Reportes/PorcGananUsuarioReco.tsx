import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Row, Col, Table, Button } from "reactstrap";
import { appsettings } from "../../../settings/appsettings";

interface IReportePorUsuario {
  producto: string;
  inversionTotalPropuesta: number;
  precioDeVenta: number;
  participantes: number;
  inversionIndividual: number;
  ingresoPropuestaPorUsuario: number;
  porcentajeGananciaFinal: number;
  rotacionDias: number | null;
  rentabilidadPorDia: number;
  analisisRentabilidad: string;
}

export function ReportePorUsuario() {
  const [reporte, setReporte] = useState<IReportePorUsuario[]>([]);
  const navigate = useNavigate();

  const obtenerReporte = async () => {
    const userId = localStorage.getItem("userId"); // Obtén el ID del usuario desde localStorage

    if (!userId) {
      Swal.fire("Error", "No se encontró un usuario autenticado", "error");
      return;
    }

    try {
      const response = await fetch(
        `${appsettings.apiUrl}Reportes/ReportePorcentajeGananciaPorUsuario/${userId}`
      );
      const data = await response.json();
      
      if (response.ok ) {
        
        setReporte(data); // Asegúrate de que `selectResultado` es el array con los datos
        Swal.fire("Éxito", "Reporte obtenido exitosamente", "success");
      } else if (data.codigo === 0) {
        Swal.fire("Aviso", "No se encontraron datos para este usuario", "info");
      } else {
        Swal.fire("Error", "Ocurrió un error al obtener el reporte", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al conectar con el servidor", "error");
    }
  };

  useEffect(() => {
    obtenerReporte();
  }, []);

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Reporte de Porcentaje de Ganancia por Usuario</h4>
          <hr />
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
