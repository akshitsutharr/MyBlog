import "./App.css";
import Layout from "./components/Layout.jsx";
import {Route, Routes} from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { UserContextProvider } from "./UserContext.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import PostPage from "./pages/PostPage.jsx";
import EditPost from "./pages/EditPost.jsx";


function App() {
  return (
    <UserContextProvider>
       <Routes>
      <Route path="/" element={<Layout />} >
      <Route index element={<IndexPage /> } />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path= '/create' element={<CreatePost />} />
      <Route path= '/post/:id' element={<PostPage />} />
      <Route path='/edit/:id' element={<EditPost />} />
      </Route>
      </Routes>
    </UserContextProvider>
   
  );
}

export default App;
