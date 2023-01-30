import { React, useState, useMemo } from 'react';
import { Grid, Text, Input, Dropdown, Spacer, Textarea, Tooltip, Button, Container, Collapse, useInput, useModal, Modal } from "@nextui-org/react";


const getSexState = (cnp) => {
    if (cnp) {
        return getCNPinfo(cnp).sex;
    }
    else {
        return 'Select';
    }
}

const getVarstaState = (cnp) => {
    if (cnp) {
        return getCNPinfo(cnp).dataNastere;
    }

}

const getCNPinfo = (cnp) => {
    let sex, dataNastere;
    if (cnp.length == 13) {
        sex = getSexFromCNP(cnp);
        dataNastere = getDataCNP(cnp);
    }
    console.log(sex, dataNastere);
    return { "sex": sex, "dataNastere": dataNastere };
}

function getSexFromCNP(cnp) {
    const firstChar = cnp[0];
    let sex = '';
    switch (firstChar) {
        case "1": sex = "masculin";
            break;
        case "2": sex = "feminin";
            break;
        case "5": sex = "masculin";
            break;
        case "6": sex = "feminin";
            break;
        case "7": sex = "masculin";
            break;
        case "8": sex = "feminin";
            break;
        default:
            break;
    }
    return sex;
}

function getDataCNP(cnp) {
    let firstChar = cnp[0];
    let an = cnp.substring(1, 3);
    if (firstChar == 1 || firstChar == 2) {
        an = 19 + an;
    }
    if (firstChar == 5 || firstChar == 6) {
        an = 20 + an;
    }
    if (firstChar == 7 || firstChar == 8) {
        an = 20 + an;
    }

    let luna = cnp.substring(3, 5);
    switch (luna) {
        case '01': luna = 'Ianuarie';
            break;
        case '02': luna = 'Februarie';
            break;
        case '03': luna = 'Martie';
            break;
        case '04': luna = 'Aprilie';
            break;
        case '05': luna = 'Mai';
            break;
        case '06': luna = 'Iunie';
            break;
        case '07': luna = 'Iulie';
            break;
        case '08': luna = 'August';
            break;
        case '09': luna = 'Septembrie';
            break;
        case '10': luna = 'Octombrie';
            break;
        case '11': luna = 'Noiembrie';
            break;
        case '12': luna = 'Decembrie';
            break;
        default:
            break;
    }
    let zi = cnp.substring(5, 7);
    let data = zi + " " + luna + " " + an;
    return data;
}

function Raport({ raport, token }) {

    const [selectSex, setSelectSex] = useState(getSexState(raport.cnp));
    const [selectVarsta, setSelectVarsta] = useState(getVarstaState(raport.cnp));
    const [selectGrup, setSelectGrup] = useState('Select');
    const [selectRh, setSelectRh] = useState('Select');
    const [selectStare, setSelectStare] = useState('Select');
    const [selectNastere, setSelectNastere] = useState('Select');

    const { value: email, reset: emailReset, bindings: emailBinding } = useInput("");
    const { value: cnp, reset: cnpReset, bindings: cnpBinding  } = useInput("");
    const { value: serie, reset: serieReset, bindings: serieBinding  } = useInput("");
    const { value: fname, reset: fnameReset, bindings: fnameBinding  } = useInput("");
    const { value: lname, reset: lnameReset, bindings: lnameBinding  } = useInput("");

    const { setVisible, bindings } = useModal();

    const validateFields = () => { 
        if (validateCNP(cnp) == true && validateEmail(email) == true && validateFname(fname) == true && validateLname(lname) == true && validateSerie(serie) == true) {
            debugger;
            return true;
        }
        else {
            debugger;
            return false;
        }
    };

    const validateEmail = (email) => {
        if (email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i))
            return true;
        else return false;
    };

    const validateCNP = (cnp) => {
        if (cnp.length == 13)
            return true;
        else return false;
    };

    const validateFname = (fname) => {
        if (fname.match(/^[a-zA-Z]{3}/i))
            return true;
        else return false;    
    };

    const validateLname = (lname) => {
        if (lname.match(/^[a-zA-Z0-9]{3}/i))
            return true;
        else return false;    
    };

    const validateSerie = (serie) => {
        if (serie.match(/^[A-Z]{2}\d{6}/i))
            return true;
        else return false;    
    };

    const helperEmail = useMemo(() => {
        if (!email)
            return {
                text: "",
                color: "",
            };
        const isValidEmail = validateEmail(email);
        return {
            text: isValidEmail == true ? "" : "Introduceti o adresa de email valida",
            color: isValidEmail == true ? "" : "error",
        };
        
    }, [email]);

    const helperCNP = useMemo(() => {
        if (!cnp)
            return {
                text: "",
                color: "",
            };
        const isValidCNP = validateCNP(cnp);
        return {
            text: isValidCNP == true ? "" : "Introduceti in CNP valid",
            color: isValidCNP == true ? "" : "error",
        };
        
    }, [cnp]);

    const helperLname = useMemo(() => {
        if (!lname)
            return {
                text: "",
                color: "",
            };
        const isValidLname = validateLname(lname);
        return {
            text: isValidLname ? "" : "Acest camp trebuie completat cu numele",
            color: isValidLname ? "" : "error",
        };
    }, [lname]);
    
    const helperFname = useMemo(() => {
        if (!fname)
            return {
                text: "",
                color: "",
            };
        const isValidFname = validateFname(fname);
        return {
            text: isValidFname ? "" : "Acest camp trebuie completat cu prenumele",
            color: isValidFname ? "" : "error",
        };
    }, [fname]);

    const helperSerie = useMemo(() => {
        if (!serie)
            return {
                text: "",
                color: "",
            };
        const isValidSerie = validateSerie(serie);
        return {
            text: isValidSerie ? "" : "Acest camp trebuie completat",
            color: isValidSerie ? "" : "error",
        };
    }, [serie]);


    async function saveNewRaportData() {
        const response = await fetch('http://localhost:5010/raports/add', {
            method: 'POST',
            headers: { authorization: token },
            body: { raport: raport }
        });
        // const data = await response.json();
        // setRaport(data);
        console.log(">>>>>", raport);
        return raport;
    };

    async function saveNewRaport() {
        console.log("raport: ", raport);
        if (validateFields() == true) {
            debugger;
            let saved = await saveNewRaportData(raport);
        }
        else {
            debugger;
            setVisible(true);
        }
        

    }


    return (
        <>
            <Collapse.Group>
                <Spacer y={2} />
                <Collapse title="Informatii Generale Pacient" expanded shadow>
                    <Grid.Container gap={6} justify="space-evenly">
                        <Grid>
                            <Input type='Text' {...lnameBinding} status={helperLname.color} color={helperLname.color} helperColor={helperLname.color} helperText={helperLname.text} underlined labelPlaceholder="Nume" />
                            <Spacer y={3} />
                            <Input type='Text' {...fnameBinding} status={helperFname.color} color={helperFname.color} helperColor={helperFname.color} helperText={helperFname.text} underlined labelPlaceholder="Prenume" />
                            <Spacer y={3} />
                            <Input type='Text' {...serieBinding} status={helperSerie.color} color={helperSerie.color} helperColor={helperSerie.color} helperText={helperSerie.text} required={true} underlined labelPlaceholder="Serie si numar buletin" />
                        </Grid>
                        <Grid alignItems='flex-start'>
                            <Input type='Text' {...cnpBinding} status={helperCNP.color} color={helperCNP.color} helperColor={helperCNP.color} helperText={helperCNP.text} underlined labelPlaceholder="CNP"  onBlur={(e) => getCNPinfo(e.target.value)}/>
                            <Spacer y={3} />
                            <Input type='Text' required={true} underlined labelPlaceholder="Varsta" onChange={e => raport.varsta = e.target.value} />
                            <Spacer y={1} />
                            <Text>Sex</Text>
                            <Dropdown>
                                <Dropdown.Button flat>{selectSex}</Dropdown.Button>
                                <Dropdown.Menu color="default"
                                    disallowEmptySelection
                                    selectionMode="single"
                                    selectedKeys={selectSex}
                                    onSelectionChange={setSelectSex}>
                                    <Dropdown.Item key="feminin">Feminin</Dropdown.Item>
                                    <Dropdown.Item key="masculin">Masculin</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Grid>
                        <Grid>
                            <Input type='Text' underlined labelPlaceholder="Alergic la" initialValue={raport.alergic} onChange={e => raport.alergic = e.target.value} />
                            <Spacer y={1} />
                            <Text>Grup sanguin</Text>
                            <Dropdown>
                                <Dropdown.Button flat>{selectGrup}</Dropdown.Button>
                                <Dropdown.Menu aria-label="Grup" color="default"
                                    disallowEmptySelection
                                    selectionMode="single"
                                    selectedKeys={selectRh}
                                    onSelectionChange={setSelectGrup}
                                    required={true}>
                                    <Dropdown.Item key="a">A</Dropdown.Item>
                                    <Dropdown.Item key="b">B</Dropdown.Item>
                                    <Dropdown.Item key="ab">AB</Dropdown.Item>
                                    <Dropdown.Item key="zero">0</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Spacer y={1} />
                            <Text>RH</Text>
                            <Dropdown>
                                <Dropdown.Button flat>{selectRh}</Dropdown.Button>
                                <Dropdown.Menu aria-label="RH" color="default"
                                    disallowEmptySelection
                                    selectionMode="single"
                                    selectedKeys={selectRh}
                                    onSelectionChange={setSelectRh}
                                    required={true}>
                                    <Dropdown.Item key="pozitiv">Pozitiv</Dropdown.Item>
                                    <Dropdown.Item key="negativ">Negativ</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Grid>
                        <Grid>
                            <Input type='Text' underlined required={true} labelPlaceholder="Adresa" initialValue={raport.address} onChange={e => raport.address = e.target.value} />
                            <Spacer y={3} />
                            <Input type='Text' underlined labelPlaceholder="Numar de telefon" initialValue={raport.phone} onChange={e => raport.phone = e.target.value} />
                            <Spacer y={3} />
                            <Input {...emailBinding} status={helperEmail.color} color={helperEmail.color} helperColor={helperEmail.color} helperText={helperEmail.text} type='email' underlined labelPlaceholder="Email" />
                        </Grid>
                    </Grid.Container>
                </Collapse>
                <Spacer y={1} />
                <Collapse title="Diagnostic" shadow>
                    <Grid.Container gap={4} justify="space-around">
                        <Spacer y={3} />
                        <Textarea
                            underlined
                            color="primary"
                            labelPlaceholder="Diagnostic de trimitere "
                            initialValue={raport.diagTrimitere}
                            onChange={e => raport.diagTrimitere = e.target.value}
                        />
                        <Spacer y={3} />
                        <Textarea
                            underlined
                            color="primary"
                            required={true}
                            labelPlaceholder="Diagnostic la internare"
                            initialValue={raport.diagInt}
                            onChange={e => raport.diagInt = e.target.value}
                        />
                        <Spacer y={3} />
                        <Textarea
                            underlined
                            color="primary"
                            labelPlaceholder="Diagnostic la 72 de ore"
                            initialValue={raport.diag72}
                            onChange={e => raport.diag72 = e.target.value}
                        />
                    </Grid.Container>
                </Collapse>
                <Spacer y={1} />
                <Collapse title="Fisa de Internare" shadow>
                    <Grid.Container gap={6} justify="space-evenly">
                        <Grid gap={6} justify="center">
                            <Text>Diagnostic la Externare</Text>
                            <Spacer y={3} />
                            <Textarea
                                underlined
                                color="primary"
                                required={true}
                                labelPlaceholder="Diagnostic principal"
                                initialValue={raport.diagPr}
                                onChange={e => raport.diagExt = e.target.value}
                            />
                            <Spacer y={3} />
                            <Textarea
                                underlined
                                color="primary"
                                labelPlaceholder="Boli concomitente"
                                initialValue={raport.boliConcomitente}
                                onChange={e => raport.boalaInt = e.target.value}
                            />
                        </Grid>
                        <Grid gap={6} justify="center">
                            <Text>Interventia chirurgicala</Text>
                            <Spacer y={3} />
                            <Textarea
                                underlined
                                color="primary"
                                labelPlaceholder="Tehnica operatorie"
                                initialValue={raport.tehnica}
                                onChange={e => raport.tehnica = e.target.value}
                            />
                            <Spacer y={3} />
                            <Textarea
                                underlined
                                color="primary"
                                labelPlaceholder="Boala pentru care s-a efectuat"
                                initialValue={raport.boalaInt}
                                onChange={e => raport.boalaInt = e.target.value}
                            />
                            <Spacer y={1} />
                            <Input
                                width="186px"
                                type="date"
                                underlined
                                label="Data interventiei"
                                initialValue={raport.dataInterventie}
                                onChange={e => raport.dataInterventie = e.target.value}
                            />
                        </Grid>
                        <Grid gap={6} justify="center">
                            <Text >Starea la externare</Text>
                            <Dropdown required={true}>
                                <Dropdown.Button flat>{selectStare}</Dropdown.Button>
                                <Dropdown.Menu aria-label="stare" color="default"
                                    disallowEmptySelection
                                    selectionMode="single"
                                    selectedKeys={selectStare}
                                    onSelectionChange={setSelectStare}>
                                    <Dropdown.Item key="vindecat">vindecat</Dropdown.Item>
                                    <Dropdown.Item key="ameliorat">ameliorat</Dropdown.Item>
                                    <Dropdown.Item key="stationar">stationar</Dropdown.Item>
                                    <Dropdown.Item key="agravat">agravat</Dropdown.Item>
                                    <Dropdown.Item key="transferat">transferat</Dropdown.Item>
                                    <Dropdown.Item key="decedat">decedat</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Spacer y={3} />
                            <Tooltip content="Se completeaza numai daca starea la externare este transferat" contentColor="error" color="white" placement="right">
                                <Input
                                    // disabled={selectStare == 'transferat' ? false : true}
                                    width="186px"
                                    labelPlaceholder="Transferat la"
                                    type="text"
                                    underlined
                                    tooltip="Se completeaza numai daca starea la externare este transferat"
                                    initialValue={raport.transfer}
                                    onChange={e => raport.transfer = e.target.value}
                                />
                            </Tooltip>
                            <Spacer y={3} />
                            <Tooltip content="Se completeaza numai daca starea la externare este decedat" contentColor="error" color="white" placement="right">
                                <Textarea
                                    underlined
                                    // disabled={selectStare == 'decedat' ? false : true}
                                    color="primary"
                                    initialValue={raport.diagDeces}
                                    onChange={e => raport.diagDeces = e.target.value}
                                    labelPlaceholder="Diagnostic la deces"
                                />
                            </Tooltip>
                        </Grid>
                        <Grid gap={6} justify="center">
                            <Text>Motivele internarii - nastere</Text>
                            <Spacer y={3} />
                            <Input
                                width="186px"
                                type="number"
                                underlined
                                labelPlaceholder="Varsta tatalui"
                                initialValue={raport.varstaTata}
                                onChange={e => raport.varstaTata = e.target.value}
                            />
                            <Spacer y={3} />
                            <Input
                                width="186px"
                                type="number"
                                underlined
                                labelPlaceholder="Varsta mamei"
                                initialValue={raport.varstaMama}
                                onChange={e => raport.varstaMama = e.target.value}
                            />
                            <Spacer y={3} />
                            <Input
                                width="186px"
                                type="text"
                                underlined
                                labelPlaceholder="Alte afectiuni sau noxe"
                                initialValue={raport.alteAfectiuni}
                                onChange={e => raport.alteAfectiuni = e.target.value}
                            />
                            <Spacer y={3} />
                            <Input
                                width="186px"
                                type="text"
                                underlined
                                labelPlaceholder="Evolutia sarcinii"
                                initialValue={raport.evolutieSarcina}
                                onChange={e => raport.evolutieSarcina = e.target.value}
                            />
                            <Spacer y={3} />
                            <Input
                                width="186px"
                                type="text"
                                underlined
                                labelPlaceholder="Numar controale prenatale"
                                initialValue={raport.nrControale}
                                onChange={e => raport.nrControale = e.target.value}
                            />
                        </Grid>
                        <Grid gap={6} justify="center">
                            <Input
                                width="186px"
                                type="number"
                                underlined
                                labelPlaceholder="Al catelea copil"
                                initialValue={raport.nrCopii}
                                onChange={e => raport.nrCopii = e.target.value}
                            />
                            <Spacer y={3} />
                            <Input
                                width="186px"
                                type="number"
                                underlined
                                labelPlaceholder="Nascut la numarul de luni"
                                initialValue={raport.nrLuni}
                                onChange={e => raport.nrLuni = e.target.value}
                            />
                            <Spacer y={3} />
                            <Input
                                width="186px"
                                type="number"
                                underlined
                                labelPlaceholder="Greutate (gr)"
                                initialValue={raport.greutateCopil}
                                onChange={e => raport.greutateCopil = e.target.value}
                            />
                            <Spacer y={3} />
                            <Input
                                width="186px"
                                type="number"
                                underlined
                                labelPlaceholder="Lungime (cm)"
                                initialValue={raport.lungime}
                                onChange={e => raport.lungime = e.target.value}
                            />
                            <Spacer y={1} />
                            <Text>Nastere</Text>
                            <Dropdown>
                                <Dropdown.Button flat>{selectNastere}</Dropdown.Button>
                                <Dropdown.Menu aria-label="stare" color="default"
                                    disallowEmptySelection
                                    selectionMode="single"
                                    selectedKeys={selectNastere}
                                    onSelectionChange={setSelectNastere}>
                                    <Dropdown.Item key="vindecat">spontana</Dropdown.Item>
                                    <Dropdown.Item key="ameliorat">cezariana</Dropdown.Item>
                                    <Dropdown.Item key="stationar">forceps/vacum</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Spacer y={1} />
                            <Input
                                width="186px"
                                type="date"
                                underlined
                                label="Data interventiei"
                                initialValue={raport.dataNastere}
                                onChange={e => raport.dataNastere = e.target.value}
                            />
                        </Grid>
                    </Grid.Container>
                </Collapse>
                <Spacer y={1} />
                <Collapse title="Conditii de viata" shadow>
                    <Grid.Container gap={6} justify="space-evenly">
                        <Grid gap={6} justify="center">
                            <Spacer y={3} />
                            <Textarea
                                underlined
                                color="primary"
                                labelPlaceholder="Istoric"
                                initialValue={raport.istoric}
                                onChange={e => raport.istoric = e.target.value}
                            />
                            <Spacer y={3} />
                            <Input
                                underlined
                                color="primary"
                                type="number"
                                required={true}
                                labelPlaceholder="Temperatura (grade Celsius)"
                                initialValue={raport.temperatura}
                                onChange={e => raport.temperatura = e.target.value}
                            />
                            <Spacer y={3} />
                            <Input
                                underlined
                                color="primary"
                                type="number"
                                required={true}
                                labelPlaceholder="Greutate (kg)"
                                initialValue={raport.greutate}
                                onChange={e => raport.greutate = e.target.value}
                            />
                        </Grid>
                        <Grid gap={6} justify="center">
                            <Textarea
                                underlined
                                color="primary"
                                labelPlaceholder="Rezultatele investigatiilor interdisciplinare"
                                initialValue={raport.rezInter}
                                onChange={e => raport.rezInter = e.target.value}
                            />
                            <Spacer y={2} />
                            <Textarea
                                underlined
                                color="primary"
                                required={true}
                                labelPlaceholder="Starea prezenta"
                                initialValue={raport.starePrez}
                                onChange={e => raport.starePrez = e.target.value}
                            />
                            <Spacer y={2} />
                            <Textarea
                                underlined
                                color="primary"
                                required={true}
                                labelPlaceholder="Prescriptia medicatiei si a investigatiilor"
                                initialValue={raport.prescriptie}
                                onChange={e => raport.prescriptie = e.target.value}
                            />
                            <Spacer y={2} />
                            <Textarea
                                underlined
                                color="primary"
                                labelPlaceholder="Evolutie"
                                initialValue={raport.evolutie}
                                onChange={e => raport.evolutie = e.target.value}
                            />
                        </Grid>
                    </Grid.Container>
                </Collapse>
            </Collapse.Group>
            <Spacer y={2} />
            <Container justify='flex-end'>
                <Button flat color="success" type='submit' auto justify='flex-end' onPress={() => saveNewRaport()}>
                    Salvare
                </Button>
            </Container>



            <Modal
                width="600px"
                aria-labelledby="modalArchive-title"
                aria-describedby="modalArchive-description"
                {...bindings}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        Completare raport gresita
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text>Cel putin unul dintre campuri este completat gresit.</Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={() => setVisible(false)}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

        
    );
}

export default Raport;
