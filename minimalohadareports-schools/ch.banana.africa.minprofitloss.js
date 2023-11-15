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
// @id = ch.banana.africa.minreportsohadardcschool
// @api = 1.0
// @pubdate = 2023-11-11
// @publisher = Banana.ch SA
// @description = 2. Compte de résultat (SMT - Ecole - RDC) [BETA]
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
   bReport.calculateTotals(["currentAmount", "previousAmount", "openingAmount"]);
   bReport.formatValues(["currentAmount", "previousAmount", "openingAmount"]);
   //Banana.console.log(JSON.stringify(reportStructure, "", " "));

   
   var previous = Banana.document.previousYear();

   /**
    * 3. Calls methods to load balances, calculate totals, format amounts
    * and check entries that can be excluded
    */
   var bReportPrev = null;
   if (previous) {
      bReportPrev = new BReport(previous, userParam, reportStructure);
      bReportPrev.validateGroupsProfitAndLoss(userParam.column);
      bReportPrev.loadBalances();
      bReportPrev.calculateTotals(["currentAmount", "previousAmount", "openingAmount"]);
      bReportPrev.formatValues(["currentAmount", "previousAmount", "openingAmount"]);
   }

   /**
    * 4. Creates the report
    */
   var stylesheet = Banana.Report.newStyleSheet();
   var report = printprofitlossstatement(Banana.document, previous, userParam, bReport, bReportPrev, stylesheet);
   setCss(Banana.document, stylesheet, userParam);

   Banana.Report.preview(report, stylesheet);
}

function printprofitlossstatement(banDoc, previous, userParam, bReport, bReportPrev, stylesheet) {

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
   tableRow.addCell("12", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("12"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("12"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("12"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("12"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* RP */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("RP"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("RP"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RP"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("RP"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

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
   tableRow.addCell("18", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("18"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("18"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("18"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("18"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* TOTAL DEPENSES SUR CHARGES */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("B"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("B"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("B"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("B"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* C (SOLDE) */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("C"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("C"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("C"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("C"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* 19 */
   tableRow = table.addRow();
   var stock_variation = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("2")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("2")));
   var stock_variation_prev = 0;
   if (previous)
      stock_variation_prev = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("2")), Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectOpeningAmountFormatted("2")));
   tableRow.addCell("19", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("19"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("19"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(stock_variation), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(stock_variation_prev), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 20 */
   tableRow = table.addRow();
   var credit_variation = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("3")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("3")));
   var credit_variation_prev = 0;
   if (previous)
      credit_variation_prev = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("3")), Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectOpeningAmountFormatted("3")));
   tableRow.addCell("20", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("20"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("20"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(credit_variation), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(credit_variation_prev), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 21 */
   tableRow = table.addRow();
   var debt_variation = Banana.SDecimal.subtract(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("9")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("10"))), Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("9")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("10"))));
   var debt_variation_prev = 0;
   if (previous)
      debt_variation_prev = Banana.SDecimal.subtract(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("9")), Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("10"))), Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectOpeningAmountFormatted("9")), Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectOpeningAmountFormatted("10"))));
   tableRow.addCell("21", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("21"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("21"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(debt_variation), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(debt_variation_prev), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* D (VARIATION A COURT TERME) */
   tableRow = table.addRow();
   var partial_total = Banana.SDecimal.add(Banana.SDecimal.invert(stock_variation), Banana.SDecimal.invert(credit_variation));
   var total_d = Banana.SDecimal.add(partial_total, debt_variation);
   var partial_total_prev = 0;
   var total_d_prev = 0;
   if (previous) {
      partial_total_prev = Banana.SDecimal.add(Banana.SDecimal.invert(stock_variation_prev), Banana.SDecimal.invert(credit_variation_prev));
      total_d_prev = Banana.SDecimal.add(partial_total_prev, debt_variation_prev);
   }
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("D"), 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("D"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(total_d), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(total_d_prev), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* 22 */
   tableRow = table.addRow();
   tableRow.addCell("22", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("22"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("22"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("13"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("12"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* F */
   tableRow = table.addRow();
   // var total_a = Banana.SDecimal.add(bReport.getObjectCurrentAmountFormatted("11"), bReport.getObjectCurrentAmountFormatted("13"));
   var total_a_number = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("11")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("12")));
   var total_b_number_1 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("13")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("14")));
   var total_b_number_2 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("15")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("16")));
   var total_b_number_3 = Banana.SDecimal.add(total_b_number_1, total_b_number_2);
   var total_b_number_4 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("17")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("18")));
   var total_b_number = Banana.SDecimal.add(total_b_number_3, total_b_number_4);
   var total_c_number = Banana.SDecimal.subtract(total_a_number, total_b_number);
   var total_d_number = Banana.Converter.toInternalNumberFormat(total_d);
   var partial_f = Banana.SDecimal.subtract(total_c_number, total_d_number);
   var final_f = Banana.SDecimal.subtract(partial_f, Banana.Converter.toInternalNumberFormat(bReport.getObjectPreviousAmountFormatted("12")));
   var total_a_previous_number = 0;
   var total_b_previous_number_1 = 0;
   var total_b_previous_number_2 = 0;
   var total_b_previous_number_3 = 0;
   var total_b_previous_number_4 = 0;
   var total_c_number_previous = 0;
   var total_d_number_previous = 0;
   var partial_f_prev = 0;
   var final_f_prev = 0;
   if (previous) {
      total_a_previous_number = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("11")), Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("12")));
      total_b_previous_number_1 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("13")), Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("14")));
      total_b_previous_number_2 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("15")), Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("16")));
      total_b_previous_number_3 = Banana.SDecimal.add(total_b_previous_number_1, total_b_previous_number_2);
      total_b_previous_number_4 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("17")), Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectCurrentAmountFormatted("18")));  
      total_b_previous_number = Banana.SDecimal.add(total_b_previous_number_3, total_b_previous_number_4);
      total_c_number_previous = Banana.SDecimal.subtract(total_a_previous_number, total_b_previous_number);
      total_d_number_previous = Banana.Converter.toInternalNumberFormat(total_d_prev);
      partial_f_prev = Banana.SDecimal.subtract(total_c_number_previous, total_d_number_previous);
      final_f_prev = Banana.SDecimal.subtract(partial_f_prev, Banana.Converter.toInternalNumberFormat(bReportPrev.getObjectPreviousAmountFormatted("12")));
   }
   tableRow.addCell("", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("F"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("F"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(final_f), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(formatValues(final_f_prev), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   
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
