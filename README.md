# 🌾 Brain Agriculture - Sistema de Gestão Agrícola

Sistema completo de gestão agrícola desenvolvido com Laravel e React, permitindo o gerenciamento de produtores, fazendas, safras e culturas. Desenvolvido seguindo princípios SOLID, Clean Code e boas práticas de desenvolvimento.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Acesso à Versão de Demonstração](#acesso-à-versão-de-demonstração)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [API e Rotas](#api-e-rotas)

---

## 🎯 Sobre o Projeto

O **Brain Agriculture** é um sistema web completo para gestão de dados agrícolas, permitindo:

- ✅ Gerenciamento de **Produtores** (CPF/CNPJ)
- ✅ Gerenciamento de **Fazendas** com dados geográficos
- ✅ Gerenciamento de **Safras** e **Culturas**
- ✅ Dashboard com visualizações e estatísticas
- ✅ Soft Delete em cascata
- ✅ Validação completa de documentos brasileiros
- ✅ Interface responsiva e moderna

---

## 🌐 Acesso à Versão de Demonstração

O sistema está disponível online para demonstração:

**URL de Acesso:** [https://teste.dynamiseducacao.com.br/login](https://teste.dynamiseducacao.com.br/login)

### Credenciais de Acesso

```
Email: admin@brain-agriculture.com
Senha: password
```

### ⚠️ Importante

- Esta é uma versão de demonstração/teste
- Os dados podem ser resetados periodicamente
- Use apenas para avaliação do sistema

---

## 🛠 Tecnologias Utilizadas

### Backend
- **Laravel 12** - Framework PHP
- **PHP 8.2+** - Linguagem de programação
- **SQLite** - Banco de dados (pode ser MySQL/PostgreSQL)
- **Inertia.js** - Integração frontend-backend
- **Ziggy** - Rotas Laravel no JavaScript

### Frontend
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool e dev server
- **Chart.js** - Gráficos e visualizações
- **React Simple Maps** - Mapas interativos
- **Sonner** - Notificações toast

### Testes
- **Jest** - Framework de testes JavaScript
- **React Testing Library** - Testes de componentes React
- **PHPUnit** - Testes PHP (Laravel)

### Outras Ferramentas
- **Laravel Nanoid** - IDs únicos
- **Faker** - Dados fictícios para desenvolvimento
- **Prettier** - Formatação de código

---

## 📦 Requisitos

Antes de começar, certifique-se de ter instalado:

- **PHP 8.2** ou superior
- **Composer** (gerenciador de dependências PHP)
- **Node.js 18+** e **npm**
- **Git**

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/brain-agriculture.git
cd brain-agriculture
```

### 2. Instale as dependências PHP

```bash
composer install
```

### 3. Instale as dependências Node.js

```bash
npm install
```

### 4. Configure o ambiente

Copie o arquivo de exemplo e configure:

```bash
cp .env.example .env
```

Gere a chave da aplicação:

```bash
php artisan key:generate
```

### 5. Configure o banco de dados

Edite o arquivo `.env` e configure o banco de dados:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/caminho/absoluto/para/database/database.sqlite
```

Ou use MySQL/PostgreSQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=brain_agriculture
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

### 6. Execute as migrações

```bash
php artisan migrate
```

### 7. Crie um usuário administrador

Execute o seeder para criar um usuário admin padrão:

```bash
php artisan db:seed
```

Ou crie manualmente via tinker:

```bash
php artisan tinker
```

```php
User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
    'is_admin' => true
]);
```

---

## ⚙️ Configuração

### Variáveis de Ambiente Importantes

No arquivo `.env`, configure:

```env
APP_NAME="Brain Agriculture"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Locale para português brasileiro
APP_LOCALE=pt_BR
APP_FALLBACK_LOCALE=pt_BR
```

### Configuração de Email (Opcional)

Para notificações por email:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=seu_usuario
MAIL_PASSWORD=sua_senha
```

---

## 🏃 Executando o Projeto

### Desenvolvimento

Para rodar o projeto em modo desenvolvimento, você precisa de dois terminais:

**Terminal 1 - Servidor Laravel:**
```bash
php artisan serve
```

**Terminal 2 - Vite (Frontend):**
```bash
npm run dev
```

Ou use o comando do Composer que roda ambos simultaneamente:

```bash
composer run dev
```

Acesse: **http://localhost:8000**

### Produção

Para build de produção:

```bash
# Build do frontend
npm run build

# Otimizar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🧪 Testes

### Testes Frontend (Jest)

Execute todos os testes:

```bash
npm test
```

Modo watch (re-executa ao salvar):

```bash
npm run test:watch
```

Com cobertura de código:

```bash
npm run test:coverage
```

### Testes Backend (PHPUnit)

Execute os testes PHP:

```bash
php artisan test
```

Ou diretamente:

```bash
./vendor/bin/phpunit
```

### Status dos Testes

Atualmente, o projeto possui **37 testes frontend** passando:

- ✅ Componentes React (Button, Input, Select, Container, SearchInput)
- ✅ Utilitários (formatadores, dados geográficos)
- ✅ Validações e lógica de negócio

---

## 📁 Estrutura do Projeto

```
brain-agriculture/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── ProducerController.php
│   │   │   │   ├── FarmController.php
│   │   │   │   ├── HarvestController.php
│   │   │   │   └── AdminController.php
│   │   │   └── Auth/
│   │   │       └── AuthenticatedSessionController.php
│   │   ├── Middleware/
│   │   │   ├── AdminMiddleware.php
│   │   │   └── HandleInertiaRequests.php
│   │   └── Requests/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Producer.php
│   │   ├── Farm.php
│   │   └── Harvest.php
│   └── Services/
│       ├── ProducerService.php
│       ├── FarmService.php
│       └── HarvestService.php
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   └── frontend/
│       ├── components/
│       │   ├── common/        # Componentes reutilizáveis
│       │   ├── admin-panel/   # Componentes do painel admin
│       │   └── __tests__/     # Testes dos componentes
│       ├── pages/
│       │   └── panel-admin/   # Páginas do painel administrativo
│       ├── layouts/           # Layouts da aplicação
│       ├── hooks/             # React Hooks customizados
│       ├── utils/             # Funções utilitárias
│       ├── types/             # Definições TypeScript
│       └── __tests__/         # Testes e configurações
├── routes/
│   ├── web.php               # Rotas públicas
│   └── admin.php             # Rotas administrativas
├── tests/
│   ├── Feature/              # Testes de integração
│   └── Unit/                 # Testes unitários
├── public/                   # Arquivos públicos
├── .env                      # Configurações do ambiente
├── composer.json             # Dependências PHP
├── package.json              # Dependências Node.js
├── vite.config.js           # Configuração do Vite
├── tailwind.config.js       # Configuração do Tailwind
├── tsconfig.json            # Configuração TypeScript
└── jest.config.js           # Configuração Jest
```

---

## 🎨 Funcionalidades

### 1. Dashboard Principal

- 📊 Estatísticas gerais (total de produtores, fazendas, safras)
- 🗺️ Mapa interativo do Brasil por estado
- 📈 Gráficos de pizza para:
  - Distribuição por cultura
  - Uso do solo (área agricultável vs vegetação)

### 2. Gerenciamento de Produtores

- ✅ Listagem com paginação (10 por página)
- ✅ Busca por nome ou documento
- ✅ Criação de produtores (CPF/CNPJ)
- ✅ Edição de dados
- ✅ Visualização de detalhes com fazendas associadas
- ✅ Soft delete em cascata
- ✅ Validação de CPF/CNPJ brasileiros

### 3. Gerenciamento de Fazendas

- ✅ Listagem com paginação
- ✅ Criação de fazendas associadas a produtores
- ✅ Edição completa (incluindo mudança de proprietário)
- ✅ Integração com API IBGE para estados e cidades
- ✅ Validação de áreas (total, agricultável, vegetação)
- ✅ Gerenciamento de safras e culturas dentro do modal de edição
- ✅ Soft delete em cascata

### 4. Gerenciamento de Safras

- ✅ Listagem de todas as safras
- ✅ Edição de safras e culturas
- ✅ Visualização por ano e fazenda

### 5. Gerenciamento de Administradores

- ✅ Listagem de usuários administradores
- ✅ Criação de novos administradores
- ✅ Edição de dados
- ✅ Exclusão de administradores

### 6. Autenticação

- ✅ Login seguro
- ✅ Middleware de autenticação
- ✅ Middleware de administrador
- ✅ Logout

---

## 🏗️ Arquitetura

### Padrão de Arquitetura

O projeto segue uma **arquitetura em camadas**:

```
Controller → Service → Model → Database
    ↓
  View (React/Inertia)
```

### Princípios Aplicados

- **SOLID**: Responsabilidades bem definidas
- **DRY**: Sem duplicação de código
- **KISS**: Soluções simples e diretas
- **Clean Code**: Código limpo e legível

### Services (Camada de Negócio)

Os Services contêm a lógica de negócio:

- `ProducerService`: Lógica de produtores
- `FarmService`: Lógica de fazendas
- `HarvestService`: Lógica de safras

### Soft Delete

Todos os modelos principais implementam soft delete:

- `Producer` → Soft delete de fazendas
- `Farm` → Soft delete de safras
- `Harvest` → Soft delete de culturas

---

## 🔌 API e Rotas

### Rotas Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Redireciona para login ou dashboard |
| GET | `/login` | Página de login |
| POST | `/login` | Processa login |
| POST | `/logout` | Logout |

### Rotas Administrativas (precisa autenticação e permissão admin)

#### Dashboard
- `GET /admin/dashboard` - Dashboard principal

#### Produtores
- `GET /admin/dashboard/producer` - Lista produtores
- `GET /admin/dashboard/producer/{id}` - Detalhes do produtor
- `POST /admin/producer` - Criar produtor
- `PUT /admin/producer/{id}` - Atualizar produtor
- `DELETE /admin/producer/{id}` - Deletar produtor

#### Fazendas
- `GET /admin/dashboard/farm` - Lista fazendas
- `POST /admin/producer/{producerId}/farm` - Criar fazenda
- `PUT /admin/producer/{producerId}/farm/{farmId}` - Atualizar fazenda
- `DELETE /admin/producer/{producerId}/farm/{farmId}` - Deletar fazenda

#### Safras
- `GET /admin/dashboard/harvest` - Lista safras
- `PUT /admin/harvest/{id}` - Atualizar safra

#### Administradores
- `GET /admin/dashboard/admin` - Lista administradores
- `POST /admin/admin` - Criar administrador
- `PUT /admin/admin/{id}` - Atualizar administrador
- `DELETE /admin/admin/{id}` - Deletar administrador

---

## 📝 Validações

### Documentos

- **CPF**: Validação completa com dígitos verificadores
- **CNPJ**: Validação completa com dígitos verificadores
- Limite de caracteres no frontend (11 para CPF, 14 para CNPJ)

### Fazendas

- Área total obrigatória e maior que zero
- Soma das áreas (agricultável + vegetação) não pode exceder área total
- Estados e cidades validados via API IBGE

### Mensagens de Erro

Todas as mensagens de erro vêm do backend em **português brasileiro**.

---

## 🎨 Interface

### Design Responsivo

- ✅ Layout adaptável para desktop, tablet e mobile
- ✅ Sidebar colapsável no mobile
- ✅ Tabelas com padding ajustado para mobile
- ✅ Botões posicionados adequadamente em cada dispositivo

### Componentes Reutilizáveis

- `Button` - Botões com variantes
- `Input` / `InputPopUpAdmin` - Campos de entrada
- `Select` - Select com busca
- `Container` - Container padrão
- `SearchInput` - Campo de busca
- `BrasilMap` - Mapa interativo do Brasil

### Tema

- Tema claro para área administrativa
- Cores primárias personalizáveis via Tailwind
- Ícones via Iconify

---

## 🔒 Segurança

- Middleware de autenticação
- Middleware de administrador
- Validação de dados no backend
- Proteção CSRF
- Sanitização de inputs
- Soft delete para preservar integridade dos dados

---

## 📊 Banco de Dados

### Tabelas Principais

- `users` - Usuários do sistema
- `producers` - Produtores rurais
- `farms` - Fazendas
- `harvests` - Safras
- `crops` - Culturas (dentro de safras)

### Relacionamentos

- User → Producer (created_by)
- Producer → Farm (1:N)
- Farm → Harvest (1:N)
- Harvest → Crop (1:N)

---

## 🚀 Deploy

### Preparação para Produção

1. Configure `.env` para produção
2. Execute `npm run build`
3. Execute `php artisan config:cache`
4. Execute `php artisan route:cache`
5. Execute `php artisan view:cache`
6. Configure servidor web (Nginx/Apache)

### Variáveis de Ambiente de Produção

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seu-dominio.com
```

---

## 📚 Documentação Adicional

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

---

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através do repositório.

---

**Desenvolvido com ❤️ usando Laravel, React e TypeScript**
