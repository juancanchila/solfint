import { Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute.jsx';
import LoginRoute from '../components/loginRoute.jsx';
import RoleRoute from '../components/RoleRoute.jsx';
import SplashScreen from '../components/SplahsScreen/SplashScreen.jsx';
import Login from '../components/Login/Login.jsx';
import Home from '../components/Home/Home.jsx';
import SendCode from '../components/Send-Code/Send-Code.jsx';
import Profile from '../components/Profile/Profile.jsx';
import Clientes from '../components/Clients/Clients.jsx';
import AddClientPage from '../components/Clients/AddClientPage.jsx';
import Users from '../components/Users/Users.jsx';
import AddUserPage from '../components/Users/AddUserPage.jsx';
const routes = [
  {
    path: '/',
    element: <SplashScreen />
  },
  {
    path: '/',
    element: <LoginRoute />, // 👈 Aquí envuelves las rutas públicas
    children: [
      { path: 'login', element: <Login /> },
      { path: 'send-code', element: <SendCode /> }
    ]
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      { path: 'home', element: <Home /> },
      {
        path: 'profile/:userId?',
        element: <Profile />
      },
      { path: 'addclient', element: <AddClientPage /> },
      { path: 'adduser', element: <AddUserPage /> },
    ]
  },
  {
    path: '/',
    element: <RoleRoute />,
    children: [
      { path: 'users', element: <Users/> },
      { path: 'clients', element: <Clientes /> }
    ]
  },

  {
    path: '*',
    element: <Navigate to="/" />
  }
];

export default routes;
