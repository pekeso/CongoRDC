// Copyright [2022] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//


// @id = ch.banana.africa.minbalancesheet.test
// @api = 1.0
// @pubdate = 2022-06-05
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.africa.minbalancesheet.test.js>
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../ch.banana.africa.minbalancesheet.js
// @timeout = -1



// Register test case to be executed
Test.registerTestCase(new MinimalBalanceSheetReport());

// Here we define the class, the name of the class is not important
function MinimalBalanceSheetReport() {

}

// This method will be called at the beginning of the test case
MinimalBalanceSheetReport.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
MinimalBalanceSheetReport.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
MinimalBalanceSheetReport.prototype.init = function() {

}

// This method will be called after every test method is executed
MinimalBalanceSheetReport.prototype.cleanup = function() {

}

MinimalBalanceSheetReport.prototype.testBananaExtension = function() {

	/**
	 * Test 1: column Gr
	 */
	var banDoc = Banana.application.openDocument("file:script/../test/testcases/2022_ets_diena.ac2");
	Test.assert(banDoc);

	var userParam = {};
  	userParam.selectionStartDate = "2021-01-01";
  	userParam.selectionEndDate = "2021-12-31";
  	userParam.title = "BILAN 2021";
	userParam.logo = false;
	userParam.logoname = 'Logo';
	userParam.printheader = false;
	userParam.printtitle = true;
	userParam.title = '';
	userParam.column = 'Gr1';
	userParam.printcolumn = false;

	var reportStructure = createReportStructure();

	const bReport = new BReport(banDoc, userParam, reportStructure);
	bReport.validateGroupsBalance(userParam.column);
	bReport.loadBalances();
	bReport.calculateTotals(["currentAmount", "previousAmount"]);
	bReport.formatValues(["currentAmount", "previousAmount"]);
	bReport.excludeEntries();

	var report = printBalanceSheet(banDoc, userParam, bReport, "");
	Test.logger.addReport("Test 'Bilan'", report);


	/**
	 * Test 2: column Gr1
	 */
	// var banDoc = Banana.application.openDocument("file:script/../test/testcases/ets_test_gestionale_gr_gr1.ac2");
	// Test.assert(banDoc);

	// var userParam = {};
  	// userParam.selectionStartDate = "2022-01-01";
  	// userParam.selectionEndDate = "2022-12-31";
  	// userParam.title = "RENDICONTO GESTIONALE (MOD. B) ANNO 2022";
	// userParam.logo = false;
	// userParam.logoname = 'Logo';
	// userParam.printheader = false;
	// userParam.printtitle = true;
	// userParam.title = '';
	// userParam.column = 'Gr1';
	// userParam.printcolumn = false;
	// userParam.printcostifigurativi = true;

	// var reportStructure = createReportStructureRendicontoGestionale();

	// const bReport1 = new BReport(banDoc, userParam, reportStructure);
	// bReport1.validateGroups(userParam.column);
	// bReport1.loadBalances();
	// bReport1.calculateTotals(["currentAmount", "previousAmount"]);
	// bReport1.formatValues(["currentAmount", "previousAmount"]);
	// bReport1.excludeEntries();

	// var report = printRendicontoModB(banDoc, userParam, bReport1, "");
	// Test.logger.addReport("Test 2: 'rendiconto gestionale (MOD. B)', column Gr1", report);

	/**
	 * Test 3: tutorial template
	 */
	// var banDoc = Banana.application.openDocument("file:script/../test/testcases/11094-entrate-uscite-ets-rendiconto-cassa-tutorial.ac2");
	// Test.assert(banDoc);

	// var userParam = {};
  	// userParam.selectionStartDate = "2020-01-01";
  	// userParam.selectionEndDate = "2020-12-31";
  	// userParam.title = "RENDICONTO GESTIONALE (MOD. B) ANNO 2020";
	// userParam.logo = false;
	// userParam.logoname = 'Logo';
	// userParam.printheader = false;
	// userParam.printtitle = true;
	// userParam.title = '';
	// userParam.column = 'Gr1';
	// userParam.printcolumn = false;
	// userParam.printcostifigurativi = true;

	// var reportStructure = createReportStructureRendicontoGestionale();

	// const bReport2 = new BReport(banDoc, userParam, reportStructure);
	// bReport2.validateGroups(userParam.column);
	// bReport2.loadBalances();
	// bReport2.calculateTotals(["currentAmount", "previousAmount"]);
	// bReport2.formatValues(["currentAmount", "previousAmount"]);
	// bReport2.excludeEntries();

	// var report = printRendicontoModB(banDoc, userParam, bReport2, "");
	// Test.logger.addReport("Test 3: 'rendiconto gestionale (MOD. B)', column Gr1", report);

	/**
	 * Test 4: tutorial template, print gr1 column
	 */
	// var banDoc = Banana.application.openDocument("file:script/../test/testcases/11094-entrate-uscite-ets-rendiconto-cassa-tutorial.ac2");
	// Test.assert(banDoc);

	// var userParam = {};
  	// userParam.selectionStartDate = "2020-01-01";
  	// userParam.selectionEndDate = "2020-12-31";
  	// userParam.title = "RENDICONTO GESTIONALE (MOD. B) ANNO 2020";
	// userParam.logo = false;
	// userParam.logoname = 'Logo';
	// userParam.printheader = false;
	// userParam.printtitle = true;
	// userParam.title = '';
	// userParam.column = 'Gr1';
	// userParam.printcolumn = true;
	// userParam.printcostifigurativi = true;

	// var reportStructure = createReportStructureRendicontoGestionale();

	// const bReport3 = new BReport(banDoc, userParam, reportStructure);
	// bReport3.validateGroups(userParam.column);
	// bReport3.loadBalances();
	// bReport3.calculateTotals(["currentAmount", "previousAmount"]);
	// bReport3.formatValues(["currentAmount", "previousAmount"]);
	// bReport3.excludeEntries();

	// var report = printRendicontoModB(banDoc, userParam, bReport3, "");
	// Test.logger.addReport("Test 4: 'rendiconto gestionale (MOD. B)', stampa colonna raggruppamento", report);

}