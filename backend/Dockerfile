FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql intl zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/local/bin/composer /usr/local/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-scripts

EXPOSE 8000

CMD mkdir -p config/jwt && \
    php bin/console lexik:jwt:generate-keypair --skip-if-exists && \
    php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration && \
    php -S 0.0.0.0:${PORT:-8000} -t public/
