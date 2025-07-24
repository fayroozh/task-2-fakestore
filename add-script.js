// معالجة إضافة منتج جديد
document.addEventListener('DOMContentLoaded', function () {
  const productForm = document.getElementById('product-form');
  const statusMessage = document.getElementById('status-message');

  productForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Show loading message
    showMessage('Adding product...', 'bg-blue-100 text-blue-700');

    // تجهيز بيانات المنتج
    const formData = new FormData(productForm);
    const productData = {
      title: formData.get('title'),
      price: parseFloat(formData.get('price')),
      description: formData.get('description'),
      category: formData.get('category'),
      image: formData.get('image')
    };

    // إرسال البيانات للـ API
    fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
      // Show success message
        showMessage(`Product added successfully! Product ID: ${data.id}`, 'bg-green-100 text-green-700');

        // Reset the form
        productForm.reset();

        // Redirect to products page after 3 seconds
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 3000);
      })
      .catch(error => {
        // Show error message
        showMessage(`An error occurred: ${error.message}`, 'bg-red-100 text-red-700');
      });
  });

  // عرض رسائل الحالة
  function showMessage(message, className) {
    statusMessage.textContent = message;
    statusMessage.className = `block mt-4 p-4 rounded-lg text-center ${className}`;
  }
});
