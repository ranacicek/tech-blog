import { RouteObject, createBrowserRouter } from "react-router-dom";
import Login from "../../components/account/Login";
import Register from "../../components/account/Register";
import App from "../../components/layout/App";
import LatestArticles from "../../components/articles/LatestArticles";
import NotFound from "../../components/error/NotFound";
import AuthorArticles from "../../components/articles/AuthorArticles";
import MyProfile from "../../components/user/MyProfile";
import AddEditArticle from "../../components/user/AddEditArticle";
import MyArticles from "../../components/user/MyArticles";
import ProtectRoute from "./ProtectRoute";
import ViewArticle from "../../components/articles/ViewArticle";
import AuthorProfile from "../../components/author/AuthorProfile";
import SearchArticles from "../../components/articles/SearchArticles";

const routes: RouteObject[] = [
    {path:"/login", element:<Login/>},
    {path:"/register", element:<Register/>},
    {
        path:"/",
        element: <App/>,
        children: [
            {path: "", element:<LatestArticles/>},
            {path: "viewarticle/:id", element:<ViewArticle/>},
            {path: "authorarticles/:id", element:<AuthorArticles/>},
            {path: "authorprofile/:id", element:<AuthorProfile/>},
            {path: "search", element:<SearchArticles/>},
            {path: "myprofile",  element: <ProtectRoute child={<MyProfile/>} />},  
            {path: "myarticles",  element: <ProtectRoute child={<MyArticles/>} />},  
            {path: "addarticle", element: <ProtectRoute child={<AddEditArticle key={"uniqueKey1"} />} />},
            {path: "editarticle/:id", element: <ProtectRoute child={<AddEditArticle key={"uniqueKey2"} />} />},
          
            {path: "*", element:<NotFound/>}          
        ]
    }    
];

export const router = createBrowserRouter(routes);