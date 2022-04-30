const fetch_data = async () => {
    const response = await fetch(
        "http://localhost:5000/api/products/getallproducts"
    );
    const json = await response.json();
    return json;
};

const data = fetch_data();

export default data;
