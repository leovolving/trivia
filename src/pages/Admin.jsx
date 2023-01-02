import { Card, Divider, Typography } from "@mui/material";

import { AdminTable } from "../components";

const Admin = ({ questions, categories, setQuestions, setCategories }) => {
  return (
    <>
      <Typography variant="h2">Admin Mode</Typography>

      <Divider variant="middle" sx={{ margin: "32px 0" }} />

      <Card sx={{ padding: "16px" }}>
        <div className="admin-categories-container">
          <Typography variant="h3" gutterBottom>
            Categories:{" "}
          </Typography>
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
        </div>
        <Typography variant="body2" gutterBottom>
          Categories are added automatically when you add questions. Categories
          are only visible in game mode if it has at least 1 question associated
          with it.
        </Typography>
      </Card>

      <Divider variant="middle" sx={{ margin: "32px 0" }} />

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
