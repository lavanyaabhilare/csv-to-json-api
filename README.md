# CSV to JSON Converter API

A Node.js Express API that converts CSV files to JSON format and stores the data in PostgreSQL database with automatic age distribution reporting.

## Overview

This application takes CSV files with nested properties (using dot notation), parses them into JSON objects, stores them in a PostgreSQL database, and generates an age distribution report.

### Key Features

- Custom CSV parser (no external CSV packages)
- Support for nested properties with dot notation (e.g., `name.firstName`, `address.line1`)
- Automatic data transformation and validation
- PostgreSQL database integration with JSONB support
- Age distribution calculation and reporting
- File upload via REST API
- Production-ready error handling

