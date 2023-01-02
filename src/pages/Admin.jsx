import { Typography } from "@mui/material";

import { AdminTable } from "../components";

const Admin = ({ questions, categories, setQuestions, setCategories }) => {
  return (
    <>
      <Typography variant="h2">Admin</Typography>

      <Typography variant="h3">Categories</Typography>
      {categories.length ? (
        <ul className="admin-category-list">
          {categories.map((c) => (
            <li>
              <Typography sx={{ fontSize: "20px" }}>{c.label}</Typography>
            </li>
          ))}
        </ul>
      ) : (
        <i>None added yet!</i>
      )}
      <Typography variant="body2" gutterBottom>
        Categories are added automatically when you add questions. Categories
        are only visible in game mode if it has at least 1 question associated
        with it.
      </Typography>

      <Typography variant="h3">Questions</Typography>
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
