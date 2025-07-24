document.addEventListener('DOMContentLoaded', function() {
  const productForm = document.getElementById('product-form');
  const statusMessage = document.getElementById('status-message');

  productForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // إظهار رسالة التحميل
    showMessage('جاري إضافة المنتج...', 'bg-blue-100 text-blue-700');
    
    // جمع بيانات النموذج
    const formData = new FormData(productForm);
    const productData = {
      title: formData.get('title'),
      price: parseFloat(formData.get('price')),
      description: formData.get('description'),
      category: formData.get('category'),
      image: formData.get('image')
    };
    
    // إرسال البيانات إلى FakeStore API
    fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('فشل في إضافة المنتج');
      }
      return response.json();
    })
    .then(data => {
      // عرض رسالة نجاح
      showMessage(`تمت إضافة المنتج بنجاح! معرف المنتج: ${data.id}`, 'bg-green-100 text-green-700');
      
      // إعادة تعيين النموذج
      productForm.reset();
      
      // إعادة التوجيه إلى صفحة المنتجات بعد 3 ثوان
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    })
    .catch(error => {
      // عرض رسالة خطأ
      showMessage(`حدث خطأ: ${error.message}`, 'bg-red-100 text-red-700');
    });
  });
  
  // دالة لعرض رسائل الحالة
  function showMessage(message, className) {
    statusMessage.textContent = message;
    statusMessage.className = `block mt-4 p-4 rounded-lg text-center ${className}`;
  }
});