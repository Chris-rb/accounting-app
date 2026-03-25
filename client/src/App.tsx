import React, {type FC} from "react";
import { RouterProvider } from "react-router/dom"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import routes from './routes/routes'
import { AuthProvider } from "./context/AuthContext";



const App: FC = () => (
  <React.StrictMode>
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={routes} />
      </LocalizationProvider>
    </AuthProvider>
  </React.StrictMode>
);

export default App
