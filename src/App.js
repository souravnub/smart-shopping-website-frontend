import "./App.css";
import Cart from "./components/cart/Cart";
import Navbar from "./components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Orders from "./pages/Orders";
import MyAccount from "./pages/account page/MyAccount";
import SingleProductInfo from "./pages/SingleProductInfo";
import Home from "./components/home/Home";
import AddToCart from "./pages/AddToCart";
import { useGlobalContext } from "./context";
import HammenuContainer from "./components/navbar/HammenuContainer";
import About from "./pages/About";
import ProductsContainer from "./components/home/ProductsContainer";
import OrdersCheckout from "./pages/OrdersCheckout";
import LikedProducts from "./pages/LikedProducts";
import ForgotPassword from "./pages/ForgotPassword";
import CategoryPage from "./pages/CategoryPage";
import AdminPage from "./pages/Admin page/AdminPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import EditProductPage from "./pages/admin edit product page/EditProductPage";
import AddProductPage from "./pages/Admin page/Subpages/AddProductPage";
import ChangeDetails from "./components/account/ChangeDetails";

function App() {
    const { isCartOpen, isHammenuOpen, adminReturn, setAdminReturn } =
        useGlobalContext();

    if (isCartOpen || isHammenuOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    return (
        <>
            <HammenuContainer />
            <div className="container">
                <Navbar />
                <Cart />

                <ToastContainer
                    position="bottom-center"
                    autoClose={3500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />

                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/about" element={<About />}></Route>

                    <Route
                        path="/products"
                        element={
                            <ProductsContainer trending={false} />
                        }></Route>
                    <Route
                        path="/orderscheckout"
                        element={<OrdersCheckout />}></Route>

                    <Route
                        path="/products/:category"
                        element={<CategoryPage />}></Route>

                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/signup" element={<SignUp />}></Route>
                    <Route path="/orders" element={<Orders />}></Route>
                    <Route path="/account" element={<MyAccount />}></Route>
                    <Route
                        path="/updateinfo"
                        element={<ChangeDetails />}></Route>
                    <Route
                        path="/addproduct"
                        element={
                            <AddProductPage setAdminReturn={setAdminReturn} />
                        }></Route>
                    <Route
                        path="/adminPage"
                        element={
                            <AdminPage adminReturn={adminReturn} />
                        }></Route>
                    <Route
                        path="/editproduct/:id"
                        element={
                            <EditProductPage setAdminReturn={setAdminReturn} />
                        }></Route>

                    <Route
                        path="/likedProducts"
                        element={<LikedProducts />}></Route>

                    <Route
                        path="/forgotpassword"
                        element={<ForgotPassword />}></Route>

                    <Route
                        path="/singleproductinfo/:id"
                        element={<SingleProductInfo />}></Route>
                    <Route
                        path="/addtocart/:id"
                        element={<AddToCart />}></Route>
                    <Route path="*" element={<PageNotFound />}></Route>
                </Routes>
            </div>
        </>
    );
}

export default App;
