// ==========================================
// UI - FUNÇÕES DE INTERFACE DO USUÁRIO
// ==========================================

// ==========================================
// LOADING
// ==========================================
function showLoading(show = true) {
    const loading = document.getElementById('loading');
    if (loading) {
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }
}

// ==========================================
// NOTIFICAÇÕES
// ==========================================
function showNotification(message, type = 'info', duration = CONFIG.UI.NOTIFICATION_DURATION) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notificationMessage');
    
    if (!notification || !messageElement) return;
    
    // Remover classes anteriores
    notification.className = 'notification';
    
    // Adicionar nova classe de tipo
    notification.classList.add(type);
    
    // Definir mensagem
    messageElement.textContent = message;
    
    // Mostrar notificação
    notification.classList.remove('hidden');
    
    // Auto-esconder após o tempo definido
    setTimeout(() => {
        notification.classList.add('hidden');
    }, duration);
}

// ==========================================
// NAVEGAÇÃO ENTRE SEÇÕES
// ==========================================
function showSection(sectionName) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Mostrar seção específica
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Atualizar interface baseado na seção
    updateSectionUI(sectionName);
}

function updateSectionUI(sectionName) {
    // Verificar se auth está disponível
    if (!window.auth) {
        console.log('Auth ainda não está disponível, pulando updateSectionUI');
        return;
    }
    
    // Esconder/mostrar elementos baseado no papel do usuário
    const user = window.auth.getCurrentUser();
    if (!user) return;
    
    // Controlar visibilidade do card de usuários no dashboard
    const usersCard = document.getElementById('usersCard');
    if (usersCard) {
        if (user.role === 'admin') {
            usersCard.style.display = 'block';
        } else {
            usersCard.style.display = 'none';
        }
    }
    
    // Controlar botões de adicionar baseado no papel
    const addPizzaBtn = document.getElementById('addPizzaBtn');
    const addDeliveryBtn = document.getElementById('addDeliveryBtn');
    
    if (user.role !== 'admin') {
        if (addPizzaBtn) addPizzaBtn.style.display = 'none';
        if (addDeliveryBtn) addDeliveryBtn.style.display = 'none';
    } else {
        if (addPizzaBtn) addPizzaBtn.style.display = 'inline-flex';
        if (addDeliveryBtn) addDeliveryBtn.style.display = 'inline-flex';
    }
    
    // Carregar dados da seção se necessário
    loadSectionData(sectionName);
}

async function loadSectionData(sectionName) {
    try {
        switch (sectionName) {
            case 'pizzas':
                if (window.pizzaManager) {
                    await window.pizzaManager.loadPizzas();
                }
                break;
            case 'orders':
                if (window.orderManager) {
                    const user = window.auth ? window.auth.getCurrentUser() : null;
                    if (user && user.role === 'admin') {
                        await window.orderManager.loadOrders();
                    } else if (user) {
                        await window.orderManager.loadUserOrders(user._id);
                    }
                }
                break;
            case 'deliveries':
                if (window.deliveryManager && window.auth && window.auth.isAdmin()) {
                    await window.deliveryManager.loadDeliveries();
                }
                break;
            case 'users':
                if (window.userManager && window.auth && window.auth.isAdmin()) {
                    await window.userManager.loadUsers();
                }
                break;
        }
    } catch (error) {
        console.error(`Erro ao carregar dados da seção ${sectionName}:`, error);
        showNotification('Erro ao carregar dados', 'error');
    }
}

// ==========================================
// MODAIS
// ==========================================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');
        
        // Foco no primeiro input do modal
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    const overlay = document.getElementById('modalOverlay');
    
    modals.forEach(modal => modal.classList.add('hidden'));
    if (overlay) overlay.classList.add('hidden');
    
    // Limpar formulários dos modais
    modals.forEach(modal => {
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
    });
}

// Fechar modal clicando no overlay
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ==========================================
// FORMATAÇÃO E UTILIDADES
// ==========================================
function createStatusBadge(status) {
    const badge = document.createElement('span');
    badge.className = `status-badge ${status.toLowerCase().replace(/\s+/g, '-')}`;
    badge.textContent = status;
    return badge;
}

function createActionButton(text, icon, className, onClick) {
    const button = document.createElement('button');
    button.className = `btn ${className}`;
    button.innerHTML = `<i class="fas fa-${icon}"></i> ${text}`;
    button.onclick = onClick;
    return button;
}

function createCard(className = 'item-card') {
    const card = document.createElement('div');
    card.className = className;
    return card;
}

function createCardHeader(title, actions = []) {
    const header = document.createElement('div');
    header.className = 'item-header';
    
    const titleElement = document.createElement('div');
    titleElement.className = 'item-title';
    titleElement.textContent = title;
    
    const actionsElement = document.createElement('div');
    actionsElement.className = 'item-actions';
    actions.forEach(action => actionsElement.appendChild(action));
    
    header.appendChild(titleElement);
    header.appendChild(actionsElement);
    
    return header;
}

// ==========================================
// VALIDAÇÃO DE FORMULÁRIOS
// ==========================================
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Validações específicas
        if (input.type === 'email' && input.value) {
            if (!CONFIG.VALIDATION.EMAIL_PATTERN.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
        
        if (input.type === 'tel' && input.value) {
            if (!CONFIG.VALIDATION.PHONE_PATTERN.test(input.value.replace(/\D/g, ''))) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// ==========================================
// MÁSCARAS DE INPUT
// ==========================================
function setupInputMasks() {
    // Máscara para telefone
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    });
    
    // Máscara para CEP
    const cepInputs = document.querySelectorAll('input[id*="zipCode"], input[id*="cep"]');
    cepInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
                e.target.value = value;
            }
        });
    });
    
    // Máscara para preço
    const priceInputs = document.querySelectorAll('input[type="number"][step="0.01"]');
    priceInputs.forEach(input => {
        input.addEventListener('blur', (e) => {
            if (e.target.value) {
                e.target.value = parseFloat(e.target.value).toFixed(2);
            }
        });
    });
}

// ==========================================
// SCROLL SUAVE
// ==========================================
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    setupInputMasks();
    
    // Configurar tooltips ou outros elementos interativos se necessário
    console.log('UI initialized');
});