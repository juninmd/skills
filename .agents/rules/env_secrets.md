# Rule: Environment & Secrets
# Identificador: env_secrets

## Descrição
Protocolo para gerenciamento de variáveis de ambiente e proteção de informações sensíveis.

## Práticas Detectadas
- Uso de arquivos `.env` para configurações locais.
- Referência a segredos do GCP/GitLab CI.

## Regras
1. **No Secrets in Code**: NUNCA commite arquivos `.env`, chaves `.json` de service accounts ou tokens. Estes arquivos DEVEM estar no `.gitignore`.
2. **Environment Templates**: Sempre mantenha um arquivo `.env.example` atualizado com as chaves necessárias (mas com valores vazios ou fakes).
3. **Loading Protocol**: Ao iniciar um script ou serviço, verifique se as variáveis obrigatórias estão presentes e emita um erro claro caso faltem.
4. **Secret Retrieval**: Prefira buscar segredos em runtime (ex: GCP Secret Manager) em vez de armazená-los em arquivos de texto no servidor.

## Protocolo de Segurança
- Se a IA sugerir um comando `export TOKEN=...`, ela deve avisar imediatamente: "⚠️ Lembre-se de não salvar este comando no seu histórico de shell se o token for sensível".
