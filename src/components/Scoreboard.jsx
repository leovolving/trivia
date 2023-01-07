import {
  Card,
  Modal,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Typography,
} from "@mui/material";

const Scoreboard = ({ teams, isOpen, onClose }) => {
  const max = Math.max(...teams.map((t) => t.points));
  console.log({ max });
  return (
    <Modal open={isOpen} onClose={onClose} className="modal">
      <Card className="modal-card">
        <Typography variant="h3" gutterBottom>
          Scoreboard
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <Typography component={TableCell}>Team</Typography>
              <Typography component={TableCell}>Points</Typography>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...teams]
              .sort((a, b) => b.points - a.points)
              .map((t) => (
                <TableRow key={t.id}>
                  <Typography
                    component={TableCell}
                    sx={{ fontWeight: t.points === max ? "bold" : "normal" }}
                  >
                    {t.name}
                  </Typography>
                  <Typography
                    component={TableCell}
                    sx={{ fontWeight: t.points === max ? "bold" : "normal" }}
                  >
                    {t.points}
                  </Typography>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </Modal>
  );
};

export default Scoreboard;
