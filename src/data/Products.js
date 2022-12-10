const fetch_data = async () => {
    const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/getallproducts`
    );
    const json = await response.json();
    return json;
};

const data = fetch_data();

export default data;
