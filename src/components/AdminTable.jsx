import {
  Autocomplete,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

const AdminTable = ({ questions, categories }) => {
  /* 
      TODO:
      - update state when inputs change
      - check if category exists. create if not
      - add new question to state
  */
  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Paper>
      <form id="new-question-form" onSubmit={onSubmit}>
        <Table aria-label="game questions">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Autocomplete
                  freeSolo
                  options={categories}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </TableCell>
              <TableCell>
                <TextField size="small" />
              </TableCell>
              <TableCell>
                <TextField size="small" />
              </TableCell>
              <TableCell>
                <Button variant="contained" type="submit">
                  Add
                </Button>
              </TableCell>
            </TableRow>
            {questions.map((q) => (
              <TableRow key={q.uuid}>
                <TableCell>
                  {categories.find((c) => c.id === q.category).label}
                </TableCell>
                <TableCell>{q.question}</TableCell>
                <TableCell>{q.points}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" disabled>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </Paper>
  );
};

export default AdminTable;
