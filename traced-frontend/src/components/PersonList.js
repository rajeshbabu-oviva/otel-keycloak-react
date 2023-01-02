import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const PersonList = (props) => (
  <TableContainer component={Paper}>
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>API</TableCell>
          <TableCell>Auth</TableCell>
          <TableCell>HTTPS</TableCell>
          <TableCell>Link</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.persons &&
          props.persons.map((link) => (
            <TableRow key={link.Link}>
              <TableCell component="th" scope="row">
                {link.Description}
              </TableCell>
              <TableCell>{link.API}</TableCell>
              <TableCell>{link.Auth}</TableCell>
              <TableCell>{link.HTTPS}</TableCell>
              <TableCell>{link.Link}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default PersonList;
