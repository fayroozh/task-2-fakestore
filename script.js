// script.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("products-container");

  // عرض حالة التحميل مع هياكل عظمية للمنتجات
  container.innerHTML = `
    <div class="col-span-full">
      ${Array(8).fill().map((_, i) => `
        <div class="product-skeleton h-64 mb-4 bg-gray-100 rounded-xl animate-pulse" style="animation-delay: ${i * 0.1}s"></div>
      `).join('')}
    </div>
  `;

  // تأثير ظهور تدريجي للصفحة
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease';
  }, 100);

  // جلب المنتجات من API
  fetch("https://fakestoreapi.com/products")
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then((products) => {
      if (products.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center py-8 text-gray-500">No products available</p>`;
        return;
      }

      // إزالة الهياكل العظمية
      container.innerHTML = '';
      
      // إنشاء بطاقات المنتجات مع تأثيرات ظهور تدريجي
      products.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all duration-300 flex flex-col opacity-0 translate-y-10";
        card.style.animationDelay = `${index * 0.1}s`;
        
        // تنسيق التقييم إذا كان متوفراً
        const ratingBadge = product.rating && product.rating.rate > 4.3 ? `
          <span class="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
            ⭐ ${product.rating.rate} | ${product.rating.count}
          </span>
        ` : '';
        
        card.innerHTML = `
          <div class="image-container h-48 overflow-hidden rounded-lg mb-4 relative">
            <img 
              src="${product.image}" 
              alt="${product.title}" 
              class="product-image w-full h-full object-contain transition-transform duration-500 hover:scale-110"
              loading="lazy"
              onerror="this.src='https://via.placeholder.com/300?text=Image+Not+Available'"
            />
            ${ratingBadge}
          </div>
          <h3 class="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">${product.title}</h3>
          <div class="mt-auto">
            <div class="flex justify-between items-center mb-3">
              <span class="text-green-600 font-bold text-xl">$${product.price.toFixed(2)}</span>
              <span class="text-xs bg-gray-100 px-2 py-1 rounded-full">${product.category}</span>
            </div>
            <button 
              class="add-to-cart-btn w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95"
              onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}')"
            >
              Add to Cart
            </button>
          </div>
        `;
        
        container.appendChild(card);
        
        // أنيميشن ظهور البطاقة
        setTimeout(() => {
          card.classList.remove('opacity-0', 'translate-y-10');
          card.classList.add('animate-fadeInUp');
        }, 100 + index * 50);
      });
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-red-500 mb-4 text-5xl">😞</div>
          <h3 class="text-xl font-bold mb-2">Failed to load products</h3>
          <button onclick="window.location.reload()" class="refresh-btn mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all flex items-center mx-auto">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Try Again
          </button>
        </div>
      `;
    });

  // إضافة تأثير انتقالي للروابط
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.href.includes('index.html') || link.href.includes('add-product.html')) {
        e.preventDefault();
        document.body.style.opacity = '0';
        
        setTimeout(() => {
          window.location.href = link.href;
        }, 300);
      }
    });
  });
});

// دالة إضافة للسلة مع تأثيرات بصرية
function addToCart(productId, productTitle) {
  // حفظ المنتج في localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, title: productTitle, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  
  // تأثيرات بصرية عند النقر على الزر
  const btn = event.target;
  
  // تغيير مظهر الزر
  btn.innerHTML = '✓ Added!';
  btn.classList.remove('from-blue-500', 'to-blue-600', 'hover:from-blue-600', 'hover:to-blue-700');
  btn.classList.add('from-green-500', 'to-green-600');
  
  // إنشاء تأثير confetti صغير
  for (let i = 0; i < 5; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = ['#f00', '#0f0', '#00f', '#ff0', '#0ff'][Math.floor(Math.random() * 5)];
    btn.parentElement.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 1000);
  }
  
  // إظهار إشعار
  showCartNotification();
  
  // إعادة الزر إلى حالته الأصلية بعد فترة
  setTimeout(() => {
    btn.innerHTML = 'Add to Cart';
    btn.classList.remove('from-green-500', 'to-green-600');
    btn.classList.add('from-blue-500', 'to-blue-600', 'hover:from-blue-600', 'hover:to-blue-700');
  }, 2000);
}

// دالة لعرض إشعار إضافة المنتج للسلة
function showCartNotification() {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
  notification.textContent = 'Product added to cart!';
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}