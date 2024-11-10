import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ListaUsuarios } from "./components/ListaUsuarios"
import { CrearUsuario } from "./components/CrearUsuario"
import { EditarUsuario } from "./components/EditarUsuario"
import { LoginUsuario } from "./components/LoginUsuario"
import { RegistroUsuario } from "./components/RegistroUsuario"

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginUsuario/>} />
      <Route path="/registroUsuario" element={<RegistroUsuario/>} />
      <Route path="/listaUsuarios" element={<ListaUsuarios/>} />
      <Route path="/crearUsuario" element={<CrearUsuario/>} />
      <Route path="/editarUsuario/:id" element={<EditarUsuario/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
