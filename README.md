# RentPath

A rental property management platform for the European market. Streamlines the rental process from property listing to tenant applications.

## Features

- **Property Management** - Guided wizard to list rentals with photos, specs, and terms
- **Lead Tracking** - Manage prospective tenants from initial interest through application
- **Invite System** - Private tokens for targeted prospects or public listings for broader reach
- **Application Management** - Review tenant applications with employment, income, and documents
- **Multi-language Support** - English, German, French, Dutch

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

# Add to /etc/hosts
echo '127.0.0.1 rentpath.test manager.rentpath.test' | sudo tee -a /etc/hosts

# Run migrations
php artisan migrate

# Build assets
npm run build
```

### Development

```bash
# Start Laravel server
php artisan serve

# In another terminal: Start Vite dev server
npm run dev
```

Visit `http://rentpath.test:8000`

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
