import React, { useState, useEffect } from "react";
import Slider from "../components/Slider"; // Nếu Slider nằm trong src/components
import FruitGallery from "../components/FruitGallery"; // Nếu FruitGallery nằm trong src/components
import MemorableProductDisplay from "../components/MemorableProductDisplay";
import BookDisplay from "../components/BookDisplay";
import FeaturedBooks from "../components/FeaturedBooks";
import ProductCategoryGrid from "../components/ProductCategoryGrid";

const Home = () => {
  return (
    <div className="">
      <Slider />
      <FruitGallery />
      <MemorableProductDisplay />
      <FeaturedBooks />
      <BookDisplay />
      <ProductCategoryGrid/>
    </div>
  );
};

export default Home;