import { Typography } from "@mui/material";

import { AdminTable } from "../components";

const Admin = ({ questions, categories }) => {
  return (
    <>
      <Typography variant="h2">Admin</Typography>

      <AdminTable questions={questions} categories={categories} />
    </>
  );
};

export default Admin;
