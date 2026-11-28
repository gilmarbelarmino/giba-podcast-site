<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

$dataDir = __DIR__ . "/data";
if (!is_dir($dataDir)) {
  @mkdir($dataDir, 0755, true);
}
$htaccessFile = $dataDir . "/.htaccess";
if (!file_exists($htaccessFile)) {
  @file_put_contents($htaccessFile, "Deny from all\n");
}

$storageFile = $dataDir . "/gibaz4-products.json";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
  if (file_exists($storageFile)) {
    echo file_get_contents($storageFile);
  } else {
    http_response_code(404);
    echo json_encode(["error" => "Not initialized"]);
  }
  exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $body = json_decode(file_get_contents("php://input"), true);
  if (!isset($body["products"]) || !is_array($body["products"])) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "Lista de produtos inválida."]);
    exit;
  }
  file_put_contents($storageFile, json_encode($body["products"], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
  echo json_encode(["ok" => true, "products" => $body["products"]]);
  exit;
}
