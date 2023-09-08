import React, { useContext, useState } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import PhoneIcon from '@mui/icons-material/Phone';

import { SocketContext } from '../SocketContext';
import styled from '@emotion/styled';

const ContainerStyled = styled(Container)({
  width: '600px',
  margin: '35px 0',
  padding: 0,
  '@media (max-width: 599px)': {
    width: '80%',
  },
});

const PaperStyled = styled(Paper)({
  padding: '10px 20px',
  border: '2px solid black',
});

const ButtonStyled = styled(Button)({
  marginTop: 20,
});

const TypographyStyled = styled(Typography)({
  marginBottom: 20,
});

const Options = ({ children }) => {
  const { Me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <ContainerStyled>
      <PaperStyled elevation={10}>
        <form noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TypographyStyled gutterBottom variant="h6">
                Account Info
              </TypographyStyled>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              {console.log(Me)}
              <CopyToClipboard text={Me}>
                <ButtonStyled variant="contained" color="primary" fullWidth startIcon={<AssignmentIcon fontSize="large" />}>
                  Copy Your ID
                </ButtonStyled>
              </CopyToClipboard>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypographyStyled gutterBottom variant="h6">
                Make a Call
              </TypographyStyled>
              <TextField label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
             {callAccepted && !callEnded ? (
                  <Button variant='contained' color='secondary' startIcon={<PhoneDisabledIcon fontSize="large"/>}
                  fullWidth
                  onClick={leaveCall}
                  className={ButtonStyled}
                  >
                    Hang Up
                  </Button>
             ):(
                <Button variant='contained' color='primary' startIcon={<PhoneIcon fontSize="large"/>}
                fullWidth
                onClick={()=>callUser(idToCall)}
                className={ButtonStyled}>
                  Call
                </Button>
             )}
            </Grid>
          </Grid>
        </form>
      {children}
      </PaperStyled>
      
    </ContainerStyled>
  );
};

export default Options;
