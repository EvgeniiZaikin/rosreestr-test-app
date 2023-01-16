import { useState } from "react";

import axios from "axios";
import HttpsProxyAgent from "https-proxy-agent";

import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Divider } from "@mui/material";

const getFormattedApi = (cadastralNumber) => {
  return `http://rosreestr.ru/fir_lite_rest/api/gkn/fir_objects/${cadastralNumber}*`;
};

const App = () => {
  const [search, setSearch] = useState("");
  const [searchInputError, setSearchInputError] = useState("");

  const handleSearchInput = (event) => {
    const inputValue = event.target.value;
    if (new RegExp("^[:0-9]*$").test(inputValue)) setSearch(inputValue);
  };

  const handleSearchClick = async () => {
    if (search.length < 5) {
      setSearchInputError(
        "Длина кадастрового номера должна быть минимум 5 символов"
      );
    } else {
      setSearchInputError("");
      try {
        const { data } = await axios.get(getFormattedApi(search), {
          proxy: false,
          httpsAgent: new HttpsProxyAgent.HttpsProxyAgent(
            `https://localhost:4000`
          ),
        });
        console.log(data);
      } catch (error) {
        alert("При запросе к АПИ произошла ошибка");
      }
    }
  };

  return (
    <>
      <CssBaseline />
      <Container>
        <h1>Hello RosReestr!</h1>
        <TextField
          onInput={handleSearchInput}
          value={search}
          label="Кадастровый номер"
          variant="outlined"
          helperText={!!searchInputError ? "Минимум 5 символов" : ""}
          error={!!searchInputError}
        />
        <Button onClick={handleSearchClick} variant="outlined">
          Найти
        </Button>
        <Divider />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Номер строки</TableCell>
                <TableCell align="right">Кад. номер</TableCell>
                <TableCell align="right">Тип</TableCell>
                <TableCell align="right">Адрес</TableCell>
              </TableRow>
            </TableHead>
            {/* <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index}
                  </TableCell>
                  <TableCell align="right">{row.objectCn}</TableCell>
                  <TableCell align="right">{row.objectType}</TableCell>
                  <TableCell align="right">{row.addressNotes}</TableCell>
                </TableRow>
              ))}
            </TableBody> */}
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default App;
