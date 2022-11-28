import { Typography } from "@mui/material";

import { AdminTable } from "../components";

const Admin = ({ questions, categories, setQuestions, setCategories }) => {
  return (
    <>
      <Typography variant="h2">Admin</Typography>

      <AdminTable
        questions={questions}
        setQuestions={setQuestions}
        categories={categories}
        setCategories={setCategories}
      />
    </>
  );
};

export default Admin;
