# Cloudflare Workers D1 Database Setup

## Prerequisites

- Node.js 18+
- Cloudflare account with Workers access
- Wrangler CLI: `npm install -g wrangler`

## Database Setup Commands

```bash
# Create production database
wrangler d1 create apis-guru-data

# Initialize production schema
wrangler d1 execute apis-guru-data --file=./schema.sql

# Create development database
wrangler d1 create apis-guru-data-dev

# Initialize development schema
wrangler d1 execute apis-guru-data-dev --file=./schema.sql
```

## Manual Configuration

1. Copy `database_id` from create commands
2. Update `wrangler.toml` with production and development `database_id`

## Next Steps

```bash
# Deploy Workers
wrangler deploy

# Start development server
wrangler dev

# Test API endpoint
curl http://localhost:8787/api/fetch-apis
```
