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
// @description = 1. Bilan (SMT - Ecole - RDC) [BETA]
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
   Système Minimum de Trésorerie

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
   bReport.validateGroupsBalance(userParam.column);
   bReport.loadBalances();
   bReport.calculateTotals(["currentAmount", "previousAmount"]);
   bReport.formatValues(["currentAmount", "previousAmount"]);
   bReport.excludeEntries();
   //Banana.console.log(JSON.stringify(reportStructure, "", " "));

   /**
    * 3. Creates the report
    */
   var stylesheet = Banana.Report.newStyleSheet();
   var report = printBalanceSheet(Banana.document, userParam, bReport, stylesheet);
   setCss(Banana.document, stylesheet, userParam);
   Banana.Report.preview(report, stylesheet);
}

function printRow(userParam, bReport, table, gr, styleColumnDescription, styleColumnAmount) {
   var note = bReport.getObjectNote(gr);
   
   
   tableRow = table.addRow();
   // tableRow.addCell(bReport.getObjectDescription(gr), styleColumnDescription + " " + styleIndentLevel, 1);
   if(bReport.getObjectType(gr) === 'total') {
      tableRow.addCell("", styleColumnDescription + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
      tableRow.addCell(bReport.getObjectDescription(gr), styleColumnDescription + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
      if (note) {
         tableRow.addCell(note, styleColumnDescription + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
      } else {
         tableRow.addCell(" ", "bottom-line", 1).setStyleAttributes("background-color: #C0C0C0");
      }
   } else {
      tableRow.addCell(gr, styleColumnDescription, 1);
      tableRow.addCell(bReport.getObjectDescription(gr), styleColumnDescription, 1);
      if (note) {
         tableRow.addCell(note, styleColumnDescription, 1);
      } else {
         tableRow.addCell(" ", "bottom-line", 1);
      }
   }
   
   if (bReport.getObjectType(gr) === 'group' || bReport.getObjectType(gr) === 'total') { //do not print amounts for title types
      if(bReport.getObjectType(gr) === 'total') {
         tableRow.addCell(bReport.getObjectCurrentAmountFormatted(gr), styleColumnAmount + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
         tableRow.addCell(bReport.getObjectPreviousAmountFormatted(gr), styleColumnAmount + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
      } else {
         tableRow.addCell(bReport.getObjectCurrentAmountFormatted(gr), styleColumnAmount, 1);
         tableRow.addCell(bReport.getObjectPreviousAmountFormatted(gr), styleColumnAmount, 1);
      }         
   } 
}

function printSubRow(userParam, bReport, table, gr, styleColumnDescription, styleColumnAmount) {
   var styleIndentLevel = "";
   var indentLevel = "lvl"+bReport.getObjectIndent(gr);
   if (indentLevel) {
      styleIndentLevel = indentLevel;
   }
   if (userParam.compattastampa) {
      // Prints only elements cannot be excluded
      if (!bReport.getObjectValue(gr, "exclude")) { // false = cannot be excluded
         tableRow = table.addRow();
         tableRow.addCell("("+bReport.getObjectDescription(gr) + ": " + bReport.getObjectCurrentAmountFormatted(gr) + " ; anno precedente " + bReport.getObjectPreviousAmountFormatted(gr) + ")", styleColumnDescription + " " + styleIndentLevel, 1);  
      }
   }
   else {
      // Prints all elements
      tableRow = table.addRow();
      tableRow.addCell("("+bReport.getObjectDescription(gr) + ": " + bReport.getObjectCurrentAmountFormatted(gr) + " ; anno precedente " + bReport.getObjectPreviousAmountFormatted(gr) + ")", styleColumnDescription + " " + styleIndentLevel, 1);
   }
}

function printBalanceSheet(banDoc, userParam, bReport, stylesheet) {

   var report = Banana.Report.newReport("Bilan");
   var startDate = userParam.selectionStartDate;
   var endDate = userParam.selectionEndDate;
   var currentYear = Banana.Converter.toDate(banDoc.info("AccountingDataBase", "OpeningDate")).getFullYear();
   var previousYear = currentYear - 1;
   var months = monthDiff(Banana.Converter.toDate(endDate), Banana.Converter.toDate(startDate));
   
   var company = banDoc.info("AccountingDataBase","Company");
   var address1 = banDoc.info("AccountingDataBase","Address1");
   var zip = banDoc.info("AccountingDataBase","Zip");
   var city = banDoc.info("AccountingDataBase","City");
   var state = banDoc.info("AccountingDataBase","State");
   var email = banDoc.info("AccountingDataBase","Email");

   /**************************************************************************************
   * ACTIVE
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
  tableRow.addCell("BILAN ACTIF AU 31 DÉCEMBRE "  + currentYear, "bold align-center", 3);

  // Active balancesheet table
  var table = report.addTable("table-active-balancesheet");
  var columnActive1 = table.addColumn("column-active1");
   var columnActive2 = table.addColumn("column-active2");
   var columnActive3 = table.addColumn("column-active3");
   var columnActive4 = table.addColumn("column-active4");
   var columnActive5 = table.addColumn("column-active5");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 4);
   tableRow = table.addRow();
   tableRow.addCell(" ", "", 4);

   tableRow = table.addRow();
   tableRow.addCell("Nº","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("ACTIF","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NOTE","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("MONTANT","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid #94B8E3;padding-bottom:2px;padding-top:5px;padding-left:77px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   
   tableRow = table.addRow();
   tableRow.addCell("","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE " + currentYear,"bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE " + previousYear,"bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

  /* 1 */
  printRow(userParam, bReport, table, "1", "description-groups", "amount-groups");
  /* 2 */
  printRow(userParam, bReport, table, "2", "description-groups", "amount-groups");
  /* 3 */
  printRow(userParam, bReport, table, "3", "description-groups", "amount-groups");
  /* 4 */
  printRow(userParam, bReport, table, "4", "description-groups", "amount-groups");
  /* 5 */
  printRow(userParam, bReport, table, "5", "description-groups", "amount-groups");
  /* Total */
  printRow(userParam, bReport, table, "A", "description-groups", "amount-groups-totals");   
   
  tableRow = table.addRow();
  tableRow.addCell(" ", "", 5);
  tableRow = table.addRow();
  tableRow.addCell(" ", "", 5);
  tableRow = table.addRow();
  tableRow.addCell(" ", "", 5);
  tableRow = table.addRow();
  tableRow.addCell(" ", "", 5);

  // Passive balancesheet table
  tableRow = table.addRow();
  tableRow.addCell("BILAN PASSIF AU 31 DÉCEMBRE "  + currentYear, "bold align-center", 5);

  tableRow = table.addRow();
   tableRow.addCell(" ", "", 5);
   tableRow = table.addRow();
   tableRow.addCell(" ", "", 5);

  tableRow = table.addRow();
   tableRow.addCell("Nº","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("ACTIF","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NOTE","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("MONTANT","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid #94B8E3;padding-bottom:2px;padding-top:5px;padding-left:77px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   
   tableRow = table.addRow();
   tableRow.addCell("","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE " + currentYear,"bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE " + previousYear,"bold align-center",1).setStyleAttributes("background-color:#94B8E3;border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* 6 */
   printRow(userParam, bReport, table, "6", "description-groups", "amount-groups");
   /* 7 */
   printRow(userParam, bReport, table, "7", "description-groups", "amount-groups");
   /* 8 */
   printRow(userParam, bReport, table, "8", "description-groups", "amount-groups");
   /* 9 */
   printRow(userParam, bReport, table, "9", "description-groups", "amount-groups");
   /* 10 */
   printRow(userParam, bReport, table, "10", "description-groups", "amount-groups");
   /* Total */
   printRow(userParam, bReport, table, "P", "description-groups", "amount-groups-totals");   
      
   
   //checkResults(banDoc, startDate, endDate);



   addFooter(report);
   return report;
}

function checkResults(banDoc, startDate, endDate) {

   /* tot A */
   var objA = banDoc.currentBalance("Gr=A", startDate, endDate);
   currentA = objA.balance;

   /* tot P */
   var objP = banDoc.currentBalance("Gr=P", startDate, endDate);
   currentP = objP.balance;

   var res0 = Banana.SDecimal.add(currentA, currentP);
   if (res0 !== "0") {
      Banana.document.addMessage("Difference entre Actif et Passif.");
   }
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

function addFooter(report) {
   report.getFooter().addClass("footer");
   report.getFooter().addText("- ", "");
   report.getFooter().addFieldPageNr();
   report.getFooter().addText(" -", "");
}

function setCss(banDoc, repStyleObj, userParam) {
   var textCSS = "";
   var file = Banana.IO.getLocalFile("file:script/balancesheetstyle.css");
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
   currentParam.value = userParam.column ? userParam.column : 'Gr1';
   currentParam.defaultvalue = 'Gr1';
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
   userParam.column = 'Gr1';
   userParam.compattastampa = false;
   userParam.stampa = true;
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
         if (Banana.application.license.licenseType === "professional" || Banana.application.license.licenseType === "advanced") {
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
