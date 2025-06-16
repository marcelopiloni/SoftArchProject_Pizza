// ==========================================
// AUTH - GERENCIAMENTO DE AUTENTICAÇÃO
// ==========================================

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Verificar se já tem usuário logado
        const savedUser = getUser();
        const token = getToken();
        
        if (savedUser && token) {
            this.currentUser = savedUser;
            this.showAppContent();
        } else {
            this.showAuthSection();
        }

        // Configurar event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerFormElement');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showNotification('Preencha todos os campos', 'error');
            return;
        }

        try {
            showLoading(true);
            
            const response = await api.login(email, password);
            
            // Salvar dados de autenticação
            saveAuthData(response.token, response.user);
            this.currentUser = response.user;
            
            showNotification('Login realizado com sucesso!', 'success');
            
            // Mostrar conteúdo da aplicação
            this.showAppContent();
            
        } catch (error) {
            showNotification(error.message || 'Erro ao fazer login', 'error');
        } finally {
            showLoading(false);
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;

        // Validações básicas
        if (!name || !email || !phone || !password) {
            showNotification('Preencha todos os campos obrigatórios', 'error');
            return;
        }

        if (password.length < CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
            showNotification(`Senha deve ter pelo menos ${CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} caracteres`, 'error');
            return;
        }

        // Limpar telefone (remover formatação) para validação
        const cleanPhone = phone.replace(/\D/g, '');
        
        if (!CONFIG.VALIDATION.PHONE_PATTERN.test(phone) || cleanPhone.length < 10 || cleanPhone.length > 11) {
            showNotification('Telefone deve ter 10 ou 11 dígitos', 'error');
            return;
        }

        try {
            showLoading(true);
            
            const userData = { name, email, phone, password };
            if (role) userData.role = role;
            
            const response = await api.register(userData);
            
            // Salvar dados de autenticação
            saveAuthData(response.token, response.user);
            this.currentUser = response.user;
            
            showNotification('Cadastro realizado com sucesso!', 'success');
            
            // Mostrar conteúdo da aplicação
            this.showAppContent();
            
        } catch (error) {
            showNotification(error.message || 'Erro ao cadastrar usuário', 'error');
        } finally {
            showLoading(false);
        }
    }

    logout() {
        // Limpar dados de autenticação
        clearAuthData();
        this.currentUser = null;
        
        // Voltar para tela de login
        this.showAuthSection();
        
        showNotification('Logout realizado com sucesso!', 'success');
    }

    showAuthSection() {
        // Esconder conteúdo da app
        const appContent = document.getElementById('appContent');
        if (appContent) appContent.classList.add('hidden');
        
        // Mostrar seção de autenticação
        const authSection = document.getElementById('authSection');
        if (authSection) authSection.classList.remove('hidden');
        
        // Atualizar navegação
        this.updateNavigation();
        
        // Limpar formulários
        this.clearAuthForms();
    }

    showAppContent() {
        // Esconder seção de autenticação
        const authSection = document.getElementById('authSection');
        if (authSection) authSection.classList.add('hidden');
        
        // Mostrar conteúdo da app
        const appContent = document.getElementById('appContent');
        if (appContent) appContent.classList.remove('hidden');
        
        // Atualizar navegação
        this.updateNavigation();
        
        // Mostrar dashboard inicial
        showSection('dashboard');
        
        // Carregar dados iniciais se necessário
        this.loadInitialData();
    }

    updateNavigation() {
        const navButtons = document.getElementById('navButtons');
        if (!navButtons) return;

        if (this.currentUser) {
            // Usuário logado - mostrar botões da aplicação
            navButtons.innerHTML = `
                <button class="btn btn-secondary" onclick="showSection('dashboard')">
                    <i class="fas fa-home"></i> Dashboard
                </button>
                <button class="btn btn-secondary" onclick="showSection('pizzas')">
                    <i class="fas fa-pizza-slice"></i> Pizzas
                </button>
                <button class="btn btn-secondary" onclick="showSection('orders')">
                    <i class="fas fa-shopping-cart"></i> Pedidos
                </button>
                ${this.currentUser.role === 'admin' ? `
                    <button class="btn btn-secondary" onclick="showSection('deliveries')">
                        <i class="fas fa-truck"></i> Entregas
                    </button>
                    <button class="btn btn-secondary" onclick="showSection('users')">
                        <i class="fas fa-users"></i> Usuários
                    </button>
                ` : ''}
                <div style="margin-left: 20px; display: flex; align-items: center; gap: 10px;">
                    <span style="color: #7F8C8D;">Olá, ${this.currentUser.name}</span>
                    <button class="btn btn-danger" onclick="auth.logout()">
                        <i class="fas fa-sign-out-alt"></i> Sair
                    </button>
                </div>
            `;
        } else {
            // Usuário não logado - esconder navegação
            navButtons.innerHTML = '';
        }
    }

    clearAuthForms() {
        // Limpar formulário de login
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) loginForm.reset();
        
        // Limpar formulário de registro
        const registerForm = document.getElementById('registerFormElement');
        if (registerForm) registerForm.reset();
    }

    async loadInitialData() {
        // Carregar dados iniciais conforme o papel do usuário
        try {
            // Sempre carregar pizzas (público)
            if (window.pizzaManager) {
                await window.pizzaManager.loadPizzas();
            }
            
            if (this.currentUser.role === 'admin') {
                // Admin pode ver tudo
                if (window.orderManager) {
                    await window.orderManager.loadOrders();
                }
                if (window.deliveryManager) {
                    await window.deliveryManager.loadDeliveries();
                }
                if (window.userManager) {
                    await window.userManager.loadUsers();
                }
            } else {
                // Usuário comum só vê seus próprios pedidos
                if (window.orderManager) {
                    await window.orderManager.loadUserOrders(this.currentUser._id);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    isAuthenticated() {
        return !!this.currentUser && !!getToken();
    }
}

// Funções globais para trocar entre login e registro
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// Instância global do gerenciador de autenticação
const auth = new AuthManager();