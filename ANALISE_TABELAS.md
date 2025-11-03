# Análise de Uso de Tabelas - Brain Agriculture

## Resumo
**Todas as tabelas estão sendo utilizadas.** Não foram encontradas tabelas não utilizadas que possam ser removidas.

---

## Tabelas do Sistema Laravel (NÃO remover)

Estas tabelas são essenciais para o funcionamento do framework Laravel:

### 1. `users` ✅ **USADA**
- **Uso:**
  - `App\Http\Controllers\Admin\AdminController` - CRUD de administradores
  - `App\Models\Producer` - Relacionamento `created_by` (foreign key)
  - Sistema de autenticação Laravel
- **Status:** Ativa e essencial

### 2. `password_reset_tokens` ✅ **USADA**
- **Uso:** Sistema padrão do Laravel para reset de senhas
- **Status:** Ativa (gerenciada pelo framework)

### 3. `sessions` ✅ **USADA**
- **Uso:** Sistema padrão do Laravel para gerenciamento de sessões
- **Status:** Ativa (gerenciada pelo framework)

### 4. `cache` ✅ **USADA**
- **Uso:** Sistema padrão do Laravel para cache
- **Status:** Ativa (gerenciada pelo framework)

### 5. `cache_locks` ✅ **USADA**
- **Uso:** Sistema padrão do Laravel para locks de cache
- **Status:** Ativa (gerenciada pelo framework)

### 6. `jobs` ✅ **USADA**
- **Uso:** Sistema padrão do Laravel para filas de jobs
- **Status:** Ativa (gerenciada pelo framework)

### 7. `job_batches` ✅ **USADA**
- **Uso:** Sistema padrão do Laravel para batches de jobs
- **Status:** Ativa (gerenciada pelo framework)

### 8. `failed_jobs` ✅ **USADA**
- **Uso:** Sistema padrão do Laravel para jobs que falharam
- **Status:** Ativa (gerenciada pelo framework)

---

## Tabelas da Aplicação (NÃO remover)

### 1. `producers` ✅ **USADA**
- **Model:** `App\Models\Producer`
- **Controllers que usam:**
  - `App\Http\Controllers\Admin\ProducerController` - CRUD completo
  - `App\Http\Controllers\Admin\FarmController` - Relacionamento com fazendas
  - `App\Http\Controllers\Admin\DashboardController` - Relacionamento indireto
- **Relacionamentos:**
  - `hasMany` com `farms`
  - `belongsTo` com `users` (created_by)
- **Status:** Ativa e essencial

### 2. `farms` ✅ **USADA**
- **Model:** `App\Models\Farm`
- **Controllers que usam:**
  - `App\Http\Controllers\Admin\FarmController` - CRUD completo
  - `App\Http\Controllers\Admin\ProducerController` - Criação/edição de produtores
  - `App\Http\Controllers\Admin\DashboardController` - Estatísticas e gráficos
- **Relacionamentos:**
  - `belongsTo` com `producers`
  - `hasMany` com `harvests`
- **Status:** Ativa e essencial

### 3. `harvests` ✅ **USADA**
- **Model:** `App\Models\Harvest`
- **Controllers que usam:**
  - `App\Http\Controllers\Admin\HarvestController` - Listagem e busca
  - `App\Http\Controllers\Admin\ProducerController` - Criação/edição de produtores
  - `App\Http\Controllers\Admin\FarmController` - Criação/edição de fazendas
- **Relacionamentos:**
  - `belongsTo` com `farms`
  - `hasMany` com `crops`
- **Status:** Ativa e essencial

### 4. `crops` ✅ **USADA**
- **Model:** `App\Models\Crop`
- **Controllers que usam:**
  - `App\Http\Controllers\Admin\ProducerController` - Criação/edição de produtores
  - `App\Http\Controllers\Admin\FarmController` - Criação de fazendas
  - `App\Http\Controllers\Admin\HarvestController` - Busca
  - `App\Http\Controllers\Admin\DashboardController` - Gráfico por cultura
- **Relacionamentos:**
  - `belongsTo` com `harvests`
- **Status:** Ativa e essencial

---

## Conclusão

✅ **Não há tabelas não utilizadas no banco de dados.**

Todas as 12 tabelas (8 do sistema Laravel + 4 da aplicação) estão sendo ativamente utilizadas. O banco de dados está bem estruturado e sem tabelas órfãs.

### Recomendações:
1. **Não remover nenhuma tabela** - todas são necessárias
2. Manter a estrutura atual, que segue boas práticas:
   - Relacionamentos bem definidos
   - Foreign keys apropriadas
   - Cascata de exclusão configurada corretamente
3. Continuar monitorando o uso das tabelas conforme a aplicação cresce

---

**Data da análise:** 2025-01-11
**Analisado por:** Análise automatizada do código

