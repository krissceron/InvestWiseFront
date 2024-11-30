import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ListaUsuarios } from "./components/Usuarios/ListaUsuarios"
import { CrearUsuario } from "./components/Usuarios/CrearUsuario"
import { EditarUsuario } from "./components/Usuarios/EditarUsuario"
import { LoginUsuario } from "./components/Usuarios/LoginUsuario"
import { RegistroUsuario } from "./components/Usuarios/RegistroUsuario"
import { HomeAdmin } from "./components/HomeAdmin"
import { DetalleUsuario } from "./components/Usuarios/DetalleUsuario"
import { CrearProducto } from "./components/Productos/CrearProducto"
import { ListaProductos } from "./components/Productos/ListaProductos"
import { EditarProducto } from "./components/Productos/EditarProducto"
import { DetalleProducto } from "./components/Productos/DetalleProducto"
import { CrearPropuesta } from "./components/Propuestas/CrearPropuesta"
import { ListaPropuestas } from "./components/Propuestas/ListaPropuesta"
import { HomeInvest } from "./components/Invest/HomeInvest"
import { DetallePropuesta } from "./components/Propuestas/DetallePropuesta"
import { InvDetallePropuesta } from "./components/Invest/InvDetallePropuesta"
import { InvListaPropuestas } from "./components/Invest/InvListaPropuestas"
import { InvReportes } from "./components/Invest/InvReportes"
import { ReportePorUsuario } from "./components/Invest/Reportes/PorcGananUsuarioReco"
import { EditarPropuesta } from "./components/Propuestas/EditarPropuesta"

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginUsuario/>} />
      <Route path="/registroUsuario" element={<RegistroUsuario/>} />
      <Route path="/HomeAdmin" element={<HomeAdmin/>} />
      <Route path="/HomeInvest" element={<HomeInvest/>} />

      <Route path="/listaUsuarios" element={<ListaUsuarios/>} />
      <Route path="/listaProductos" element={<ListaProductos />} />
      <Route path="/listaPropuestas" element={<ListaPropuestas />} />
      <Route path="/invListaPropuestas" element={<InvListaPropuestas />} />

      <Route path="/crearUsuario" element={<CrearUsuario/>} />
      <Route path="/crearProducto" element={<CrearProducto />} />
      <Route path="/crearPropuesta" element={<CrearPropuesta/>} />
      

      <Route path="/editarUsuario/:id" element={<EditarUsuario/>} />
      <Route path="/editarProducto/:id" element={<EditarProducto />} />
      <Route path="/editarPropuesta/:id" element={<EditarPropuesta />} />
      
      
      <Route path="/detalleUsuario/:id" element={<DetalleUsuario />} />
      <Route path="/detalleProducto/:id" element={<DetalleProducto />} />
      <Route path="/detallePropuesta/:id" element={<DetallePropuesta />} />
      <Route path="/invDetallePropuesta/:id" element={<InvDetallePropuesta/>} />

      <Route path="/invReportes" element={<InvReportes/>} />
      <Route path="/porcGananUsuReco" element={<ReportePorUsuario/>} />
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
