import { React, useEffect, useState } from 'react';
import { Container, Card, Grid, Text, Button, Spacer } from "@nextui-org/react";

function ProfilDoctor({ token }) {

    const [info, setInfo] = useState({});

    useEffect(() => {
        fetch('http://localhost:5010/doctors/info', {
            method: 'GET',
            headers: { authorization: token },
        })
            .then((data) =>
                data.json()

            )
            .then((data) => {
                setInfo(data);
            })
    }, []);

    return (
        <Container justify='center' display='flex' css={{ w: "100%", h: "100%", padding: "$20" }}>
            <Card isHoverable css={{ w: "600px", h: "600px" }}>
                <Card.Header>
                    <Grid.Container css={{ pl: "$6" }} justify="center">
                        <Grid xs={12}>
                            <Text size={26} weight="bold" color="#9E9E9E">{info.doctorNumber}</Text>
                        </Grid>
                    </Grid.Container>
                </Card.Header>
                <Card.Divider />
                <Card.Body css={{ py: "$2" }}>
                    <Container display='flex' direction="row">
                        <Text h2 css={{ color: "$accents8" }}>Nume</Text>
                        <Spacer x={1}/>
                        <Text h2 css={{ color: "#9E9E9E" }}>{info.lastname}</Text>
                    </Container>
                    <Container display='flex' direction="row">
                        <Text h3 css={{ color: "$accents8" }}>Prenume</Text>
                        <Spacer/>
                        <Text h3 css={{ color: "#9E9E9E" }}>{info.firstname}</Text>
                    </Container>
                    <Container display='flex' direction="row">
                        <Text h4 css={{ color: "$accents8" }}>Numar de telefon</Text>
                        <Spacer/>
                        <Text h4 css={{ color: "#9E9E9E" }}>{info.phone}</Text>
                    </Container>
                    <Container display='flex' direction="row">
                        <Text h4 css={{ color: "$accents8" }}>Adresa de email</Text>
                        <Spacer/>
                        <Text h4 css={{ color: "#9E9E9E" }}>{info.email}</Text>
                    </Container>
                </Card.Body>
                <Card.Footer display='flex' css={{justifyContent: "center"}}>
                    <Button >Logout</Button>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default ProfilDoctor;
