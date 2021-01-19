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


/* Update: 2020-01-14 */


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
    reportStructure.push({"id":"1", "type":"group", "note":"1", "bclass":"1", "description":"Immobilisations"});
    reportStructure.push({"id":"2", "type":"group", "note":"2", "bclass":"1", "description":"Stocks"});
    reportStructure.push({"id":"3", "type":"group", "note":"3", "bclass":"1", "description":"Clients et débiteurs divers"});
    reportStructure.push({"id":"4", "type":"group", "note":"", "bclass":"1", "description":"Caisse"});
    reportStructure.push({"id":"5", "type":"group", "note":"", "bclass":"1", "description":"Banque (en + ou en -)"});
    reportStructure.push({"id":"A", "type":"total", "note":"", "bclass":"1", "description":"Total actif", "sum":"1;2;3;4;5"});

    /* PASSIVE */
    reportStructure.push({"id":"6", "type":"group", "note":"", "bclass":"2", "description":"Compte exploitant"});
    reportStructure.push({"id":"7", "type":"group", "note":"", "bclass":"2", "description":"Résultat exercice"});
    reportStructure.push({"id":"8", "type":"group", "note":"", "bclass":"2", "description":"Emprunt"});
    reportStructure.push({"id":"9", "type":"group", "note":"3", "bclass":"2", "description":"Fournisseurs et créditeurs divers"});
    reportStructure.push({"id":"P", "type":"total", "note":"", "bclass":"2", "description":"Total passif", "sum":"6;7;8;9"});
    
    return reportStructure;
}