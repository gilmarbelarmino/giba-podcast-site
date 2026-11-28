<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

$body = json_decode(file_get_contents("php://input"), true);
$raw = isset($body["url"]) ? trim($body["url"]) : "";

if (!$raw) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Link ou @ do Instagram inválido."]);
  exit;
}

$username = "";
if (preg_match("/instagram\.com\/([A-Za-z0-9._]+)/i", $raw, $m)) {
  $username = $m[1];
} else {
  $username = preg_replace("/[^A-Za-z0-9._]/", "", ltrim($raw, "@"));
}

if (!$username) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Não foi possível identificar o perfil do Instagram."]);
  exit;
}

$profileUrl = "https://www.instagram.com/" . $username . "/";
$fullName = "";
$remoteLogo = "";

$ch = curl_init("https://i.instagram.com/api/v1/users/web_profile_info/?username=" . urlencode($username));
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 10,
  CURLOPT_HTTPHEADER => [
    "x-ig-app-id: 936619743392459",
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept: application/json",
  ],
]);
$apiResp = curl_exec($ch);
$apiCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($apiCode === 200 && $apiResp) {
  $json = json_decode($apiResp, true);
  $user = $json["data"]["user"] ?? null;
  if ($user) {
    $fullName = $user["full_name"] ?? "";
    $remoteLogo = $user["profile_pic_url_hd"] ?? ($user["profile_pic_url"] ?? "");
  }
}

if (!$fullName || !$remoteLogo) {
  $ch2 = curl_init($profileUrl);
  curl_setopt_array($ch2, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_USERAGENT => "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  ]);
  $html = curl_exec($ch2);
  curl_close($ch2);
  if ($html) {
    if (!$remoteLogo && preg_match('/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $m)) {
      $remoteLogo = html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, "UTF-8");
    }
    if (!$fullName && preg_match('/<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $m)) {
      $t = html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, "UTF-8");
      $t = trim(preg_replace('/\(@[^)]+\).*$/i', "", $t));
      $t = trim(preg_replace('/\s*[•|–—-]\s*Instagram.*$/i', "", $t));
      $fullName = $t;
    }
  }
}

$localLogo = "";
if ($remoteLogo) {
  $imgCh = curl_init($remoteLogo);
  curl_setopt_array($imgCh, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_USERAGENT => "Mozilla/5.0",
  ]);
  $imgBytes = curl_exec($imgCh);
  $imgCode = curl_getinfo($imgCh, CURLINFO_HTTP_CODE);
  curl_close($imgCh);
  if ($imgCode === 200 && $imgBytes && strlen($imgBytes) > 500) {
    $dir = __DIR__ . "/ongs-logos";
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $safeName = preg_replace("/[^a-zA-Z0-9_-]/", "_", strtolower($username)) . ".jpg";
    if (@file_put_contents($dir . "/" . $safeName, $imgBytes)) {
      $localLogo = "/api/ongs-logos/" . $safeName . "?v=" . time();
    }
  }
}

if (!$fullName) $fullName = $username;
$parts = preg_split("/\s+/", trim($fullName));
$shortName = isset($parts[0]) ? rtrim($parts[0], ",.:;!?()[]") : $username;

echo json_encode([
  "ok" => true,
  "instagramUrl" => $profileUrl,
  "handle" => "@" . $username,
  "fullName" => $fullName,
  "shortName" => $shortName,
  "logo" => $localLogo ?: $remoteLogo,
  "partial" => (!$localLogo && !$remoteLogo),
]);
