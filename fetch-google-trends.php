<?php
header("Content-Type: application/json");
$URL = "http://www.google.com/trends/hottrends/hotItems";

if (!empty($URL)) {
	$googleTrends = file_get_contents($URL);

	print($googleTrends);
} else {
	die("Invalid URL.");
}
?>