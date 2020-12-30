// Copyright [2020] [Banana.ch SA - Lugano Switzerland]
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


/* Update: 2020-11-11 */


/**
 * Creates the report structure for each report type.
 * - "id" used as GR/GR1 and to identify the object
 * - "type" used to define the type of data (group, title or total)
 * - "indent" used to define the indent level for the print
 * - "bclass" used to define the bclass of the group
 * - "description" used to define the description text used for the print
 * - "sum" used to define how to calculate the total
 */


// Balance sheet
function createReportStructureBalanceSheet() {
    var reportStructure = [];

    /* ACTIVE */
    reportStructure.push({"id":"AD", "type":"total", "note":"3", "bclass":"1", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AE;AF;AG;AH"});
    reportStructure.push({"id":"AE", "type":"group", "note":"", "bclass":"1", "description":"Frais de développement et de prospection"});
    reportStructure.push({"id":"AF", "type":"group", "note":"", "bclass":"1", "description":"Brevets, licences, logiciels, et  droits similaires"});
    reportStructure.push({"id":"AG", "type":"group", "note":"", "bclass":"1", "description":"Fonds commercial et droit au bail"});
    reportStructure.push({"id":"AH", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisation incorporelles"});
    reportStructure.push({"id":"AI", "type":"total", "note":"3", "bclass":"1", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AJ;AK;AL;AM;AN;AP"}); 
    reportStructure.push({"id":"AJ", "type":"group", "note":"", "bclass":"1", "description":"Terrains (1) dont Placement en  Net......./......."});    
    reportStructure.push({"id":"AK", "type":"group", "note":"", "bclass":"1", "description":"Bâtiments (1) dont Placement en  Net......./......."});
    reportStructure.push({"id":"AL", "type":"group", "note":"", "bclass":"1", "description":"Aménagements, agencements et installations"});
    reportStructure.push({"id":"AM", "type":"group", "note":"", "bclass":"1", "description":"Matériel, mobilier et actifs biologiques"});
    reportStructure.push({"id":"AN", "type":"group", "note":"", "bclass":"1", "description":"Matériel de transport"});
    reportStructure.push({"id":"AP", "type":"group", "note":"3", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations"});
    reportStructure.push({"id":"AQ", "type":"total", "note":"4", "bclass":"1", "description":"IMMOBILISATIONS FINANCIERES", "sum":"AR;AS"});
    reportStructure.push({"id":"AR", "type":"group", "note":"", "bclass":"1", "description":"Titres de participation"});
    reportStructure.push({"id":"AS", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisations financières"});
    reportStructure.push({"id":"AZ", "type":"total", "note":"", "bclass":"1", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AD;AI;AQ"});
    reportStructure.push({"id":"BA", "type":"group", "note":"5", "bclass":"1", "description":"ACTIF CIRCULANT HAO"});
    reportStructure.push({"id":"BB", "type":"group", "note":"6", "bclass":"1", "description":"STOCKS ET ENCOURS"});
    reportStructure.push({"id":"BG", "type":"group", "note":"", "bclass":"1", "description":"CREANCES ET EMPLOIS ASSIMILES"});
    reportStructure.push({"id":"BH", "type":"group", "note":"17", "bclass":"1", "description":"Fournisseurs avances versées"});
    reportStructure.push({"id":"BI", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BJ", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BK", "type":"total", "note":"", "bclass":"1", "description":"TOTAL ACTIF CIRCULANT", "sum":"BA;BB;BH;BI;BJ"});
    reportStructure.push({"id":"BQ", "type":"group", "note":"9", "bclass":"1", "description":"Titres de placement"});
    reportStructure.push({"id":"BR", "type":"group", "note":"10", "bclass":"1", "description":"Valeurs à encaisser"});
    reportStructure.push({"id":"BS", "type":"group", "note":"11", "bclass":"1", "description":"Banques, chèques postaux, caisse et assimilés"});
    reportStructure.push({"id":"BT", "type":"total", "note":"", "bclass":"1", "description":"TOTAL TRESORERIE-ACTIF", "sum":"BQ;BR;BS"});
    reportStructure.push({"id":"BU", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif"});
    reportStructure.push({"id":"BZ", "type":"total", "note":"", "bclass":"1", "description":"TOTAL GENERAL", "sum":"AZ;BK;BT;BU"});

    /* PASSIVE */
    reportStructure.push({"id":"CA", "type":"group", "note":"13", "bclass":"2", "description":"Capital"});
    reportStructure.push({"id":"CB", "type":"group", "note":"13", "bclass":"2", "description":"Apporteurs capital non appelé (-)"});
    reportStructure.push({"id":"CD", "type":"group", "note":"14", "bclass":"2", "description":"Primes liées au capital social"});
    reportStructure.push({"id":"CE", "type":"group", "note":"3e", "bclass":"2", "description":"Ecarts de réévaluation"});
    reportStructure.push({"id":"CF", "type":"group", "note":"14", "bclass":"2", "description":"Réserves indisponibles"});
    reportStructure.push({"id":"CG", "type":"group", "note":"14", "bclass":"2", "description":"Réserves libres"});
    reportStructure.push({"id":"CH", "type":"group", "note":"14", "bclass":"2", "description":"Report à nouveau (+ ou -)"});
    reportStructure.push({"id":"CJ", "type":"group", "note":"", "bclass":"2", "description":"Résultat net de l'exercice (bénéfice + ou perte -)"});
    reportStructure.push({"id":"CL", "type":"group", "note":"15", "bclass":"2", "description":"Subventions d'investissement"});
    reportStructure.push({"id":"CM", "type":"group", "note":"15", "bclass":"2", "description":"Provisions réglementées"});
    reportStructure.push({"id":"CP", "type":"total", "note":"", "bclass":"2", "description":"TOTAL CAPITAUX PROPRES ET RESSOURCES ASSIMILEES", "sum":"CA;CB;CD;CE;CF;CG;CH;CJ;CL;CM"});
    reportStructure.push({"id":"DA", "type":"group", "note":"16", "bclass":"2", "description":"Emprunts et dettes financières diverses"});
    reportStructure.push({"id":"DB", "type":"group", "note":"16", "bclass":"2", "description":"Dettes de location acquisition"});
    reportStructure.push({"id":"DC", "type":"group", "note":"16", "bclass":"2", "description":"Provisions pour risques et charges"});
    reportStructure.push({"id":"DD", "type":"total", "note":"", "bclass":"2", "description":"TOTAL DETTES FINANCIERES ET RESSOURCES ASSIMILEES", "sum":"DA;DB;DC"});
    reportStructure.push({"id":"DF", "type":"total", "note":"", "bclass":"2", "description":"TOTAL RESSOURCES STABLES", "sum":"CP;DD"});
    reportStructure.push({"id":"DH", "type":"group", "note":"5", "bclass":"2", "description":"Dettes circulantes HAO"});
    reportStructure.push({"id":"DI", "type":"group", "note":"7", "bclass":"2", "description":"Clients, avances reçues"});
    reportStructure.push({"id":"DJ", "type":"group", "note":"17", "bclass":"2", "description":"Fournisseurs d'exploitation"});
    reportStructure.push({"id":"DK", "type":"group", "note":"18", "bclass":"2", "description":"Dettes fiscales et sociales"});
    reportStructure.push({"id":"DM", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DN", "type":"group", "note":"19", "bclass":"2", "description":"Provisions pour risques à court terme"});
    reportStructure.push({"id":"DP", "type":"total", "note":"", "bclass":"2", "description":"TOTAL PASSIF CIRCULANT", "sum":"DH;DI;DJ;DK;DM;DN"});
    reportStructure.push({"id":"DQ", "type":"group", "note":"20", "bclass":"2", "description":"Banques, crédits d'escompte"});
    reportStructure.push({"id":"DR", "type":"group", "note":"20", "bclass":"2", "description":"Banques, établissements financiers et crédits de trésorerie"});
    reportStructure.push({"id":"DT", "type":"total", "note":"", "bclass":"2", "description":"TOTAL TRESORERIE-PASSIF", "sum":"DQ;DR"});
    reportStructure.push({"id":"DV", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DZ", "type":"total", "note":"", "bclass":"2", "description":"TOTAL GENERAL", "sum":"DF;DP;DT;DV"});

    return reportStructure;
}