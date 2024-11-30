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
        console.log("ID de usuario desde localStorage:", data);
        if (data.codigo === 1) {
            const { rolUsuario, idUsuario } = data.selectResultado || {};
            localStorage.setItem("userRole", rolUsuario); // Guardar el rol en localStorage
            localStorage.setItem("userId", idUsuario); // Guardar el ID del usuario en localStorage
            console.log("ID de usuario desde localStorage:", {idUsuario});
            console.log("ROL de usuario desde localStorage:", {rolUsuario});


            Swal.fire("Éxito", `Bienvenido, rol: ${rolUsuario}`, "success");
            if (rolUsuario === "Administrador") {
                navigate("/HomeAdmin");
            } else if (rolUsuario === "Inversionista") {
                navigate("/HomeInvest");
            }
        } else if (data.codigo === 0) {
            Swal.fire("Error", "Credenciales incorrectas", "error");
        } else {
            Swal.fire("Error", "Ocurrió un error durante el login", "error");
        }
    } catch (error) {
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
