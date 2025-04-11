// Product data structure (400 products total)
const products = {
    seeds: Array(20).fill().map((_, i) => ({
        id: i+1,
        name: `Seed Variety ${i+1}`,
        price: Math.floor(Math.random() * 900) + 100,
        rating: (Math.random() * 2 + 3).toFixed(1),
        image: 'https://via.placeholder.com/300',
        description: 'High quality agricultural seeds',
        category: 'seeds',
        size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)]
    })),
    tools: Array(20).fill().map((_, i) => ({
        id: i+101,
        name: `Garden Tool ${i+1}`,
        price: Math.floor(Math.random() * 900) + 100,
        rating: (Math.random() * 2 + 3).toFixed(1),
        image: 'https://via.placeholder.com/300',
        description: 'Durable farming tool',
        category: 'tools',
        size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)]
    })),
    fertilizers: Array(20).fill().map((_, i) => ({
        id: i+201,
        name: `Fertilizer ${i+1}`,
        price: Math.floor(Math.random() * 900) + 100,
        rating: (Math.random() * 2 + 3).toFixed(1),
        image: 'https://via.placeholder.com/300',
        description: 'Nutrient-rich plant food',
        category: 'fertilizers',
        size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)]
    })),
    pesticides: Array(20).fill().map((_, i) => ({
        id: i+301,
        name: `Pesticide ${i+1}`,
        price: Math.floor(Math.random() * 900) + 100,
        rating: (Math.random() * 2 + 3).toFixed(1),
        image: 'https://via.placeholder.com/300',
        description: 'Effective pest control solution',
        category: 'pesticides',
        size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)]
    }))
};

// Best selling products (can be edited easily)
const bestSellers = [products.seeds[0], products.tools[0], products.fertilizers[0], products.pesticides[0]];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Setup products dropdown toggle
    const productsMenu = document.querySelector('.products-menu');
    const navDropdown = document.querySelector('.nav-dropdown');
    
    if (productsMenu && navDropdown) {
        // Remove all JavaScript interference with the dropdown
        // Links will now work natively without any JavaScript
        // Dropdown can be styled with pure CSS hover states
    }

    if (document.getElementById('products-container')) {
        // On products page
        const allProducts = Object.values(products).flat();
        renderProducts(allProducts);
        setupFilters();
    } else {
        // On home page
        renderCategories();
        renderBestSellers();
    }
});

function setupFilters() {
    const priceRange = document.querySelector('.price-range');
    const priceValue = document.getElementById('price-value');
    
    // Set initial values from URL params if present
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');
    const initialMinPrice = urlParams.get('minPrice');
    const initialMaxPrice = urlParams.get('maxPrice');
    const initialSizes = urlParams.get('sizes')?.split(',');
    const initialSort = urlParams.get('sort');

    // Set category filters
    if (initialCategory) {
        const categoryCheckbox = document.querySelector(`.category-filter[value="${initialCategory}"]`);
        if (categoryCheckbox) categoryCheckbox.checked = true;
    }

    // Set price filters
    if (initialMinPrice && document.querySelector('.min-price')) {
        document.querySelector('.min-price').value = initialMinPrice;
    }

    if (initialMaxPrice && priceRange) {
        priceRange.value = initialMaxPrice;
        if (priceValue) priceValue.textContent = initialMaxPrice;
    }

    // Set size filters
    if (initialSizes) {
        initialSizes.forEach(size => {
            const sizeCheckbox = document.querySelector(`.size-filter[value="${size}"]`);
            if (sizeCheckbox) sizeCheckbox.checked = true;
        });
    }

    // Set sort option
    if (initialSort && document.querySelector('.sort-select')) {
        document.querySelector('.sort-select').value = initialSort;
    }

    // Update price display when slider changes
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', () => {
            priceValue.textContent = priceRange.value;
        });
    }

    // Apply filters when button clicked
    const applyButton = document.getElementById('apply-filters');
    if (applyButton) {
        applyButton.addEventListener('click', applyFilters);
    }
    
    // Apply filters when sort selection changes
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    // Setup clear filters button
    const clearButton = document.getElementById('clear-filters');
    if (clearButton) {
        clearButton.addEventListener('click', clearFilters);
    }

    // Apply filters immediately if URL params exist
    if (urlParams.toString()) {
        applyFilters();
    }
}

function updateFilterURL(categories, minPrice, maxPrice, sizes) {
    const url = new URL(window.location);
    const params = new URLSearchParams();
    
    if (categories.length > 0) {
        params.set('category', categories[0]); // Single category for simplicity
    }
    
    if (minPrice > 0) {
        params.set('minPrice', minPrice);
    }
    
    if (maxPrice < 1000) { // 1000 is our default max
        params.set('maxPrice', maxPrice);
    }
    
    if (sizes && sizes.length > 0) {
        params.set('sizes', sizes.join(','));
    }
    
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect && sortSelect.value !== 'default') {
        params.set('sort', sortSelect.value);
    }
    
    // Only update URL if params exist
    if (params.toString()) {
        window.history.replaceState({}, '', `${url.pathname}?${params}`);
    } else {
        window.history.replaceState({}, '', url.pathname);
    }
}

function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(el => el.value);
    const priceRange = document.querySelector('.price-range');
    const maxPrice = priceRange ? priceRange.value : 1000;
    const minPrice = document.querySelector('.min-price') ? document.querySelector('.min-price').value : 0;
    const selectedSizes = Array.from(document.querySelectorAll('.size-filter:checked'))
        .map(el => el.value);
    const sortOption = document.querySelector('.sort-select').value;

    let filteredProducts = Object.values(products).flat();

    // Apply category filter if any categories selected
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }

    // Apply price range filter
    filteredProducts = filteredProducts.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );

    // Apply size filter if any sizes selected
    if (selectedSizes.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedSizes.includes(product.size)
        );
    }

    // Update URL with current filters
    updateFilterURL(selectedCategories, minPrice, maxPrice, selectedSizes);

    // Apply sorting
    switch(sortOption) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    renderProducts(filteredProducts);
}

function renderProducts(products) {
    const productsContainer = document.getElementById('products-container');
    
    productsContainer.innerHTML = products.map(product => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-1">${product.name}</h3>
                <div class="flex items-center mb-2">
                    ${renderRating(product.rating)}
                    <span class="text-gray-600 text-sm ml-2">${product.rating}</span>
                </div>
                <p class="text-green-600 font-bold mb-3">$${product.price.toFixed(2)}</p>
                <div class="text-xs text-gray-500 mb-2">Size: ${product.size || 'N/A'}</div>
                <a href="product.html?id=${product.id}" class="block text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-300">
                    View Details
                </a>
            </div>
        </div>
    `).join('');
}

function renderCategories() {
    const categoriesContainer = document.querySelector('.grid-cols-4');
    const categories = [
        { name: 'Seeds', icon: 'seedling', products: products.seeds },
        { name: 'Tools', icon: 'tools', products: products.tools },
        { name: 'Fertilizers', icon: 'flask', products: products.fertilizers },
        { name: 'Pesticides', icon: 'spray-can', products: products.pesticides }
    ];

    categoriesContainer.innerHTML = categories.map(category => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <div class="p-6 text-center">
                <i class="fas fa-${category.icon} text-4xl text-green-600 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">${category.name}</h3>
                <p class="text-gray-600 mb-4">${category.products.length} products available</p>
                <a href="products.html?category=${category.name.toLowerCase()}" class="inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                    View Products
                </a>
            </div>
        </div>
    `).join('');
}

function renderBestSellers() {
    const bestSellersContainer = document.querySelector('.bg-gray-100 .grid-cols-4');
    
    bestSellersContainer.innerHTML = bestSellers.map(product => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-1">${product.name}</h3>
                <div class="flex items-center mb-2">
                    ${renderRating(product.rating)}
                    <span class="text-gray-600 text-sm ml-2">${product.rating}</span>
                </div>
                <p class="text-green-600 font-bold mb-3">$${product.price.toFixed(2)}</p>
                <button class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-300" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function renderRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star text-yellow-400"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        } else {
            stars += '<i class="far fa-star text-yellow-400"></i>';
        }
    }
    
    return stars;
}

// Initialize cart from localStorage or create empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = findProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    const quantity = parseInt(document.getElementById('quantity')?.textContent || 1);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    showNotification(`${product.name} added to cart`);
}

// Load cart when cart.html is opened
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const cartItemsContainer = document.getElementById('cart-items-list');
        const emptyCartDiv = document.getElementById('empty-cart');
        const cartWithItemsDiv = document.getElementById('cart-with-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        
        if (cart.length === 0) {
            emptyCartDiv.classList.remove('hidden');
            cartWithItemsDiv.classList.add('hidden');
        } else {
            emptyCartDiv.classList.add('hidden');
            cartWithItemsDiv.classList.remove('hidden');
            
            let subtotal = 0;
            cartItemsContainer.innerHTML = '';
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'grid grid-cols-12 gap-4 items-center border-b py-4';
                cartItemElement.innerHTML = `
                    <div class="col-span-1 flex justify-center">
                        <input type="checkbox" class="item-checkbox" value="${item.id}" 
                               onchange="toggleCartItemSelection(${item.id}, this.checked)">
                    </div>
                    <div class="col-span-5 flex items-center">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                        <div>
                            <h4 class="font-medium">${item.name}</h4>
                            <button class="text-red-500 text-sm mt-1" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash mr-1"></i> Remove
                            </button>
                        </div>
                    </div>
                    <div class="col-span-2 text-center">$${item.price.toFixed(2)}</div>
                    <div class="col-span-2 text-center">
                        <div class="flex items-center justify-center">
                            <button class="px-2 py-1 border rounded-l" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span class="px-3 py-1 border-t border-b">${item.quantity}</span>
                            <button class="px-2 py-1 border rounded-r" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="col-span-2 text-right">$${itemTotal.toFixed(2)}</div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            // Add shipping and total calculation
            const shipping = calculateShipping(subtotal);
            const total = subtotal + shipping;
            
            cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            
            // Add order summary section
            cartItemsContainer.innerHTML += `
                <div class="grid grid-cols-12 gap-4 py-6 border-t">
                    <div class="col-span-6 font-bold">Subtotal</div>
                    <div class="col-span-6 text-right">$${subtotal.toFixed(2)}</div>
                    
                    <div class="col-span-6 font-bold">Shipping</div>
                    <div class="col-span-6 text-right">$${shipping.toFixed(2)}</div>
                    
                    <div class="col-span-6 text-xl font-bold">Total</div>
                    <div class="col-span-6 text-right text-xl font-bold">$${total.toFixed(2)}</div>
                </div>
            `;
        }
    });
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    // Validate maximum quantity (50 per item)
    if (newQuantity > 50) {
        showNotification('Maximum quantity per item is 50');
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload();
    }
}

// Add bulk remove functionality
function removeMultipleItems(productIds) {
    cart = cart.filter(item => !productIds.includes(item.id));
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}

// Calculate shipping costs
function calculateShipping(subtotal) {
    if (subtotal > 10000) return 0; // Free shipping over $100
    if (subtotal > 5000) return 5.99;
    if (subtotal > 1000) return 9.99;
    return 14.99;
}

function findProductById(id) {
    for (const category in products) {
        const found = products[category].find(p => p.id === id);
        if (found) return found;
    }
    return null;
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.fa-shopping-cart + span').forEach(el => {
        el.textContent = count;
    });
}

// Bulk selection functions
let selectedCartItems = new Set();

function toggleCartItemSelection(productId, isSelected) {
    if (isSelected) {
        selectedCartItems.add(productId);
    } else {
        selectedCartItems.delete(productId);
    }
    updateBulkSelectHeader();
}

function toggleBulkSelect(checkbox) {
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const isChecked = checkbox.checked;
    
    itemCheckboxes.forEach(cb => {
        cb.checked = isChecked;
        const productId = parseInt(cb.value);
        if (isChecked) {
            selectedCartItems.add(productId);
        } else {
            selectedCartItems.delete(productId);
        }
    });
}

function updateBulkSelectHeader() {
    const bulkSelectHeader = document.querySelector('.bulk-select');
    if (bulkSelectHeader) {
        const itemCheckboxes = document.querySelectorAll('.item-checkbox');
        const checkedCount = document.querySelectorAll('.item-checkbox:checked').length;
        
        bulkSelectHeader.checked = checkedCount === itemCheckboxes.length && itemCheckboxes.length > 0;
        bulkSelectHeader.indeterminate = checkedCount > 0 && checkedCount < itemCheckboxes.length;
    }
}

function removeSelectedItems() {
    if (selectedCartItems.size === 0) {
        showNotification('Please select items to remove');
        return;
    }
    removeMultipleItems(Array.from(selectedCartItems));
}

function clearFilters() {
    // Uncheck all filter checkboxes
    document.querySelectorAll('.category-filter, .size-filter').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset price range
    const priceRange = document.querySelector('.price-range');
    if (priceRange) {
        priceRange.value = 1000;
        const priceValue = document.getElementById('price-value');
        if (priceValue) priceValue.textContent = '1000';
    }
    
    // Reset min price
    const minPrice = document.querySelector('.min-price');
    if (minPrice) minPrice.value = 0;
    
    // Reset sort
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) sortSelect.value = 'default';
    
    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
    
    // Reapply filters (will show all products)
    applyFilters();
    
    showNotification('Filters cleared');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Animation for notification
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
}
.animate-fade-in-out {
    animation: fadeInOut 2.1s ease-in-out forwards;
}
`;
document.head.appendChild(style);
