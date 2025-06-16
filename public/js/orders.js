// ==========================================
// ORDERS - GERENCIAMENTO DE PEDIDOS
// ==========================================

class OrderManager {
    constructor() {
        this.orders = [];
        this.filteredOrders = [];
        this.selectedPizzas = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal de pedido
        const orderForm = document.getElementById('orderModalForm');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => this.handleOrderSubmit(e));
        }

        // Filtro de status
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterOrders());
        }
    }

    async loadOrders() {
        try {
            showLoading(true);
            this.orders = await api.getAllOrders();
            this.filteredOrders = [...this.orders];
            this.renderOrders();
        } catch (error) {
            showNotification('Erro ao carregar pedidos', 'error');
            console.error('Erro ao carregar pedidos:', error);
        } finally {
            showLoading(false);
        }
    }

    async loadUserOrders(userId) {
        try {
            showLoading(true);
            this.orders = await api.getOrdersByUser(userId);
            this.filteredOrders = [...this.orders];
            this.renderOrders();
        } catch (error) {
            showNotification('Erro ao carregar seus pedidos', 'error');
            console.error('Erro ao carregar pedidos do usuário:', error);
        } finally {
            showLoading(false);
        }
    }

    renderOrders() {
        const container = document.getElementById('ordersList');
        if (!container) return;

        if (this.filteredOrders.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #7F8C8D;">
                    <i class="fas fa-shopping-cart" style="font-size: 3em; margin-bottom: 15px; display: block;"></i>
                    <p>Nenhum pedido encontrado</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredOrders.map(order => this.createOrderCard(order)).join('');
    }

    createOrderCard(order) {
        const isAdmin = auth.isAdmin();
        const currentUser = auth.getCurrentUser();
        const canManage = isAdmin || order.user._id === currentUser._id;
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Pedido #${order._id.slice(-6)}</div>
                        <div class="order-date">${formatDate(order.createdAt)}</div>
                        <div style="margin-top: 5px;">Cliente: ${order.user.name}</div>
                    </div>
                    <div style="text-align: right;">
                        ${this.createStatusBadge(order.status)}
                        <div style="margin-top: 10px;">
                            ${formatPrice(order.totalPrice)}
                        </div>
                    </div>
                </div>
                
                <div class="order-pizzas">
                    <strong>Pizzas:</strong>
                    ${order.pizzas.map(item => `
                        <div class="order-pizza-item">
                            <span>${item.pizza.name}</span>
                            <span>Qtd: ${item.quantity} | ${formatPrice(item.pizza.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-address">
                    <strong>Endereço:</strong><br>
                    ${order.address.street}, ${order.address.number}
                    ${order.address.complement ? `, ${order.address.complement}` : ''}<br>
                    ${order.address.neighborhood} - ${order.address.city}<br>
                    CEP: ${formatCEP(order.address.zipCode)}
                </div>
                
                <div style="margin-top: 15px;">
                    <strong>Pagamento:</strong> ${order.paymentMethod}
                    ${order.observations ? `<br><strong>Observações:</strong> ${order.observations}` : ''}
                </div>
                
                ${isAdmin ? `
                    <div class="item-actions" style="margin-top: 20px; justify-content: flex-start;">
                        <select onchange="orderManager.updateOrderStatus('${order._id}', this.value)" style="margin-right: 10px;">
                            <option value="">Alterar Status</option>
                            ${CONFIG.ORDER_STATUS.map(status => `
                                <option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>
                            `).join('')}
                        </select>
                        <button class="btn btn-danger btn-sm" onclick="orderManager.deleteOrder('${order._id}')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    createStatusBadge(status) {
        const badgeClass = status.toLowerCase().replace(/\s+/g, '-');
        return `<span class="status-badge ${badgeClass}">${status}</span>`;
    }

    async showOrderModal() {
        // Carregar pizzas disponíveis
        if (!window.pizzaManager || window.pizzaManager.getPizzas().length === 0) {
            await window.pizzaManager.loadPizzas();
        }
        
        this.selectedPizzas = {};
        this.renderOrderPizzasList();
        this.updateOrderTotal();
        
        showModal('orderModal');
    }

    renderOrderPizzasList() {
        const container = document.getElementById('orderPizzasList');
        if (!container) return;
        
        const pizzas = window.pizzaManager.getPizzas();
        
        container.innerHTML = pizzas.map(pizza => `
            <div class="order-pizza-selector" data-pizza-id="${pizza._id}">
                <div class="pizza-selector-header">
                    <div>
                        <strong>${pizza.name}</strong> - ${formatPrice(pizza.price)}
                        <div style="font-size: 0.9em; color: #7F8C8D;">${pizza.ingredients.join(', ')}</div>
                    </div>
                    <div class="quantity-controls">
                        <button type="button" class="quantity-btn" onclick="orderManager.adjustPizzaQuantity('${pizza._id}', -1)">-</button>
                        <input type="number" class="quantity-input" id="qty-${pizza._id}" value="0" min="0" readonly>
                        <button type="button" class="quantity-btn" onclick="orderManager.adjustPizzaQuantity('${pizza._id}', 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    adjustPizzaQuantity(pizzaId, change) {
        const currentQty = this.selectedPizzas[pizzaId] || 0;
        const newQty = Math.max(0, currentQty + change);
        
        if (newQty === 0) {
            delete this.selectedPizzas[pizzaId];
        } else {
            this.selectedPizzas[pizzaId] = newQty;
        }
        
        // Atualizar input
        const input = document.getElementById(`qty-${pizzaId}`);
        if (input) input.value = newQty;
        
        // Atualizar visual do seletor
        const selector = document.querySelector(`[data-pizza-id="${pizzaId}"]`);
        if (selector) {
            if (newQty > 0) {
                selector.classList.add('selected');
            } else {
                selector.classList.remove('selected');
            }
        }
        
        this.updateOrderTotal();
    }

    updateOrderTotal() {
        const pizzas = window.pizzaManager.getPizzas();
        let total = 0;
        
        Object.keys(this.selectedPizzas).forEach(pizzaId => {
            const pizza = pizzas.find(p => p._id === pizzaId);
            if (pizza) {
                total += pizza.price * this.selectedPizzas[pizzaId];
            }
        });
        
        const totalElement = document.getElementById('orderTotal');
        if (totalElement) {
            totalElement.textContent = total.toFixed(2);
        }
    }

    async handleOrderSubmit(event) {
        event.preventDefault();
        
        // Validar pizzas selecionadas
        if (Object.keys(this.selectedPizzas).length === 0) {
            showNotification('Selecione pelo menos uma pizza', 'error');
            return;
        }
        
        // Coletar dados do endereço
        const street = document.getElementById('orderStreet').value.trim();
        const number = document.getElementById('orderNumber').value.trim();
        const complement = document.getElementById('orderComplement').value.trim();
        const neighborhood = document.getElementById('orderNeighborhood').value.trim();
        const city = document.getElementById('orderCity').value.trim();
        const zipCode = document.getElementById('orderZipCode').value.replace(/\D/g, '');
        const paymentMethod = document.getElementById('orderPayment').value;
        const observations = document.getElementById('orderObservations').value.trim();
        
        // Validações
        if (!street || !number || !neighborhood || !city || !zipCode || !paymentMethod) {
            showNotification('Preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        if (zipCode.length !== 8) {
            showNotification('CEP deve ter 8 dígitos', 'error');
            return;
        }
        
        // Preparar dados do pedido
        const pizzas = Object.keys(this.selectedPizzas).map(pizzaId => ({
            pizza: pizzaId,
            quantity: this.selectedPizzas[pizzaId]
        }));
        
        const orderData = {
            user: auth.getCurrentUser()._id,
            pizzas,
            address: {
                street,
                number,
                complement,
                neighborhood,
                city,
                zipCode
            },
            paymentMethod,
            observations
        };
        
        try {
            showLoading(true);
            await api.createOrder(orderData);
            showNotification('Pedido criado com sucesso!', 'success');
            closeModal();
            
            // Recarregar pedidos
            const user = auth.getCurrentUser();
            if (user.role === 'admin') {
                await this.loadOrders();
            } else {
                await this.loadUserOrders(user._id);
            }
            
        } catch (error) {
            showNotification(error.message || 'Erro ao criar pedido', 'error');
        } finally {
            showLoading(false);
        }
    }

    async updateOrderStatus(orderId, newStatus) {
        if (!newStatus) return;
        
        try {
            await api.updateOrderStatus(orderId, newStatus);
            showNotification('Status atualizado com sucesso!', 'success');
            await this.loadOrders();
        } catch (error) {
            showNotification(error.message || 'Erro ao atualizar status', 'error');
        }
    }

    async deleteOrder(orderId) {
        if (!confirm('Tem certeza que deseja excluir este pedido?')) {
            return;
        }
        
        try {
            showLoading(true);
            await api.deleteOrder(orderId);
            showNotification('Pedido excluído com sucesso!', 'success');
            await this.loadOrders();
        } catch (error) {
            showNotification(error.message || 'Erro ao excluir pedido', 'error');
        } finally {
            showLoading(false);
        }
    }

    filterOrders() {
        const statusFilter = document.getElementById('statusFilter');
        const selectedStatus = statusFilter ? statusFilter.value : '';
        
        if (selectedStatus) {
            this.filteredOrders = this.orders.filter(order => order.status === selectedStatus);
        } else {
            this.filteredOrders = [...this.orders];
        }
        
        this.renderOrders();
    }

    // Método para obter pedidos (usado por outros módulos)
    getOrders() {
        return this.orders;
    }
}

// Função global para mostrar modal de pedido
function showOrderModal() {
    if (window.orderManager) {
        window.orderManager.showOrderModal();
    }
}

// Instância global
window.orderManager = new OrderManager();