// ==========================================
// PIZZAS - GERENCIAMENTO DE PIZZAS
// ==========================================

class PizzaManager {
    constructor() {
        this.pizzas = [];
        this.filteredPizzas = [];
        this.currentPizza = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal de pizza
        const pizzaForm = document.getElementById('pizzaModalForm');
        if (pizzaForm) {
            pizzaForm.addEventListener('submit', (e) => this.handlePizzaSubmit(e));
        }

        // Filtro de categoria
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterPizzas());
        }
    }

    async loadPizzas() {
        try {
            showLoading(true);
            this.pizzas = await api.getAllPizzas();
            this.filteredPizzas = [...this.pizzas];
            this.renderPizzas();
        } catch (error) {
            showNotification('Erro ao carregar pizzas', 'error');
            console.error('Erro ao carregar pizzas:', error);
        } finally {
            showLoading(false);
        }
    }

    renderPizzas() {
        const container = document.getElementById('pizzasList');
        if (!container) return;

        if (this.filteredPizzas.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #7F8C8D;">
                    <i class="fas fa-pizza-slice" style="font-size: 3em; margin-bottom: 15px; display: block;"></i>
                    <p>Nenhuma pizza encontrada</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredPizzas.map(pizza => this.createPizzaCard(pizza)).join('');
    }

    createPizzaCard(pizza) {
        const isAdmin = auth.isAdmin();
        
        return `
            <div class="pizza-card">
                <div class="pizza-category">${pizza.category}</div>
                <div class="pizza-name">${pizza.name}</div>
                <div class="pizza-ingredients">${pizza.ingredients.join(', ')}</div>
                <div class="pizza-price">${formatPrice(pizza.price)}</div>
                ${isAdmin ? `
                    <div class="item-actions">
                        <button class="btn btn-warning" onclick="pizzaManager.editPizza('${pizza._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="pizzaManager.deletePizza('${pizza._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    showPizzaModal(pizzaId = null) {
        this.currentPizza = pizzaId;
        
        const modal = document.getElementById('pizzaModal');
        const title = document.getElementById('pizzaModalTitle');
        const form = document.getElementById('pizzaModalForm');
        
        if (pizzaId) {
            // Editando pizza existente
            const pizza = this.pizzas.find(p => p._id === pizzaId);
            if (pizza) {
                title.textContent = 'Editar Pizza';
                document.getElementById('pizzaName').value = pizza.name;
                document.getElementById('pizzaIngredients').value = pizza.ingredients.join(', ');
                document.getElementById('pizzaPrice').value = pizza.price;
                document.getElementById('pizzaCategory').value = pizza.category;
            }
        } else {
            // Nova pizza
            title.textContent = 'Adicionar Pizza';
            form.reset();
        }
        
        showModal('pizzaModal');
    }

    async handlePizzaSubmit(event) {
        event.preventDefault();
        
        const name = document.getElementById('pizzaName').value.trim();
        const ingredientsText = document.getElementById('pizzaIngredients').value.trim();
        const price = parseFloat(document.getElementById('pizzaPrice').value);
        const category = document.getElementById('pizzaCategory').value;
        
        // Validações
        if (!name || !ingredientsText || !price || !category) {
            showNotification('Preencha todos os campos', 'error');
            return;
        }
        
        if (price <= 0) {
            showNotification('Preço deve ser maior que zero', 'error');
            return;
        }
        
        // Converter ingredientes (separar por vírgula)
        const ingredients = ingredientsText.split(',').map(ing => ing.trim()).filter(ing => ing);
        
        if (ingredients.length === 0) {
            showNotification('Adicione pelo menos um ingrediente', 'error');
            return;
        }
        
        const pizzaData = {
            name,
            ingredients,
            price,
            category
        };
        
        try {
            showLoading(true);
            
            if (this.currentPizza) {
                // Atualizar pizza existente
                await api.updatePizza(this.currentPizza, pizzaData);
                showNotification('Pizza atualizada com sucesso!', 'success');
            } else {
                // Criar nova pizza
                await api.createPizza(pizzaData);
                showNotification('Pizza criada com sucesso!', 'success');
            }
            
            closeModal();
            await this.loadPizzas();
            
        } catch (error) {
            showNotification(error.message || 'Erro ao salvar pizza', 'error');
        } finally {
            showLoading(false);
        }
    }

    editPizza(pizzaId) {
        this.showPizzaModal(pizzaId);
    }

    async deletePizza(pizzaId) {
        const pizza = this.pizzas.find(p => p._id === pizzaId);
        if (!pizza) return;
        
        if (!confirm(`Tem certeza que deseja excluir a pizza "${pizza.name}"?`)) {
            return;
        }
        
        try {
            showLoading(true);
            await api.deletePizza(pizzaId);
            showNotification('Pizza excluída com sucesso!', 'success');
            await this.loadPizzas();
        } catch (error) {
            showNotification(error.message || 'Erro ao excluir pizza', 'error');
        } finally {
            showLoading(false);
        }
    }

    filterPizzas() {
        const categoryFilter = document.getElementById('categoryFilter');
        const selectedCategory = categoryFilter ? categoryFilter.value : '';
        
        if (selectedCategory) {
            this.filteredPizzas = this.pizzas.filter(pizza => pizza.category === selectedCategory);
        } else {
            this.filteredPizzas = [...this.pizzas];
        }
        
        this.renderPizzas();
    }

    // Método para obter pizzas (usado por outros módulos)
    getPizzas() {
        return this.pizzas;
    }

    getPizzaById(pizzaId) {
        return this.pizzas.find(pizza => pizza._id === pizzaId);
    }
}

// Função global para mostrar modal de pizza
function showPizzaModal(pizzaId = null) {
    if (window.pizzaManager) {
        window.pizzaManager.showPizzaModal(pizzaId);
    }
}

// Instância global
window.pizzaManager = new PizzaManager();