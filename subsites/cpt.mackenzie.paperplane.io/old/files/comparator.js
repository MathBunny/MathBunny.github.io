$(document).ready(function()){
	alert("Sup");
	$("#buttonCompareFiles").click(function()){
		alert("Pressed!");
	}
	$('#cssmenu').prepend('<div id="bg-one"></div><div id="bg-two"></div><div id="bg-three"></div><div id="bg-four"></div>');
}
/*
function DifferencerTest()
{
	this.main = function()
	{
		var inputFileToCompare0 = document.getElementById("inputFileToCompare0");
		var inputFileToCompare1 = document.getElementById("inputFileToCompare1");
		inputFileToCompare0.onchange = this.inputFileToCompare_Change;
		inputFileToCompare1.onchange = this.inputFileToCompare_Change;

		var buttonCompareFiles = document.getElementById("buttonCompareFiles");
		buttonCompareFiles.onclick = this.buttonCompareFiles_Click;
	}

	this.inputFileToCompare_Change = function(event)
	{	
		var fileControlChanged = event.target;
		var fileToLoad = fileControlChanged.files[0];

		var fileReader = new FileReader();
		fileReader.fileControl = fileControlChanged;
		fileReader.onload = function(fileLoadedEvent) 
		{
			var textFromFileLoaded = fileLoadedEvent.target.result;
			var fileControl = fileLoadedEvent.target.fileControl;
			fileControl.textFromFile = textFromFileLoaded;
		};
		fileReader.readAsText(fileToLoad, "UTF-8");
	}


	this.buttonCompareFiles_Click = function(event)
	{		
		var stringsToCompare = 
		[
			document.getElementById("inputFileToCompare0").textFromFile,
			document.getElementById("inputFileToCompare1").textFromFile,
		];

		if (stringsToCompare[0] == null || stringsToCompare[1] == null)
		{
			alert("Please choose two files to compare!");
		}
		else
		{
			var differences = Differences.findDifferencesBetweenStrings
			(
				stringsToCompare[0],
				stringsToCompare[1]
			);

			var differencesAsHTMLElement = differences.toHTMLElement();

			document.body.appendChild(differencesAsHTMLElement);	
		}
	}	
}

// classes

function Differences(passagePairs)
{
	this.passagePairs = passagePairs;
}
{
	// static methods

	Differences.findDifferencesBetweenStrings = function(string0, string1)
	{
		var passagePairsAll = new Array();

		var passagePairsMatching = Differences.findPassagePairsMatchingBetweenStrings
		(
			string0, string1, new Array(0, 0)
		);

		Differences.insertPassagePairsDifferentBetweenMatching
		(
			string0,
			string1,
			passagePairsMatching,
			passagePairsAll
		);

		var returnValue = new Differences(passagePairsAll);

		return returnValue;
	}

	Differences.findPassagePairsMatchingBetweenStrings = function(string0, string1, positionOffsets)
	{
		var passagePairsMatching = new Array();

		var longestCommonPassagePair = Differences.findLongestCommonPassagePair
		(
			string0, 
			string1
		);

		var longestCommonPassageText = longestCommonPassagePair.passages[0].text;
		var lengthOfPassage = longestCommonPassageText.length;

		if (lengthOfPassage == 0)
		{
			return passagePairsMatching;	
		}

		passagePairsMatching.push(longestCommonPassagePair);

		var passages = longestCommonPassagePair.passages;
		var passage0 = passages[0];
		var passage1 = passages[1];

		var passagePairSetsMatchingBeforeAndAfter = new Array
		(
			Differences.findPassagePairsMatchingBetweenStrings
			(
				string0.substring(0, passage0.position),
				string1.substring(0, passage1.position),
				new Array
				(
					positionOffsets[0], 
					positionOffsets[1]
				)
			),
			Differences.findPassagePairsMatchingBetweenStrings
			(
				string0.substring
				(
					passage0.position + lengthOfPassage
				),
				string1.substring
				(
					passage1.position + lengthOfPassage
				),
				new Array
				(
					positionOffsets[0] 
						+ passage0.position 
						+ lengthOfPassage,

					positionOffsets[1] 
						+ passage1.position 
						+ lengthOfPassage
				)
			)
		);

		for (var i = 0; i < passagePairSetsMatchingBeforeAndAfter.length; i++)
		{
			var passagePairSet = passagePairSetsMatchingBeforeAndAfter[i];

			for (var p = 0; p < passagePairSet.length; p++)
			{
				passagePairsMatching.splice
				(
					(i == 0 ? 0 : passagePairsMatching.length),
					0, 
					passagePairSet[p]
				);
			}
		}

		for (var i = 0; i < longestCommonPassagePair.passages.length; i++)
		{
			var passage = longestCommonPassagePair.passages[i];
			passage.position += positionOffsets[i];
		}

		return passagePairsMatching;
	}

	Differences.findLongestCommonPassagePair = function(string0, string1)
	{
		var passage0 = new Passage("", 0);
		var passage1 = new Passage("", 0);

		var returnValue = new PassagePair
		(
			true, // doPassagesMatch
			new Array
			(
				passage0, passage1
			)
		);

		var lengthOfString0 = string0.length;
		var lengthOfString1 = string1.length;

		var substringLengthsForRow = null;
		var substringLengthsForRowPrev;

		var lengthOfLongestCommonSubstringSoFar = 0;
		var longestCommonSubstringsSoFar = "";
		var cellIndex = 0;

		// Build a table whose y-axis is chars from string0,
		// and whose x-axis is chars from string1.
		// Put length of the longest substring in each cell.

		for (var i = 0; i < lengthOfString0; i++)
		{
			substringLengthsForRowPrev = substringLengthsForRow;
			substringLengthsForRow = new Array();

			for (var j = 0; j < lengthOfString1; j++)
			{
				if (string0[i] != string1[j])
				{
					substringLengthsForRow[j] = 0;
				}
				else 
				{
					var cellValue;

					if (i == 0 || j == 0)
					{
						// first row or column
						cellValue = 1;
					}
					else
					{
						// Copy cell to upper left, add 1.
						cellValue = substringLengthsForRowPrev[j - 1] + 1;
					}

					substringLengthsForRow[j] = cellValue;

					if (cellValue > lengthOfLongestCommonSubstringSoFar)
					{
						lengthOfLongestCommonSubstringSoFar = cellValue;
						var startIndex = i - lengthOfLongestCommonSubstringSoFar + 1;
						var longestCommonSubstringSoFar = string0.substring
						(
							startIndex, 
							i + 1
						);

						passage0.text = longestCommonSubstringSoFar;
						passage0.position = startIndex;

						passage1.text = longestCommonSubstringSoFar;
						passage1.position = j - lengthOfLongestCommonSubstringSoFar + 1;
					}
				}
			}
		}

		return returnValue;
	}

	Differences.insertPassagePairsDifferentBetweenMatching = function
	(
		string0,
		string1,
		passagePairsToInsertBetween,
		passagePairsAll
	)
	{	
		passagePairsToInsertBetween.splice
		(
			0, 
			0,
			new PassagePair
			(
				true, 
				new Array
				(
					new Passage("", 0),
					new Passage("", 0)
				)
			)
		);

		passagePairsToInsertBetween.push
		(
			new PassagePair
			(
				true, 
				new Array
				(
					new Passage("", string0.length),
					new Passage("", string1.length)
				)
			)
		);

		var pMax = passagePairsToInsertBetween.length - 1;

		for (var p = 0; p < pMax; p++)
		{
			passagePairToInsertAfter = passagePairsToInsertBetween[p];
			passagePairToInsertBefore = passagePairsToInsertBetween[p + 1];

			Differences.buildAndInsertPassagePairBetweenExisting
			(
				string0,
				string1,
				passagePairToInsertBefore,
				passagePairToInsertAfter,
				passagePairsAll
			);

			passagePairsAll.push(passagePairToInsertBefore);
		}

		var indexOfPassagePairFinal = passagePairsAll.length - 1;

		var passagePairFinal = passagePairsAll[indexOfPassagePairFinal];

		if 
		(
			passagePairFinal.doPassagesMatch == true 
			&& passagePairFinal.passages[0].text.length == 0
		)
		{
			passagePairsAll.splice(indexOfPassagePairFinal, 1);
		}
	}

	Differences.buildAndInsertPassagePairBetweenExisting = function
	(
		string0, 
		string1, 
		passagePairToInsertBefore, 
		passagePairToInsertAfter,
		passagePairsAll
	)
	{
		var lengthOfPassageToInsertAfter = passagePairToInsertAfter.passages[0].text.length;

		var positionsForPassagePairDifferent = new Array
		(
			new Array
			(
				passagePairToInsertAfter.passages[0].position 
					+ lengthOfPassageToInsertAfter,

				passagePairToInsertAfter.passages[1].position 
					+ lengthOfPassageToInsertAfter
			),			
			new Array
			(
				passagePairToInsertBefore.passages[0].position,
				passagePairToInsertBefore.passages[1].position
			)			
		);

		var passagePairToInsert = new PassagePair
		(
			false,
			new Array
			(
				new Passage
				(
					string0.substring
					(
						positionsForPassagePairDifferent[0][0], 
						positionsForPassagePairDifferent[1][0]
					),
					positionsForPassagePairDifferent[0][0]
				),
				new Passage
				(
					string1.substring
					(
						positionsForPassagePairDifferent[0][1], 
						positionsForPassagePairDifferent[1][1]
					),
					positionsForPassagePairDifferent[0][1]
				)
			)
		);

		if 
		(
			passagePairToInsert.passages[0].text.length > 0
			|| passagePairToInsert.passages[1].text.length > 0
		)
		{
			passagePairsAll.push(passagePairToInsert);
		}

	}

	// instance methods

	Differences.prototype.toHTMLElement = function()
	{
		var returnValue = document.createElement("table");
		returnValue.style.border = "1px solid";

		for (var p = 0; p < this.passagePairs.length; p++)
		{
			var passagePair = this.passagePairs[p];

			returnValue.appendChild(passagePair.toHTMLElement());
		}

		return returnValue; 
	}	
}

function Passage(text, position)
{
	this.text = text;

	this.position = position;
}
{
	Passage.prototype.toHTMLElement = function()
	{
		var returnValue = document.createElement("td");

		var tableForPassage = document.createElement("table");

		var trForPassage = document.createElement("tr");

		var tdForText = document.createElement("td");
		tdForText.style.border = "1px solid";
		tdForText.style.width = "100px";
		tdForText.innerHTML = this.text;
		trForPassage.appendChild(tdForText);

		var tdForPosition = document.createElement("td");
		tdForPosition.style.border = "1px solid";
		tdForPosition.style.width = "50px";
		tdForPosition.innerHTML = this.position;
		trForPassage.appendChild(tdForPosition);

		tableForPassage.appendChild(trForPassage);

		returnValue.appendChild(tableForPassage);

		return returnValue;
	}
}

function PassagePair(doPassagesMatch, passages)
{
	this.doPassagesMatch = doPassagesMatch;
	this.passages = passages;	
}
{
	PassagePair.prototype.toHTMLElement = function()
	{
		var returnValue = document.createElement("tr");

		for (var i = 0; i < this.passages.length; i++)		
		{
			var passage = this.passages[i];

			returnValue.appendChild(passage.toHTMLElement());
		}

		var symbolForChangeType;

		if (this.doPassagesMatch == true)
		{
			symbolForChangeType = "=";
		}
		else
		{
			if (this.passages[0].text.length == 0)
			{
				symbolForChangeType = "+";
			}	
			else if (this.passages[1].text.length == 0)
			{
				symbolForChangeType = "-";
			}
			else
			{
				symbolForChangeType = "~";
			}
		}

		var tdForChangeType = document.createElement("td");
		tdForChangeType.style.border = "1px solid";
		tdForChangeType.innerHTML = symbolForChangeType;
		returnValue.appendChild(tdForChangeType);			

		return returnValue;
	}
}
new DifferencerTest().main();*/