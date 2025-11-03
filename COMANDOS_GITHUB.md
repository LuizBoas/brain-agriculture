# Comandos para Enviar para GitHub

Após criar o repositório privado no GitHub, execute estes comandos:

## 1. Adicionar o remote (substitua SEU_USUARIO pelo seu usuário do GitHub)

```bash
git remote add origin https://github.com/SEU_USUARIO/brain-agriculture.git
```

## 2. Verificar o remote

```bash
git remote -v
```

## 3. Enviar o código para o GitHub

```bash
git push -u origin main
```

## Se precisar autenticar:

Se o GitHub solicitar autenticação, você pode usar:

- **Personal Access Token (recomendado)**: 
  - Vá em GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Crie um novo token com permissão `repo`
  - Use o token como senha quando solicitado

- **Ou use SSH** (se configurado):
  ```bash
  git remote set-url origin git@github.com:SEU_USUARIO/brain-agriculture.git
  git push -u origin main
  ```

