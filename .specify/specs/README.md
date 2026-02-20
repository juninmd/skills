# Exemplos de Specs SDD

Esta pasta contém exemplos de specs implementadas seguindo a metodologia Specification-Driven Development (SDD).

## Specs Disponíveis

### [docker-troubleshooting](docker-troubleshooting/)
- **Status**: Em desenvolvimento
- **Descrição**: Skill para diagnóstico e resolução de problemas comuns em containers Docker
- **Plataformas**: Todas as plataformas suportadas
- **Exemplo de**: Spec completa com cenários de troubleshooting

### [init-padrao-labs](init-padrao-labs/)
- **Status**: Em desenvolvimento
- **Descrição**: Ferramenta de inicialização de projetos seguindo os padrões Luizalabs
- **Plataformas**: CLI, IDE integrations
- **Exemplo de**: Spec abrangente com múltiplas funcionalidades

## Como Usar Estes Exemplos

1. **Estude a estrutura**: Cada pasta contém `spec.md`, `plan.md`, `tasks.md` e `checklist.md`
2. **Analise o formato**: Veja como são estruturados cenários de usuário, requisitos e critérios de sucesso
3. **Adapte para seu projeto**: Use como template para criar suas próprias specs

## Criando Sua Própria Spec

Para criar uma nova spec baseada nestes exemplos:

```bash
pnpm spec:init [nome-da-sua-feature]
```

Isso criará uma nova pasta com templates baseados nos exemplos aqui disponíveis.

## Links Úteis

- [Documentação SDD](../../docs/sdd.md)
- [Templates de Spec](../templates/)
- [Workflow Completo](../../../.agent/workflows/sdd-new-feature.md)