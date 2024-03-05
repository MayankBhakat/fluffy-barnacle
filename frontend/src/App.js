import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OTP from "./pages/OTP";
import WishList from "./pages/Wishlist";
import ResetPassword from "./pages/resetpassword";
import HomePage from "./pages/Home";
import RentPage from "./pages/Rent";
import Renthome from "./pages/Renthomes";
import SingleRentHomePage from "./pages/SingleRentHomePage";
import AgentsPage from "./pages/AgentsPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from "./components/Loader";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./authRoutes/protectedRoutes";
import PublicRoutes from "./authRoutes/publicRoutes";
import Sell_rentproperty from "./pages/Sell_rentproperty";

import './index.css'
function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <div className="App">
    {loading && <Loader />}
    <Toaster position="top-center" reverseOrder={false} />
    <BrowserRouter>
     <Routes>
     <Route path="/login" element={<PublicRoutes><LoginPage /></PublicRoutes>} />
     <Route path="/register" element={<PublicRoutes><RegisterPage /></PublicRoutes>} />
     <Route path="/forgot_password" element={<PublicRoutes><ForgotPasswordPage /></PublicRoutes>} />
     <Route path="/OTP/:user_id/:unique_string" element={<PublicRoutes><OTP /></PublicRoutes>} />
     <Route path="/reset_password/:user_id/:unique_string" element={<PublicRoutes><ResetPassword /></PublicRoutes>} />
     <Route path="/" element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />
     <Route path="/rent" element={<ProtectedRoutes><RentPage /></ProtectedRoutes>} />
     <Route path="/renthome" element={<ProtectedRoutes><Renthome /></ProtectedRoutes>} />
     <Route path="/singlerenthome/:home_id" element={<ProtectedRoutes>< SingleRentHomePage/></ProtectedRoutes>} />
     <Route path="/agentspage" element={<ProtectedRoutes><AgentsPage/></ProtectedRoutes>}/>
     <Route path="/wishlist" element={<ProtectedRoutes><WishList/></ProtectedRoutes>}/>
     <Route path="/addproperty" element={<ProtectedRoutes><Sell_rentproperty/></ProtectedRoutes>}/>
     </Routes>
    </BrowserRouter>
    </div>
);
}

export default App;
