# Profileit - POD Sales Intelligence Platform

A comprehensive POD Sales Intelligence Platform that provides end-to-end solutions for print-on-demand sellers. The platform combines AI-powered buyer profiling, SEO optimization, profit analysis, marketing calendar planning, and design variation strategies.

## Features

- **AI-Powered Buyer Profiling**: Generate detailed 9-category buyer personas
- **Design Recommendations**: Get actionable slogans, visuals, fonts, colors, and mockups
- **SEO Optimization**: Product titles, descriptions, and keyword strategies
- **Profit Analysis**: Pricing strategies and cost breakdowns
- **Marketing Calendar**: Seasonal campaign planning
- **Trending Insights**: Market intelligence and competitor analysis
- **Payment Integration**: Stripe-powered payment processing
- **Admin Dashboard**: Secure admin access with unlimited profile generation

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT-4 with intelligent demo fallbacks
- **Payments**: Stripe integration
- **Build**: Vite + esbuild

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Run database migrations:**
   ```bash
   npm run db:push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Digital Ocean.

## Admin Access

- Email: `joan@example.com`
- Password: `admin123`

## Environment Variables

Required environment variables:
- `OPENAI_API_KEY`: OpenAI API key
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption secret
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

## License

MIT
