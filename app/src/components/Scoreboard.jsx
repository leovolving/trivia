import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Typography,
} from "@mui/material";

import { Modal } from "../_ds";

import { useAppContext } from "../ContextWrapper";

const Scoreboard = ({ isOpen, onClose }) => {
  const { teams } = useAppContext();

  const max = Math.max(...teams.map((t) => t.points));
  return (
    <Modal open={isOpen} onClose={onClose}>
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
    </Modal>
  );
};

export default Scoreboard;
