/**
 * Trends Parser, main.js
 *
 * @author Daniel Sebastian Iliescu, http://dansil.net
 * @created 2013-08-27
 * @updated 2013-12-12
 */

//(function() {
	"use strict";

	var googleTrends = [];
	var twitterTrends = [];
	var convergedTrends = [];

	var googleRegions = [];
	googleRegions["Worldwide"] = 0;
	googleRegions["Australia"] = 8;
	googleRegions["Canada"] = 13;
	googleRegions["Germany"] = 15;
	googleRegions["Hong Kong"] = 10;
	googleRegions["India"] = 3;
	googleRegions["Israel"] = 6;
	googleRegions["Japan"] = 4;
	googleRegions["Netherlands"] = 17;
	googleRegions["Russia"] = 14;
	googleRegions["Singapore"] = 5;
	googleRegions["Taiwan"] = 12;
	googleRegions["United Kingdom"] = 9;
	googleRegions["United States"] = 1;

	var twitterRegions = [];
	var googleTrendsWW = [];

	//localhost/
	var rootURL = "localhost/projects/TrendsParser/";

	$(document).ready(function() {
		displayLoading($("#google"));
		displayLoading($("#twitter"));

		displayGoogleTrends(1); // US
		displayTwitterTrends(1); // WW

		$(document).ajaxStop(function() {
			displayConvergence();
		});
	});

	function displayLoading(element) {
		var loadingImg = $(document.createElement("img"));

		loadingImg.prop("id", element.prop("id") + "-loading");
		loadingImg.prop("alt", "loading...");
		loadingImg.prop("src", "img/loading.gif");

		element.append(loadingImg);
	}

	function displayGoogleTrends(region) {
		$.ajax({
			type: "GET",
			url: rootURL + "fetch-google-trends.php",
			async: true,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data) {
				googleTrends = data[region].slice(0);

				createTable(googleTrends, "google");

				$("#google-loading").remove();
			}
		});
	}

	function displayTwitterTrends(woeid) {
		$.ajax({
			type: "GET",
			url: rootURL + "fetch-twitter-trends.php?woeid=" + woeid,
			async: true,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data) {
				for (var i = 0; i < data.trends.length; i++) {
					twitterTrends.push(data.trends[i].name);
				}

				createTable(twitterTrends, "twitter");

				$("#twitter-loading").remove();
			}
		});
	}

	function displayConvergence() {
		var termsList = $(document.createElement("ul"));

		compareConvergence(googleTrends, twitterTrends);

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

	function generateGoogleWWTrends() {
		$.ajax({
			type: "GET",
			url: rootURL + "fetch-google-trends.php",
			async: true,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data) {
				for (var i = 0; i < googleRegions.length; i++) {
					googleTrends.push(data[googleRegions[i]].slice(0));
				}
			}
		});
	}

	function createTable(trends, type) {
		var trendsTable = $(document.createElement("table"));
		var trendsTableHeadingRow = $(document.createElement("tr"));
		var tableRankHeading = $(document.createElement("th"));
		var tableContentHeading = $(document.createElement("th"));

		tableRankHeading.html("Rank");
		tableContentHeading.html("Trend");

		trendsTableHeadingRow.append(tableRankHeading);
		trendsTableHeadingRow.append(tableContentHeading);
		trendsTable.append(trendsTableHeadingRow);

		for (var i = 0; i < trends.length; i++) {
			var trendsTableRow = $(document.createElement("tr"));
			var trendsRankTableDefinition = $(document.createElement("td"));
			var trendsContentTableDefinition = $(document.createElement("td"));
			var url = "";

			if (type === "google") {
				url = "http://www.google.com/search?q=" + trends[i];
			} else if (type === "twitter") {
				var trend = "";

				if (trends[i][0] === "#") {
					trend = trends[i].substring(1, trends[i].length);
				} else {
					trend = trends[i];
				}

				url = "https://twitter.com/search?q=" + trend;
			}

			trendsContentTableDefinition.html(trends[i]);
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
//})();