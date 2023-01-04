import React, { useState } from "react";
import { Navbar, Container, useTheme } from "@nextui-org/react";
//import ProfilDoctor from "./ProfilDoctor";

function MenuBar() {

  const variant = "highlight-rounded";
  const activeColor = "primary";
  const {isDark} = useTheme();
  // const [lista, setLista] = useState(false);
  // const [raport, setRaport] = useState(true);
  // const [profil, setProfil] = useState(false);

  return (
    <Container>
      <Navbar isBordered={isDark} variant="sticky">
        <Navbar.Content enableCursorHighlight activeColor={activeColor} hideIn="xs" variant={variant}>
          <Navbar.Link href="profil">Profil doctor</Navbar.Link>
          <Navbar.Link href="pacienti">Lista de pacienti</Navbar.Link>
          <Navbar.Link href="/">Rapoarte medicale</Navbar.Link>  
        </Navbar.Content>
      </Navbar>
    </Container>
  )
}

export default MenuBar;
