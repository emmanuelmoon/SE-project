#!/bin/bash
CURRENT_DIR=$(pwd)
FRONTEND_DIR="${CURRENT_DIR}/client"

cd "${FRONTEND_DIR}" && npm install
cd "${FRONTEND_DIR}" && npm run build
cd "${CURRENT_DIR}"
