/**
 * Trends Parser, main.js
 *
 * @author Daniel Sebastian Iliescu, http://dansil.net
 * @created 2013-08-27
 * @updated 2013-08-28
 */

 (function() {
	"use strict";

	var googleTrendsUS = [];
	var twitterTrendsUS = [];
	var twitterTrendsWW = [];
	var convergedTrends = [];

	var rootURL = "localhost/";

	$(document).ready(function() {
		displayGoogleTrends("xml");
		displayTwitterTrends(23424977, "us");
		displayTwitterTrends(1, "ww");

		$(document).ajaxStop(function() {
			displayConvergence();
		});
	});

	function displayGoogleTrends(type) {
		$.ajax({
			type: "GET",
			url: rootURL + "fetch-google-trends.php?type=" + type,
			async: true,
			contentType: "application/" + type + "; charset=utf-8",
			dataType: type,
			success: function(data) {
				var contents = $(data).find("content").get(0).firstChild.data;
				var content = $(contents).find("a");

				createTable(content, "google-us");
			}
		});
	}

	function displayTwitterTrends(woeid, area) {
		$.ajax({
			type: "GET",
			url: rootURL + "fetch-twitter-trends.php?woeid=" + woeid,
			async: true,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data) {
				var content = data.trends;

				createTable(content, "twitter-" + area);
			}
		});
	}

	function displayConvergence() {
		var termsList = $(document.createElement("ul"));

		compareConvergence(googleTrendsUS, twitterTrendsUS);
		compareConvergence(googleTrendsUS, twitterTrendsWW);
		compareConvergence(twitterTrendsUS, twitterTrendsWW);

		if (convergedTrends.length == 0) {
			var termsElement = $(document.createElement("li"));

			termsElement.html("No converging trends.");

			termsList.append(termsElement);
		} else {
			for (var i = 0; i < convergedTrends.length; i++) {
				var termsElement = $(document.createElement("li"));

				termsElement.html(convergedTrends[i]);

				termsList.append(termsElement);
			}
		}

		$("#convergence").append(termsList);
	}

	function compareConvergence(firstTrends, secondTrends) {
		for (var i = 0; i < firstTrends.length; i++) {
			for (var j = 0; j < secondTrends.length; j++) {
				if (firstTrends[i] === secondTrends[j]) {
					convergedTrends.push(firstTrends[i] + " is a converging trend.");
				}
			}
		}
	}

	function createTable(content, type) {
		var trendsTable = $(document.createElement("table"));

		var trendsTableHeadingRow = $(document.createElement("tr"));
		var tableRankHeading = $(document.createElement("th"));
		var tableContentHeading = $(document.createElement("th"));

		tableRankHeading.html("Rank");
		tableContentHeading.html("Trend");

		trendsTableHeadingRow.append(tableRankHeading);
		trendsTableHeadingRow.append(tableContentHeading);
		trendsTable.append(trendsTableHeadingRow);

		for (var i = 0; i < content.length; i++) {
			var trendsTableRow = $(document.createElement("tr"));
			var trendsRankTableDefinition = $(document.createElement("td"));
			var trendsContentTableDefinition = $(document.createElement("td"));
			var url = "";
			var trendRaw = "";
			var trend = "";

			if (type === "google-us") {
				url = content[i].href;
				trend = content[i].innerHTML;
				googleTrendsUS[i] = trend;

				trendsContentTableDefinition.html(trend);
			} else if (type === "twitter-us" || type === "twitter-ww") {
				url = content[i].url;

				if (url.split(".").length != 2) {
					url = url.split(".");
					url = url[2].substring(3, url[2].length);
					url = "https://twitter.com" + url;
				}

				trendRaw = content[i].name;

				if (trendRaw[0] === "#") {
					trend = trendRaw.substring(1, trendRaw.length);
				} else {
					trend = trendRaw;
				}

				if (type === "twitter-us") {
					twitterTrendsUS[i] = trend;
				} else if (type === "twitter-ww") {
					twitterTrendsWW[i] = trend;
				}

				trendsContentTableDefinition.html(trendRaw);
			}

			trendsRankTableDefinition.html(i+1);

			trendsTableRow.append(trendsRankTableDefinition);
			trendsTableRow.append(trendsContentTableDefinition);
			trendsTable.append(trendsTableRow);

			$(trendsRankTableDefinition).click(assignURL(trendsRankTableDefinition, url));
			$(trendsContentTableDefinition).click(assignURL(trendsContentTableDefinition, url));
		}

		$("#" + type).append(trendsTable);
	}

	function assignURL(element, URL) {
		return function() {
			window.location = URL;
		};
	}
})();
