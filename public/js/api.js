// ==========================================
// API - COMUNICAÇÃO COM O BACKEND EXISTENTE
// ==========================================

// Verificar se CONFIG está disponível
if (typeof CONFIG === 'undefined') {
    console.error('❌ CONFIG não está definido! Verifique se config.js foi carregado.');
}

class API {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        console.log('✅ API inicializada com baseURL:', this.baseURL);
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = this.baseURL + endpoint;
        const token = getToken();
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Erro ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ==========================================
    // AUTENTICAÇÃO
    // ==========================================
    
    async register(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: userData
        });
    }

    async login(email, password) {
        return this.request('/users/login', {
            method: 'POST',
            body: { email, password }
        });
    }

    async getProfile(userId = null) {
        const endpoint = userId ? `/users/profile?userId=${userId}` : '/users/profile';
        return this.request(endpoint);
    }

    // ==========================================
    // USUÁRIOS
    // ==========================================
    
    async getAllUsers() {
        return this.request('/users');
    }

    async getUser(userId) {
        return this.request(`/users/${userId}`);
    }

    async updateUser(userId, userData) {
        return this.request(`/users/${userId}`, {
            method: 'PUT',
            body: userData
        });
    }

    async deleteUser(userId) {
        return this.request(`/users/${userId}`, {
            method: 'DELETE'
        });
    }

    // ==========================================
    // PIZZAS
    // ==========================================
    
    async getAllPizzas(category = null) {
        const endpoint = category ? `/pizzas?category=${category}` : '/pizzas';
        return this.request(endpoint);
    }

    async getPizza(pizzaId) {
        return this.request(`/pizzas/${pizzaId}`);
    }

    async createPizza(pizzaData) {
        return this.request('/pizzas', {
            method: 'POST',
            body: pizzaData
        });
    }

    async updatePizza(pizzaId, pizzaData) {
        return this.request(`/pizzas/${pizzaId}`, {
            method: 'PUT',
            body: pizzaData
        });
    }

    async deletePizza(pizzaId) {
        return this.request(`/pizzas/${pizzaId}`, {
            method: 'DELETE'
        });
    }

    // ==========================================
    // PEDIDOS
    // ==========================================
    
    async getAllOrders() {
        return this.request('/orders');
    }

    async getOrder(orderId) {
        return this.request(`/orders/${orderId}`);
    }

    async getOrdersByUser(userId) {
        return this.request(`/orders/user/${userId}`);
    }

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: orderData
        });
    }

    async updateOrder(orderId, orderData) {
        return this.request(`/orders/${orderId}`, {
            method: 'PUT',
            body: orderData
        });
    }

    async updateOrderStatus(orderId, status) {
        return this.request(`/orders/${orderId}/status`, {
            method: 'PATCH',
            body: { status }
        });
    }

    async deleteOrder(orderId) {
        return this.request(`/orders/${orderId}`, {
            method: 'DELETE'
        });
    }

    // ==========================================
    // ENTREGAS
    // ==========================================
    
    async getAllDeliveries() {
        return this.request('/deliveries');
    }

    async getDelivery(deliveryId) {
        return this.request(`/deliveries/${deliveryId}`);
    }

    async getDeliveryByOrder(orderId) {
        return this.request(`/deliveries/order/${orderId}`);
    }

    async createDelivery(deliveryData) {
        return this.request('/deliveries', {
            method: 'POST',
            body: deliveryData
        });
    }

    async updateDelivery(deliveryId, deliveryData) {
        return this.request(`/deliveries/${deliveryId}`, {
            method: 'PUT',
            body: deliveryData
        });
    }

    async updateDeliveryStatus(deliveryId, status) {
        return this.request(`/deliveries/${deliveryId}/status`, {
            method: 'PATCH',
            body: { status }
        });
    }

    async deleteDelivery(deliveryId) {
        return this.request(`/deliveries/${deliveryId}`, {
            method: 'DELETE'
        });
    }
}

// Instância global da API
const api = new API();

// Verificação para debug
console.log('✅ Instância global "api" criada:', typeof api);

// Disponibilizar globalmente para debug
window.api = api;