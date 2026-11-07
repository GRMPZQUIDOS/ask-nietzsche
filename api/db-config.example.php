<?php
// Copy to db-config.php on the server and fill values from a secret store.
// Never commit real credentials.
define('DB_HOST', getenv('ASKNIETZSCHE_DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('ASKNIETZSCHE_DB_NAME') ?: 'ask_nietzsche');
define('DB_USER', getenv('ASKNIETZSCHE_DB_USER') ?: '');
define('DB_PASS', getenv('ASKNIETZSCHE_DB_PASS') ?: '');
