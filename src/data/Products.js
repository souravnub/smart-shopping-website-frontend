const fetch_data = async () => {
    const response = await fetch(
        "https://smart-shopping-website.herokuapp.com/api/products/getallproducts"
    );
    const json = await response.json();
    return json;
};

const data = fetch_data();

export default data;
