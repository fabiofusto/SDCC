# CobraInsights

## Description

CobraInsights allows users to upload a CSV file, select a column for sentiment analysis, and use AWS Comprehend and Azure AI services to obtain a detailed report. Users can download the generated reports and the datasets used, and view saved reports in the "My Reports" section. All files are stored in an S3 bucket, and a PostgreSQL RDS database is used for data storage. Authentication is managed via Auth.js v5, using AWS Cognito and Google as social providers.

## Features

- **CSV File Upload**: Allows users to upload a CSV file.
- **Column Selection**: Users can choose a column for sentiment analysis.
- **Sentiment Analysis**: Uses AWS Comprehend and Azure AI to analyze the sentiment of the text.
- **Downloadable Reports**: Users can download the generated reports and the datasets used.
- **My Reports Section**: Users can view and download previously saved reports.
- **Secure Authentication**: Managed via Auth.js v5.
- **Storage**: All files are stored in an S3 bucket.
- **Database**: Uses PostgreSQL RDS for data management.

## Requirements

- Node.js >= 20.x
- AWS Account with Cognito, S3, and RDS PostgreSQL configured
- Azure Account with AI Language Services configured

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/fabiofusto/SDCC.git
    cd SDCC
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure environment variables**:
    Create a `.env` file in the root directory of the project and add the following environment variables:
    ```env
    # AUTH
    AUTH_COGNITO_ID=""
    AUTH_COGNITO_SECRET=""
    AUTH_COGNITO_ISSUER=""
    AUTH_GOOGLE_ID=""
    AUTH_GOOGLE_SECRET=""
    AUTH_SECRET=""
    AUTH_URL="http://localhost:3000"
    AUTH_TRUST_HOST=true

    # PRISMA
    DATABASE_URL=""

    # AWS IAM
    IAM_ACCESS_KEY=""
    IAM_SECRET_ACCESS_KEY=""

    # S3 BUCKET
    S3_BUCKET_NAME=""
    S3_BUCKET_REGION=""

    # AWS COMPREHEND
    COMPREHEND_REGION=""

    # AZURE AI LANGUAGE SERVICE
    AZURE_KEY=""
    AZURE_ENDPOINT=""
    ```

4. **Run the application**:
    ```bash
    npm run dev
    ```

## Support

For any issues, please open an [issue](https://github.com/fabiofusto/SDCC/issues) in the repository.

<!-- ## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. -->