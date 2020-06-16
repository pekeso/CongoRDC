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
// @id = ch.banana.africa.tvardc
// @api = 1.0
// @pubdate = 2019-10-14
// @publisher = Banana.ch SA
// @description = VAT Declaration (OHADA - RDC) [BETA]
// @description.fr = Taxe sur la valeur ajoutée TVA (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
   Resume:
   =======
   
   This BananaApp creates a VAT declaration for RDC.

*/

function exec() {

   var dateForm = getPeriodSettings("Select Date");
   
   if (!dateForm) {
      return;
   }

   //CURRENT year file: the current opened document in Banana */
   var current = Banana.document;
   if (!current) {
      return "@Cancel";
   }    

   // Create the VAT report for the selected period
   var startDate = dateForm.selectionStartDate;
   var endDate = dateForm.selectionEndDate;

   var report = createVATDeclaration(startDate, endDate, current);
   var stylesheet = createStyleSheet();
   Banana.Report.preview(report, stylesheet);
}

/**************************************************************************************
*
* Function that creates and prints the VAT report
*
**************************************************************************************/
function createVATDeclaration(startDate, endDate, current) {

   // Accounting period for the current year file
   var currentStartDate = current.info("AccountingDataBase","OpeningDate");
   var currentEndDate = current.info("AccountingDataBase","ClosureDate");
   var currentYear = Banana.Converter.toDate(currentStartDate).getFullYear();
   var company = current.info("AccountingDataBase","Company");
   var address = current.info("AccountingDataBase","Address1");
   var city = current.info("AccountingDataBase","City");
   var state = current.info("AccountingDataBase","State");
   var fiscalNumber = current.info("AccountingDataBase","FiscalNumber");
   var vatNumber = current.info("AccountingDataBase","VatNumber"); 
   var phoneNumber = current.info("AccountingDataBase","Phone");
   var email = current.info("AccountingDataBase","Email");

   // Extract data from journal and calculate balances
   var transactions = getJournal(current, startDate, endDate);

   if (!report) {
      var report = Banana.Report.newReport("VAT Declaration");
   }

   // Header of the report
   var table = report.addTable("table");

   var col1 = table.addColumn("c1");
   col1.setStyleAttributes("width:25%");
   var col2 = table.addColumn("c2");
   col2.setStyleAttributes("width:25%");
   var col3 = table.addColumn("c3");
   col3.setStyleAttributes("width:25%");
   var col4 = table.addColumn("c4");
   col4.setStyleAttributes("width:25%");
   
   
   tableRow = table.addRow();
   tableRow.addCell("RÉPUBLIQUE DÉMOCRATIQUE DU CONGO", "",4);   

   tableRow = table.addRow();
   tableRow.addCell("MINISTÈRE DES FINANCES", "", 4);

   tableRow = table.addRow();
   tableRow.addImage("images/logo.jpg", "1.9cm", "1.9cm", "logostyle");
   cell_in = tableRow.addCell("", "", 2);

   var insideTable = cell_in.addTable("inTable");

   row_in = insideTable.addRow();
   row_in.addCell("", "", 5);
   row_in = insideTable.addRow();
   row_in.addCell("DÉCLARATION DE LA TAXE SUR LA VALEUR AJOUTÉE", "center bold", 1).setStyleAttributes("border-top:thin solid black");
   row_in = insideTable.addRow();
   row_in.addCell("Mois de (2):", "center bold", 1).setStyleAttributes("border-left:thin solid black");
   row_in = insideTable.addRow();
   row_in.addCell("(à souscrire obligatoirement au plus tard le 15 du mois suivant)", "center bold", 1);
   row_in = insideTable.addRow();
   row_in.addCell("", "center bold", 1);

   tableRow = table.addRow();
   tableRow.addCell("SERVICE (1):", "", 4);

   tableRow = table.addRow();
   tableRow.addCell("", "", 4);

   // VAT table
   var table = report.addTable("vatTable");
   var col1 = table.addColumn("colTable1");
   col1.setStyleAttributes("width:5%");
   var col2 = table.addColumn("colTable2");
   col2.setStyleAttributes("width:5%");
   var col3 = table.addColumn("colTable3");
   col3.setStyleAttributes("width:5%");
   var col4 = table.addColumn("colTable4");
   col4.setStyleAttributes("width:5%");
   var col5 = table.addColumn("colTable5");
   col5.setStyleAttributes("width:5%");
   var col6 = table.addColumn("colTable6");
   col6.setStyleAttributes("width:5%");
   var col7 = table.addColumn("colTable7");
   col7.setStyleAttributes("width:5%");
   var col8 = table.addColumn("colTable8");
   col8.setStyleAttributes("width:5%");
   var col9 = table.addColumn("colTable9");
   col9.setStyleAttributes("width:5%");
   var col10 = table.addColumn("colTable10");
   col10.setStyleAttributes("width:5%");
   var col11 = table.addColumn("colTable11");
   col11.setStyleAttributes("width:5%");
   var col12 = table.addColumn("colTable12");
   col12.setStyleAttributes("width:5%");
   var col13 = table.addColumn("colTable13");
   col13.setStyleAttributes("width:5%");
   var col14 = table.addColumn("colTable14");
   col14.setStyleAttributes("width:5%");
   var col15 = table.addColumn("colTable15");
   col15.setStyleAttributes("width:5%");
   var col16 = table.addColumn("colTable16");
   col16.setStyleAttributes("width:5%");
   var col17 = table.addColumn("colTable17");
   col17.setStyleAttributes("width:5%");
   var col18 = table.addColumn("colTable18");
   col18.setStyleAttributes("width:5%");
   var col19 = table.addColumn("colTable19");
   col19.setStyleAttributes("width:5%");
   var col20 = table.addColumn("colTable20");
   col20.setStyleAttributes("width:5%");
   
   var tableRow = table.addRow();
   tableRow.addCell("I. IDENTIFICATION DU REDEVABLE (3)", "bold", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 9);

   tableRow = table.addRow();
   tableRow.addCell("Nom ou Raison sociale: " + company, "",8).setStyleAttributes("border:thin black solid");
   tableRow.addCell("NUMÉRO IMPÔT", "", 3).setStyleAttributes("border:thin black solid");
   tableRow.addCell(fiscalNumber, "", 9).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell("Sigle:", "", 8).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Adresse Postale:", "", 3).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 9).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell("Adresse Physique:", "", 8).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Nº téléphone:", "", 3).setStyleAttributes("border:thin black solid");
   tableRow.addCell(phoneNumber, "", 9).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell(address, "", 8).setStyleAttributes("border-top:thin black solid;border-bottom:0px black solid");
   tableRow.addCell("Fax:", "", 3).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 9).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell("", "", 8).setStyleAttributes("border:thin black solid");
   tableRow.addCell("E-mail:", "", 3).setStyleAttributes("border:thin black solid");
   tableRow.addCell(email, "", 9).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 20);

   tableRow = table.addRow();
   tableRow.addCell("II. OPÉRATIONS RÉALISÉES (4)", "bold", 12).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Chiffre d'affaires (a)", "bold center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("TVA Collectée(b)=a * 16%", "bold center", 4).setStyleAttributes("border:thin black solid");

   /* Row 1: Livraisons de biens */
   tableRow = table.addRow();
   tableRow.addCell("1","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Livraisons de biens", "", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 2: */
   tableRow = table.addRow();
   tableRow.addCell("2","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Prestations de services", "", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");

   /* Row 3: */
   tableRow = table.addRow();
   tableRow.addCell("3","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Livraisons de biens à soi-même", "", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");

   /* Row 4: */
   tableRow = table.addRow();
   tableRow.addCell("4","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Prestations de services à soi-même", "", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");

   /* Row 5: */
   tableRow = table.addRow();
   tableRow.addCell("5","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Opérations afférentes aux marchés publics à financement extérieur", "", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");

   /* Row 6: */
   tableRow = table.addRow();
   tableRow.addCell("6","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Exportations et opérations assimilées", "", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");

   /* Row 7: */
   tableRow = table.addRow();
   tableRow.addCell("7","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Opérations exonérées", "", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");

   /* Row 8: */
   tableRow = table.addRow();
   tableRow.addCell("8","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Opérations non imposables", "", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");

   /* Row 9: */
   tableRow = table.addRow();
   tableRow.addCell("9","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Total", "", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 20);

   tableRow = table.addRow();
   tableRow.addCell("III. PRESTATIONS REÇUES DES PRESTATAIRES NON ÉTABLIS EN RDC (5)", "bold", 12).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Montant des factures (c)", "bold center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("TVA Collectée(d)=c * 16%", "bold center", 4).setStyleAttributes("border:thin black solid");

   /* Row 10: */
   tableRow = table.addRow();
   tableRow.addCell("10","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Prestations reçues des prestataires non établis en RDC", "", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 20);

   tableRow = table.addRow();
   tableRow.addCell("Prorata(6)      :    %", "bold", 8);
   tableRow.addCell(" ", "", 12);

   tableRow = table.addRow();
   tableRow.addCell("IV. DÉDUCTIONS/Taxe déductible sur:(7)", "bold", 8).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Importations (e)", "bold center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Local (f)", "bold center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Total(g)=e + f", "bold center", 4).setStyleAttributes("border:thin black solid");

   /* Row 11: */
   tableRow = table.addRow();
   tableRow.addCell("11", "center", 1);
   tableRow.addCell("Immobilisations", "", 7).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 12: */
   tableRow = table.addRow();
   tableRow.addCell("12", "center", 1);
   tableRow.addCell("Marchandises", "", 7).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 13: */
   tableRow = table.addRow();
   tableRow.addCell("13", "center", 1);
   tableRow.addCell("Matières premières", "", 7).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 14: */
   tableRow = table.addRow();
   tableRow.addCell("14", "center", 1);
   tableRow.addCell("Autres biens et services", "", 7).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 15: */
   tableRow = table.addRow();
   tableRow.addCell("15", "center", 1);
   tableRow.addCell("Total TVA déductible (g11+g12+g13+g14)", "", 7).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 16: */
   var gr4449 = getAmount(current,'Gr=4449','opening',startDate,endDate);
   tableRow = table.addRow();
   tableRow.addCell("16", "center", 1);
   tableRow.addCell("Report de crédit du mois précédent (déclaration précédente, ligne 24)", "", 7).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "lightGreyCell", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "lightGreyCell", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 17: */
   tableRow = table.addRow();
   tableRow.addCell("17", "center", 1);
   tableRow.addCell("Montant de la TVA déductible (g15+g16)", "", 7).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "lightGreyCell", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "lightGreyCell", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "center", 4).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell("V. RÉGULARISATIONS (8)", "bold", 8);
   tableRow.addCell("h", "center", 8);

   /* Row 18: */
   tableRow = table.addRow();
   tableRow.addCell("18", "center", 1);
   tableRow.addCell("Reversement de TVA", "", 7);
   tableRow.addCell("", "center", 4);
   tableRow.addCell("", "darkGreyCell", 4);

   /* Row 19: */
   tableRow = table.addRow();
   tableRow.addCell("19", "center", 1);
   tableRow.addCell("Complément de déduction", "", 7);
   tableRow.addCell("", "darkGreyCell", 4);
   tableRow.addCell("", "center", 4);

   /* Row 20: */
   tableRow = table.addRow();
   tableRow.addCell("20", "center", 1);
   tableRow.addCell("Récupération de la TVA déductible sur marchés publics à financement extérieur", "", 7);
   tableRow.addCell("", "center", 4);
   tableRow.addCell("", "darkGreyCell", 4);

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 20);

   tableRow = table.addRow();
   tableRow.addCell("VI. CALCUL DE L'IMPÔT (9)", "bold", 8);
   tableRow.addCell("i", "center", 8);

   tableRow = table.addRow();
   tableRow.addCell("21", "center", 1);
   tableRow.addCell("TVA nette à verser (b9+d10+h18+h20-g17-h19-b5)", "", 7);
   tableRow.addCell("", "center", 4);
   tableRow.addCell("", "darkGreyCell", 4);

   tableRow = table.addRow();
   tableRow.addCell("22", "center", 1);
   tableRow.addCell("Crédit de TVA (g17+h19+b5-b9-d10-h18-h20)", "", 7);
   tableRow.addCell("", "darkGreyCell", 4);
   tableRow.addCell("", "center", 4);

   tableRow = table.addRow();
   tableRow.addCell("23", "center", 1);
   tableRow.addCell("Remboursement de crédit de TVA demandé (montant figurant sur la demande de remboursement)", "", 7);
   tableRow.addCell("", "center", 4);
   tableRow.addCell("", "darkGreyCell", 4);

   tableRow = table.addRow();
   tableRow.addCell("24", "center", 1);
   tableRow.addCell("Crédit de TVA reportable (i22-i23)", "", 7);
   tableRow.addCell("", "darkGreyCell", 4);
   tableRow.addCell("", "center", 4);

   tableRow = table.addRow();
   tableRow.addCell("25", "center", 1);
   tableRow.addCell("TVA sur marchés publics à financement extérieur (case b5)", "", 7);
   tableRow.addCell("", "center", 4);
   tableRow.addCell("", "greyCell", 4);

   tableRow = table.addRow();
   tableRow.addCell("26", "center", 1);
   tableRow.addCell("TVA POUR COMPTE DES TIERS", "bold", 7);
   tableRow.addCell("", "center", 4);
   tableRow.addCell("", "greyCell", 4);

   tableRow = table.addRow();
   tableRow.addCell("27", "center", 1);
   tableRow.addCell("MONTANT À PAYER (i21+i25+i26)", "bold", 7);
   tableRow.addCell("", "center", 4);
   tableRow.addCell("", "greyCell", 4);

   tableRow = table.addRow();
   tableRow.addCell("MODE DE PAIEMENT (10)", "bold", 8);
   tableRow.addCell(" ", "", 12);

   tableRow = table.addRow();
   tableRow.addCell("AVIS DE CERTIFICATION", "", 8);
   tableRow.addCell("", "", 2);
   tableRow.addCell("CHÈQUE CERTIFIÉ", "", 3).setStyleAttributes("padding-left:10px");
   tableRow.addCell("", "", 2);
   tableRow.addCell("VIREMENT", "center", 3);
   tableRow.addCell("", "", 2);

   // Signature and others

   var table = report.addTable("table");

   var col1 = table.addColumn("c1");
   col1.setStyleAttributes("width:25%");
   var col2 = table.addColumn("c2");
   col2.setStyleAttributes("width:25%");
   var col3 = table.addColumn("c3");
   col3.setStyleAttributes("width:25%");
   var col4 = table.addColumn("c4");
   col4.setStyleAttributes("width:25%");

   var tableRow = table.addRow();
   tableRow.addCell("", "", 4);

   tableRow = table.addRow();
   tableRow.addCell("", "", 2);
   tableRow.addCell("Fait à          " + city, "", 1).setStyleAttributes("font-size:6.5px;font-weight:bold");  
   tableRow.addCell(",le ", "", 1).setStyleAttributes("font-size:6.5px;font-weight:bold"); 

   tableRow = table.addRow();
   tableRow.addCell("Déclaré conforme à nos écritures,", "", 4).setStyleAttributes("padding-left:40px;font-size:6.5px;font-weight:bold");

   tableRow = table.addRow();
   tableRow.addCell("Sceau de l'entreprise", "", 1).setStyleAttributes("font-size:6.5px;font-weight:bold");
   tableRow.addCell("Nom et qualité du signataire (11)", "", 2).setStyleAttributes("font-size:6.5px;font-weight:bold");  
   tableRow.addCell("Signature", "", 1).setStyleAttributes("font-size:6.5px;font-weight:bold"); 

   tableRow = table.addRow();
   tableRow.addCell("", "", 4);

   var table = report.addTable("vatTable");
   var col1 = table.addColumn("colTable1");
   col1.setStyleAttributes("width:5%");
   var col2 = table.addColumn("colTable2");
   col2.setStyleAttributes("width:5%");
   var col3 = table.addColumn("colTable3");
   col3.setStyleAttributes("width:5%");
   var col4 = table.addColumn("colTable4");
   col4.setStyleAttributes("width:5%");
   var col5 = table.addColumn("colTable5");
   col5.setStyleAttributes("width:5%");
   var col6 = table.addColumn("colTable6");
   col6.setStyleAttributes("width:5%");
   var col7 = table.addColumn("colTable7");
   col7.setStyleAttributes("width:5%");
   var col8 = table.addColumn("colTable8");
   col8.setStyleAttributes("width:5%");
   var col9 = table.addColumn("colTable9");
   col9.setStyleAttributes("width:5%");
   var col10 = table.addColumn("colTable10");
   col10.setStyleAttributes("width:5%");
   var col11 = table.addColumn("colTable11");
   col11.setStyleAttributes("width:5%");
   var col12 = table.addColumn("colTable12");
   col12.setStyleAttributes("width:5%");
   var col13 = table.addColumn("colTable13");
   col13.setStyleAttributes("width:5%");
   var col14 = table.addColumn("colTable14");
   col14.setStyleAttributes("width:5%");
   var col15 = table.addColumn("colTable15");
   col15.setStyleAttributes("width:5%");
   var col16 = table.addColumn("colTable16");
   col16.setStyleAttributes("width:5%");
   var col17 = table.addColumn("colTable17");
   col17.setStyleAttributes("width:5%");
   var col18 = table.addColumn("colTable18");
   col18.setStyleAttributes("width:5%");
   var col19 = table.addColumn("colTable19");
   col19.setStyleAttributes("width:5%");
   var col20 = table.addColumn("colTable20");
   col20.setStyleAttributes("width:5%");

   var tableRow = table.addRow();
   tableRow.addCell("VIII. RÉSERVÉ À L'ADMINISTRATION (12)", "bold", 20);

   tableRow = table.addRow();
   tableRow.addCell("Nº de la Quittance", "", 7);
   tableRow.addCell("Date de la Quittance", "", 6);
   tableRow.addCell("Cachet de l'Administration", "", 7);

   tableRow = table.addRow();
   tableRow.addCell("", "", 7);
   tableRow.addCell("", "", 6);
   tableRow.addCell("", "", 7);

   var table = report.addTable("table");

   var col1 = table.addColumn("c1");
   col1.setStyleAttributes("width:25%");
   var col2 = table.addColumn("c2");
   col2.setStyleAttributes("width:25%");
   var col3 = table.addColumn("c3");
   col3.setStyleAttributes("width:25%");
   var col4 = table.addColumn("c4");
   col4.setStyleAttributes("width:25%");

   var tableRow = table.addRow();
   tableRow.addCell("IMPORTANT", "bold italic", 20).setStyleAttributes("font-size:7px;padding-left:15px");

   tableRow = table.addRow();
   tableRow.addCell("* Lire attentivement la notice au verso avant de remplir la déclaration. " + 
               "En cas d'hésitation, se référer au service de la DGI du lieu de souscription.", "", 20).setStyleAttributes("font-size:7px;padding-left:15px");

   tableRow = table.addRow();
   tableRow.addCell("* Le montant de la TVA payé par l'assujetti bénéficiaire de marché public " +
               "à financement extérieur ne comprend pas la TVA prise en charge par l'État.", "", 20).setStyleAttributes("font-size:7px;padding-left:15px");

   tableRow = table.addRow();
   tableRow.addCell("* Remplir correctement en majuscule toutes les cases.", "", 20).setStyleAttributes("font-size:7px;padding-left:15px");

   tableRow = table.addRow();
   tableRow.addCell("* En cas de rature ou de surcharge, la déclaration ne sera pas acceptée.", "", 20).setStyleAttributes("font-size:7px;padding-left:15px");


   return report;
}

/**************************************************************************************
*
* Functions that retrieve and format values from Banana
*
**************************************************************************************/

function getAmount(banDoc,account,property,startDate,endDate) {
   var currentBal = banDoc.currentBalance(account,startDate,endDate)
   var value = currentBal[property];
   return value;
}

function formatValues(value) {
   if (!value || value === "0" || value == null) {
      value = "0";
   }
   return Banana.Converter.toLocaleNumberFormat(value);
}

function formatNumber(amount, convZero) {

	return Banana.Converter.toLocaleNumberFormat(amount, 2, convZero);
}

/* Function that retrieves the total vat from Banana */
function getTotalFromBanana(banDoc, checkValues, startDate, endDate) {
   
}

function getPeriodSettings(name) {

   // The parameters of the period 
   var scriptForm = {
      "selectionStartDate": "",
      "selectionEndDate": "",
      "selectionChecked": "false"
   }

   // Read script settings
   var data = Banana.document.getScriptSettings();

   // Check if there are previously saved settings and read them
   if (data.length > 0) {
      try {
         var readSettings = JSON.parse(data);

         // Check if readSettings is not null, then fill the form parameters with the acquired values
         if (readSettings) {
            scriptForm = readSettings;
         }
      } catch (e) {}
   }

   // Take the accounting start date and end date from the document. These will be used as default dates
   var docStartDate = Banana.document.startPeriod();
   var docEndDate = Banana.document.endPeriod();

   // A dialog window is opened asking the user to insert the desired period. By defaults, its the accounting period
   var selectedDates = Banana.Ui.getPeriod(name, docStartDate, docEndDate,
               scriptForm.selectionStartDate, scriptForm.selectionEndDate, scriptForm.selectionChecked);

   // Take the values entered by the user and save them as new default values
   // Next time the script will be executed, the dialog window will contain the new values.
   if (selectedDates) {
      scriptForm["selectionStartDate"] = selectedDates.startDate;
      scriptForm["selectionEndDate"] = selectedDates.endDate;
      scriptForm["selectionChecked"] = selectedDates.hasSelection;

      // Save script settings
      var formToString = JSON.stringify(scriptForm);
      var value = Banana.document.setScriptSettings(formToString);
   } else {
      // User clicked cancel
      return;
   }
   return scriptForm;
}

/* Function returning lines from the journal */
function getJournal(banDoc, startDate, endDate) {
   var journal = banDoc.journal(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL);
   var length = journal.rowCount;
   var transactions = []; // Array that will contain all the lines of the transactions

   for (var i=0; i < length; i++) {
      var line = {};
      var tableRow = journal.row(i);

      if (tableRow.value("JDate") >= startDate && tableRow.value("JDate") <= endDate) {
         line.date = tableRow.value("JDate");
         line.account = tableRow.value("JAccount");
         line.vatcode = tableRow.value("JVatCodeWithoutSign");
         line.doc = tableRow.value("Doc");
         line.description = tableRow.value("Description");
         line.isvatoperation = tableRow.value("JVatIsVatOperation");

         // We only take the rows with a VAT code
         if (line.isvatoperation) {
            line.vattaxable = tableRow.value("JVatTaxable");   
            line.vatamount = tableRow.value("VatAmount");
            line.vatposted = tableRow.value("VatPoste");
            line.amount = tableRow.value("JAmount");

            transactions.push(line);
         }
      }
   }
   return transactions;
}

/* This function sums the vat amounts for the specified vat code and period retrieved from transactions (converted journal's lines)
   Returns an object containing {vatTaxable, vatPosted} */
function getVatCodesBalance(transactions, vatCodes, startDate, endDate) {
   
}

/* The purpose of this function is to calculate all the VAT balances of the accounts belonging to the same group (grText) */
function getGr1VatBalance(banDoc, transactions, grCodes, vatClass, startDate, endDate) {
   
}

/* The main purpose of this function is to create an array with all the values 
   of a given column of the table (codeColumn) belonging to the same group (grText) */
function getVatCodeForGr(banDoc, grText, grColumn) {
   var codes = [];

   if (!banDoc || !banDoc.table("VatCodes")) {
      return codes;
   }

   var table = banDoc.table("VatCodes");

   if (!grColumn) {
      grColumn = "Gr1";
   }

   /* Can have multiple values */
   var arrayGrText = grText.split(';');

   // Loop to take the values of each rows of the table
   for (var i = 0; i < table.rowCount; i++) {
      var tRow = table.row(i);

      // If Gr1 column contains other characters (in this case ";") we know there are more values
		// We have to split them and take all values separately
      // If there are only alphanumeric characters in Gr1 column we know there is only one value
      var arrCodeString = tRow.value(grColumn).split(";");
      for (var j = 0; j < arrayGrText.length; j++) {
			if (arrayContains(arrCodeString, arrayGrText[j])) {
				var vatCode = tRow.value('VatCode');
				if (!arrayContains(codes, vatCode)) {
					codes.push(vatCode);
				}
			}
		}
   }
   // Return the array  
   return codes;
}

function arrayContains(array, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === value) {
			return true;
		}
	}
	return false;
}

/* Function that checks for all the used vat codes without Gr1 and prints a warning message */
function checkUsedVatCodesHaveGr1(banDoc, report) {
   // Get all the vat codes used on the Transactions table
   var usedVatCodes = getVatCodesUsed(banDoc);

   // For each code check if on the VatCode table there is a Gr1
   // Shows a warning message in red for all the vat codes without the Gr1
   var codesWithoutGr1 = [];

   // Save all the vat codes without Gr1 into an array
   for (var i = 0; i < usedVatCodes.length; i++) {
      var gr1 = getVatCodeGr1(banDoc, usedVatCodes[i]);
      if (!gr1) {
         codesWithoutGr1.push(usedVatCodes[i]);
      }
   }

   // Print the warning messages
   for (var i = 0; i < codesWithoutGr1.length; i++) {
      report.addParagraph("Warning: " + codesWithoutGr1[i] + " does not exist in Gr1", "red");
   }
}

/* Function that checks all the vat/gr1 codes used in the transactions.
   It returns a warning message (red) if wrong codes are used. */
function checkUsedVatCodes(banDoc, report) {
   var usedGr1Codes = [];
   var vatCodes = getVatCodesUsed(banDoc);
   for (i = 0; i < vatCodes.length; i++) {
      var gr1Codes = getVatCodeGr1(banDoc, vatCodes[i]);
      for (var j = 0; j < gr1Codes.length; j++) {
         usedGr1Codes.push(gr1Codes[j]);
      }
   }

   // Removing duplicates
   for (var i = 0; i < usedGr1Codes.length; i++) {
      for (var x = i + 1; x < usedGr1Codes.length; x++) {
         if (usedGr1Codes[x] === usedGr1Codes[i]) {
            usedGr1Codes.splice(x, 1);
            --x;
         }
      }
   }

   for (var j = 0; j < usedGr1Codes.length; j++) {
      if (usedGr1Codes[j] !== "II-1" && usedGr1Codes[j] !== "II-2" &&
          usedGr1Codes[j] !== "II-3" && usedGr1Codes[j] !== "II-4" &&
          usedGr1Codes[j] !== "II-5" && usedGr1Codes[j] !== "II-6" && 
          usedGr1Codes[j] !== "II-7" && usedGr1Codes[j] !== "II-8" && 
          usedGr1Codes[j] !== "III-10" && 
          usedGr1Codes[j] !== "IV-11-e" && usedGr1Codes[j] !== "IV-12-e" &&
          usedGr1Codes[j] !== "IV-13-e" && usedGr1Codes[j] !== "IV-14-e" &&
          usedGr1Codes[j] !== "IV-11-f" && usedGr1Codes[j] !== "IV-12-f" &&
          usedGr1Codes[j] !== "IV-13-f" && usedGr1Codes[j] !== "IV-14-f" && 
          usedGr1Codes[j] !== "V-18" && usedGr1Codes[j] !== "V-19" &&
          usedGr1Codes[j] != "V-20") {
             report.addParagraph("Warning: " + usedGr1Codes[j], "red");
          }
   }
}

/* Function that returns an array with all the gr1 codes for the given vat code */
function getVatCodeGr1(banDoc, vatCode) {
   var codes = [];
   var table = banDoc.table("VatCodes");
   if (table === undefined || !table) {
      return codes;
   }

   // Loop to take the values of each row in the table
   for (var i = 0; i < table.rowCount; i++) {
      var tableRow = table.row(i);
      var gr1 = tableRow.value("Gr1");
      var vatcode = tableRow.value("VatCode");

      if (gr1 && vatcode === vatCode) {
         var code = gr1.split(";");
         for (var j = 0; j < code.length; j++) {
            if (code[j]) {
               codes.push(code[j]);
            }
         }
      }
   }

   return codes;
}

/* Function that returns all the vat codes used in the transaction table */
function getVatCodesUsed(banDoc) {
   var codes = [];
   var table = banDoc.table("Transactions");
   if (table === undefined || !table) {
      return codes;
   }

   // Loop to take the values of each row in the table
   for (var i = 0; i < table.rowCount; i++) {
      var tableRow = table.row(i);
      var vatRow = tableRow.value("VatCode");

      if (vatRow) {
         var code = vatRow.split(";");
         for (var j = 0; j < code.length; j++) {
            if (code[j]) {
               codes.push(code[j]);
            }
         }
      }
   }

   // Remove duplicates
   for (var i = 0; i < codes.length; i++) {
      for (var x = i + 1; x < codes.length; x++) {
         if (codes[x] === codes[i]) {
            codes.splice(x, 1);
            --x;
         }
      }
   }

   // Return the array of vat codes
   return codes;
}

/**************************************************************************************
*
* Styles
*
**************************************************************************************/

function createStyleSheet() {
   var stylesheet = Banana.Report.newStyleSheet();

   stylesheet.addStyle("@page", "margin:1mm 5mm 1mm 5mm;border:2px black solid");
   stylesheet.addStyle("body", "font-family:Helvetica; font-size:8pt");
   stylesheet.addStyle(".bold", "font-weight:bold;");
   stylesheet.addStyle(".right", "text-align:right;");
   stylesheet.addStyle(".center", "text-align:center");
   stylesheet.addStyle(".italic", "font-style:italic");

   style = stylesheet.addStyle(".blackCell");
   style.setAttribute("background-color", "black");
   style.setAttribute("color","white");

   style = stylesheet.addStyle(".greyCell");
   style.setAttribute("background-color", "#A0A0A0");

   style = stylesheet.addStyle(".darkGreyCell");
   style.setAttribute("background-color", "#505050");

   style = stylesheet.addStyle(".lightGreyCell");
   style.setAttribute("background-color", "#DFDFDF");

   style = stylesheet.addStyle(".logostyle");
   style.setAttribute("padding-top", "0em");
   style.setAttribute("padding-left", "3em");

   /* table */
   var tableStyle = stylesheet.addStyle(".table");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle(".c1", "");
   stylesheet.addStyle(".c2", "");
   stylesheet.addStyle(".c3", "");
   stylesheet.addStyle(".c4", "");  
   stylesheet.addStyle("table.table td", "");

   // Inside header table
   var tableStyle = stylesheet.addStyle(".inTable");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle("table.table.inTable td", "border:2px solid black");
   tableStyle.setAttribute("background-color", "#EFEFEF");

   // VAT declaration table
   var tableStyle = stylesheet.addStyle(".vatTable");
   tableStyle.setAttribute("width", "100%");
   tableStyle.setAttribute("font-size", "6.5");
   stylesheet.addStyle(".colTable1", "");
   stylesheet.addStyle(".colTable2", "");
   stylesheet.addStyle(".colTable3", "");
   stylesheet.addStyle(".colTable4", "");
   stylesheet.addStyle(".colTable5", "");
   stylesheet.addStyle(".colTable6", "");
   stylesheet.addStyle(".colTable7", "");
   stylesheet.addStyle(".colTable8", "");
   stylesheet.addStyle(".colTable9", "");
   stylesheet.addStyle(".colTable10", "");
   stylesheet.addStyle(".colTable11", "");
   stylesheet.addStyle(".colTable12", "");
   stylesheet.addStyle(".colTable13", "");
   stylesheet.addStyle(".colTable14", "");
   stylesheet.addStyle(".colTable15", "");
   stylesheet.addStyle(".colTable16", "");
   stylesheet.addStyle(".colTable17", "");
   stylesheet.addStyle(".colTable18", "");
   stylesheet.addStyle(".colTable19", "");
   stylesheet.addStyle(".colTable20", "");
   stylesheet.addStyle("table.vatTable td", "border:thin solid black;padding-top:2px;padding-bottom:2px");

   var tableStyle = stylesheet.addStyle(".tableCashFlow");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle(".col1", "width:5%");
   stylesheet.addStyle(".col2", "width:60%");
   stylesheet.addStyle(".col3", "width:5%");
   stylesheet.addStyle(".col4", "width:15%");
   stylesheet.addStyle(".col5", "width:15%");
   stylesheet.addStyle("table.tableCashFlow td", "border:thin solid black;padding-bottom:2px;padding-top:5px");

   return stylesheet;
}
