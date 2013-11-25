<?php
if (isset($_GET["woeid"])) {
	header("Content-Type: application/json");

	$woeid = $_GET["woeid"];
	$URL = "http://api.whatthetrend.com/api/v2/trends.json?woeid=".$woeid;
	$twitterTrends = file_get_contents($URL);

	print($twitterTrends);
} else {
	die("Invalid parameters.");
}
?>