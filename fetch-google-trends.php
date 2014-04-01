<?php
header("Content-Type: application/json");

$URL = "http://hawttrends.appspot.com/api/terms/";
$googleTrends = file_get_contents($URL);

print($googleTrends);
?>