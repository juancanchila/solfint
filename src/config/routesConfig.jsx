import { Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import LoginRoute from "../components/loginRoute.jsx";
import RoleRoute from "../components/RoleRoute.jsx";
import SplashScreen from "../components/SplahsScreen/SplashScreen.jsx";
import Login from "../components/Login/Login.jsx";
import Home from "../components/Home/Home.jsx";
import SendCode from "../components/Send-Code/Send-Code.jsx";
import Profile from "../components/Profile/Profile.jsx";
import Clientes from "../components/Clients/Clients.jsx";
import AddClientPage from "../components/Clients/AddClientPage.jsx";
import Users from "../components/Users/Users.jsx";
import AddUserPage from "../components/Users/AddUserPage.jsx";
import EditUserPage from "../components/Profile/EditUserPage.jsx";
import ClientProfile from "../components/Clients/ClientProfile.jsx";
import EditClientPage from "../components/Clients/EditClientPage.jsx";
import RecoverPassword from "../components/Login/RecoverPassword.jsx";
import SetPassword from "../components/Login/SetPassword.jsx";
import ResetRoute from "../components/ResetRoute.jsx";
const routes = [
  // Splash screen
  {
    path: "/",
    element: <SplashScreen />,
  },

  {
    path: "/reset-password",
    element: <RecoverPassword />,
  },

  // Login (público)
  {
    element: <LoginRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/set-password",
        element: <SetPassword />,
      },
      {
        path: "/send-code",
        element: <SendCode />,
      },
    ],
  },

  {
    element: <ResetRoute />,
    children: [
      {
        path: "/set-password",
        element: <SetPassword />,
      },
    ],
  },

  // Rutas privadas protegidas por PrivateRoute
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/profile/:userId?",
        element: <Profile />,
      },
      {
        path: "/clients/:clientId",
        element: <ClientProfile />,
      },
      {
        path: "/editclient/:clientId",
        element: <EditClientPage />,
      },
      {
        path: "/user/:userId?",
        element: <EditUserPage />,
      },
      {
        path: "/addclient",
        element: <AddClientPage />,
      },
      {
        path: "/adduser",
        element: <AddUserPage />,
      },
    ],
  },

  // Rutas protegidas por rol
  {
    element: <RoleRoute />,
    children: [
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/clients",
        element: <Clientes />,
      },
    ],
  },

  // Ruta por defecto para cualquier path no encontrado
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default routes;
