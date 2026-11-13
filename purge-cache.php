<?php
header("X-LiteSpeed-Purge: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
echo "PURGED";
