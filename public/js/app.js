// ==========================================
// APP - INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================

class PizzariaApp {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🍕 Inicializando Pizzaria Delivery App...');
            
            // Aguardar o DOM estar pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
            
        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            showNotification('Erro ao inicializar aplicação', 'error');
        }
    }

    async initializeApp() {
        console.log('📱 DOM carregado, inicializando componentes...');
        
        // Verificar conectividade com a API
        await this.checkApiHealth();
        
        // Inicializar gerenciadores
        this.initializeManagers();
        
        // Configurar event listeners globais
        this.setupGlobalEventListeners();
        
        // Aplicar máscaras de input
        setupInputMasks();
        
        // Marcar como inicializada
        this.isInitialized = true;
        
        console.log('✅ Aplicação inicializada com sucesso!');
        
        // Se já estiver logado, carregar dados iniciais
        if (window.auth && window.auth.isAuthenticated()) {
            await this.loadInitialData();
        }
    }

    async checkApiHealth() {
        try {
            const response = await fetch('/health');
            const data = await response.json();
            
            if (data.status === 'OK') {
                console.log('✅ API está funcionando:', data.message);
            } else {
                throw new Error('API não está respondendo corretamente');
            }
        } catch (error) {
            console.error('❌ Erro ao conectar com a API:', error);
            showNotification('Erro de conexão com o servidor. Verifique se a API está rodando.', 'error', 10000);
        }
    }

    initializeManagers() {
        console.log('🔧 Inicializando gerenciadores...');
        
        // Os gerenciadores já são inicializados automaticamente através dos scripts
        // Apenas garantir que estão disponíveis globalmente
        if (!window.pizzaManager) {
            console.error('PizzaManager não foi inicializado');
        }
        
        if (!window.orderManager) {
            console.error('OrderManager não foi inicializado');
        }
        
        if (!window.deliveryManager) {
            console.error('DeliveryManager não foi inicializado');
        }
        
        if (!window.userManager) {
            console.error('UserManager não foi inicializado');
        }
        
        console.log('✅ Gerenciadores inicializados');
    }

    setupGlobalEventListeners() {
        console.log('🎯 Configurando event listeners globais...');
        
        // Interceptar erros globais
        window.addEventListener('error', (event) => {
            console.error('Erro global capturado:', event.error);
            showNotification('Ocorreu um erro inesperado', 'error');
        });

        // Interceptar erros de Promise não tratadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promise rejeitada não tratada:', event.reason);
            showNotification('Erro de conexão ou processamento', 'error');
        });

        // Controlar visibilidade da página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('📱 Aplicação em background');
            } else {
                console.log('📱 Aplicação em foreground');
                this.refreshDataIfNeeded();
            }
        });

        console.log('✅ Event listeners globais configurados');
    }

    async loadInitialData() {
        console.log('📊 Carregando dados iniciais...');
        
        try {
            if (!window.auth) {
                console.log('Auth não está disponível ainda');
                return;
            }
            
            const user = window.auth.getCurrentUser();
            if (!user) {
                console.log('Usuário não está logado');
                return;
            }
            
            // Sempre carregar pizzas (dados públicos)
            await window.pizzaManager.loadPizzas();
            
            if (user.role === 'admin') {
                // Admin carrega todos os dados
                await Promise.all([
                    window.orderManager.loadOrders(),
                    window.deliveryManager.loadDeliveries(),
                    window.userManager.loadUsers()
                ]);
            } else {
                // Cliente carrega apenas seus pedidos
                await window.orderManager.loadUserOrders(user._id);
            }
            
            console.log('✅ Dados iniciais carregados');
            
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            showNotification('Erro ao carregar alguns dados', 'warning');
        }
    }

    async refreshDataIfNeeded() {
        if (!window.auth || !window.auth.isAuthenticated() || !this.isInitialized) return;
        
        // Verificar se faz mais de 5 minutos que os dados foram carregados
        const lastRefresh = localStorage.getItem('lastDataRefresh');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (!lastRefresh || (now - parseInt(lastRefresh)) > fiveMinutes) {
            console.log('🔄 Atualizando dados...');
            await this.loadInitialData();
            localStorage.setItem('lastDataRefresh', now.toString());
        }
    }

    clearAppData() {
        console.log('🧹 Limpando dados da aplicação...');
        
        // Limpar dados dos gerenciadores
        if (window.pizzaManager) {
            window.pizzaManager.pizzas = [];
            window.pizzaManager.filteredPizzas = [];
        }
        
        if (window.orderManager) {
            window.orderManager.orders = [];
            window.orderManager.filteredOrders = [];
        }
        
        if (window.deliveryManager) {
            window.deliveryManager.deliveries = [];
        }
        
        if (window.userManager) {
            window.userManager.users = [];
        }
        
        // Limpar localStorage específico da app
        localStorage.removeItem('lastDataRefresh');
        
        console.log('✅ Dados da aplicação limpos');
    }

    getAppStatus() {
        return {
            initialized: this.isInitialized,
            authenticated: window.auth ? window.auth.isAuthenticated() : false,
            user: window.auth ? window.auth.getCurrentUser() : null,
            apiConnected: true,
            managersReady: {
                pizza: !!window.pizzaManager,
                order: !!window.orderManager,
                delivery: !!window.deliveryManager,
                user: !!window.userManager
            }
        };
    }

    debug() {
        console.log('🐛 Status da aplicação:', this.getAppStatus());
        console.log('📊 Dados carregados:', {
            pizzas: window.pizzaManager?.getPizzas()?.length || 0,
            orders: window.orderManager?.getOrders()?.length || 0,
            deliveries: window.deliveryManager?.getDeliveries()?.length || 0,
            users: window.userManager?.getUsers()?.length || 0
        });
    }
}

// Inicializar aplicação
console.log('🚀 Iniciando Pizzaria Delivery App...');
const app = new PizzariaApp();

// Disponibilizar globalmente para debug
window.app = app;
window.debug = () => app.debug();

// Função de utilidade para verificar se tudo está funcionando
window.checkApp = () => {
    console.log('🔍 Verificação da aplicação:');
    console.log('- App inicializada:', app.isInitialized);
    console.log('- Usuário logado:', window.auth ? window.auth.isAuthenticated() : false);
    console.log('- Gerenciadores:', {
        pizza: !!window.pizzaManager,
        order: !!window.orderManager,
        delivery: !!window.deliveryManager,
        user: !!window.userManager,
        auth: !!window.auth
    });
    
    if (window.auth && window.auth.isAuthenticated()) {
        console.log('- Usuário atual:', window.auth.getCurrentUser());
        console.log('- É admin:', window.auth.isAdmin());
    }
    
    console.log('✅ Verificação concluída!');
};