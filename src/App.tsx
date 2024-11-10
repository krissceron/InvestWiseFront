import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ListaUsuarios } from "./components/ListaUsuarios"
import { CrearUsuario } from "./components/CrearUsuario"
import { EditarUsuario } from "./components/EditarUsuario"

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ListaUsuarios/>} />
      <Route path="/crearUsuario" element={<CrearUsuario/>} />
      <Route path="/editarUsuario/:id" element={<EditarUsuario/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
