#!/bin/bash

# Script de configuration des variables d'environnement pour PharmaGGD

echo "🔧 Configuration des variables d'environnement PharmaGGD"
echo "=================================================="

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cat > .env << EOF
APP_NAME=PharmaGGD
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8000

APP_LOCALE=fr
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=fr_FR

APP_MAINTENANCE_DRIVER=file
APP_MAINTENANCE_STORE=database

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pharma_gdd
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="\${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="\${APP_NAME}"

# Admin passwords - Change these in production!
ADMIN_PASSWORD=admin
CATALOG_PASSWORD=admin_cat
EOF
    echo "✅ Fichier .env créé"
else
    echo "✅ Fichier .env existe déjà"
fi

# Générer la clé d'application
echo "🔑 Génération de la clé d'application..."
php artisan key:generate

# Demander les mots de passe admin
echo ""
echo "🔐 Configuration des mots de passe administrateurs"
echo "=================================================="

read -p "Mot de passe pour l'admin principal (admin@pharma-gdd.com) [admin]: " admin_pass
admin_pass=${admin_pass:-admin}

read -p "Mot de passe pour l'admin catalogue (catalog@pharma-gdd.com) [admin_cat]: " catalog_pass
catalog_pass=${catalog_pass:-admin_cat}

# Mettre à jour les mots de passe dans .env
sed -i.bak "s/ADMIN_PASSWORD=.*/ADMIN_PASSWORD=$admin_pass/" .env
sed -i.bak "s/CATALOG_PASSWORD=.*/CATALOG_PASSWORD=$catalog_pass/" .env

echo ""
echo "🎉 Configuration terminée !"
echo "=========================="
echo "📧 Admin principal: admin@pharma-gdd.com"
echo "🔑 Mot de passe: $admin_pass"
echo ""
echo "📧 Admin catalogue: catalog@pharma-gdd.com"
echo "🔑 Mot de passe: $catalog_pass"
echo ""
echo "🚀 Vous pouvez maintenant exécuter:"
echo "   php artisan migrate"
echo "   php artisan db:seed"
