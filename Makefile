.PHONY: install dev build preview clean generate help spec-init spec-validate spec-status spec-check

SHELL := /bin/bash

help:
	@echo "📚 Luizalabs Agents & Skills Documentation"
	@echo ""
	@echo "Available commands:"
	@echo "  make install        - Install dependencies"
	@echo "  make generate       - Generate documentation from .agent/"
	@echo "  make dev            - Start development server (with watch)"
	@echo "  make build          - Build for production"
	@echo "  make preview        - Preview production build locally"
	@echo "  make clean          - Clean generated files"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run Docker container"
	@echo ""
	@echo "📋 Spec-Driven Development:"
	@echo "  make spec-init FEATURE=<name>  - Create new feature spec"
	@echo "  make spec-validate [FEATURE]   - Validate specs (all or specific)"
	@echo "  make spec-status               - Show specs status dashboard"
	@echo "  make spec-check [FEATURE]      - Validate + show status (combined)"
	@echo ""
	@echo "  make help           - Show this help message"
	@echo ""

install:
	npm install

generate:
	node scripts/loader.js

dev: generate
	npm run docs:dev

build: generate
	npm run docs:build

preview:
	npm run docs:preview

clean:
	rm -rf docs/.vitepress/dist
	rm -rf docs/.vitepress/cache
	rm -f docs/.vitepress/sidebar.js
	rm -f docs/catalog.json
	rm -rf docs/agents docs/skills docs/rules docs/hooks docs/workflows
	rm -f docs/search.md

docker-build:
	docker build -t luizalabs-agents-docs:latest .

docker-run:
	docker run -p 8080:8080 luizalabs-agents-docs:latest

docker-dev:
	docker build -t luizalabs-agents-docs:dev --target 0 .
	docker run -it -p 5173:5173 -v $(PWD):/app luizalabs-agents-docs:dev npm run docs:dev

# --- Spec-Driven Development ---

spec-init:
ifndef FEATURE
	@echo "Erro: FEATURE é obrigatório. Uso: make spec-init FEATURE=<nome>"
	@exit 1
endif
	node .specify/scripts/init-spec.mjs $(FEATURE)

spec-validate:
ifdef FEATURE
	node .specify/scripts/check-spec.mjs $(FEATURE)
else
	node .specify/scripts/check-spec.mjs
endif

spec-status:
	node .specify/scripts/check-spec.mjs

spec-check:
ifdef FEATURE
	node .specify/scripts/check-spec.mjs $(FEATURE)
else
	node .specify/scripts/check-spec.mjs
endif

