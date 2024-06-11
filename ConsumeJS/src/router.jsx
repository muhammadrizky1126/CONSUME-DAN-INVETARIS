import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Stuff from "./pages/Stuff";
import StuffTrash from "./pages/StuffTrash";
import User from "./pages/User/Index";
import UserCreate from "./pages/User/Create";
import UserEdit from "./pages/User/Edit";
import UserTrash from "./pages/User/Trash";




export const router = createBrowserRouter([
    {path: '/', element: <App/>},
    {path:'/login', element: <Login/>},
    {path:'/profile', element: <Profile/>},
    {path:'/stuff', element: <Stuff/>},
    {path:'/stuff/trash', element: <StuffTrash/>},
    {path:'/user',element: <User/>},
    {path:'/user/create',element: <UserCreate/>},
    {path:'/user/edit/:id',element: <UserEdit/>} ,
    {path:'/user/trash/',element: <UserTrash/>} 


]);