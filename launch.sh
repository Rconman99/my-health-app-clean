#!/bin/bash
# 🚀 Auto-launch your Health App with VS Code and Expo (with cache clear)

# Set working directory
APP_DIR=~/my-health-app/my-health-app-clean

echo "🔍 Navigating to project directory: $APP_DIR"
cd "$APP_DIR" || {
  echo "❌ Failed to navigate to $APP_DIR. Directory not found."
  exit 1
}

# Open VS Code
echo "🛠️  Launching VS Code..."
code .

# Start Expo with clean cache
echo "🚀 Starting Expo (clearing cache)..."
npx expo start --clear