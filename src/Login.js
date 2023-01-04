import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    Spacer,
    Button,
    Text,
    Input,
    Container,
    Popover
} from '@nextui-org/react';
import background from './images/bg.jpg'

async function loginUser(credentials) {
    console.log(credentials);
    return fetch('http://localhost:5010/doctors/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function Login({ setToken }) {
    const [doctorNumber, setDoctorNumber] = useState();
    const [password, setPassword] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [isNrValid, setIsNrValid] = useState('default');

    const handleSubmit = async e => {
        // e.preventDefault();
        if(validateDoctorNumber(doctorNumber) == true) {
            const token = await loginUser({
                doctorNumber,
                password
            });
            setToken(token);
        }
        else {
            setIsNrValid('error');
            setIsOpen(true);
        }
    };

    function validateDoctorNumber(doctorNumber){
        const regexDrNumber = /[A-Za-z0-9]$/;
        return regexDrNumber.test(doctorNumber);
    };

    return (
        <div style={{backgroundImage: `url(${background})`, backgroundRepeat: 'no-repeat', backgroundSize:'cover', width:'100%' }} >
            <Container
                display="flex"
                alignItems="center"
                justify="center"
                css={{ minHeight: '100vh'}}
            >
                <Card css={{ mw: '520px', h: '600', p: '20px', backgroundColor:'#C2E2FFCC' }} variant="bordered">
                    <Text
                        size={24}
                        weight="bold"
                        css={{
                            as: 'center',
                            mb: '20px',
                        }}
                    >
                        Autentificare
                    </Text>
                    <Input
                        required={true}
                        clearable
                        underlined
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Numar Medic"
                        onChange={e => setDoctorNumber(e.target.value)}
                        status={isNrValid}
                        onBlur={setIsNrValid}
                    />
                    <Spacer y={1} />
                    <Input
                        type='password'
                        clearable
                        underlined
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Parola"
                        css={{ mb: '6px' }}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Spacer y={1} />
                    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
                        <Popover.Trigger>
                        <Button onClick={handleSubmit}>Logare</Button>
                        </Popover.Trigger>
                        <Popover.Content css={{opacity: '0.8'}}>
                        <Text css={{ p: "$10", color:'red' }}>Numarul medicului sau parola sunt gresite.</Text>
                    </Popover.Content>
                    </Popover>
                </Card>
            </Container>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};