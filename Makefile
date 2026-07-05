.PHONY: install up down reset logs

install: up wait db-setup jwt fixtures
	@echo ""
	@echo "✅  Installation terminée !"
	@echo "   Frontend : http://localhost:3000"
	@echo "   Backend  : http://localhost:8000"
	@echo "   API docs : http://localhost:8000/api"
	@echo ""
	@echo "   Admin Happy Paws : admin@happy-paws.com / admin1234"
	@echo "   Admin Woof Valley: admin@woof-valley.com / admin1234"
	@echo "   Users             : alice@example.com ... karine@example.com / password"

up:
	docker compose up --build -d

down:
	docker compose down

reset:
	docker compose down -v
	$(MAKE) install

wait:
	@echo "⏳  Attente de MySQL..."
	@until docker compose exec db mysqladmin ping -uroot -proot --silent 2>/dev/null; do sleep 2; done
	@echo "✅  MySQL prêt"

db-setup:
	docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

jwt:
	docker compose exec backend php bin/console lexik:jwt:generate-keypair --overwrite --no-interaction

fixtures:
	docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction

logs:
	docker compose logs -f

cache-clear:
	docker compose exec backend php bin/console cache:clear
	docker compose restart backend
