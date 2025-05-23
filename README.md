# API de Delivery de Pizza

Este projeto consiste em uma API para um sistema de delivery de pizza usando o padrão de arquitetura MVC (Model-View-Controller). A API permite gerenciar usuários, cardápio, pedidos e entregas para uma pizzaria.

## Estrutura do Projeto

```
SOFTARCHPROJECT/
├── node_modules/
├── src/
│   ├── config/
│   │   ├── auth.js
│   │   └── dbConnect.js
│   ├── controllers/
│   │   ├── deliveryController.js
│   │   ├── orderController.js
│   │   ├── pizzaController.js
│   │   └── userController.js
│   ├── dtos/
│   │   ├── deliveryDto.js
│   │   ├── orderDto.js
│   │   ├── pizzaDto.js
│   │   └── userDto.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── Delivery.js
│   │   ├── Order.js
│   │   ├── Pizza.js
│   │   └── User.js
│   ├── repositories/
│   │   ├── baseRepository.js
│   │   ├── deliveryRepository.js
│   │   ├── orderRepository.js
│   │   ├── pizzaRepository.js
│   │   └── userRepository.js
│   ├── routes/
│   │   ├── deliveryRoutes.js
│   │   ├── index.js
│   │   ├── orderRoutes.js
│   │   ├── pizzaRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── deliveryService.js
│   │   ├── orderService.js
│   │   ├── pizzaService.js
│   │   └── userService.js
├── .env
├── .gitignore
├── app.js
├── package.json
├── README.md
└── server.js
```

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript server-side
- **Express.js**: Framework web para Node.js
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM (Object Data Modeling) para MongoDB
- **Joi**: Biblioteca para validação de dados

## Requisitos

- Node.js (v14+)
- NPM (v6+)
- MongoDB

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pizza-delivery-api.git
cd pizza-delivery-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   Crie ou edite o arquivo `.env` na raiz do projeto com:
```
PORT=3000
MONGODB_URI=sua-string-de-conexao-mongodb
```

4. Inicie o servidor:
```bash
npm start
```

## Entidades

### Usuário
- **name**: Nome do usuário
- **email**: Email do usuário (único)
- **password**: Senha do usuário
- **phone**: Número de telefone
- **role**: Tipo de usuário (user/admin)

### Pizza
- **name**: Nome da pizza
- **ingredients**: Lista de ingredientes
- **price**: Preço da pizza
- **category**: Categoria (Tradicional, Premium, Doce)
- **createdAt**: Data de criação

### Pedido
- **user**: Referência ao usuário que fez o pedido
- **pizzas**: Lista de pizzas e quantidades
- **totalPrice**: Preço total do pedido
- **status**: Status do pedido (Pendente, Em preparo, Em entrega, Entregue, Cancelado)
- **address**: Endereço de entrega
- **paymentMethod**: Método de pagamento
- **observations**: Observações adicionais
- **createdAt**: Data de criação

### Entrega
- **order**: Referência ao pedido
- **deliveryPerson**: Nome do entregador
- **startTime**: Hora de início da entrega
- **endTime**: Hora de finalização da entrega
- **status**: Status da entrega (Em preparo, Em rota, Entregue, Cancelado)
- **estimatedTime**: Tempo estimado em minutos
- **notes**: Observações sobre a entrega

## Guia Rápido para Testar a API

Configure o Postman com a variável `base_url` como `http://localhost:3000/api`

### 1. Usuários

#### Registro de Usuário
- **POST** `{{base_url}}/users/register`
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "phone": "11999887766"
}
```

#### Login de Usuário
- **POST** `{{base_url}}/users/login`
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

#### Obter Perfil
- **GET** `{{base_url}}/users/profile?userId=ID_DO_USUARIO`

#### Obter Usuário por ID
- **GET** `{{base_url}}/users/ID_DO_USUARIO`

#### Atualizar Usuário
- **PUT** `{{base_url}}/users/ID_DO_USUARIO`
```json
{
  "name": "João Silva Atualizado",
  "phone": "11999887755"
}
```

#### Listar Usuários
- **GET** `{{base_url}}/users`

#### Excluir Usuário
- **DELETE** `{{base_url}}/users/ID_DO_USUARIO`

### 2. Pizzas

#### Criar Pizza
- **POST** `{{base_url}}/pizzas`
```json
{
  "name": "Margherita",
  "ingredients": ["Molho de tomate", "Mussarela", "Manjericão"],
  "price": 45.90,
  "category": "Tradicional"
}
```

#### Listar Pizzas
- **GET** `{{base_url}}/pizzas`

#### Obter Pizza por ID
- **GET** `{{base_url}}/pizzas/ID_DA_PIZZA`

#### Atualizar Pizza
- **PUT** `{{base_url}}/pizzas/ID_DA_PIZZA`
```json
{
  "price": 49.90,
  "ingredients": ["Molho de tomate", "Mussarela de búfala", "Manjericão fresco"]
}
```

#### Excluir Pizza
- **DELETE** `{{base_url}}/pizzas/ID_DA_PIZZA`

### 3. Pedidos

#### Criar Pedido
- **POST** `{{base_url}}/orders`
```json
{
  "user": "ID_DO_USUARIO",
  "pizzas": [
    {
      "pizza": "ID_DA_PIZZA",
      "quantity": 2
    }
  ],
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 101",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "zipCode": "01234567"
  },
  "paymentMethod": "Cartão de crédito",
  "observations": "Sem cebola, por favor"
}
```

#### Listar Pedidos
- **GET** `{{base_url}}/orders`

#### Obter Pedido por ID
- **GET** `{{base_url}}/orders/ID_DO_PEDIDO`

#### Listar Pedidos de um Usuário
- **GET** `{{base_url}}/orders/user/ID_DO_USUARIO`

#### Atualizar Pedido
- **PUT** `{{base_url}}/orders/ID_DO_PEDIDO`
```json
{
  "address": {
    "street": "Avenida Principal",
    "number": "500"
  },
  "observations": "Entregar na portaria"
}
```

#### Atualizar Status do Pedido
- **PATCH** `{{base_url}}/orders/ID_DO_PEDIDO/status`
```json
{
  "status": "Em preparo"
}
```

#### Excluir Pedido
- **DELETE** `{{base_url}}/orders/ID_DO_PEDIDO`

### 4. Entregas

#### Criar Entrega
- **POST** `{{base_url}}/deliveries`
```json
{
  "order": "ID_DO_PEDIDO",
  "deliveryPerson": "Carlos Motoboy",
  "estimatedTime": 30,
  "notes": "Ligar quando chegar"
}
```

#### Listar Entregas
- **GET** `{{base_url}}/deliveries`

#### Obter Entrega por ID
- **GET** `{{base_url}}/deliveries/ID_DA_ENTREGA`

#### Obter Entrega por Pedido
- **GET** `{{base_url}}/deliveries/order/ID_DO_PEDIDO`

#### Atualizar Entrega
- **PUT** `{{base_url}}/deliveries/ID_DA_ENTREGA`
```json
{
  "deliveryPerson": "Paulo Motoboy",
  "estimatedTime": 25
}
```

#### Atualizar Status da Entrega
- **PATCH** `{{base_url}}/deliveries/ID_DA_ENTREGA/status`
```json
{
  "status": "Em rota"
}
```

#### Excluir Entrega
- **DELETE** `{{base_url}}/deliveries/ID_DA_ENTREGA`

### Fluxo de Teste Completo

1. Registre um usuário
2. Crie uma pizza
3. Faça um pedido
4. Crie uma entrega para o pedido
5. Atualize o status da entrega para "Em rota"
6. Verifique se o pedido mudou para "Em entrega"
7. Atualize para "Entregue" e confirme novamente

## Arquitetura do Projeto

Este projeto segue os princípios da arquitetura em camadas com o padrão MVC:

1. **Models**: Definem a estrutura dos dados
2. **DTOs (Data Transfer Objects)**: Validam os dados recebidos
3. **Repositories**: Abstraem o acesso ao banco de dados
4. **Services**: Implementam a lógica de negócios
5. **Controllers**: Processam as requisições e respostas
6. **Routes**: Definem os endpoints da API
7. **Middlewares**: Processam requisições para validação e autenticação

## Licença

Este projeto está licenciado sob a licença MIT.