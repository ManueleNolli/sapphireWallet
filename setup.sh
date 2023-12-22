#!/bin/bash

################
## SETUP FILE ##
################

#1. Copy env.example to env
folders=("mobileapp" "blockchain" "backend/sapphire-relayer" "backend/wallet-factory")

copy_env() {
  if [ -e .env.example ]; then
    cp .env.example .env
    echo "Copied .env.example to .env in $PWD"
  else
    echo ".env.example not found in $PWD"
  fi
}

for folder in "${folders[@]}"; do
  cd "$folder" || exit 1
  copy_env
  cd - || exit 1  # Return to the previous directory
done

