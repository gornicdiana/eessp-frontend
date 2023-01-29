import { React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, Row, Col, Tooltip, Badge, Text, Modal, useModal, Button, Grid, Spacer, Collapse, Popover } from "@nextui-org/react";
import { IconButton } from "./IconButtons";
import { EyeIcon } from "./EyeIcon";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";

function ListaPacienti({ token }) {
    const [pacienti, setPacienti] = useState([]);
    const { setVisible, bindings } = useModal();
    const [raport, setRaport] = useState([]);
    const navigate = useNavigate();
    // const [archive, setArchive] = useState(false);
    const [confirm, setConfirm] = useState(false);
    // const [deny, setDeny] = useState(false);


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

    async function getRaportData(cnp) {
        const response = await fetch('http://localhost:5010/raports/raport', {
            method: 'GET',
            headers: { authorization: cnp }
        });
        const data = await response.json();
        console.log(">>>>>", data);
        return data;
    };

    async function archiveRaport(cnp) {
        debugger;
        const arch = await fetch('http://localhost:5010/raports/archive', {
            method: 'PUT',
            headers: { authorization: cnp },
        });
        const data = await arch.json();
        console.log(data);
        debugger;
        return true;
    }

    // async function deletePacient(cnp) {
    //     debugger;
    //     // const response = await fetch('http://localhost:5010/raports/delete', {
    //     //     method: 'DELETE',
    //     //     headers: { 'Content-Type': 'application/json' },
    //     //     body: {"cnp": cnp}
    //     // })
    //     // debugger;
    //     // const confirm = response;
    //     // console.log(confirm);
    //     // debugger;
    //     // return confirm;
    // };

    async function seeRaport(cnp) {
        const info = await getRaportData(cnp);
        setVisible(true);
    };

    async function editRaport(cnp) {
        const raport = await getRaportData(cnp);
        navigate("/", { state: { raport: raport} });
    };

    async function deleteRaport(cnp) {
        debugger;
        const info = await archiveRaport(cnp);
        const refresh = () => window.location.reload(true)
    };


    const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];
        let today = new Date();
        let dataInt = new Date(user.dataInt);
        let dataExt = new Date(user.dataExt);
        let flag = user.flag;
        switch (columnKey) {
            case "lastname":
                return (
                    <Text color={flag == true ? "#B5B4B8" : "#050505"}>{user.lastname}</Text>
                );
            case "firstname":
                return (
                    <Text color={flag == true ? "#B5B4B8" : "#050505"}>{user.firstname}</Text>
                );
            case "cnp":
                return (
                    <Text color={flag == true ? "#B5B4B8" : "#050505"}>{user.cnp}</Text>
                );
            case "dataInt":
                return (
                    <Text color={flag == true ? "#B5B4B8" : "#050505"}>{dataInt.toDateString()}</Text>
                );
            case "dataExt":
                return (
                    <Text color={flag == true ? "#B5B4B8" : "#050505"}>{dataExt.toDateString()}</Text>
                );
            case "status":
                if (flag == true)
                    return <Badge color="primary" variant="flat" size="md">Arhivat</Badge>;
                else {
                    if (dataExt <= today)
                        return <Badge color="success" variant="flat" size="md">Externat</Badge>;
                    else
                        return <Badge color="error" variant="flat">Internat</Badge>;
                }
            case "actions":
                return (
                    <Row justify="start" align="start" >
                        <Col css={{ d: "flex" }}>
                            <Tooltip content="Detalii">
                                <IconButton disabled={flag} onClick={() => seeRaport(user.cnp)}>
                                    <EyeIcon size={20} fill={flag == true ? "#B5B4B8" : "#337EFF"} />
                                </IconButton>
                            </Tooltip>
                        </Col>
                        <Col css={{ d: "flex" }}>
                            <Tooltip content="Editare pacient">
                                <IconButton disabled={flag} onClick={() => editRaport(user.cnp)}>
                                    <EditIcon size={20} fill={flag == true ? "#B5B4B8" : "#1DB835"} />
                                </IconButton>
                            </Tooltip>
                        </Col>
                        <Col css={{ d: "flex" }}>
                            <Popover>
                                <Popover.Trigger>
                                    <IconButton disabled={flag} >
                                        <DeleteIcon size={20} fill={flag == true ? "#B5B4B8" : "#FF0080"} />
                                    </IconButton>
                                </Popover.Trigger>
                                <Popover.Content>
                                    <Grid.Container
                                        css={{ borderRadius: "14px", padding: "0.75rem", maxWidth: "330px" }}
                                    >
                                        <Row justify="center" align="center">
                                            <Text b>Confirmare arhivare raport</Text>
                                        </Row>
                                        <Row>
                                            <Text>
                                                Sunteti digur ca doriti sa arhivati raportul acestui pacient?
                                            </Text>
                                        </Row>
                                        <Grid.Container justify="space-between" alignContent="center">
                                            <Grid>
                                                <Button size="sm" light >
                                                    Nu
                                                </Button>
                                            </Grid>
                                            <Grid>
                                                <Button size="sm" shadow color="error" onClick={() => deleteRaport(user.cnp)}>
                                                    Da
                                                </Button>
                                            </Grid>
                                        </Grid.Container>
                                    </Grid.Container>
                                </Popover.Content>
                            </Popover>

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
                    <Button auto onClick={() => { editRaport() }}>
                        Print
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* <Modal
                width="600px"
                aria-labelledby="modalArchive-title"
                aria-describedby="modalArchive-description"
                {...bindings}
                open={archive}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        ARHIVARE RAPORT
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text>Sunteti sigur ca doriti sa arhivati raportul?</Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={() => setConfirm(true)}>
                        Da
                    </Button>
                    <Button auto onClick={() => setDeny(true)}>
                        Nu
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </>
    );
};

export default ListaPacienti;