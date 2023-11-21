import './App.css'
import UploadForm from "./components/UploadForm.tsx";
import {Route} from "@mui/icons-material";
import {createBrowserRouter, Router, RouterProvider} from "react-router-dom";
import {DataProvider} from "./contexts/DataContext.tsx";
import Results from "./components/Results.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <UploadForm />,
    },
    {
        path: "/results",
        element: <Results />,
    },
]);
function App() {
  return (
      <DataProvider>
          <RouterProvider router={router}/>
      </DataProvider>
  );
}

export default App;
