import './App.css'
import UploadPage from "./pages/UploadPage.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {DataProvider} from "./contexts/DataContext.tsx";
import ResultsPage from "./pages/ResultsPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <UploadPage />,
    },
    {
        path: "/results",
        element: <ResultsPage />,
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
