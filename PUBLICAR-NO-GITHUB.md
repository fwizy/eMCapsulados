# Publicar no GitHub Pages

O README apresenta a empresa. Este guia separado explica a publicação.

1. Crie um repositório no GitHub e envie os arquivos deste projeto para a raiz. Inclua a pasta `.github`, que contém a publicação automática. Não envie `node_modules`.
2. No repositório, abra **Settings > Pages**.
3. Em **Build and deployment**, selecione **GitHub Actions**.
4. Abra a aba **Actions** e execute **Publicar eMCapsulados no GitHub Pages**, ou faça um novo envio para a branch `main`.
5. Aguarde a execução terminar. O endereço publicado aparecerá na etapa de deploy e em **Settings > Pages**.

A publicação detecta automaticamente se o endereço usa uma pasta de repositório ou a raiz de um domínio. As páginas usam navegação por hash, como `/#/produtos`, para que os links e o recarregamento funcionem no GitHub Pages sem servidor.

Para testar no computador, use Node.js 24 e pnpm 11.25.0:

```sh
corepack enable
pnpm install
pnpm dev
```

Para gerar uma versão estática:

```sh
pnpm build
```

O resultado fica em `dist`. A pasta `site-pronto` deste pacote também traz os arquivos compilados para hospedagem estática, sem precisar instalar ferramentas.

O carrinho e a escolha de tema ficam no navegador. Checkout e envio de formulários não fazem parte desta demonstração. Dados empresariais e condições comerciais são fictícios.
