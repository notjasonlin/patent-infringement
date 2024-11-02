<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Checkr - Patent Analysis Platform</h1>
</a>

<p align="center">
 AI-powered patent infringement analysis tool built with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#local-development"><strong>Local Development</strong></a> ·
  <a href="#docker-deployment"><strong>Docker Deployment</strong></a>
</p>
<br/>

## About

Checkr is an AI-powered patent analysis platform that helps companies identify potential patent infringement risks. It leverages OpenAI's GPT models to analyze patents and products, providing detailed insights and risk assessments.

## Features

- **Patent Search & Analysis**: Search through patent databases and analyze potential infringement risks
- **AI-Powered Analysis**: Utilizes OpenAI's GPT models for detailed patent analysis
- **Risk Assessment**: Provides comprehensive risk levels (High, Moderate, Low) for potential infringements
- **Company & Product Management**: Track multiple companies and their products
- **Analysis History**: Store and review past analyses
- **Export Capabilities**: Export analyses in CSV and JSON formats
- **User Authentication**: Secure authentication powered by Supabase
- **Dark/Light Mode**: Customizable theme support

## Tech Stack

- Next.js 14 (App Router)
- Supabase (Auth & Database)
- OpenAI API
- TypeScript
- Tailwind CSS
- shadcn/ui Components

## Local Development

1. Clone the repository
2. create `.env.local` and insert the following:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Docker Deployment

### Prerequisites
- Docker installed on your machine
- Your environment variables ready

### Option 1: Using Docker Directly

1. Build the Docker image:
```bash
docker build -t checkr-app .
```

2. Run the container:
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_supabase_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key \
  -e OPENAI_API_KEY=your_openai_key \
  checkr-app
```

Or using your `.env.local` file:
```bash
docker run -p 3000:3000 --env-file .env.local checkr-app
```

### Option 2: Using Docker Compose

1. Create a `docker-compose.yml` file in your project root:
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

3. Stop the containers:
```bash
docker-compose down
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `OPENAI_API_KEY`: Your OpenAI API key

## License

This project is licensed under the MIT License - see the LICENSE file for details.