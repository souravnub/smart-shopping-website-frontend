import React from "react";
import ContactForm from "./ContactForm";
import Hero from "./Hero";
import ProductsContainer from "./ProductsContainer";

const Home = () => {
    return (
        <>
            <Hero />
            <ProductsContainer trending={true} />
            <ContactForm />
        </>
    );
};

export default Home;
