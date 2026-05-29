<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow', true);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_response(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$config = load_config();
$expectedToken = config_value($config, 'MAIL_RELAY_TOKEN', '');
$providedToken = bearer_token() ?: ($_SERVER['HTTP_X_MAIL_RELAY_TOKEN'] ?? '');

if ($expectedToken === '') {
    json_response(500, ['ok' => false, 'error' => 'relay_token_missing']);
}

if ($providedToken === '' || !hash_equals($expectedToken, $providedToken)) {
    json_response(403, ['ok' => false, 'error' => 'forbidden']);
}

$payload = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($payload)) {
    json_response(400, ['ok' => false, 'error' => 'invalid_json']);
}

try {
    $mail = normalize_mail_payload($payload, $config);
    send_smtp_with_fallback($mail);
    json_response(200, ['ok' => true]);
} catch (Throwable $error) {
    error_log('[lead-mail-relay] ' . $error->getMessage());
    json_response(502, ['ok' => false, 'error' => 'smtp_failed']);
}

function load_config(): array
{
    $path = __DIR__ . '/lead-mail-relay.config.php';
    if (!is_file($path)) {
        return [];
    }

    $config = require $path;
    return is_array($config) ? $config : [];
}

function normalize_mail_payload(array $payload, array $config): array
{
    $smtp = is_array($payload['smtp'] ?? null) ? $payload['smtp'] : [];
    $to = $payload['to'] ?? [];
    if (!is_array($to)) {
        throw new RuntimeException('Invalid recipients');
    }

    $mail = [
        'host' => string_value($smtp['host'] ?? config_value($config, 'SMTP_HOST', 'smtp.hostinger.com')),
        'port' => int_value($smtp['port'] ?? config_value($config, 'SMTP_PORT', '587')),
        'secure' => bool_value($smtp['secure'] ?? config_value($config, 'SMTP_SECURE', 'false')),
        'user' => string_value($smtp['user'] ?? config_value($config, 'SMTP_USER', 'biuro@warszawskiczas.pl')),
        'pass' => string_value($smtp['pass'] ?? config_value($config, 'SMTP_PASS', '')),
        'from' => string_value($payload['from'] ?? config_value($config, 'CONTACT_FROM_EMAIL', 'biuro@warszawskiczas.pl')),
        'fromName' => string_value($payload['fromName'] ?? config_value($config, 'CONTACT_FROM_NAME', 'Warszawski Czas - Formularz')),
        'to' => array_values(array_map('string_value', $to)),
        'replyTo' => string_value($payload['replyTo'] ?? ''),
        'subject' => string_value($payload['subject'] ?? ''),
        'text' => string_value($payload['text'] ?? ''),
    ];

    if ($mail['host'] !== 'smtp.hostinger.com') {
        throw new RuntimeException('Invalid SMTP host');
    }
    if ($mail['user'] !== 'biuro@warszawskiczas.pl' || $mail['from'] !== 'biuro@warszawskiczas.pl') {
        throw new RuntimeException('Invalid sender');
    }
    if ($mail['pass'] === '') {
        throw new RuntimeException('Missing SMTP password');
    }
    if (!filter_var($mail['from'], FILTER_VALIDATE_EMAIL) || !filter_var($mail['replyTo'], FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('Invalid email address');
    }
    if (count($mail['to']) < 1 || count($mail['to']) > 5) {
        throw new RuntimeException('Invalid recipient count');
    }
    foreach ($mail['to'] as $recipient) {
        if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('Invalid recipient');
        }
    }
    if ($mail['subject'] === '' || $mail['text'] === '') {
        throw new RuntimeException('Missing message content');
    }

    return $mail;
}

function send_smtp_with_fallback(array $mail): void
{
    $attempts = [$mail];
    $fallback = $mail['port'] === 587 && !$mail['secure']
        ? ['port' => 465, 'secure' => true]
        : ['port' => 587, 'secure' => false];
    if ($fallback['port'] !== $mail['port'] || $fallback['secure'] !== $mail['secure']) {
        $attempts[] = array_merge($mail, $fallback);
    }

    $errors = [];
    foreach ($attempts as $attempt) {
        try {
            send_smtp($attempt);
            return;
        } catch (Throwable $error) {
            $errors[] = smtp_label($attempt) . ' ' . $error->getMessage();
        }
    }

    throw new RuntimeException(implode('; ', $errors));
}

function send_smtp(array $mail): void
{
    $context = stream_context_create([
        'ssl' => [
            'peer_name' => $mail['host'],
            'verify_peer' => true,
            'verify_peer_name' => true,
            'SNI_enabled' => true,
        ],
    ]);
    $transport = $mail['secure'] ? 'ssl' : 'tcp';
    $socket = @stream_socket_client(
        $transport . '://' . $mail['host'] . ':' . $mail['port'],
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT,
        $context
    );

    if (!$socket) {
        throw new RuntimeException('connect failed: ' . ($errstr ?: (string) $errno));
    }

    try {
        stream_set_timeout($socket, 20);
        smtp_expect($socket, [220]);
        smtp_command($socket, 'EHLO warszawskiczas.pl', [250]);

        if (!$mail['secure']) {
            smtp_command($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('STARTTLS failed');
            }
            smtp_command($socket, 'EHLO warszawskiczas.pl', [250]);
        }

        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($mail['user']), [334]);
        smtp_command($socket, base64_encode($mail['pass']), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $mail['from'] . '>', [250]);
        foreach ($mail['to'] as $recipient) {
            smtp_command($socket, 'RCPT TO:<' . $recipient . '>', [250, 251]);
        }
        smtp_command($socket, 'DATA', [354]);
        fwrite($socket, dot_stuff(build_mime_message($mail)) . "\r\n.\r\n");
        smtp_expect($socket, [250]);
        smtp_command($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}

function build_mime_message(array $mail): string
{
    $headers = [
        'From: ' . format_mailbox($mail['fromName'], $mail['from']),
        'To: ' . implode(', ', array_map(fn ($email) => format_mailbox('', $email), $mail['to'])),
        'Reply-To: ' . format_mailbox('', $mail['replyTo']),
        'Subject: ' . encode_header($mail['subject']),
        'Date: ' . gmdate('r'),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
    ];

    return implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($mail['text']), 76, "\r\n");
}

function smtp_command($socket, string $command, array $expectedCodes): string
{
    fwrite($socket, $command . "\r\n");
    return smtp_expect($socket, $expectedCodes);
}

function smtp_expect($socket, array $expectedCodes): string
{
    [$code, $response] = smtp_read($socket);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('SMTP code ' . $code);
    }
    return $response;
}

function smtp_read($socket): array
{
    $lines = [];
    do {
        $line = fgets($socket, 4096);
        if ($line === false) {
            throw new RuntimeException('SMTP socket closed');
        }
        $line = rtrim($line, "\r\n");
        if (!preg_match('/^\d{3}[ -]/', $line)) {
            throw new RuntimeException('Invalid SMTP response');
        }
        $lines[] = $line;
    } while (strlen($line) >= 4 && $line[3] === '-');

    return [(int) substr($lines[count($lines) - 1], 0, 3), implode("\n", $lines)];
}

function dot_stuff(string $message): string
{
    $message = preg_replace("/\r\n|\r|\n/", "\r\n", $message);
    return preg_replace('/^\./m', '..', $message ?? '');
}

function format_mailbox(string $name, string $email): string
{
    return $name !== '' ? encode_header($name) . ' <' . $email . '>' : '<' . $email . '>';
}

function encode_header(string $value): string
{
    $value = sanitize_header($value);
    return preg_match('/^[\x20-\x7E]*$/', $value)
        ? $value
        : '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function sanitize_header(string $value): string
{
    return trim(preg_replace('/\r|\n/', ' ', $value) ?? '');
}

function smtp_label(array $mail): string
{
    return $mail['host'] . ':' . $mail['port'] . '/' . ($mail['secure'] ? 'tls' : 'starttls');
}

function bearer_token(): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
        return trim($matches[1]);
    }
    return '';
}

function config_value(array $config, string $key, string $fallback): string
{
    $value = getenv($key);
    if (is_string($value) && trim($value) !== '') {
        return trim($value);
    }
    $value = $config[$key] ?? null;
    return is_string($value) && trim($value) !== '' ? trim($value) : $fallback;
}

function string_value($value): string
{
    return is_scalar($value) ? trim((string) $value) : '';
}

function int_value($value): int
{
    $number = (int) string_value($value);
    return $number > 0 ? $number : 587;
}

function bool_value($value): bool
{
    $normalized = strtolower(string_value($value));
    return !in_array($normalized, ['', '0', 'false', 'no', 'off'], true);
}

function json_response(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}
