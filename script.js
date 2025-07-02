// DOM Elements
const scrollTopBtn = document.getElementById('scrollTopBtn');
const navbar = document.querySelector('.navbar');
const heroSlides = document.querySelectorAll('.hero-slide');
const categoryCards = document.querySelectorAll('.category-card');
const productCards = document.querySelectorAll('.product-card');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCountdown();
    initializeScrollEffects();
    initializeAnimations();
    initializeForms();
    initializeNavigation();
    if (document.querySelector('.filter-btn')) {
        initProductFiltering();
    }
    initLanguageSwitcher();
});

// Countdown Timer
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    // Set countdown to 24 hours from now
    const countdownDate = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(timer);
            countdownElement.innerHTML = "انتهى العرض";
        }
    }, 1000);
}

// Scroll Effects
function initializeScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            scrollTopBtn.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Intersection Observer for Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe category cards
    categoryCards.forEach(card => {
        observer.observe(card);
    });
    
    // Observe product cards
    productCards.forEach(card => {
        observer.observe(card);
    });
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Form Handling
function initializeForms() {
    // Request from China form
    const requestForm = document.querySelector('.request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const url = this.querySelector('input[type="url"]').value;
            const name = this.querySelector('input[type="text"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const notes = this.querySelector('textarea').value;
            
            if (url && name && phone) {
                showNotification('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.', 'success');
                this.reset();
            } else {
                showNotification('يرجى ملء جميع الحقول المطلوبة.', 'error');
            }
        });
    }
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (name && email && message) {
                showNotification('تم إرسال رسالتك بنجاح! سنرد عليك قريباً.', 'success');
                this.reset();
            } else {
                showNotification('يرجى ملء جميع الحقول.', 'error');
            }
        });
    }
}

// Navigation
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Close mobile menu when link is clicked
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
}

// Product Card Interactions
function initializeProductCards() {
    const addToCartButtons = document.querySelectorAll('.product-card .btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add animation effect
            this.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة';
            this.classList.add('btn-success');
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = 'أضف للسلة';
                this.classList.remove('btn-success');
                this.disabled = false;
            }, 2000);
            
            showNotification('تمت إضافة المنتج إلى السلة!', 'success');
        });
    });
}

// Category Card Interactions
function initializeCategoryCards() {
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h5').textContent;
            showNotification(`عرض منتجات ${categoryName}`, 'info');
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-triangle';
        case 'warning': return 'exclamation-circle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                showNotification(`البحث عن: ${searchTerm}`, 'info');
                // Here you would typically send the search query to your backend
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-right: 10px;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .navbar.scrolled {
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px);
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProductCards();
    initializeCategoryCards();
    initializeSearch();
});

// Hero Slider (if multiple slides are added)
function initializeHeroSlider() {
    if (heroSlides.length > 1) {
        let currentSlide = 0;
        
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 5000);
    }
}

// Initialize hero slider
initializeHeroSlider();

// Product Filtering and Sorting
function initProductFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.querySelector('.form-select');
    const productItems = document.querySelectorAll('.product-item');
    const productsGrid = document.querySelector('.row.g-4');
    
    if (!filterButtons.length || !productItems.length) return;
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            filterProducts(filterValue);
            
            // Update product count
            updateProductCount();
        });
    });
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            sortProducts(sortValue);
        });
    }
    
    function filterProducts(category) {
        productItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                item.classList.add('animate-in');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-in');
            }
        });
    }
    
    function sortProducts(sortType) {
        const visibleItems = Array.from(productItems).filter(item => 
            item.style.display !== 'none'
        );
        
        visibleItems.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            
            switch(sortType) {
                case 'السعر: من الأقل للأعلى':
                    return priceA - priceB;
                case 'السعر: من الأعلى للأقل':
                    return priceB - priceA;
                case 'الأعلى تقييماً':
                    // You can add rating logic here
                    return 0;
                case 'الأكثر مبيعاً':
                    // You can add sales logic here
                    return 0;
                default: // الأحدث
                    return 0;
            }
        });
        
        // Reorder DOM elements
        visibleItems.forEach(item => {
            productsGrid.appendChild(item);
        });
    }
    
    function updateProductCount() {
        const visibleItems = Array.from(productItems).filter(item => 
            item.style.display !== 'none'
        );
        
        const countElement = document.querySelector('.count-number');
        if (countElement) {
            countElement.textContent = visibleItems.length;
        }
    }
}

// Initialize product filtering when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (document.querySelector('.filter-btn')) {
            initProductFiltering();
        }
        initLanguageSwitcher();
    });
} else {
    if (document.querySelector('.filter-btn')) {
        initProductFiltering();
    }
    initLanguageSwitcher();
}

// Translation Data
const translations = {
    ar: {
        // Navigation
        'brand_name': 'متجر سوريا',
        'search_placeholder': 'البحث عن المنتجات...',
        'home': 'الرئيسية',
        'categories': 'الفئات',
        'about': 'حولنا',
        'contact': 'اتصل بنا',
        'offers': 'العروض',
        'request': 'طلب من الصين',
        'arabic': 'العربية',
        'english': 'English',
        'language': 'العربية',
        
        // Main content
        'hero_title': 'منتجات صينية في متناول يدك',
        'hero_subtitle': 'أقل الأسعار - شحن سريع - موثوق 100%',
        'start_shopping': 'ابدأ التسوق',
        'categories_title': 'الفئات الرئيسية',
        'shop_now': 'تسوق الآن',
        'electronics_description': 'هواتف، لابتوب، اكسسوارات',
        'toys_description': 'ألعاب تعليمية، ألعاب أطفال',
        'home_and_kitchen': 'المنزل والمطبخ',
        'home_and_kitchen_description': 'أدوات منزلية ومطبخية',
        'beauty_and_care': 'الجمال والعناية',
        'beauty_and_care_description': 'مستحضرات تجميل وعناية',
        'bags_and_accessories': 'الحقائب والاكسسوارات',
        'bags_and_accessories_description': 'حقائب وإكسسوارات أنيقة',
        'best_selling': 'الأكثر مبيعاً في سوريا',
        'best_selling_description': 'المنتجات الرائجة',
        'offers_title': 'عروض اليوم',
        'countdown_timer': 'العرض ينتهي خلال: ',
        'product_name': 'سماعات لاسلكية',
        'add_to_cart': 'أضف للسلة',
        
        // Request section
        'request_title': 'اطلب منتجك من الصين',
        'request_subtitle': 'الصق رابط المنتج من AliExpress، Temu، أو 1688 وسنحضره لك',
        'product_link': 'رابط المنتج',
        'product_link_placeholder': 'الصق هنا رابط المنتج من AliExpress أو Temu أو 1688',
        'full_name': 'الاسم الكامل',
        'phone_number': 'رقم الهاتف',
        'additional_notes': 'ملاحظات إضافية',
        'send_request': 'إرسال الطلب',
        
        // Reviews section
        'reviews_title': 'آراء العملاء',
        'review_1': '"استلمت خلال 5 أيام، جودة ممتازة! 🔥"',
        'reviewer_1': 'طارق ديراني',
        'city_1': '- دمشق',
        
        // FAQ section
        'faq_title': 'الأسئلة الشائعة',
        'faq_question_1': 'كيف أقوم بالطلب؟',
        'faq_answer_1': 'يمكنك التسوق مباشرة من الموقع أو استخدام خدمة "اطلب من الصين" بلصق رابط المنتج.',
        
        // Contact section
        'contact_title': 'تواصل معنا',
        'working_hours': 'ساعات العمل: 9:00 - 18:00',
        'name_placeholder': 'الاسم',
        'email_placeholder': 'البريد الإلكتروني',
        'message_placeholder': 'الرسالة',
        'send_message': 'إرسال الرسالة',
        
        // Footer
        'footer_description': 'أفضل المنتجات الصينية بأسعار منافسة وتوصيل سريع إلى سوريا',
        'free_shipping': 'شحن مجاني',
        'free_shipping_desc': 'لجميع الطلبات فوق 5000 ل.س',
        'fast_delivery': 'توصيل سريع',
        'fast_delivery_desc': 'من 2-5 أيام عمل',
        'secure_payment': 'دفع آمن',
        'secure_payment_desc': 'حماية 100% لبياناتك',
        'customer_support': 'دعم العملاء',
        'customer_support_desc': '24/7 خدمة عملاء',
        
        // Categories
        'featured_categories': 'الفئات المميزة',
        'electronics': 'الإلكترونيات',
        'toys': 'الألعاب',
        'home_kitchen': 'المنزل والمطبخ',
        'beauty': 'الجمال والعناية',
        'bags': 'الحقائب والإكسسوارات',
        'best_sellers': 'الأكثر مبيعاً',
        
        // Products
        'featured_products': 'المنتجات المميزة',
        'add_to_cart': 'أضف للسلة',
        'quick_view': 'عرض سريع',
        'sale': 'تخفيض',
        'new': 'جديد',
        
        // Footer
        'about_us': 'حولنا',
        'customer_service': 'خدمة العملاء',
        'follow_us': 'تابعنا',
        'newsletter': 'النشرة الإخبارية',
        'newsletter_desc': 'اشترك لتحصل على أحدث العروض والمنتجات',
        'subscribe': 'اشتراك',
        'enter_email': 'أدخل بريدك الإلكتروني',
        
        // Notifications
        'lang_changed': 'تم تغيير اللغة إلى العربية'
    },
    en: {
        // Navigation
        'brand_name': 'Syria Store',
        'search_placeholder': 'Search for products...',
        'home': 'Home',
        'categories': 'Categories',
        'about': 'About',
        'contact': 'Contact',
        'offers': 'Offers',
        'request': 'Order from China',
        'arabic': 'العربية',
        'english': 'English',
        'language': 'English',
        
        // Main content
        'hero_title': 'Chinese Products at Your Fingertips',
        'hero_subtitle': 'Lowest Prices - Fast Shipping - 100% Trusted',
        'start_shopping': 'Start Shopping',
        'categories_title': 'Main Categories',
        'shop_now': 'Shop Now',
        'electronics_description': 'Phones, laptops, accessories',
        'toys_description': 'Educational toys, children\'s toys',
        'home_and_kitchen': 'Home & Kitchen',
        'home_and_kitchen_description': 'Home and kitchen tools',
        'beauty_and_care': 'Beauty & Care',
        'beauty_and_care_description': 'Beauty and care products',
        'bags_and_accessories': 'Bags & Accessories',
        'bags_and_accessories_description': 'Elegant bags and accessories',
        'best_selling': 'Best Selling in Syria',
        'best_selling_description': 'Trending products',
        'offers_title': 'Today\'s Offers',
        'countdown_timer': 'Offer ends in: ',
        'product_name': 'Wireless Headphones',
        'add_to_cart': 'Add to Cart',
        
        // Request section
        'request_title': 'Order Your Product from China',
        'request_subtitle': 'Paste product link from AliExpress, Temu, or 1688 and we\'ll get it for you',
        'product_link': 'Product Link',
        'product_link_placeholder': 'Paste product link from AliExpress, Temu or 1688 here',
        'full_name': 'Full Name',
        'phone_number': 'Phone Number',
        'additional_notes': 'Additional Notes',
        'send_request': 'Send Request',
        
        // Reviews section
        'reviews_title': 'Customer Reviews',
        'review_1': '"Received in 5 days, excellent quality! 🔥"',
        'reviewer_1': 'Tareq Derani',
        'city_1': '- Damascus',
        
        // FAQ section
        'faq_title': 'Frequently Asked Questions',
        'faq_question_1': 'How do I place an order?',
        'faq_answer_1': 'You can shop directly from the website or use the "Order from China" service by pasting the product link.',
        
        // Contact section
        'contact_title': 'Contact Us',
        'working_hours': 'Working Hours: 9:00 - 18:00',
        'name_placeholder': 'Name',
        'email_placeholder': 'Email',
        'message_placeholder': 'Message',
        'send_message': 'Send Message',
        
        // Footer
        'footer_description': 'Best Chinese products with competitive prices and fast delivery to Syria',
        'free_shipping': 'Free Shipping',
        'free_shipping_desc': 'On orders over 5000 SYP',
        'fast_delivery': 'Fast Delivery',
        'fast_delivery_desc': '2-5 business days',
        'secure_payment': 'Secure Payment',
        'secure_payment_desc': '100% data protection',
        'customer_support': 'Customer Support',
        'customer_support_desc': '24/7 customer service',
        
        // Categories
        'featured_categories': 'Featured Categories',
        'electronics': 'Electronics',
        'toys': 'Toys',
        'home_kitchen': 'Home & Kitchen',
        'beauty': 'Beauty & Care',
        'bags': 'Bags & Accessories',
        'best_sellers': 'Best Sellers',
        
        // Products
        'featured_products': 'Featured Products',
        'add_to_cart': 'Add to Cart',
        'quick_view': 'Quick View',
        'sale': 'Sale',
        'new': 'New',
        
        // Footer
        'about_us': 'About Us',
        'customer_service': 'Customer Service',
        'follow_us': 'Follow Us',
        'newsletter': 'Newsletter',
        'newsletter_desc': 'Subscribe to get the latest offers and products',
        'subscribe': 'Subscribe',
        'enter_email': 'Enter your email',
        
        // Notifications
        'lang_changed': 'Language changed to English'
    }
};

// Language Switcher Functionality
function initLanguageSwitcher() {
    const languageItems = document.querySelectorAll('.dropdown-item[data-lang]');
    const languageButton = document.querySelector('.language-switcher');
    
    if (!languageItems.length || !languageButton) return;
    
    languageItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const selectedLang = this.dataset.lang;
            const selectedText = this.textContent.trim();
            
            // Remove active class from all items
            languageItems.forEach(lang => {
                lang.classList.remove('active');
                const icon = lang.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-globe me-2';
                }
            });
            
            // Add active class to selected item
            this.classList.add('active');
            const activeIcon = this.querySelector('i');
            if (activeIcon) {
                activeIcon.className = 'fas fa-check me-2';
            }
            
            // Update button text
            const buttonText = languageButton.querySelector('.d-none');
            if (buttonText) {
                buttonText.textContent = selectedText;
            }
            
            // Store language preference
            localStorage.setItem('selectedLanguage', selectedLang);
            
            // Apply language changes
            applyLanguage(selectedLang);
            
            // Show notification for language change
            showNotification(getTranslation('lang_changed', selectedLang), 'success');
        });
    });
    
    // Load saved language preference on page load
    const savedLang = localStorage.getItem('selectedLanguage') || 'ar';
    const savedLangItem = document.querySelector(`[data-lang="${savedLang}"]`);
    if (savedLangItem && savedLang !== 'ar') {
        // Apply language without notification on initial load
        applyLanguage(savedLang);
        savedLangItem.classList.add('active');
        const activeIcon = savedLangItem.querySelector('i');
        if (activeIcon) {
            activeIcon.className = 'fas fa-check me-2';
        }
        const buttonText = languageButton.querySelector('.d-none');
        if (buttonText) {
            buttonText.textContent = savedLangItem.textContent.trim();
        }
    }
}

// Translate content based on language
function translateContent(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key, lang);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = getTranslation(key, lang);
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // Update search placeholder
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.placeholder = getTranslation('search_placeholder', lang);
    }
}

// Apply language changes to the page
function applyLanguage(lang) {
    // Change document direction and language
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '') + ` ${lang === 'ar' ? 'rtl' : 'ltr'}`;
    
    translateContent(lang);
    
    // Toggle layout classes
    document.body.classList.toggle('english-layout', lang === 'en');
}

// Get translation helper function
function getTranslation(key, lang) {
    return translations[lang] && translations[lang][key] ? translations[lang][key] : translations['ar'][key] || key;
}

// Simple notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 250px;';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
