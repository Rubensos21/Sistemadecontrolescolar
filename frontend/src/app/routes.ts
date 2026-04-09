import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHome } from "./components/DashboardHome";
import { StudentsList } from "./components/StudentsList";
import { GradesList } from "./components/GradesList";
import { ImportGrades } from "./components/ImportGrades";
import { Reports } from "./components/Reports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: "students", Component: StudentsList },
      { path: "grades", Component: GradesList },
      { path: "import", Component: ImportGrades },
      { path: "reports", Component: Reports },
    ],
  },
]);
