<?php
/**
 * Endpoint gratuito de monitoramento de cliques e visitas da página /gibaz4
 * Armazena as métricas em JSON local no servidor (compatível com PHP 8+).
 */

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

$dataDir = __DIR__ . "/data";
if (!is_dir($dataDir)) {
  @mkdir($dataDir, 0755, true);
}

$htaccessFile = $dataDir . "/.htaccess";
if (!file_exists($htaccessFile)) {
  @file_put_contents($htaccessFile, "Deny from all\n");
}

$statsFile = $dataDir . "/gibaz4-stats.json";

function defaultStats(): array {
  return [
    "updatedAt" => gmdate("c"),
    "totals" => [
      "page_view" => 0,
      "unique_view" => 0,
      "whatsapp_floating" => 0,
      "whatsapp_hero" => 0,
      "whatsapp_contact" => 0,
      "instagram" => 0,
      "youtube_gibaz4" => 0,
      "youtube_podcast" => 0,
      "video_peso_ideal" => 0,
      "tiktok" => 0,
      "site_podcast" => 0,
      "email" => 0,
      "other_clicks" => 0,
    ],
    "devices" => [
      "mobile" => 0,
      "desktop" => 0,
    ],
    "sources" => [
      "instagram" => 0,
      "direct_or_other" => 0,
    ],
    "byDate" => [],
    "recent" => [],
  ];
}

function loadStats(string $file): array {
  $defaults = defaultStats();
  if (!file_exists($file)) {
    return $defaults;
  }
  $raw = @file_get_contents($file);
  if (!$raw) {
    return $defaults;
  }
  $decoded = json_decode($raw, true);
  if (!is_array($decoded)) {
    return $defaults;
  }
  $decoded["totals"] = array_merge($defaults["totals"], is_array($decoded["totals"] ?? null) ? $decoded["totals"] : []);
  $decoded["devices"] = array_merge($defaults["devices"], is_array($decoded["devices"] ?? null) ? $decoded["devices"] : []);
  $decoded["sources"] = array_merge($defaults["sources"], is_array($decoded["sources"] ?? null) ? $decoded["sources"] : []);
  $decoded["byDate"] = is_array($decoded["byDate"] ?? null) ? $decoded["byDate"] : [];
  $decoded["recent"] = is_array($decoded["recent"] ?? null) ? $decoded["recent"] : [];
  return $decoded;
}

function formatForOutput(array $stats): array {
  $out = $stats;
  $out["byDate"] = (object)($stats["byDate"] ?? []);
  return $out;
}

function saveStats(string $file, array $stats): void {
  $stats["updatedAt"] = gmdate("c");
  $toSave = formatForOutput($stats);
  @file_put_contents($file, json_encode($toSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method === "GET" && empty($_GET["action"])) {
  $stats = loadStats($statsFile);
  echo json_encode(formatForOutput($stats), JSON_UNESCAPED_UNICODE);
  exit;
}

if ($method === "POST" || !empty($_GET["action"])) {
  $rawBody = file_get_contents("php://input");
  $payload = json_decode($rawBody ?: "{}", true);
  if (!is_array($payload) || empty($payload)) {
    $payload = $_POST ?: $_GET;
  }

  $action = (string)($payload["action"] ?? "track");

  if ($action === "reset") {
    $pin = (string)($payload["pin"] ?? "");
    if ($pin !== "giba2026" && $pin !== "1234") {
      http_response_code(403);
      echo json_encode(["ok" => false, "error" => "Código inválido"]);
      exit;
    }
    $fresh = defaultStats();
    saveStats($statsFile, $fresh);
    echo json_encode(["ok" => true, "stats" => formatForOutput($fresh)], JSON_UNESCAPED_UNICODE);
    exit;
  }

  $event = preg_replace('/[^a-z0-9_]/', '', strtolower((string)($payload["event"] ?? "")));
  if (!$event) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "Evento inválido"]);
    exit;
  }

  $rawLabel = trim((string)($payload["label"] ?? $event));
  $label = function_exists("mb_substr") ? mb_substr($rawLabel, 0, 120) : substr($rawLabel, 0, 120);
  $isUnique = !empty($payload["isUnique"]);
  $ua = strtolower((string)($_SERVER["HTTP_USER_AGENT"] ?? ""));
  $referrer = strtolower((string)($payload["referrer"] ?? ($_SERVER["HTTP_REFERER"] ?? "")));

  $isMobile = (bool)preg_match('/android|iphone|ipad|ipod|mobile|iemobile|opera mini/', $ua);
  $isInstagram = strpos($ua, "instagram") !== false || strpos($referrer, "instagram.com") !== false;

  $stats = loadStats($statsFile);

  if (!array_key_exists($event, $stats["totals"])) {
    $event = "other_clicks";
  }
  $stats["totals"][$event] = (int)($stats["totals"][$event] ?? 0) + 1;

  if ($event === "page_view") {
    if ($isUnique) {
      $stats["totals"]["unique_view"] = (int)($stats["totals"]["unique_view"] ?? 0) + 1;
    }
    if ($isMobile) {
      $stats["devices"]["mobile"] = (int)($stats["devices"]["mobile"] ?? 0) + 1;
    } else {
      $stats["devices"]["desktop"] = (int)($stats["devices"]["desktop"] ?? 0) + 1;
    }
    if ($isInstagram) {
      $stats["sources"]["instagram"] = (int)($stats["sources"]["instagram"] ?? 0) + 1;
    } else {
      $stats["sources"]["direct_or_other"] = (int)($stats["sources"]["direct_or_other"] ?? 0) + 1;
    }
  }

  $tz = new DateTimeZone("America/Sao_Paulo");
  $now = new DateTime("now", $tz);
  $dayKey = $now->format("Y-m-d");

  if (!isset($stats["byDate"][$dayKey]) || !is_array($stats["byDate"][$dayKey])) {
    $stats["byDate"][$dayKey] = [
      "views" => 0,
      "whatsapp" => 0,
      "social" => 0,
    ];
  }

  if ($event === "page_view") {
    $stats["byDate"][$dayKey]["views"] = (int)($stats["byDate"][$dayKey]["views"] ?? 0) + 1;
  } elseif (strpos($event, "whatsapp_") === 0) {
    $stats["byDate"][$dayKey]["whatsapp"] = (int)($stats["byDate"][$dayKey]["whatsapp"] ?? 0) + 1;
  } else {
    $stats["byDate"][$dayKey]["social"] = (int)($stats["byDate"][$dayKey]["social"] ?? 0) + 1;
  }

  ksort($stats["byDate"]);
  if (count($stats["byDate"]) > 60) {
    $stats["byDate"] = array_slice($stats["byDate"], -60, 60, true);
  }

  array_unshift($stats["recent"], [
    "time" => $now->format("d/m/Y H:i:s"),
    "event" => $event,
    "label" => $label,
    "device" => $isMobile ? "Celular" : "Computador",
    "source" => $isInstagram ? "Instagram" : "Link direto",
  ]);
  if (count($stats["recent"]) > 40) {
    $stats["recent"] = array_slice($stats["recent"], 0, 40);
  }

  saveStats($statsFile, $stats);
  echo json_encode(["ok" => true, "totals" => $stats["totals"]], JSON_UNESCAPED_UNICODE);
  exit;
}

http_response_code(405);
echo json_encode(["ok" => false, "error" => "Method not allowed"]);
