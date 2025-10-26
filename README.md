# RentPath

A rental property management platform built with Laravel and React.

## Tech Stack

- **Backend**: Laravel 12, PHP 8.3
- **Frontend**: React, TypeScript, Inertia.js, Tailwind CSS
- **Database**: MySQL 8.0
- **Infrastructure**: AWS (Elastic Beanstalk, RDS, S3, CloudFront)
- **Deployment**: Terraform, AWS CodePipeline

## Quick Start

### Prerequisites

- PHP 8.3+
- Node.js 18+
- Composer
- SQLite (for local development)

### Installation

```bash
# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Build assets
npm run build
```

### Development

```bash
# Start all services (Laravel, queue, logs, Vite)
composer dev

# For mobile development (network access)
composer dev:lan
```

Visit `http://localhost:8000`

## File Upload Limits

- Profile pictures: 5MB (JPEG, PNG, WEBP)
- Documents (ID/License): 20MB (PDF, JPEG, PNG, JPG)
- Infrastructure max: 64MB

## Deployment

Automatic deployment via AWS CodePipeline on push to `main` branch.

```bash
# Deploy infrastructure changes
cd infrastructure
terraform plan
terraform apply
```

## License

Proprietary
