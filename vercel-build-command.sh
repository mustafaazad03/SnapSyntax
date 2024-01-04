#!/bin/bash

# Add prisma generate step before the actual build
npx prisma generate
npm run build
