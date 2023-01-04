import { BrowserRouter as Router, Routes, Route,} from "react-router-dom";
import React from "react";
import Login from './Login';
import useToken from './useToken';
import MenuBar from "./MenuBar";
import { Container} from "@nextui-org/react";
import Rapoarte from "./Rapoarte";
import ListaPacienti from "./ListaPacienti";
import ProfilDoctor from "./ProfilDoctor";

function App() {

  const { token, setToken } = useToken();
  
  if(!token) {
    return <Login setToken={setToken} />
  }
  
  return (
    <>
      <MenuBar/>
      <Container>
        <Router>
          <Routes>
              <Route path="/" element={<Rapoarte />} />
              <Route path="/pacienti" element={<ListaPacienti token={token}/>} />
              <Route path="/profil" element={<ProfilDoctor token={token}/>} />
          </Routes>
        </Router>      
      </Container>
    </>
  )
}

export default App;
