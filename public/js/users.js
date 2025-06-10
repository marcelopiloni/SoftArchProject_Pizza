// ==========================================
// USERS - GERENCIAMENTO DE USUÁRIOS
// ==========================================

class UserManager {
    constructor() {
        this.users = [];
    }

    async loadUsers() {
        try {
            showLoading(true);
            this.users = await api.getAllUsers();
            this.renderUsers();
        } catch (error) {
            showNotification('Erro ao carregar usuários', 'error');
            console.error('Erro ao carregar usuários:', error);
        } finally {
            showLoading(false);
        }
    }

    renderUsers() {
        const container = document.getElementById('usersList');
        if (!container) return;

        if (this.users.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #7F8C8D;">
                    <i class="fas fa-users" style="font-size: 3em; margin-bottom: 15px; display: block;"></i>
                    <p>Nenhum usuário encontrado</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.users.map(user => this.createUserCard(user)).join('');
    }

    createUserCard(user) {
        const currentUser = auth.getCurrentUser();
        const isCurrentUser = currentUser._id === user._id;
        
        return `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">
                            ${user.name}
                            ${isCurrentUser ? '<span style="color: #E74C3C; font-size: 0.8em;">(Você)</span>' : ''}
                        </div>
                        <div style="color: #7F8C8D; font-size: 0.9em;">
                            ${user.email}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        ${this.createRoleBadge(user.role)}
                    </div>
                </div>
                
                <div style="margin: 15px 0;">
                    <div><strong>Telefone:</strong> ${formatPhone(user.phone)}</div>
                    <div><strong>Tipo:</strong> ${user.role === 'admin' ? 'Administrador' : 'Cliente'}</div>
                    ${user.createdAt ? `<div><strong>Cadastrado em:</strong> ${formatDate(user.createdAt)}</div>` : ''}
                </div>
                
                <div class="item-actions" style="margin-top: 20px;">
                    <button class="btn btn-secondary btn-sm" onclick="userManager.viewUserDetails('${user._id}')">
                        <i class="fas fa-eye"></i> Detalhes
                    </button>
                    ${!isCurrentUser ? `
                        <button class="btn btn-danger btn-sm" onclick="userManager.deleteUser('${user._id}')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    createRoleBadge(role) {
        const badgeClass = role === 'admin' ? 'status-badge em-preparo' : 'status-badge pendente';
        const roleText = role === 'admin' ? 'Admin' : 'Cliente';
        return `<span class="${badgeClass}">${roleText}</span>`;
    }

    async viewUserDetails(userId) {
        try {
            showLoading(true);
            
            // Buscar detalhes do usuário
            const userDetails = await api.getUser(userId);
            
            // Buscar pedidos do usuário
            let userOrders = [];
            try {
                userOrders = await api.getOrdersByUser(userId);
            } catch (error) {
                console.log('Usuário não tem pedidos ou erro ao carregar:', error);
            }
            
            this.showUserDetailsModal(userDetails, userOrders);
            
        } catch (error) {
            showNotification('Erro ao carregar detalhes do usuário', 'error');
        } finally {
            showLoading(false);
        }
    }

    showUserDetailsModal(user, orders) {
        // Criar modal dinâmico
        const modalHTML = `
            <div id="userDetailsModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Detalhes do Usuário</h3>
                        <button class="modal-close" onclick="this.closest('.modal').remove(); document.getElementById('modalOverlay').classList.add('hidden')">&times;</button>
                    </div>
                    <div style="padding: 30px;">
                        <div style="margin-bottom: 25px;">
                            <h4 style="color: #E74C3C; margin-bottom: 15px;">Informações Pessoais</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div><strong>Nome:</strong> ${user.name}</div>
                                <div><strong>Email:</strong> ${user.email}</div>
                                <div><strong>Telefone:</strong> ${formatPhone(user.phone)}</div>
                                <div><strong>Tipo:</strong> ${user.role === 'admin' ? 'Administrador' : 'Cliente'}</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 25px;">
                            <h4 style="color: #E74C3C; margin-bottom: 15px;">
                                Histórico de Pedidos (${orders.length})
                            </h4>
                            ${orders.length > 0 ? `
                                <div style="max-height: 300px; overflow-y: auto;">
                                    ${orders.map(order => `
                                        <div style="border: 1px solid #ecf0f1; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                                <strong>Pedido #${order._id.slice(-6)}</strong>
                                                <span class="status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span>
                                            </div>
                                            <div style="font-size: 0.9em; color: #7F8C8D; margin-bottom: 10px;">
                                                ${formatDate(order.createdAt)}
                                            </div>
                                            <div style="margin-bottom: 10px;">
                                                ${order.pizzas.map(item => `${item.pizza.name} (${item.quantity}x)`).join(', ')}
                                            </div>
                                            <div style="font-weight: bold; color: #E74C3C;">
                                                Total: ${formatPrice(order.totalPrice)}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <p style="color: #7F8C8D; text-align: center; padding: 20px;">
                                    Nenhum pedido encontrado
                                </p>
                            `}
                        </div>
                        
                        <div style="text-align: right;">
                            <button class="btn btn-secondary" onclick="this.closest('.modal').remove(); document.getElementById('modalOverlay').classList.add('hidden')">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Mostrar overlay
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    async deleteUser(userId) {
        const user = this.users.find(u => u._id === userId);
        if (!user) return;
        
        if (!confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
            return;
        }
        
        try {
            showLoading(true);
            await api.deleteUser(userId);
            showNotification('Usuário excluído com sucesso!', 'success');
            await this.loadUsers();
        } catch (error) {
            showNotification(error.message || 'Erro ao excluir usuário', 'error');
        } finally {
            showLoading(false);
        }
    }

    // Método para obter usuários (usado por outros módulos)
    getUsers() {
        return this.users;
    }

    getUserById(userId) {
        return this.users.find(user => user._id === userId);
    }

    // Função para criar estatísticas dos usuários
    getUserStats() {
        const totalUsers = this.users.length;
        const admins = this.users.filter(user => user.role === 'admin').length;
        const clients = this.users.filter(user => user.role === 'user').length;
        
        return {
            total: totalUsers,
            admins,
            clients,
            adminPercentage: totalUsers > 0 ? ((admins / totalUsers) * 100).toFixed(1) : 0,
            clientPercentage: totalUsers > 0 ? ((clients / totalUsers) * 100).toFixed(1) : 0
        };
    }
}

// Instância global
window.userManager = new UserManager();