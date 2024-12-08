import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlusCircle, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import Axios

function Products() {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị tìm kiếm
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ productCode: "", name: "", price: "", description: "", category: "", image: null });
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const productsPerPage = 5; // Số sản phẩm trên mỗi trang

  const apiUrl = "http://localhost:5000/api/products"; // Địa chỉ API

  // Lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(apiUrl, { params: { searchTerm } });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      toast.error("Không thể tải sản phẩm từ server.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  // Lọc sản phẩm và phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleShowModal = (product = null) => {
    setCurrentProduct(product);
    setFormData(
      product
        ? { ...product }
        : { productCode: "", name: "", price: "", description: "", category: "", image: null }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFormData({ ...formData, image: e.target.files[0] });

  const handleSave = async () => {
    if (!formData.productCode || !formData.name || !formData.price || !formData.description || !formData.category) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    try {
      // Xử lý file hình ảnh (chỉ nếu hình ảnh được chọn)
      let imageUrl = formData.image;
      if (formData.image && typeof formData.image !== "string") {
        const reader = new FileReader();
        reader.readAsDataURL(formData.image);
        await new Promise((resolve) => (reader.onloadend = resolve));
        imageUrl = reader.result;
      }
  
      const payload = {
        productCode: formData.productCode,
        name: formData.name,
        price: parseInt(formData.price, 10),
        description: formData.description,
        category: formData.category,
        image: imageUrl || "", // URL của hình ảnh
      };
  
      if (currentProduct) {
        await axios.put(`${apiUrl}/${currentProduct._id}`, payload);
        toast.success("Sản phẩm đã được cập nhật thành công!");
      } else {
        await axios.post(apiUrl, payload);
        toast.success("Sản phẩm đã được thêm thành công!");
      }
  
      fetchProducts(); // Cập nhật danh sách sản phẩm
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      toast.error("Không thể lưu sản phẩm.");
    }
  };
  
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      toast.success("Sản phẩm đã được xóa thành công!");
      fetchProducts(); // Cập nhật danh sách sản phẩm
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Quản Lý Sản Phẩm</h2>

      {/* Thanh tìm kiếm */}
      <div className="mb-4 d-flex align-items-center">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Tìm kiếm theo tên, mã sản phẩm hoặc danh mục..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
          }}
        />
        <FaSearch size={20} />
      </div>

      {/* Bảng danh sách sản phẩm */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Mã Sản Phẩm</th>
              <th>Tên</th>
              <th>Hình Ảnh</th>
              <th>Giá</th>
              <th>Danh Mục</th>
              <th>Mô Tả</th>
              <th>Ngày Thêm</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.productCode}</td>
                <td>{product.name}</td>
                <td>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  ) : (
                    "Chưa có ảnh"
                  )}
                </td>
                <td>{product.price.toLocaleString()} VNĐ</td>
                <td>{product.category}</td>
                <td>{product.description}</td>
                <td>{product.createdAt}</td>
                <td>
                  <div className="d-flex align-items-center justify-content-center">
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleShowModal(product)}>
                      <FaEdit /> Sửa
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>
                      <FaTrash /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Nút thêm sản phẩm */}
      <div className="mt-4 text-center">
        <button className="btn btn-success" onClick={() => handleShowModal()}>
          <FaPlusCircle /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Modal thêm/sửa sản phẩm */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProduct ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductCode">
              <Form.Label>Mã Sản Phẩm</Form.Label>
              <Form.Control
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Tên Sản Phẩm</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Danh Mục</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Chọn Hình Ảnh</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Products;
