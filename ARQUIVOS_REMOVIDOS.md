# Arquivos Removidos - Brain Agriculture

## Data: 2025-01-11

### Arquivos não utilizados removidos:

1. **Páginas de Autenticação não utilizadas:**
   - `resources/frontend/pages/auth/forgot-password.tsx` - Não há rota definida
   - `resources/frontend/pages/auth/register.tsx` - Não há rota definida
   - `resources/frontend/pages/auth/reset-password.tsx` - Não há rota definida
   - `resources/frontend/pages/auth/verify-email.tsx` - Não há rota definida
   - `resources/frontend/pages/auth/confirm-password.tsx` - Não há rota definida

2. **Componentes não utilizados:**
   - `resources/frontend/components/admin-panel/celebration-modal.tsx` - Não importado em nenhum lugar
   - `resources/frontend/components/admin-panel/sortable-badges-grid.tsx` - Não importado em nenhum lugar
   - `resources/frontend/components/auth/` - Pasta vazia

3. **Layouts não utilizados:**
   - `resources/frontend/layouts/user-layout.tsx` - Não utilizado em nenhuma página
   - `resources/frontend/layouts/terms-layout.tsx` - Não utilizado em nenhuma página
   - `resources/frontend/layouts/user-course.tsx` - Não utilizado em nenhuma página

4. **Services não utilizados:**
   - `app/Services/DocumentValidationService.php` - Não importado em nenhum controller

### Observação:
- Arquivos de navegação (header/footer) foram mantidos pois são usados pelos layouts que podem ser necessários no futuro
- Componentes comuns mantidos para reutilização futura
- `ClasseFilterContext` mantido pois está sendo usado no `AdminLayout`, mesmo que não esteja sendo consumido pelas páginas atualmente
- Hooks (`useStudentMap`, `useGlobalFilterRefresh`, `useHomeSidePanel`) mantidos mas não estão sendo utilizados - podem ser removidos futuramente se confirmado
- Componentes `modules.tsx` e `requirements.tsx` mantidos pois podem ser usados em funcionalidades futuras relacionadas a cursos

