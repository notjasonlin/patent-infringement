#!/bin/bash

# Load environment variables from .env.local
source .env.local

# Build the Docker image with environment variables
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --build-arg OPENAI_API_KEY=$OPENAI_API_KEY \
  -t checkr-app .

# Save the image to a tar file
docker save checkr-app > checkr-app.tar

echo "Docker image has been built and saved to checkr-app.tar" 