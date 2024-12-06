import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import MemberPolicyPage from "./pages/MemberPolicyPage";
import ContactPage from "./pages/ContactPage"
import IntroductionPage from "./pages/IntroductionPage";
import AuthForm from "./components/AuthForm";
import ShoppingCartPage from "./pages/ShoppingCartPage"
import PaymentPage from "./pages/PaymentPage";
import BookDetailPage from "./pages/BookDetailPage"

const App = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Router>
      <div>
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div className="mt-[70px] w-full">
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memberpolicy" element={<MemberPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/introduction" element={<IntroductionPage />} />
          <Route path="/authform" element={<AuthForm />} />
          <Route path="/shoppingcart" element={<ShoppingCartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/book-detail/:id" element={<BookDetailPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;