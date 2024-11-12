import { ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { IProducto } from "../../Model/IProducto";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

interface ICategoria {
    idCategoria: number;
    nombreCategoria: string;
}

const initialProducto = {
    idProducto: 0,
    idCategoria: 0,
    nombreProducto: "",
    descripcionProducto: "",
    precio: 0,
};

export function EditarProducto() {
    const { id } = useParams<{ id: string }>();
    const [producto, setProducto] = useState<IProducto>(initialProducto);
    const [categorias, setCategorias] = useState<ICategoria[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener categorías al montar el componente
        const fetchCategorias = async () => {
            try {
                const response = await fetch(`${appsettings.apiUrl}Categoria/ObtenerTodo`);
                const data = await response.json();
                setCategorias(data.selectResultado); // Asume que `selectResultado` contiene las categorías
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategorias();
    }, []);

    useEffect(() => {
        // Obtener el producto por su ID
        const obtenerProducto = async () => {
            try {
                const response = await fetch(`${appsettings.apiUrl}Producto/ObtenerPorId/${id}`);
                const data = await response.json();

                if (data.codigo === 1) {
                    Swal.fire("Éxito", "Producto obtenido exitosamente", "success");
                    setProducto(data.selectResultado[0]); // Asume que `selectResultado` contiene el producto
                } else if (data.codigo === 0) {
                    Swal.fire("Error", "No se encontró el producto", "error");
                } else {
                    Swal.fire("Error", "Ocurrió un error", "error");
                }
            } catch (error) {
                Swal.fire("Error", "Ocurrió un error al obtener el producto", "error");
            }
        };

        obtenerProducto();
    }, [id]);

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setProducto({ ...producto, [inputName]: inputValue });
    };

    const botonGuardar = async () => {
        try {
            const response = await fetch(`${appsettings.apiUrl}Producto/Editar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(producto),
            });
            const data = await response.json();
            if (data.codigo === 1) {
                Swal.fire("Éxito", "Producto editado exitosamente", "success");
                navigate("/listaProductos");
            } else {
                Swal.fire("Error", "No se pudo editar el producto", "error");
            }
        } catch (error) {
            console.error("Error editing product:", error);
            Swal.fire("Error", "Ocurrió un error al editar el producto", "error");
        }
    };

    const botonVolver = () => {
        navigate("/listaProductos");
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Editar Producto</h4>
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
                            <Label>Descripción</Label>
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
