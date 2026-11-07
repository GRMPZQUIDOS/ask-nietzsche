# Deployment notes

This public source package is not a turnkey production deployment. Review and configure all of the following before hosting:

1. Use a supported PHP runtime with cURL, PDO MySQL, SQLite, and the extensions required by the selected attachment formats.
2. Store the Anthropic API key and database credentials in environment variables or secret files outside the public document root. Do not commit `db-config.php`.
3. Create and restrict the MySQL database and tables required by `api/user.php` and `api/log-conversation.php`.
4. Configure the RAG database path and make the SQLite file readable by PHP without exposing it as a downloadable web asset.
5. Review allowed origins, request limits, upload limits, rate limiting, account authentication, CORS, and error handling.
6. Set privacy and retention rules before collecting messages. The current API logs conversation messages to MySQL.
7. Verify that each front-end language points to the correct API host and that required images/fonts are available.
8. Review provider terms, current model selection, cost controls, and user disclosures.

Do not copy any live hosting credentials, API secrets, database backups, analytics identifiers, or private transcripts into this repository.
