import React, { useState, useContext, createContext, useEffect } from "react";
import { toast } from "react-toastify";
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHammenuOpen, setIsHammenuOpen] = useState(false);
    const [cartList, setCartList] = useState(
        localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart"))
            : []
    );
    const [adminReturn, setAdminReturn] = useState(false);
    const [totalSum, setTotalSum] = useState(0);
    const [itemCount, setItemCount] = useState(0);
    const [newsLetterHolder, setNewsLetterHolder] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoading, setAdminLoading] = useState(true);

    const [auth, setAuth] = useState(
        localStorage.getItem("ShopAuthtoken") || null
    );

    const [likedProductsList, setLikedProductsList] = useState(
        localStorage.getItem("likedProductsList")
            ? JSON.parse(localStorage.getItem("likedProductsList"))
            : []
    );

    // temp state created because useeffect for cartlist was not working
    const [tempState, setTempState] = useState(0);
    const [productsList, setProductsList] = useState([]);

    const fetch_products = async () => {
        const response = await fetch(
            "http://localhost:5000/api/products/getallproducts"
        );
        const json = await response.json();

        return setProductsList(json.products);
    };

    const fetch_is_admin = async () => {
        setAdminLoading(true);
        const response = await fetch("http://localhost:5000/api/auth/getuser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: auth,
            },
        });
        const json = await response.json();

        if (json.success) {
            if (json.user["news letter holder"]) {
                setNewsLetterHolder(true);
            }
            if (json.user.is_admin) {
                setAdminLoading(false);
                return setIsAdmin(true);
            }
        }
        setAdminLoading(false);
        setIsAdmin(false);
    };

    const darkTheme = {
        "--scroll-thumb": "rgba(154, 154, 154, 0.6)",
        "--scroll-track": "rgba(63, 63, 63, 0.6)",

        "--text-color": " white",
        "--logo-blob": "#222222",
        "--hover-link-color": "#0d0d0d",
        "--bg-color": "#121212",
        "--alt-bg-color": "#171717",
        "--bg-dark-color": " black",
        "--extra-light-bg-color": "#151515",

        "--toastify-color-light": "var(--alt-bg-color)",
        "--toastify-toast-width": "70vw",
        " --toastify-font-family": "Roboto",

        "--shadow": "rgba(0, 0,0 , .5)",
    };

    const lightTheme = {
        "--scroll-thumb": "var(--bg-dark-color)",
        "--scroll-track": "var(--hover-link-color)",
        "--toastify-toast-width": "70vw",
        "--toastify-color-light": "var(--alt-bg-color)",
        " --toastify-font-family": "Roboto",

        "--text-color": "black",
        "--logo-blob": "#e7e7e7",
        "--hover-link-color": "#e0e0e0",
        "--bg-color": "#fcfcfc",
        "--extra-light-bg-color": "#f9f9f9",
        "--alt-bg-color": "#f4f4f4",
        "--bg-dark-color": "#bfbfbf",
        "--shadow": "rgba(17, 12, 46, 0.15)",
    };

    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const days = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        0: "Sunday",
    };

    const genDate = (main_date) => {
        const date = new Date(main_date);

        return `
        ${date.getDate()} ${
            monthNames[date.getMonth()]
        } ${date.getFullYear()} , ${days[date.getDay()]}
        `;
    };

    useEffect(() => {
        fetch_products();
        setAuth(localStorage.getItem("ShopAuthtoken"));
        if (theme === "light") {
            for (let key in lightTheme) {
                document
                    .querySelector(":root")
                    .style.setProperty(key, lightTheme[key]);
            }
        } else {
            for (let key in darkTheme) {
                document
                    .querySelector(":root")
                    .style.setProperty(key, darkTheme[key]);
            }
        }
    }, []);

    useEffect(() => {
        if (auth) {
            fetch_is_admin();
        }
    }, [auth]);

    useEffect(() => {
        localStorage.setItem(
            "likedProductsList",
            JSON.stringify(likedProductsList)
        );
    }, [likedProductsList]);

    const dispatchAlert = (type = "", message = "") => {
        switch (type) {
            case "success":
                toast.success(message, {
                    position: "bottom-center",
                    autoClose: 3500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                break;

            case "info":
                toast.info(message, {
                    position: "bottom-center",
                    autoClose: 3500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                break;

            case "error":
                toast.error(message, {
                    position: "bottom-center",
                    autoClose: 3500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                break;

            case "warning":
                toast.warning(message, {
                    position: "bottom-center",
                    autoClose: 3500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        let total = 0;
        let item_count = 0;

        cartList.forEach((item) => {
            total += item.price * item.amount;
            item_count += item.amount;
        });

        setItemCount(item_count);
        setTotalSum(total);
    }, [cartList, tempState]);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartList));
    }, [cartList, tempState]);

    return (
        <AppContext.Provider
            value={{
                fetch_products,
                isCartOpen,
                setIsCartOpen,
                cartList,
                setCartList,
                totalSum,
                productsList,
                setTempState,
                likedProductsList,
                setLikedProductsList,
                dispatchAlert,
                isHammenuOpen,
                setIsHammenuOpen,
                setProductsList,
                theme,
                setTheme,
                darkTheme,
                lightTheme,
                itemCount,
                auth,
                setAuth,
                genDate,
                isAdmin,
                adminLoading,
                setIsAdmin,
                adminReturn,
                setAdminReturn,
                newsLetterHolder,
            }}>
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppProvider };
