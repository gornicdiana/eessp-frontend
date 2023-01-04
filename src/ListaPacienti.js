import { React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, Row, Col, Tooltip, Badge, Text, Modal, useModal, Button, Grid, Spacer, Collapse } from "@nextui-org/react";
import { IconButton } from "./IconButtons";
import { EyeIcon } from "./EyeIcon";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";

function ListaPacienti({ token }) {
    const [pacienti, setPacienti] = useState([]);
    const { setVisible, bindings } = useModal();
    const [raport, setRaport] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5010/raports/myRaports', {
            method: 'GET',
            headers: { authorization: token },
        })
            .then((data) =>
                data.json()

            )
            .then((data) => {
                setPacienti(data);
            })
    }, []);

    const columns = [
        { label: "NUME", key: "lastname" },
        { label: "PRENUME", key: "firstname" },
        { label: "CNP", key: "cnp" },
        { label: "DATA INTERNARE", key: "dataInt" },
        { label: "DATA EXTERNARE", key: "dataExt" },
        { label: "STATUS", key: "status" },
        { label: "Actiuni rapide", key: "actions" }
    ];

    async function getRaportData (cnp){
        const response = await fetch('http://localhost:5010/raports/raport', {
            method: 'GET',
            headers: {authorization: cnp}
        });
        const data = await response.json();
        setRaport(data);
        debugger;
        console.log(">>>>>", raport);
        return raport;
    };

    async function seeRaport(cnp) {
        const info = await getRaportData(cnp);
        setVisible(true);
    };

    async function editRaport(cnp) {
        const info = await getRaportData(cnp);
        navigate("/", {state: {raport}}); 
    } 

    async function deletePacient(cnp) {
        const response = await fetch('http://localhost:5010/pacients/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: cnp
        })
        const confirm = await response;
        console.log(confirm);
        debugger;
    };

    const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];
        let today = new Date();
        let dataInt = new Date(user.dataInt);
        let dataExt = new Date(user.dataExt);
        switch (columnKey) {
            case "lastname":
                return (
                    <Text>{user.lastname}</Text>
                );
            case "firstname":
                return (
                    <Text>{user.firstname}</Text>
                );
            case "cnp":
                return (
                    <Text>{user.cnp}</Text>
                );
            case "dataInt":
                return (
                    <Text>{dataInt.toDateString()}</Text>
                );
            case "dataExt":
                return (
                    <Text>{dataExt.toDateString()}</Text>
                );
            case "status":
                if (dataExt <= today)
                    return <Badge color="success" variant="flat" size="md">Externat</Badge>;
                else
                    return <Badge color="error" variant="flat">Internat</Badge>;
            case "actions":
                return (
                    <Row justify="start" align="start">
                        <Col css={{ d: "flex" }}>
                            <Tooltip content="Detalii">
                                <IconButton onClick={() => seeRaport(user.cnp)}>
                                    <EyeIcon size={20} fill="#979797" />
                                </IconButton>
                            </Tooltip>
                        </Col>
                        <Col css={{ d: "flex" }}>
                            <Tooltip content="Editare pacient">
                                <IconButton onClick={() => editRaport(user.cnp)}>
                                    <EditIcon size={20} fill="#979797" />
                                </IconButton>
                            </Tooltip>
                        </Col>
                        <Col css={{ d: "flex" }}>
                            <Tooltip
                                content="Stergere pacient"
                                color="error"
                            >
                                <IconButton onClick={deletePacient(user.cnp)}>
                                    <DeleteIcon size={20} fill="#FF0080" />
                                </IconButton>
                            </Tooltip>
                        </Col>
                    </Row>
                );
            default:
                return cellValue;
        }
    };

    return (
        <>
            <Table
                css={{ height: "auto", minWidth: "100%", }}
                shadow="true"
            >
                <Table.Header columns={columns}>
                    {(column) => (
                        <Table.Column key={column.key}>{column.label}</Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={pacienti}>
                    {(item) => (
                        <Table.Row key={item.cnp}>
                            {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

            <Modal
                scroll
                width="600px"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                {...bindings}
            >
                <Modal.Header>
                    <Grid justify="flex-start">
                        <Text id="modal-title" size={26} css={{ color: "#9E9E9E" }}>Raport medical</Text>
                        <Text size={16} css={{ color: "#9E9E9E" }}>Numar doctor: {raport.doctorNumber}</Text>
                        <Text size={16} css={{ color: "#9E9E9E" }}>Nume medic:{raport.dorctorLastname} </Text>
                        <Text size={16} css={{ color: "#9E9E9E" }}>Prenume medic: {raport.doctorFirstname}</Text>
                    </Grid>
                </Modal.Header>
                <Modal.Body>
                    <Collapse.Group>
                        <Spacer y={2} />
                        <Collapse title="Informatii Generale Pacient" shadow>
                            <Grid.Container gap={4} justify="flex-start">
                                <Grid>
                                    <Text>Nume: {raport.lastname}</Text>
                                    <Text>Prenume: {raport.firstname}</Text>
                                    <Text>CNP: {raport.cnp}</Text>
                                    <Text>Serie si numar buletin: {raport.serieNr}</Text>
                                    <Text>Varsta: {raport.varsta} ani</Text>
                                    <Text>Sex: {raport.sex}</Text>
                                    <Text>Adresa: {raport.address}</Text>
                                    <Text>Nr. telefon: {raport.phone}</Text>
                                    <Text>Email: {raport.email}</Text>
                                    <Text>Alergic la: {raport.alergic}</Text>
                                    <Text>Grup sanguin: {raport.grup}</Text>
                                    <Text>Rh: {raport.rh}</Text>
                                </Grid>
                            </Grid.Container>
                        </Collapse>
                        <Spacer y={1} />
                        <Collapse title="Diagnostic" shadow>
                            <Grid.Container gap={4} justify="flex-start">
                                <Grid>
                                    <Text>Diagnostic la internare: {raport.diagInt}</Text>
                                    <Text>Diagnostic la 72 de ore: {raport.diag72}</Text>
                                    <Text>Diagnostic principal: {raport.diagPr}</Text>
                                    <Text>Boli concomitente: {raport.boliConcomitente} </Text>
                                    <Text>Tehnica operatorie: {raport.tehnica}</Text>
                                    <Text>Boala pentru care s-a efectuat interventia: {raport.boalaInt}</Text>
                                    <Text>Data interventiei: {raport.dataInterventie}</Text>
                                    <Text >Starea la externare: {raport.stareExt}</Text>
                                    <Text>Transferat la: {raport.transfer}</Text>
                                    <Text>Diagnostic la deces: {raport.diagDeces}</Text>
                                </Grid>
                            </Grid.Container>
                        </Collapse>
                        <Spacer y={1} />
                        <Collapse title="Fisa de Internare" shadow>
                            <Grid.Container gap={4} justify="flex-start">
                                <Grid >
                                    <Text>Motivele internarii - nastere</Text>
                                    <Text>Varsta tatalui: {raport.varstaTata}</Text>
                                    <Text>Varsta mamei:  {raport.varstaMama}</Text>
                                    <Text>Alte afectiuni sau noxe:  {raport.alteAfectiuni}</Text>
                                    <Text>Evolutia sarcinii: {raport.evolutieSarcina}</Text>
                                    <Text>Numar controale prenatale: {raport.nrControale}</Text>
                                    <Text>Al catelea copil: {raport.nrCopii}</Text>
                                    <Text>Nascut la numarul de luni: {raport.nrLuni}</Text>
                                    <Text>Greutate: {raport.greutateCopil} gr</Text>
                                    <Text>Lungime: {raport.lungime} cm</Text>
                                    <Text>Nastere: {raport.nastere}</Text>
                                    <Text>Data nasterii: {raport.dataNastere}</Text>
                                </Grid>
                            </Grid.Container>
                        </Collapse>
                        <Spacer y={1} />
                        <Collapse title="Conditii de viata" shadow>
                            <Grid.Container gap={4} justify="flex-start">
                                <Grid>
                                    <Text>Istoric: {raport.istoric}</Text>
                                    <Text>Temperatura:{raport.temp} grade Celsius</Text>
                                    <Text>Greutate:{raport.greutate} Kg</Text>
                                    <Text>Rezultatele investigatiilor interdisciplinare: {raport.rezInter}</Text>
                                    <Text>Starea prezenta:{raport.starePrez}</Text>
                                    <Text>Prescriptia medicatiei si investigatiilor:{raport.prescriptie}</Text>
                                    <Text>Evolutia: {raport.evolutie}</Text>
                                </Grid>
                            </Grid.Container>
                        </Collapse>
                    </Collapse.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={() => setVisible(false)}>
                        Close
                    </Button>
                    <Button auto onClick={() => { editRaport()}}>
                        Print
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ListaPacienti;