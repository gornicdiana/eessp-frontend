import React from 'react';
import {useLocation} from 'react-router-dom';
import Raport from './Raport';


function Rapoarte({token}) {
  const editRaport = useLocation().state;
  const newRaport = editRaport==null ? null : editRaport.raport;

  let raport = {
    "cnp": "",
    "doctorFirstname": "",
    "dorctorLastname": "",
    "firstname": "",
    "lastname": "",
    "serieNr": "",
    "varsta": '',
    "sex": "",
    "address": "",
    "phone": "",
    "alergic": "",
    "grup": "",
    "rh": "",
    "diagInt": "",
    "diag72": "",
    "diagPr": "",
    "tehnica": "",
    "boalaInt": "",
    "dataInt": "",
    "dataExt": "",
    "stareExt": "",
    "transfer": "",
    "diagDeces": "",
    "varstaTata": "",
    "varstaMama": "",
    "alteAfectiuni": "",
    "evolutieSarcina": "",
    "nrControale": "",
    "nrCopii": "",
    "nrLuni": "",
    "greutateCopil": "",
    "lungime": "",
    "nastere": "",
    "dataNastere": "",
    "istoric": "",
    "temp": '',
    "greutate": '',
    "rezInter": "",
    "starePrez": "",
    "prescriptie": "",
    "evolutie": ""
}

  return (
    <>
    {editRaport == null ?
      <Raport raport={raport} token={token}/>
    : <Raport raport={newRaport} token={token}/>
    }
    </>
  );
}

export default Rapoarte;
