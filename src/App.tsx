import * as React from 'react';
import axios from 'axios';
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Grid,
  Button,
  TextField } from '@mui/material/';
import dataInput from './input-data.json'

const App = () => {
  const [inputData, setInputData] = React.useState(JSON.stringify(dataInput));
  const [outputData, setOutputData] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const processData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const requestBackend = {
      method: 'POST',
      url: `${process.env.REACT_APP_BACKEND_URL}/write`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: dataInput
    };

    axios.request(requestBackend).then(function (response) {
      setOutputData(response.data)
      setIsLoading(false);
    }).catch(function (error) {
      console.error(error);
    }).then(() => {
      setIsLoading(false);
    });
  };

  return (
    <Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box component="form" onSubmit={processData} noValidate sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              rows={15}
              multiline
              disabled
              onChange={(e) => setInputData(e.target.value)}
              required
              fullWidth
              name="JSON Data"
              label="Input JSON data"
              type="text"
              value={inputData}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Process Data
        </Button>
      </Box>
      <Box>
        {outputData.map((tran: any) =>
          (
            <div key={tran.transaction}>
              <p><strong>Transaction ID:</strong> {tran.transaction}</p>
              <p><strong>Transformations:</strong></p>

              {tran.transformations.map((tf: any, i: number) =>
                (
                  <div style={{ marginLeft: '1rem' }} key={i + 1}>
                    <p><strong>Part Num:</strong> {tf.partNum}</p>
                    <p><strong>Size:</strong> {tf.size}</p>
                    <p><strong>Qty:</strong> {tf.qty}</p>
                  </div>
                )
              )}
              <p><strong>Balance:</strong> {tran.balance}</p>
              <p><strong>Is Valid:</strong> {JSON.stringify(tran.isValid)}</p>
              <hr />
            </div>
          )
        )}
      </Box>
    </Container>
  )
}

export default App