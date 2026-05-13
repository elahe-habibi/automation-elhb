# Postman API Testing Collection

This directory contains **Postman collections and environments** used for automated API testing.
The purpose of these tests is to validate API functionality, response structure, status codes,
and basic business rules.

---

## Overview

The Postman collections in this folder are designed to:

- Test RESTful APIs using different HTTP methods (GET, POST, PUT, DELETE)
- Validate response status codes and payloads
- Use environment variables for dynamic data
- Perform basic assertions using Postman test scripts
- Prepare collections for CLI execution using **Newman**

---

## Contents

- **Clasor-qaqc-deploy.postman_collection.json**  
  Main API test collection containing functional API test cases.

- **dms.postman_environment.json**  
  Environment variables used for managing base URLs, tokens, and dynamic data.

- **sanitize-postman.ps1 / sanitize-postman.cmd**  
  Scripts used to remove sensitive data (tokens, credentials) before committing
  collections to GitHub.

---

## How to Run the Collection (Postman GUI)

1. Open **Postman**
2. Import the collection file:
Clasor-qaqc-deploy.postman_collection.json


3. Import the environment file:
dms.postman_environment.json


4. Select the environment
5. Run the collection using **Collection Runner**

---

## Run with Newman (CLI)

The collection can also be executed via **Newman**, which allows integration
with CI/CD pipelines.

### Install Newman
```bash
npm install -g newman
Run the collection
bash
newman run Clasor-qaqc-deploy.postman_collection.json \
  -e dms.postman_environment.json \
  --reporters cli,html
CI/CD Ready
This collection is structured to be CI/CD friendly and can be easily

integrated into pipelines such as:

GitHub Actions
GitLab CI
Jenkins
Typical use cases include:

Automated API regression tests
Smoke tests on deployment
Backend validation without UI dependency
Notes
Sensitive data has been removed or sanitized before committing.
Environment variables should be customized based on the target environment(dev / staging / production).
👤 Author: Elahe Habibi

Role: QA Automation Engineer
