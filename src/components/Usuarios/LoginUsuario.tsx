import { ChangeEvent, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ILoginUsuario } from "../../Model/ILoginUsuario";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

// Configuración inicial del usuario
const initialLoginUsuario: ILoginUsuario = {
  nombreUsuario: "",
  contraseniaUsuario: ""
};

export function LoginUsuario() {
  const [loginusuario, setLoginUsuario] = useState<ILoginUsuario>(initialLoginUsuario);
  const navigate = useNavigate();

  // Manejo de cambios en los inputs
  const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setLoginUsuario({ ...loginusuario, [inputName]: inputValue });
  };

  // Función para el botón de login
  const botonLogin = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Usuario/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginusuario),
      });
      const data = await response.json();

      if (data.codigo === 1) {
        Swal.fire("Éxito", "Usuario logeado exitosamente", "success");
        navigate("/paginaPrincipal"); // Navega a otra ruta en caso de éxito
      } else if (data.codigo === 0) {
        Swal.fire("Error", "Credenciales incorrectas", "error");
      } else {
        Swal.fire("Error", "Ocurrió un error durante el login", "error");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      Swal.fire("Error", "Ocurrió un error al iniciar sesión", "error");
    }
  };

  const botonRegistrarse = () => {
    navigate("/registroUsuario");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>Iniciar Sesión</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label>Nombre de Usuario</Label>
              <Input
                type="text"
                name="nombreUsuario"
                onChange={inputChangeValue}
                value={loginusuario.nombreUsuario}
              />
            </FormGroup>
            <FormGroup>
              <Label>Contraseña</Label>
              <Input
                type="password"
                name="contraseniaUsuario"
                onChange={inputChangeValue}
                value={loginusuario.contraseniaUsuario}
              />
            </FormGroup>
            <Button color="primary" className="me-4" onClick={botonLogin}>
              Iniciar Sesión
            </Button>
            <Button color="secondary" onClick={botonRegistrarse}>
              Registrarse
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
