// Copyright [2018] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.africa.balancesheetrdcmulticurrency
// @api = 1.0
// @pubdate = 2020-08-12
// @publisher = Banana.ch SA
// @description = Balance sheet Report Multicurrency (OHADA - RDC) [BETA]
// @description.fr = Bilan Multi-devise (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
   Resume:
   =======
   
   This BananaApp creates a Balance sheet report for RDC.
   - Active Balance sheet
   - Passive Balance sheet

*/

var exchangerate = "";

/**************************************************************************************
*
* Styles
*
**************************************************************************************/

function createStyleSheet() {
    var stylesheet = Banana.Report.newStyleSheet();
 
    stylesheet.addStyle("@page", "margin:10mm 10mm 10mm 20mm;") 
    stylesheet.addStyle("body", "font-family:Helvetica; font-size:9pt");
    stylesheet.addStyle(".bold", "font-weight:bold;");
    stylesheet.addStyle(".right", "text-align:right;");
    stylesheet.addStyle(".center", "text-align:center");
 
    style = stylesheet.addStyle(".blackCell");
    style.setAttribute("background-color", "black");
    style.setAttribute("color","white");
 
    style = stylesheet.addStyle(".greyCell");
    style.setAttribute("background-color", "#C0C0C0");
 
    style = stylesheet.addStyle(".blueCell");
    style.setAttribute("background-color", "#b7c3e0");
 
    /* table */
    var tableStyle = stylesheet.addStyle(".table");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".c1", "");
    stylesheet.addStyle(".c2", "");
    stylesheet.addStyle("table.table td", "");
    
    var tableStyle = stylesheet.addStyle(".tableActiveBalanceSheet");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".col1", "width:4%");
    stylesheet.addStyle(".col2", "width:31%");
    stylesheet.addStyle(".col3", "width:5%");
    stylesheet.addStyle(".col4", "width:15%");
    stylesheet.addStyle(".col5", "width:15%");
    stylesheet.addStyle(".col6", "width:15%");
    stylesheet.addStyle(".col7", "width:15%");
    //stylesheet.addStyle("table.tableActiveBalanceSheet td", "border:thin solid black;padding-bottom:2px;padding-top:5px");
    stylesheet.addStyle("table.tableActiveBalanceSheet td", "padding-bottom:2px;padding-top:5px");
 
    var tableStyle = stylesheet.addStyle(".tablePassiveBalanceSheet");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".pCol1", "width:5%");
    stylesheet.addStyle(".pCol2", "width:60%");
    stylesheet.addStyle(".pCol3", "width:5%");
    stylesheet.addStyle(".pCol4", "width:15%");
    stylesheet.addStyle(".pCol5", "width:15%");
    stylesheet.addStyle("table.tablePassiveBalanceSheet td", "border:thin solid black;padding-bottom:2px;padding-top:5px");
 
    return stylesheet;
 }
 

