import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "../../../notFound";
import Account from "../../page/account";
import Dashboard from "../../page/dashboard";
import Question from "../../page/question";
import FileUpload from "../../page/file";
import "./style.css";
import FileList from "../../page/listfile";
import ViewFile from "../../page/listfile/viewFile";
import EditFile from "../../page/listfile/editFile";

export default function Main() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Account />} />
        <Route path="/topQuestion" element={<Question />} />
        <Route path="/file" element={<FileList />} />
        <Route path="/file/:id" element={<ViewFile />} />
        <Route path="/files/:id" element={<EditFile />} />
        {/* <Route path="/listFile" element={<FileList />} /> */}
        {/* <Route path="/viewFile" element={<ViewFile />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
