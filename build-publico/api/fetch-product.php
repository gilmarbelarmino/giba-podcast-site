<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

$body = json_decode(file_get_contents("php://input"), true);
$rawUrl = isset($body["url"]) ? trim($body["url"]) : "";

if (!$rawUrl) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "URL inválida."]);
  exit;
}

if (!preg_match("/^https?:\/\//i", $rawUrl)) {
  $rawUrl = "https://" . $rawUrl;
}

$ch = curl_init($rawUrl);
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_MAXREDIRS => 8,
  CURLOPT_TIMEOUT => 12,
  CURLOPT_USERAGENT => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  CURLOPT_HTTPHEADER => ["Accept-Language: pt-BR,pt;q=0.9"],
]);
$html = curl_exec($ch);
$finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL) ?: $rawUrl;
curl_close($ch);

if (!$html) {
  echo json_encode(["ok" => false, "url" => $rawUrl, "error" => "Não foi possível acessar o link automaticamente."]);
  exit;
}

$fullName = "";
$image = "";
$price = "";

if (preg_match("/MLB-?(\d{7,12})/i", $finalUrl . " " . $html, $m) && preg_match("/mercadolivre|mercadolibre/i", $finalUrl)) {
  $mlJson = @file_get_contents("https://api.mercadolibre.com/items/MLB" . $m[1]);
  if ($mlJson) {
    $ml = json_decode($mlJson, true);
    if (!empty($ml["title"])) $fullName = $ml["title"];
    if (!empty($ml["price"])) $price = "R$ " . number_format((float)$ml["price"], 2, ",", ".");
    if (!empty($ml["pictures"][0]["secure_url"])) $image = $ml["pictures"][0]["secure_url"];
    elseif (!empty($ml["thumbnail"])) $image = str_replace(["-I.jpg", "http://"], ["-O.jpg", "https://"], $ml["thumbnail"]);
  }
}

$getMeta = function(string $prop) use ($html): string {
  $p = preg_quote($prop, "/");
  if (preg_match('/<meta[^>]+(?:property|name|itemprop)=["\']' . $p . '["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $m)) {
    return html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, "UTF-8");
  }
  if (preg_match('/<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name|itemprop)=["\']' . $p . '["\']/i', $html, $m)) {
    return html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, "UTF-8");
  }
  return "";
};

if (!$fullName) {
  $fullName = $getMeta("og:title") ?: $getMeta("twitter:title");
  if (!$fullName && preg_match("/<title[^>]*>([\s\S]*?)<\/title>/i", $html, $m)) {
    $fullName = html_entity_decode(trim($m[1]), ENT_QUOTES | ENT_HTML5, "UTF-8");
  }
}

if (!$image) {
  $image = $getMeta("og:image") ?: $getMeta("twitter:image");
}

if (!$price) {
  $mp = $getMeta("product:price:amount") ?: $getMeta("og:price:amount") ?: $getMeta("price");
  if ($mp) {
    $num = (float)str_replace(",", ".", preg_replace("/[^\d.,]/", "", $mp));
    if ($num > 0) $price = "R$ " . number_format($num, 2, ",", ".");
  } elseif (preg_match("/R\$\s*(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})/", $html, $m)) {
    $price = "R$ " . $m[1];
  }
}

$fullName = trim(preg_replace("/\s*[-|–—]\s*(Mercado\s*Livre.*|Amazon\.com\.br.*|Shopee.*|Magalu.*|Magazine Luiza.*)$/i", "", $fullName));
$parts = preg_split("/\s+/", $fullName);
$shortName = isset($parts[0]) ? rtrim($parts[0], ",.:;!?()[]") : "";

echo json_encode([
  "ok" => true,
  "url" => $rawUrl,
  "resolvedUrl" => $finalUrl,
  "fullName" => $fullName,
  "shortName" => $shortName,
  "price" => $price,
  "image" => $image,
  "partial" => (!$fullName || !$image || !$price),
]);
