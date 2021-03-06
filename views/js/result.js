function showUserResult(resultList) {
	if (resultList.length > 0) {
		// Header row
		var headTable = document.getElementById("headerResultTable");
		var newRow = headTable.insertRow(-1);
		var categoryHeader = newRow.insertCell(0);
		categoryHeader.appendChild(document.createTextNode('Category'));
		var levelHeader = newRow.insertCell(1);
		levelHeader.appendChild(document.createTextNode('Level'));
		var scoreHeader = newRow.insertCell(2);
		scoreHeader.appendChild(document.createTextNode('Score'));
		var timeHeader = newRow.insertCell(3);
		timeHeader.appendChild(document.createTextNode('Time'));

		var table = document.getElementById("resultTable");
		for (i=0; i<resultList.length; i++){
			// Insert a row at the end of the table
			var newRow1 = table.insertRow(-1);
			
			// Category
			var category = newRow1.insertCell(0);
			category.style.textAlign = "center";
			category.appendChild(document.createTextNode(resultList[i].category));
	
			// Level
			var level = newRow1.insertCell(1);
			level.style.textAlign = "center";
			level.appendChild(document.createTextNode(resultList[i].level));
	
			// Score
			var score = newRow1.insertCell(2);
			score.style.textAlign = "center";
			score.appendChild(document.createTextNode(resultList[i].score));
			
			// Time
			var time = newRow1.insertCell(3);
			time.style.textAlign = "center";
			time.appendChild(document.createTextNode(resultList[i].time));
		}
	}
	else {
		document.getElementById("noti").change = "Have not taken exams!";
	}
}

function countSubmissionByLevel (resultList){
	var easy = 0;
	var medium = 0;
	var hard = 0;
	for (i=0; i<resultList.length; i++){
		// Level
		if (resultList[i].level == 'Easy'){
			easy += 1;
		}
		if (resultList[i].level == 'Medium'){
			medium += 1;
		}
		if (resultList[i].level == 'Hard'){
			hard += 1;
		}
	}
	return [["Easy", easy], ["Medium", medium], ["Hard", hard]];
}

function getResultByLevel (resultList, level){
	var result = [];
	for (i=0; i<resultList.length; i++){
		// Level
		if (resultList[i].level == level){
			result.push([resultList[i].time.slice(0,16), resultList[i].score]);
		}
	}
	return result;
}

function getResultByCategory (resultList, categoryList) {
	var result = {};
	var res = [];
	for (i=0; i<categoryList.length; i++){
		result[categoryList[i]] = 0;
	}
	for (i=0; i<resultList.length; i++){
		result[resultList[i].category] += 1;
	}
	for (i=0; i<categoryList.length; i++){
		res.push([])
	}
	console.log(result);

	return result;
}

function showBarChart(resultList, categoryList){
	var chart = anychart.bar(getResultByCategory(resultList, categoryList));
	//chart.title("Taken Exam by Categories");
	chart.container("barchart");
	chart.draw();
}

function showPieChart (resultList){
	if (resultList.length > 0){
		var chart = anychart.pie(countSubmissionByLevel(resultList));
		//chart.title("Taken Exam by Levels");
		chart.container("piechart");
		chart.draw();
	}
}

function showLineChart (resultList, level){
	if (resultList.length > 0){
		var chart = anychart.line(getResultByLevel(resultList, level));
		//chart.title("Taken " + level + " Exam");
		var container = "linechart";
		container = container.concat(level);
		//console.log(container);
		chart.container(container);
		chart.draw();
	}
}

function getTableResult() {
	var ajax = new XMLHttpRequest();
	var method = "POST";
	var url = "controllers/result_ptj.php";
	var asynchronous = true;
	ajax.open(method, url, asynchronous);
	ajax.send();
	ajax.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var data = this.responseText;
			console.log(data);
			var resultArr = JSON.parse(data);
			if (resultArr != null){
				var resultList = resultArr[0];
				var categoryList = resultArr[1];
				showUserResult(resultList);
				showPieChart(resultList);
				//showBarChart(resultList, categoryList);
				showLineChart(resultList, "Hard");
				showLineChart(resultList, "Medium");
				showLineChart(resultList, "Easy");
			}
			else {
				document.getElementById('noti').textContent = 'No data available';
				document.getElementById('result_container').style.background = 'white';
				document.getElementById('examhistorty').style.display = 'none';
				document.getElementById('difficulty').style.display = 'none';
				document.getElementById('hard').style.display = 'none';
				document.getElementById('medium').style.display = 'none';
				document.getElementById('easy').style.display = 'none';
			}
		}
	};
}