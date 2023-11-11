// Copyright [2020] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//  http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @id = ch.banana.africa.smereportsohadardc
// @api = 1.0
// @pubdate = 2021-01-22
// @publisher = Banana.ch SA
// @description = 2. Compte de résultat (SMT)
// @task = app.command
// @doctype = 100.100;110.100;130.100
// @docproperties = 
// @outputformat = none
// @inputdatasource = none
// @timeout = -1
// @includejs = reportstructure.js
// @includejs = breport.js
// @includejs = errors.js


/*

   

*/


var BAN_VERSION = "10.0.1";
var BAN_EXPM_VERSION = "";


//Main function
function exec(string) {

   //Check if we are on an opened document
   if (!Banana.document) {
      return;
   }

   //Check the banana version
   var isCurrentBananaVersionSupported = bananaRequiredVersion(BAN_VERSION, BAN_EXPM_VERSION);
   if (!isCurrentBananaVersionSupported) {
      return "@Cancel";
   }

   var userParam = initUserParam();
   var savedParam = Banana.document.getScriptSettings();
   if (savedParam && savedParam.length > 0) {
      userParam = JSON.parse(savedParam);
   }
   // If needed show the settings dialog to the user
   if (!options || !options.useLastSettings) {
      userParam = settingsDialog(); // From properties
   }
   if (!userParam) {
      return "@Cancel";
   }

   /**
    * 1. Loads the report structure
    */
   var reportStructure = createReportStructure();

   /**
    * 2. Calls methods to load balances, calculate totals, format amounts
    * and check entries that can be excluded
    */
   const bReport = new BReport(Banana.document, userParam, reportStructure);
   bReport.validateGroupsProfitAndLoss(userParam.column);
   bReport.loadBalances();
   bReport.calculateTotals(["currentAmount", "previousAmount"]);
   bReport.formatValues(["currentAmount", "previousAmount"]);
   //Banana.console.log(JSON.stringify(reportStructure, "", " "));

   /**
    * 3. Creates the report
    */
   var previous = Banana.document.previousYear();
   var stylesheet = Banana.Report.newStyleSheet();
   var report = printprofitlossstatement(Banana.document, previous, userParam, bReport, stylesheet);
   setCss(Banana.document, stylesheet, userParam);

   Banana.Report.preview(report, stylesheet);
}

function printprofitlossstatement(banDoc, previous, userParam, bReport, stylesheet) {

   var report = Banana.Report.newReport("Compte de résultat");
   var startDate = userParam.selectionStartDate;
   var endDate = userParam.selectionEndDate;
   var currentStartDate = startDate;
   var currentEndDate = endDate;
   var currentYear = Banana.Converter.toDate(banDoc.info("AccountingDataBase", "OpeningDate")).getFullYear();
   var previousYear = currentYear - 1;
   var months = monthDiff(Banana.Converter.toDate(endDate), Banana.Converter.toDate(startDate));
   var currentStartMonth = Banana.Converter.toDate(startDate).getMonth();
   var currentEndMonth = Banana.Converter.toDate(endDate).getMonth();

   if (previous) {
      var previousStartDate = previous.info("AccountingDataBase","OpeningDate");
      var previousEndDate = previous.info("AccountingDataBase","ClosureDate");
   }

   var company = banDoc.info("AccountingDataBase","Company");
   var address1 = banDoc.info("AccountingDataBase","Address1");
   var zip = banDoc.info("AccountingDataBase","Zip");
   var city = banDoc.info("AccountingDataBase","City");
   var state = banDoc.info("AccountingDataBase","State");
   var email = banDoc.info("AccountingDataBase","Email");

   

   
   /**************************************************************************************
   * COMPTE DE RÉSULTAT
   **************************************************************************************/
    var table = report.addTable("table");
    var column1 = table.addColumn("column1");
    var column2 = table.addColumn("column2");
    var column3 = table.addColumn("column3");

    var tableRow = table.addRow(); 
    tableRow.addCell(company, "bold", 1);
    tableRow.addCell("Exercice clos le " + Banana.Converter.toLocaleDateFormat(endDate), "", 2);
    tableRow = table.addRow();
    tableRow.addCell(address1 + " - " + city + " - " + state, "", 1);
    tableRow.addCell("Durée (en mois) " + months, "", 2);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);
    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);
    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);
    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);

    tableRow = table.addRow();
    tableRow.addCell("COMPTE DE RÉSULTAT AU 31 DÉCEMBRE "  + currentYear, "bold align-center", 3);

    // Profit & Loss table
   var table = report.addTable("table-profit-loss");
   var columnProfitLoss1 = table.addColumn("column-profit-loss1");
   var columnProfitLoss2 = table.addColumn("column-profit-loss2");
   var columnProfitLoss3 = table.addColumn("column-profit-loss3");
   var columnProfitLoss4 = table.addColumn("column-profit-loss4");
   var columnProfitLoss5 = table.addColumn("column-profit-loss5");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 5).setStyleAttributes("border:thin solid white");
   tableRow = table.addRow();
   tableRow.addCell(" ", "", 5).setStyleAttributes("border-left:thin solid white;border-right:thin solid white");

   tableRow = table.addRow();
   tableRow.addCell("Nº","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-bottom:thin solid white;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("RUBRIQUES","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-bottom:thin solid white;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NOTE","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-bottom:thin solid white;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("MONTANT","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid white;padding-bottom:2px;padding-top:5px;padding-left:77px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   
   tableRow = table.addRow();
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE " + currentYear,"bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE " + previousYear,"bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* 11 */   
   tableRow = table.addRow();
   tableRow.addCell("11", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("11"), "align-left", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("11"), "align-center", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("11"), "align-right", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("11"), "align-right", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");

   /* 12 */
   tableRow = table.addRow();
   var groupTwelve = Number(banDoc.currentBalance("4111")['credit']);
   var previousGroupTwelve = Number(banDoc.currentBalance("4111")['opening']);
   tableRow.addCell("12", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("12"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("12"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(groupTwelve), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousGroupTwelve), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 4 */
   tableRow = table.addRow();
   var totalProducts = groupTwelve + Number(banDoc.currentBalance("7010")['credit']) + Number(banDoc.currentBalance("7020")['credit']);
   var previousTotalProducts = previousGroupTwelve + Number(banDoc.currentBalance("7010")['opening']) + Number(banDoc.currentBalance("7020")['opening']);
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("RP"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("RP"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(totalProducts), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousTotalProducts), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* 13 */
   tableRow = table.addRow();
   tableRow.addCell("13", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("13"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("13"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("13"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("13"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 14 */
   tableRow = table.addRow();
   tableRow.addCell("14", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("14"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("14"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("14"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("14"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   
   /* 15 */
   tableRow = table.addRow();
   tableRow.addCell("15", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("15"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("15"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("15"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("15"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   
   /* 16 */
   tableRow = table.addRow();
   tableRow.addCell("16", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("16"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("16"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("16"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("16"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 17 */
   tableRow = table.addRow();
   tableRow.addCell("17", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("17"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("17"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("17"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("17"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 18 */
   tableRow = table.addRow();
   var currentBal = Number(banDoc.currentBalance("6580")['debit']) + Number(banDoc.currentBalance("4011")['debit']);
   var previousYearBalance = Number(banDoc.currentBalance("6580")['opening']) + Number(banDoc.currentBalance("4011")['opening']);
   tableRow.addCell("18", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("18"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("18"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(currentBal), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousYearBalance), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* TOTAL DEPENSES SUR CHARGES */
   tableRow = table.addRow();
   var accounts = [Number(banDoc.currentBalance("6010")['debit']), Number(banDoc.currentBalance("6228")['debit']), 
               Number(banDoc.currentBalance("6611")['debit']), Number(banDoc.currentBalance("6480")['debit']),
               Number(banDoc.currentBalance("6712")['debit']), Number(banDoc.currentBalance("6580")['debit']), 
               Number(banDoc.currentBalance("4011")['debit'])];
   var previousAccounts = [Number(banDoc.currentBalance("6010")['opening']), Number(banDoc.currentBalance("6228")['opening']), 
                        Number(banDoc.currentBalance("6611")['opening']), Number(banDoc.currentBalance("6480")['opening']),
                        Number(banDoc.currentBalance("6712")['opening']), Number(banDoc.currentBalance("6580")['opening']), 
                        Number(banDoc.currentBalance("4011")['opening'])];
   var totalExpenses = sumAccounts(accounts);
   var previousTotalExpenses = sumAccounts(previousAccounts);
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("B"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("B"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(totalExpenses), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousTotalExpenses), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* C (SOLDE) */
   tableRow = table.addRow();
   var solde = totalProducts - totalExpenses;
   var previousSolde = previousTotalProducts - previousTotalExpenses;
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("C"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("C"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(solde), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousSolde), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* 19 */
   tableRow = table.addRow();
   var resultVarStock = Number(banDoc.currentBalance("3110")['balance']) - Number(banDoc.currentBalance("3110")['opening']);
   tableRow.addCell("19", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("19"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("19"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(resultVarStock), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("19"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 20 */
   tableRow = table.addRow();
   var resultVarCreances = Number(banDoc.currentBalance("4111")['balance']) - Number(banDoc.currentBalance("4111")['opening']);
   tableRow.addCell("20", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("20"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("20"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(resultVarCreances), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("20"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 21 */
   tableRow = table.addRow();
   var resultVarDettes = Number(Banana.SDecimal.invert(banDoc.currentBalance("4011")['balance'])) - Number(Banana.SDecimal.invert(banDoc.currentBalance("4011")['opening']));
   tableRow.addCell("21", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("21"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("21"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(resultVarDettes), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("21"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* D (VARIATION A COURT TERME) */
   tableRow = table.addRow();
   var shortTermVariation = Number(Banana.SDecimal.invert(resultVarStock)) + Number(Banana.SDecimal.invert(resultVarCreances)) + resultVarDettes;
   var previousShortTermVariation = Number(banDoc.currentBalance("6030")['opening']) + Number(banDoc.currentBalance("4111")['opening']) + Number(Banana.SDecimal.invert(banDoc.currentBalance("4011")['opening']));
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("D"), 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("D"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(shortTermVariation), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("D"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* 22 */
   var realEstateAcquisitions = Number(banDoc.currentBalance("2300")['debit']) + Number(banDoc.currentBalance("2400")['debit']);
   var previousRealEstateAcquisitions = Number(banDoc.currentBalance("2300", previousStartDate, previousEndDate)['debit']) 
                     + Number(banDoc.currentBalance("2400", previousStartDate, previousEndDate)['debit']);
   // var realEstateAcquisitions = sumClosing - sumOpening;
   // var previousYearSumOpening = Number(banDoc.currentBalance("2300", previousStartDate, previousEndDate)['opening']) + 
   //                               Number(banDoc.currentBalance("2400", previousStartDate, previousEndDate)['opening']);
   // var previousYearSumClosing = Number(banDoc.currentBalance("2300", previousStartDate, previousEndDate)['balance']) +
   //                               Number(banDoc.currentBalance("2400", previousStartDate, previousEndDate)['balance']);
   // var previousRealEstateAcquisitions = previousYearSumClosing - previousYearSumOpening;
   tableRow = table.addRow();
   tableRow.addCell("22", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("22"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("22"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(realEstateAcquisitions), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousRealEstateAcquisitions), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 23 */
   var cashContribution = Number(banDoc.currentBalance("1040")['credit']) - Number(banDoc.currentBalance("1030")['debit']);
   var previousCashContribution = Number(banDoc.currentBalance("1040", previousStartDate, previousEndDate)['credit']) 
                                    - Number(banDoc.currentBalance("1030", previousStartDate, previousEndDate)['debit']);
   tableRow = table.addRow();
   tableRow.addCell("23", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("23"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("23"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(cashContribution), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousCashContribution), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 24 */
   var sample = Number(banDoc.currentBalance("1040")['debit']) - Number(banDoc.currentBalance("1030")['credit']);
   var previousSample = Number(banDoc.currentBalance("1040", previousStartDate, previousEndDate)['debit']) 
                           - Number(banDoc.currentBalance("1030", previousStartDate, previousEndDate)['credit']);
   tableRow = table.addRow();
   tableRow.addCell("24", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("24"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("24"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(sample), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousSample), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 28 */
   tableRow = table.addRow();
   borrow = Number(banDoc.currentBalance("1620")['credit']);
   previousBorrow = Number(banDoc.currentBalance("1620")['opening']);
   tableRow.addCell("28", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("28"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("28"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(borrow), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousBorrow), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 29 */
   tableRow = table.addRow();
   borrowReimburse = Number(banDoc.currentBalance("1620")['debit']);
   previousBorrowReimburse = Number(banDoc.currentBalance("1620")['opening']);
   tableRow.addCell("29", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("29"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("29"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(borrowReimburse), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousBorrowReimburse), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* E (VARIATION A LONG TERME) */
   tableRow = table.addRow();
   var longTermVariation =  Number(realEstateAcquisitions) + Number(Banana.SDecimal.invert(Number(cashContribution))) + Number(sample) + Number(Banana.SDecimal.invert(Number(borrow))) + Number(borrowReimburse);
   var previousLongTermVariation = sumAccounts([previousRealEstateAcquisitions, previousCashContribution, previousSample, previousBorrow, previousBorrowReimburse]);
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("E"), 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("E"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(longTermVariation), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(previousLongTermVariation), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* 30 */
   tableRow = table.addRow();
   tableRow.addCell("30", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("30"), 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("30"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(Number(banDoc.currentBalance("6813")['debit']), 2), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(Number(banDoc.currentBalance("6813")['opening']), 2), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* G (RESULTAT EXERCICE) */
   tableRow = table.addRow();
   result = solde  - shortTermVariation - longTermVariation - Banana.SDecimal.invert(Number(banDoc.currentBalance("6813")['debit']));
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell("RÉSULTAT EXERCICE (G = C-D+E-F)", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell("G", "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(result), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("G"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   
   //checkResults(banDoc, startDate, endDate);



   //addFooter(report);
   return report;
}

/**************************************************************************************
*
* Functions that calculate the data for the report
*
**************************************************************************************/
function monthDiff(d1, d2) {
    if (d2 < d1) { 
       var dTmp = d2;
       d2 = d1;
       d1 = dTmp;
    }
    var months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth(); //+1
    months += d2.getMonth();
 
    if (d1.getDate() <= d2.getDate()) {
       months += 1;
    }
    return months;
 }

function checkResults(banDoc, startDate, endDate) {
}

function sumAccounts(accounts) {
   sum = 0;
   for (i = 0; i < accounts.length; i++) {
      sum += accounts[i];
   }
   return sum;
}

function addFooter(report) {
   report.getFooter().addClass("footer");
   report.getFooter().addText("- ", "");
   report.getFooter().addFieldPageNr();
   report.getFooter().addText(" -", "");
}

function formatValues(value,decimals) {
   if (decimals) {
     return Banana.Converter.toLocaleNumberFormat(value,2,true);
   }
   else {
     return Banana.Converter.toLocaleNumberFormat(value,2,true);
   }
 }


/**************************************************************************************
 * Styles
 **************************************************************************************/
function setCss(banDoc, repStyleObj, userParam) {
   var textCSS = "";
   var file = Banana.IO.getLocalFile("file:script/profitlossstatement.css");
   var fileContent = file.read();
   if (!file.errorString) {
      Banana.IO.openPath(fileContent);
      //Banana.console.log(fileContent);
      textCSS = fileContent;
   } else {
      Banana.console.log(file.errorString);
   }
   // Parse the CSS text
   repStyleObj.parse(textCSS);
}


/**************************************************************************************
 * Functions to manage the parameters
 **************************************************************************************/
function convertParam(userParam) {

   var convertedParam = {};
   convertedParam.version = '1.0';
   convertedParam.data = [];

   var currentParam = {};
   currentParam.name = 'logo';
   currentParam.title = "Imprimer le logo de l'en-tête";
   currentParam.type = 'bool';
   currentParam.value = userParam.logo ? true : false;
   currentParam.defaultvalue = false;
   currentParam.readValue = function() {
      userParam.logo = this.value;
   }
   convertedParam.data.push(currentParam);

   var currentParam = {};
   currentParam.name = 'logoname';
   currentParam.title = 'Nom du logo (Logo Imposé -> Personnalisation)';
   currentParam.type = 'string';
   currentParam.value = userParam.logoname ? userParam.logoname : 'Logo';
   currentParam.defaultvalue = 'Logo';
   currentParam.readValue = function() {
     userParam.logoname = this.value;
   }
   convertedParam.data.push(currentParam);

   currentParam = {};
   currentParam.name = 'printheader';
   currentParam.title = "Imprimer le texte de l'en-tête de la page (Proprieté fichier -> Adresse)";
   currentParam.type = 'bool';
   currentParam.value = userParam.printheader ? true : false;
   currentParam.defaultvalue = false;
   currentParam.readValue = function() {
    userParam.printheader = this.value;
   }
   convertedParam.data.push(currentParam);

   currentParam = {};
   currentParam.name = 'printtitle';
   currentParam.title = 'Imprimer le titre';
   currentParam.type = 'bool';
   currentParam.value = userParam.printtitle ? true : false;
   currentParam.defaultvalue = true;
   currentParam.readValue = function() {
    userParam.printtitle = this.value;
   }
   convertedParam.data.push(currentParam);

   // var currentParam = {};
   // currentParam.name = 'title';
   // currentParam.title = 'Testo titolo (vuoto = testo predefinito)';
   // currentParam.type = 'string';
   // currentParam.value = userParam.title ? userParam.title : '';
   // currentParam.defaultvalue = '';
   // currentParam.readValue = function() {
   //    userParam.title = this.value;
   // }
   // convertedParam.data.push(currentParam);

   var currentParam = {};
   currentParam.name = 'column';
   currentParam.title = "Colonne de regroupement (Nom XML de la colonne)";
   currentParam.type = 'string';
   currentParam.value = userParam.column ? userParam.column : 'Gr';
   currentParam.defaultvalue = 'Gr';
   currentParam.readValue = function() {
      userParam.column = this.value;
   }
   convertedParam.data.push(currentParam);

   var currentParam = {};
   currentParam.name = 'decimals';
   currentParam.title = 'Enlever les décimales';
   currentParam.type = 'bool';
   currentParam.value = userParam.decimals ? userParam.decimals : false;
   currentParam.defaultvalue = false;
   currentParam.readValue = function() {
      userParam.decimals = this.value;
   }
   convertedParam.data.push(currentParam);

   return convertedParam;
}

function initUserParam() {
   var userParam = {};
   userParam.logo = false;
   userParam.logoname = 'Logo';
   userParam.printheader = false;
   userParam.printtitle = true;
   userParam.title = '';
   userParam.column = 'Gr';
   return userParam;
}

function parametersDialog(userParam) {
   if (typeof(Banana.Ui.openPropertyEditor) !== 'undefined') {
      var dialogTitle = "Parametri";
      var convertedParam = convertParam(userParam);
      var pageAnchor = 'ch.banana.africa.smereportsohadardc';
      if (!Banana.Ui.openPropertyEditor(dialogTitle, convertedParam, pageAnchor)) {
         return null;
      }
      for (var i = 0; i < convertedParam.data.length; i++) {
         // Read values to userParam (through the readValue function)
         convertedParam.data[i].readValue();
      }
      //  Reset reset default values
      userParam.useDefaultTexts = false;
   }

   return userParam;
}

function settingsDialog() {
   var userParam = initUserParam();
   var savedParam = Banana.document.getScriptSettings();
   if (savedParam && savedParam.length > 0) {
      userParam = JSON.parse(savedParam);
   }

   //We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
   var docStartDate = Banana.document.startPeriod();
   var docEndDate = Banana.document.endPeriod();

   //A dialog window is opened asking the user to insert the desired period. By default is the accounting period
   var selectedDates = Banana.Ui.getPeriod('', docStartDate, docEndDate,
      userParam.selectionStartDate, userParam.selectionEndDate, userParam.selectionChecked);

   //We take the values entered by the user and save them as "new default" values.
   //This because the next time the script will be executed, the dialog window will contains the new values.
   if (selectedDates) {
      userParam["selectionStartDate"] = selectedDates.startDate;
      userParam["selectionEndDate"] = selectedDates.endDate;
      userParam["selectionChecked"] = selectedDates.hasSelection;
   } else {
      //User clicked cancel
      return null;
   }

   userParam = parametersDialog(userParam); // From propertiess
   if (userParam) {
      var paramToString = JSON.stringify(userParam);
      Banana.document.setScriptSettings(paramToString);
   }

   return userParam;
}


/**************************************************************************************
 * Check the banana version
 **************************************************************************************/
function bananaRequiredVersion(requiredVersion, expmVersion) {
   if (expmVersion) {
      requiredVersion = requiredVersion + "." + expmVersion;
   }
   if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) < 0) {
      Banana.application.showMessages();
      Banana.document.addMessage(getErrorMessage(ID_ERR_VERSION));
      return false;
   }
   else {
      if (Banana.application.license) {
         if (Banana.application.license.licenseType === "advanced") {
            return true;
         }
         else {
            Banana.application.showMessages();
            Banana.document.addMessage(getErrorMessage(ID_ERR_LICENCE_ADVANCED));           
            return false;
         }
      }
   }
}
