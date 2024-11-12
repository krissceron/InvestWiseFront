import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ListaUsuarios } from "./components/Usuarios/ListaUsuarios"
import { CrearUsuario } from "./components/Usuarios/CrearUsuario"
import { EditarUsuario } from "./components/Usuarios/EditarUsuario"
import { LoginUsuario } from "./components/Usuarios/LoginUsuario"
import { RegistroUsuario } from "./components/Usuarios/RegistroUsuario"
import { PaginaPrincipal } from "./components/PagPrincipalAdmin"
import { DetalleUsuario } from "./components/Usuarios/DetalleUsuario"
import { CrearProducto } from "./components/Productos/CrearProducto"
import { ListaProductos } from "./components/Productos/ListaProductos"
import { EditarProducto } from "./components/Productos/EditarProducto"
import { DetalleProducto } from "./components/Productos/DetalleProducto"
import { CrearPropuesta } from "./components/Propuestas/CrearPropuesta"

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginUsuario/>} />
      <Route path="/registroUsuario" element={<RegistroUsuario/>} />
      <Route path="/paginaPrincipal" element={<PaginaPrincipal/>} />

      <Route path="/listaUsuarios" element={<ListaUsuarios/>} />
      <Route path="/listaProductos" element={<ListaProductos />} />

      <Route path="/crearUsuario" element={<CrearUsuario/>} />
      <Route path="/crearProducto" element={<CrearProducto />} />
      <Route path="/crearPropuesta" element={<CrearPropuesta/>} />

      <Route path="/editarUsuario/:id" element={<EditarUsuario/>} />
      <Route path="/editarProducto/:id" element={<EditarProducto />} />
      
      <Route path="/detalleUsuario/:id" element={<DetalleUsuario />} />
      <Route path="/detalleProducto/:id" element={<DetalleProducto />} />
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
