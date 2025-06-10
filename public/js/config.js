// ==========================================
// CONFIG - CONFIGURAÇÕES GLOBAIS (INTEGRADO)
// ==========================================

const CONFIG = {
    // URL da API (integrado no mesmo servidor)
    API_BASE_URL: '/api',  // MUDANÇA: sem http://localhost:3000
    
    // Endpoints da API
    ENDPOINTS: {
        // Auth
        REGISTER: '/users/register',
        LOGIN: '/users/login',
        PROFILE: '/users/profile',
        
        // Users
        USERS: '/users',
        
        // Pizzas
        PIZZAS: '/pizzas',
        
        // Orders
        ORDERS: '/orders',
        ORDER_STATUS: '/orders/{id}/status',
        ORDERS_BY_USER: '/orders/user/{userId}',
        
        // Deliveries
        DELIVERIES: '/deliveries',
        DELIVERY_STATUS: '/deliveries/{id}/status',
        DELIVERY_BY_ORDER: '/deliveries/order/{orderId}'
    },
    
    // Chaves para localStorage
    STORAGE_KEYS: {
        TOKEN: 'pizzaria_token',
        USER: 'pizzaria_user'
    },
    
    // Categorias de pizza
    PIZZA_CATEGORIES: ['Tradicional', 'Premium', 'Doce'],
    
    // Status de pedidos
    ORDER_STATUS: [
        'Pendente',
        'Em preparo', 
        'Em entrega',
        'Entregue',
        'Cancelado'
    ],
    
    // Status de entregas
    DELIVERY_STATUS: [
        'Em preparo',
        'Em rota',
        'Entregue', 
        'Cancelado'
    ],
    
    // Formas de pagamento
    PAYMENT_METHODS: [
        'Dinheiro',
        'Cartão de crédito',
        'Cartão de débito',
        'PIX'
    ],
    
    // Configurações de UI
    UI: {
        NOTIFICATION_DURATION: 5000, // 5 segundos
        MODAL_ANIMATION_DURATION: 300, // 0.3 segundos
        LOADING_MIN_DURATION: 500 // 0.5 segundos mínimo
    },
    
    // Validações
    VALIDATION: {
        PASSWORD_MIN_LENGTH: 6,
        PHONE_PATTERN: /^[\d\s\(\)\-]{10,15}$/,  // Aceita números, espaços, parênteses e hífen
        CEP_PATTERN: /^\d{5}\-?\d{3}$/,          // Aceita CEP com ou sem hífen
        EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
};

// Função para construir URL completa
function buildApiUrl(endpoint, params = {}) {
    let url = CONFIG.API_BASE_URL + endpoint;
    
    // Substituir parâmetros na URL (ex: {id} por valor real)
    Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key]);
    });
    
    return url;
}

// Função para obter token do localStorage
function getToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
}

// Função para obter usuário do localStorage
function getUser() {
    const userStr = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
}

// Função para salvar dados de autenticação
function saveAuthData(token, user) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
}

// Função para limpar dados de autenticação
function clearAuthData() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
}

// Função para verificar se usuário está logado
function isAuthenticated() {
    return !!getToken();
}

// Função para verificar se usuário é admin
function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}

// Função para formatar preço
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Função para formatar telefone
function formatPhone(phone) {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
}

// Função para formatar CEP
function formatCEP(cep) {
    if (!cep) return '';
    
    const cleaned = cep.replace(/\D/g, '');
    
    if (cleaned.length === 8) {
        return `${cleaned.slice(0,5)}-${cleaned.slice(5)}`;
    }
    
    return cep;
}

// Função para capitalizar primeira letra
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Função para gerar ID único simples
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Função para debounce (evitar muitas chamadas)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}