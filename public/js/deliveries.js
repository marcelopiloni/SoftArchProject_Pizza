// ==========================================
// DELIVERIES - GERENCIAMENTO DE ENTREGAS
// ==========================================

class DeliveryManager {
    constructor() {
        this.deliveries = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal de entrega
        const deliveryForm = document.getElementById('deliveryModalForm');
        if (deliveryForm) {
            deliveryForm.addEventListener('submit', (e) => this.handleDeliverySubmit(e));
        }
    }

    async loadDeliveries() {
        try {
            showLoading(true);
            this.deliveries = await api.getAllDeliveries();
            this.renderDeliveries();
        } catch (error) {
            showNotification('Erro ao carregar entregas', 'error');
            console.error('Erro ao carregar entregas:', error);
        } finally {
            showLoading(false);
        }
    }

    renderDeliveries() {
        const container = document.getElementById('deliveriesList');
        if (!container) return;

        if (this.deliveries.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #7F8C8D;">
                    <i class="fas fa-truck" style="font-size: 3em; margin-bottom: 15px; display: block;"></i>
                    <p>Nenhuma entrega encontrada</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.deliveries.map(delivery => this.createDeliveryCard(delivery)).join('');
    }

    createDeliveryCard(delivery) {
        const isAdmin = auth.isAdmin();
        
        return `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">Entrega #${delivery._id.slice(-6)}</div>
                        <div style="color: #7F8C8D; font-size: 0.9em;">
                            Pedido #${delivery.order._id.slice(-6)}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        ${this.createStatusBadge(delivery.status)}
                    </div>
                </div>
                
                <div style="margin: 15px 0;">
                    <div><strong>Entregador:</strong> ${delivery.deliveryPerson}</div>
                    <div><strong>Tempo Estimado:</strong> ${delivery.estimatedTime} minutos</div>
                    <div><strong>Início:</strong> ${formatDate(delivery.startTime)}</div>
                    ${delivery.endTime ? `<div><strong>Fim:</strong> ${formatDate(delivery.endTime)}</div>` : ''}
                </div>
                
                <div style="background: rgba(244, 208, 63, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <strong>Cliente:</strong> ${delivery.order.user.name}<br>
                    <strong>Telefone:</strong> ${formatPhone(delivery.order.user.phone)}<br>
                    <strong>Endereço:</strong> ${delivery.order.address.street}, ${delivery.order.address.number}
                    ${delivery.order.address.complement ? `, ${delivery.order.address.complement}` : ''}<br>
                    ${delivery.order.address.neighborhood} - ${delivery.order.address.city}
                </div>
                
                <div style="margin: 15px 0;">
                    <strong>Pizzas do Pedido:</strong>
                    ${delivery.order.pizzas.map(item => `
                        <div style="margin: 5px 0; padding: 5px 0; border-bottom: 1px solid #ecf0f1;">
                            ${item.pizza.name} (${item.quantity}x) - ${formatPrice(item.pizza.price * item.quantity)}
                        </div>
                    `).join('')}
                    <div style="font-weight: bold; margin-top: 10px;">
                        Total: ${formatPrice(delivery.order.totalPrice)}
                    </div>
                </div>
                
                ${delivery.notes ? `
                    <div style="margin: 15px 0;">
                        <strong>Observações:</strong> ${delivery.notes}
                    </div>
                ` : ''}
                
                ${isAdmin ? `
                    <div class="item-actions" style="margin-top: 20px; justify-content: flex-start;">
                        <select onchange="deliveryManager.updateDeliveryStatus('${delivery._id}', this.value)" style="margin-right: 10px;">
                            <option value="">Alterar Status</option>
                            ${CONFIG.DELIVERY_STATUS.map(status => `
                                <option value="${status}" ${delivery.status === status ? 'selected' : ''}>${status}</option>
                            `).join('')}
                        </select>
                        <button class="btn btn-warning btn-sm" onclick="deliveryManager.editDelivery('${delivery._id}')" style="margin-right: 10px;">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deliveryManager.deleteDelivery('${delivery._id}')">
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

    async showDeliveryModal() {
        // Carregar pedidos disponíveis para entrega
        await this.loadAvailableOrders();
        showModal('deliveryModal');
    }

    async loadAvailableOrders() {
        try {
            // Carregar todos os pedidos
            const orders = await api.getAllOrders();
            
            // Filtrar pedidos que estão "Em preparo" e ainda não têm entrega
            const availableOrders = orders.filter(order => 
                order.status === 'Em preparo' || order.status === 'Pendente'
            );
            
            const select = document.getElementById('deliveryOrder');
            if (select) {
                select.innerHTML = '<option value="">Selecione um pedido</option>' +
                    availableOrders.map(order => `
                        <option value="${order._id}">
                            Pedido #${order._id.slice(-6)} - ${order.user.name} - ${formatPrice(order.totalPrice)}
                        </option>
                    `).join('');
            }
        } catch (error) {
            showNotification('Erro ao carregar pedidos disponíveis', 'error');
        }
    }

    async handleDeliverySubmit(event) {
        event.preventDefault();
        
        const orderId = document.getElementById('deliveryOrder').value;
        const deliveryPerson = document.getElementById('deliveryPerson').value.trim();
        const estimatedTime = parseInt(document.getElementById('deliveryTime').value);
        const notes = document.getElementById('deliveryNotes').value.trim();
        
        // Validações
        if (!orderId || !deliveryPerson || !estimatedTime) {
            showNotification('Preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        if (estimatedTime <= 0) {
            showNotification('Tempo estimado deve ser maior que zero', 'error');
            return;
        }
        
        const deliveryData = {
            order: orderId,
            deliveryPerson,
            estimatedTime,
            notes
        };
        
        try {
            showLoading(true);
            await api.createDelivery(deliveryData);
            showNotification('Entrega criada com sucesso!', 'success');
            closeModal();
            await this.loadDeliveries();
        } catch (error) {
            showNotification(error.message || 'Erro ao criar entrega', 'error');
        } finally {
            showLoading(false);
        }
    }

    async updateDeliveryStatus(deliveryId, newStatus) {
        if (!newStatus) return;
        
        try {
            await api.updateDeliveryStatus(deliveryId, newStatus);
            showNotification('Status da entrega atualizado!', 'success');
            await this.loadDeliveries();
        } catch (error) {
            showNotification(error.message || 'Erro ao atualizar status', 'error');
        }
    }

    editDelivery(deliveryId) {
        const delivery = this.deliveries.find(d => d._id === deliveryId);
        if (!delivery) return;
        
        // Preencher formulário com dados da entrega
        document.getElementById('deliveryPerson').value = delivery.deliveryPerson;
        document.getElementById('deliveryTime').value = delivery.estimatedTime;
        document.getElementById('deliveryNotes').value = delivery.notes || '';
        
        // Não permitir alterar o pedido
        const orderSelect = document.getElementById('deliveryOrder');
        if (orderSelect) {
            orderSelect.innerHTML = `<option value="${delivery.order._id}" selected>
                Pedido #${delivery.order._id.slice(-6)} - ${delivery.order.user.name}
            </option>`;
            orderSelect.disabled = true;
        }
        
        // Alterar o submit para update
        const form = document.getElementById('deliveryModalForm');
        if (form) {
            form.onsubmit = (e) => this.handleDeliveryUpdate(e, deliveryId);
        }
        
        showModal('deliveryModal');
    }

    async handleDeliveryUpdate(event, deliveryId) {
        event.preventDefault();
        
        const deliveryPerson = document.getElementById('deliveryPerson').value.trim();
        const estimatedTime = parseInt(document.getElementById('deliveryTime').value);
        const notes = document.getElementById('deliveryNotes').value.trim();
        
        if (!deliveryPerson || !estimatedTime) {
            showNotification('Preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        const deliveryData = {
            deliveryPerson,
            estimatedTime,
            notes
        };
        
        try {
            showLoading(true);
            await api.updateDelivery(deliveryId, deliveryData);
            showNotification('Entrega atualizada com sucesso!', 'success');
            closeModal();
            await this.loadDeliveries();
            
            // Restaurar form para criação
            const form = document.getElementById('deliveryModalForm');
            if (form) {
                form.onsubmit = (e) => this.handleDeliverySubmit(e);
            }
            const orderSelect = document.getElementById('deliveryOrder');
            if (orderSelect) {
                orderSelect.disabled = false;
            }
            
        } catch (error) {
            showNotification(error.message || 'Erro ao atualizar entrega', 'error');
        } finally {
            showLoading(false);
        }
    }

    async deleteDelivery(deliveryId) {
        if (!confirm('Tem certeza que deseja excluir esta entrega?')) {
            return;
        }
        
        try {
            showLoading(true);
            await api.deleteDelivery(deliveryId);
            showNotification('Entrega excluída com sucesso!', 'success');
            await this.loadDeliveries();
        } catch (error) {
            showNotification(error.message || 'Erro ao excluir entrega', 'error');
        } finally {
            showLoading(false);
        }
    }

    // Método para obter entregas (usado por outros módulos)
    getDeliveries() {
        return this.deliveries;
    }
}

// Função global para mostrar modal de entrega
function showDeliveryModal() {
    if (window.deliveryManager) {
        window.deliveryManager.showDeliveryModal();
    }
}

// Instância global
window.deliveryManager = new DeliveryManager();