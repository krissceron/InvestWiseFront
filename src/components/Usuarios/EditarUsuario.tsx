import { ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { IUsuario } from "../../Model/IUsuario";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

interface IRol {
    idRol: number;
    nombreRol: string;
  }

const initialUsuario = {
    idUsuario:0,
    idRol: 0,
    nombreApellido: "",
    nombreUsuario: "",
    contraseniaUsuario: "",
    cedulaUsuario: "",
    telefonoUsuario: "",
    correoUsuario: "",
  };
export function EditarUsuario(){
    const {id}=  useParams<{id:string}>()
    const [usuario, setUsuario]=useState<IUsuario>(initialUsuario)
    const [roles, setRoles] = useState<IRol[]>([]);
    const navigate = useNavigate();

  useEffect(() => {
    // Fetch roles when component mounts
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Rol/ObtenerTodo`);
        const data = await response.json();
        setRoles(data.selectResultado); // Assumes roles come in this property
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const obtenerUsuario = async () => {
        try {
            const response = await fetch(`${appsettings.apiUrl}Usuario/ObtenerPorId/${id}`);
            const data = await response.json();

            if (data.codigo === 1) {
                Swal.fire("Éxito", "Usuario obtenido exitosamente", "success");
                setUsuario(data.selectResultado[0]); // Suponiendo que `selectResultado` contiene el usuario
            } else if (data.codigo === 0) {
                Swal.fire("Error", "No se encontró al usuario", "error");
            } else {
                Swal.fire("Error", "Ocurrió un error", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Ocurrió un error al obtener el usuario", "error");
        }
    };

    obtenerUsuario();
}, [id]);


    const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setUsuario({ ...usuario, [inputName]: inputValue });
      };

      //botones

      const botonGuardar = async () => {
        try {
            const response = await fetch(`${appsettings.apiUrl}Usuario/Editar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario),
            });
            const data = await response.json();
            if (data.codigo === 1) {
                Swal.fire("Éxito", "Usuario editado exitosamente", "success");
                navigate("/listaUsuarios");
            } else {
                Swal.fire("Error", "No se pudo editar el usuario", "error");
            }
        } catch (error) {
            console.error("Error editing user:", error);
            Swal.fire("Error", "Ocurrió un error al editar el usuario", "error");
        }
    };
    
    
      const botonVolver = () => {
        navigate("/listaUsuarios");
      };

      return (
        <Container className="mt-5">
          <Row>
            <Col sm={{ size: 8, offset: 2 }}>
              <h4>Editar Usuario</h4>
              <hr />
              <Form>
                <FormGroup>
                  <Label>Rol</Label>
                  <Input type="select" name="idRol" onChange={inputChangeValue} value={usuario.idRol}>
                    <option value="0">Seleccione un rol</option>
                    {roles.map((rol) => (
                      <option key={rol.idRol} value={rol.idRol}>
                        {rol.nombreRol}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Nombre</Label>
                  <Input type="text" name="nombreApellido" onChange={inputChangeValue} value={usuario.nombreApellido} />
                </FormGroup>
                <FormGroup>
                  <Label>Nombre de Usuario</Label>
                  <Input type="text" name="nombreUsuario" onChange={inputChangeValue} value={usuario.nombreUsuario} />
                </FormGroup>
                <FormGroup>
                  <Label>Correo</Label>
                  <Input type="text" name="correoUsuario" onChange={inputChangeValue} value={usuario.correoUsuario} />
                </FormGroup>
                <FormGroup>
                  <Label>Cédula</Label>
                  <Input type="text" name="cedulaUsuario" onChange={inputChangeValue} value={usuario.cedulaUsuario} />
                </FormGroup>
                <FormGroup>
                  <Label>Teléfono</Label>
                  <Input type="text" name="telefonoUsuario" onChange={inputChangeValue} value={usuario.telefonoUsuario} />
                </FormGroup>
                <FormGroup>
                  <Label>Contraseña</Label>
                  <Input type="text" name="contraseniaUsuario" onChange={inputChangeValue} value={usuario.contraseniaUsuario} />
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