<?php
/**
 * WebDev Odyssey - Real PHP Server-Side Code Evaluator & Sandbox API
 * Executes and validates PHP code safely in an output-buffered sandbox.
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(["status" => "error", "message" => "POST required"], 405);
}

$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (!$data || !isset($data['code'])) {
    sendJsonResponse(["status" => "error", "message" => "Missing 'code' parameter"], 400);
}

$userCode = $data['code'];
$challengeId = isset($data['challenge_id']) ? intval($data['challenge_id']) : 0;
$mode = $data['mode'] ?? 'challenge'; // 'challenge' or 'repl'

// 1. Security Filter - Disallow hazardous functions and tokens
$blockedTokens = [
    'exec', 'shell_exec', 'system', 'passthru', 'proc_open', 'popen',
    '`', 'unlink', 'rmdir', 'file_put_contents', 'copy', 'rename',
    'mysqli_', 'pdo', 'sqlite', 'curl_', 'fsockopen', 'mail', 'eval'
];

foreach ($blockedTokens as $token) {
    if (stripos($userCode, $token) !== false) {
        sendJsonResponse([
            "status" => "security_violation",
            "message" => "Security Alert: Use of restricted function/token '{$token}' is blocked.",
            "http_status" => 403,
            "passed" => false,
            "output" => "ERROR 403: Forbidden function call."
        ]);
    }
}

// 2. Strip opening <?php and closing ?> tags for execution
$executable = trim($userCode);
if (strpos($executable, '<?php') === 0) {
    $executable = substr($executable, 5);
}
if (substr($executable, -2) === '?>') {
    $executable = substr($executable, 0, -2);
}
$executable = trim($executable);

// 3. Execution Sandbox
$startTime = microtime(true);
$startMemory = memory_get_usage();
$output = '';
$passed = false;
$tests = [];
$errorMsg = null;

// Setup mock test environment based on challenge ID
$mockPost = ['email' => 'dev@example.com', 'username' => 'CodeExplorer'];
$mockName = 'CodeExplorer';

ob_start();
try {
    // Inject mock environment for challenges
    $_POST = $mockPost;
    $_SERVER['REQUEST_METHOD'] = 'POST';

    // Safely evaluate user code
    $evalResult = eval($executable . ';');
    $output = ob_get_clean();

    if ($evalResult === false && ($err = error_get_last())) {
        $errorMsg = $err['message'] ?? 'Syntax error in evaluated code';
    }
} catch (Throwable $t) {
    $output = ob_get_clean();
    $errorMsg = $t->getMessage() . " on line " . $t->getLine();
}

$endTime = microtime(true);
$execTimeMs = round(($endTime - $startTime) * 1000, 2);
$memoryUsed = round((memory_get_usage() - $startMemory) / 1024, 2) . ' KB';

// 4. Challenge-specific validation rules
switch ($challengeId) {
    case 1: // String concatenation
        $hasDot = (strpos($userCode, '. $name') !== false || strpos($userCode, '.$name') !== false);
        $outputMatches = (strpos($output, 'Welcome, CodeExplorer') !== false);
        $passed = $hasDot && $outputMatches;
        $tests = [
            ["name" => "Uses PHP dot operator (.) for concatenation", "passed" => $hasDot],
            ["name" => "Outputs expected greeting 'Welcome, CodeExplorer'", "passed" => $outputMatches]
        ];
        break;

    case 2: // Form handling POST
        $usesPost = (strpos($userCode, '$_POST') !== false);
        $outputMatches = (strpos($output, 'Authenticated: dev@example.com') !== false);
        $passed = $usesPost && $outputMatches;
        $tests = [
            ["name" => "Accesses form data using \$_POST superglobal", "passed" => $usesPost],
            ["name" => "Successfully reads email from POST payload", "passed" => $outputMatches]
        ];
        break;

    case 3: // JSON API
        $hasJson = (strpos($userCode, 'json_encode($response)') !== false || strpos($userCode, 'json_encode($response,') !== false);
        $hasHeader = (strpos($userCode, 'application/json') !== false);
        $passed = $hasJson && $hasHeader;
        $tests = [
            ["name" => "Sets Content-Type: application/json header", "passed" => $hasHeader],
            ["name" => "Encodes array with json_encode()", "passed" => $hasJson]
        ];
        break;

    case 4: // XSS sanitization
        $hasHtmlSpecialChars = (strpos($userCode, 'htmlspecialchars') !== false);
        $noRawScript = (strpos($output, '<script>') === false);
        $passed = $hasHtmlSpecialChars && $noRawScript;
        $tests = [
            ["name" => "Sanitizes output using htmlspecialchars()", "passed" => $hasHtmlSpecialChars],
            ["name" => "Neutralizes raw <script> execution tags", "passed" => $noRawScript]
        ];
        break;

    case 5: // Password verification
        $hasVerify = (strpos($userCode, 'password_verify') !== false);
        $loginGranted = (strpos($output, 'Login Granted') !== false);
        $passed = $hasVerify && $loginGranted;
        $tests = [
            ["name" => "Validates password using password_verify()", "passed" => $hasVerify],
            ["name" => "Correctly verifies valid password against bcrypt hash", "passed" => $loginGranted]
        ];
        break;

    default: // Generic REPL or Custom test
        $passed = empty($errorMsg);
        $tests = [
            ["name" => "Syntax validation", "passed" => empty($errorMsg)]
        ];
        break;
}

// 5. Record submission in database
try {
    $db = Database::getInstance();
    $pdo = $db->getPdo();
    if ($pdo) {
        $ins = $pdo->prepare("INSERT INTO submissions (challenge_id, code, status, output, exec_time_ms) VALUES (?, ?, ?, ?, ?)");
        $ins->execute([
            "Mission-{$challengeId}",
            $userCode,
            $passed ? 'PASSED' : 'FAILED',
            $errorMsg ? "Error: {$errorMsg}" : $output,
            $execTimeMs
        ]);
    }
} catch (Exception $e) {}

// 6. Return response
sendJsonResponse([
    "status" => "success",
    "passed" => $passed,
    "challenge_id" => $challengeId,
    "execution_time_ms" => $execTimeMs,
    "memory_used" => $memoryUsed,
    "http_status" => $passed ? 200 : ($errorMsg ? 500 : 422),
    "output" => $errorMsg ? "PHP Parse/Runtime Error:\n{$errorMsg}" : $output,
    "tests" => $tests
]);
