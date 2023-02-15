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


/* Update: 2020-07-06 */


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
    reportStructure.push({"id":"AD", "type":"total", "note":"3", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AF"});
    reportStructure.push({"id":"AD-A", "type":"total", "note":"3", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AF-A"});
    reportStructure.push({"id":"AD-(AD-A)", "type":"total", "note":"3", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AD;AD-A"});

    reportStructure.push({"id":"AE", "type":"group", "note":"", "bclass":"1", "description":"Frais de développement et de prospection"});

    reportStructure.push({"id":"AF", "type":"group", "note":"3", "bclass":"1", "description":"Brevets, licences, logiciels, et  droits similaires"});
    reportStructure.push({"id":"AF-A", "type":"group", "note":"", "bclass":"1", "description":"Brevets, licences, logiciels, et  droits similaires"});
    reportStructure.push({"id":"AF-(AF-A)", "type":"total", "note":"", "description":"Brevets, licences, logiciels, et  droits similaires", "sum":"AF;AF-A"});

    reportStructure.push({"id":"AG", "type":"group", "note":"", "bclass":"1", "description":"Fonds commercial et droit au bail"});
    reportStructure.push({"id":"AH", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisation incorporelles"});

    reportStructure.push({"id":"AI", "type":"total", "note":"3", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AJ;AK;AM;AN;AP"}); 
    reportStructure.push({"id":"AI-A", "type":"total", "note":"3", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AK-A;AM-A;AN-A;AP-A"});
    reportStructure.push({"id":"AI-(AI-A)", "type":"total", "note":"3", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AI;AI-A"});

    reportStructure.push({"id":"AJ", "type":"group", "note":"", "bclass":"1", "description":"Terrains (1) dont Placement en  Net......./......."});    

    reportStructure.push({"id":"AK", "type":"group", "note":"", "bclass":"1", "description":"Bâtiments (1) dont Placement en  Net......./......."});
    reportStructure.push({"id":"AK-A", "type":"group", "note":"", "bclass":"1", "description":"Bâtiments (1) dont Placement en  Net......./......."});
    reportStructure.push({"id":"AK-(AK-A)", "type":"total", "note":"", "description":"Bâtiments (1) dont Placement en  Net......./.......", "sum":"AK;AK-A"});

    reportStructure.push({"id":"AL", "type":"group", "note":"", "bclass":"1", "description":"Aménagements, agencements et installations"});

    reportStructure.push({"id":"AM", "type":"group", "note":"", "bclass":"1", "description":"Matériel, mobilier et actifs biologiques"});
    reportStructure.push({"id":"AM-A", "type":"group", "note":"", "bclass":"1", "description":"Matériel, mobilier et actifs biologiques"});
    reportStructure.push({"id":"AM-(AM-A)", "type":"total", "note":"", "description":"Matériel, mobilier et actifs biologiques", "sum":"AM;AM-A"});

    reportStructure.push({"id":"AN", "type":"group", "note":"", "bclass":"1", "description":"Matériel de transport"});
    reportStructure.push({"id":"AN-A", "type":"group", "note":"", "bclass":"1", "description":"Matériel de transport"});
    reportStructure.push({"id":"AN-(AN-A)", "type":"total", "note":"", "description":"Matériel de transport", "sum":"AN;AN-A"});

    reportStructure.push({"id":"AP", "type":"group", "note":"3", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations"});
    reportStructure.push({"id":"AP-A", "type":"group", "note":"3", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations"});
    reportStructure.push({"id":"AP-(AP-A)", "type":"total", "note":"3", "description":"Avances et acomptes versés sur immobilisations", "sum":"AP;AP-A"});

    reportStructure.push({"id":"AQ", "type":"total", "note":"4", "description":"IMMOBILISATIONS FINANCIERES", "sum":"AR;AS"});
    reportStructure.push({"id":"AQ-A", "type":"total", "note":"4", "description":"IMMOBILISATIONS FINANCIERES", "sum":""});
    reportStructure.push({"id":"AQ-(AQ-A)", "type":"total", "note":"4", "description":"IMMOBILISATIONS FINANCIERES", "sum":"AQ"});

    reportStructure.push({"id":"AR", "type":"group", "note":"", "bclass":"1", "description":"Titres de participation"});
    reportStructure.push({"id":"AS", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisations financières"});

    reportStructure.push({"id":"AZ", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AD;AI;AQ"});
    reportStructure.push({"id":"AZ-A", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AD-A;AI-A"});
    reportStructure.push({"id":"AZ-(AZ-A)", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AZ;AZ-A"});

    reportStructure.push({"id":"BA", "type":"group", "note":"5", "bclass":"1", "description":"ACTIF CIRCULANT HAO"});

    reportStructure.push({"id":"BB", "type":"group", "note":"6", "bclass":"1", "description":"STOCKS ET ENCOURS"});
    reportStructure.push({"id":"BB-A", "type":"group", "note":"6", "bclass":"1", "description":"STOCKS ET ENCOURS"});
    reportStructure.push({"id":"BB-(BB-A)", "type":"total", "note":"6", "description":"STOCKS ET ENCOURS", "sum":"BB;BB-A"});

    reportStructure.push({"id":"BG", "type":"total", "note":"", "description":"CREANCES ET EMPLOIS ASSIMILES", "sum":"BH;BI;BJ"});
    reportStructure.push({"id":"BG-A", "type":"total", "note":"", "description":"CREANCES ET EMPLOIS ASSIMILES", "sum":"BH-A;BI-A;BJ-A"});
    reportStructure.push({"id":"BG-(BG-A)", "type":"total", "note":"", "description":"CREANCES ET EMPLOIS ASSIMILES", "sum":"BG;BG-A"});

    reportStructure.push({"id":"BH", "type":"group", "note":"17", "bclass":"1", "description":"Fournisseurs avances versées"});
    reportStructure.push({"id":"BH-A", "type":"group", "note":"17", "bclass":"1", "description":"Fournisseurs avances versées"});
    reportStructure.push({"id":"BH-(BH-A)", "type":"total", "note":"17", "description":"Fournisseurs avances versées", "sum":"BH;BH-A"});

    reportStructure.push({"id":"BI", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BI-A", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BI-(BI-A)", "type":"total", "note":"7", "description":"Clients", "sum":"BI;BI-A"});

    reportStructure.push({"id":"BJ", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ-A", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ-(BJ-A)", "type":"total", "note":"8", "description":"Autres créances", "sum":"BJ;BJ-A"});

    reportStructure.push({"id":"BK", "type":"total", "note":"", "description":"TOTAL ACTIF CIRCULANT", "sum":"BA;BB;BG"});
    reportStructure.push({"id":"BK-A", "type":"total", "note":"", "description":"TOTAL ACTIF CIRCULANT", "sum":"BB-A;BG-A"});
    reportStructure.push({"id":"BK-(BK-A)", "type":"total", "note":"", "description":"TOTAL ACTIF CIRCULANT", "sum":"BK;BG-A"});

    reportStructure.push({"id":"BQ", "type":"group", "note":"9", "bclass":"1", "description":"Titres de placement"});
    reportStructure.push({"id":"BR", "type":"group", "note":"10", "bclass":"1", "description":"Valeurs à encaisser"});

    reportStructure.push({"id":"BS", "type":"group", "note":"11", "bclass":"1", "description":"Banques, chèques postaux, caisse et assimilés"});
    reportStructure.push({"id":"BS-A", "type":"group", "note":"11", "bclass":"1", "description":"Banques, chèques postaux, caisse et assimilés"});
    reportStructure.push({"id":"BS-(BS-A)", "type":"total", "note":"11", "description":"Banques, chèques postaux, caisse et assimilés", "sum":"BS;BS-A"});

    reportStructure.push({"id":"BT", "type":"total", "note":"", "description":"TOTAL TRESORERIE-ACTIF", "sum":"BR;BS"});
    reportStructure.push({"id":"BT-A", "type":"total", "note":"", "description":"TOTAL TRESORERIE-ACTIF", "sum":"BS-A"});
    reportStructure.push({"id":"BT-(BT-A)", "type":"total", "note":"", "description":"TOTAL TRESORERIE-ACTIF", "sum":"BT;BT-A"});

    reportStructure.push({"id":"BU", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif"});

    reportStructure.push({"id":"BZ", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"AZ;BK;BT;BU"});
    reportStructure.push({"id":"BZ-A", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"AZ-A;BK-A;BT-A"});
    reportStructure.push({"id":"BZ-(BZ-A)", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"BZ;BZ-A"});

    // To get CJ, we sum up products and subtract by charges
    reportStructure.push({"id":"TA", "type":"group", "note":"21", "bclass":"4", "description":"Ventes de marchandises"});
    reportStructure.push({"id":"TB", "type":"group", "note":"21", "bclass":"4", "description":"Ventes de produits fabriqués"});
    reportStructure.push({"id":"TC", "type":"group", "note":"21", "bclass":"4", "description":"Travaux, services vendus"});
    reportStructure.push({"id":"TD", "type":"group", "note":"21", "bclass":"4", "description":"Produits accessoires"});
    reportStructure.push({"id":"TE", "type":"group", "note":"6", "bclass":"4", "description":"Production stockée (ou déstockage)"});
    reportStructure.push({"id":"TF", "type":"group", "note":"21", "bclass":"4", "description":"Production immobilisée"});
    reportStructure.push({"id":"TG", "type":"group", "note":"21", "bclass":"4", "description":"Subventions d’exploitation"});
    reportStructure.push({"id":"TH", "type":"group", "note":"21", "bclass":"4", "description":"Autres produits"});
    reportStructure.push({"id":"TI", "type":"group", "note":"12", "bclass":"4", "description":"Transferts de charges d'exploitation"});
    reportStructure.push({"id":"TJ", "type":"group", "note":"28", "bclass":"4", "description":"Reprises d’amortissements, provisions et dépréciations"});
    reportStructure.push({"id":"TL", "type":"group", "note":"28", "bclass":"4", "description":"Reprises de provisions  et dépréciations financières"});
    reportStructure.push({"id":"TM", "type":"group", "note":"12", "bclass":"4", "description":"Transferts de charges financières"});
    reportStructure.push({"id":"TN", "type":"group", "note":"3D", "bclass":"4", "description":"Produits des cessions d'immobilisations"});
    reportStructure.push({"id":"TO", "type":"group", "note":"30", "bclass":"4", "description":"Autres Produits HAO"});
    reportStructure.push({"id":"RA", "type":"group", "note":"22", "bclass":"3", "description":"Achats de marchandises"});
    reportStructure.push({"id":"RB", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks de marchandises"});
    reportStructure.push({"id":"RC", "type":"group", "note":"22", "bclass":"3", "description":"Achats de matières premières et fournitures liées"});
    reportStructure.push({"id":"RD", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks de matières premières et fournitures liées"});
    reportStructure.push({"id":"RE", "type":"group", "note":"22", "bclass":"3", "description":"Autres achats"});
    reportStructure.push({"id":"RF", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks d’autres approvisionnements"});
    reportStructure.push({"id":"RG", "type":"group", "note":"23", "bclass":"3", "description":"Transports"});
    reportStructure.push({"id":"RH", "type":"group", "note":"24", "bclass":"3", "description":"Services extérieurs"});
    reportStructure.push({"id":"RI", "type":"group", "note":"25", "bclass":"3", "description":"Impôts et taxes"});
    reportStructure.push({"id":"RJ", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"RK", "type":"group", "note":"27", "bclass":"3", "description":"Charges de personnel"});
    reportStructure.push({"id":"RL", "type":"group", "note":"3C&28", "bclass":"3", "description":"Dotations aux amortissements, aux provisions et dépréciations"});
    reportStructure.push({"id":"RM", "type":"group", "note":"29", "bclass":"3", "description":"Frais financiers et charges assimilées"});
    reportStructure.push({"id":"RN", "type":"group", "note":"3C&28", "bclass":"3", "description":"Dotations aux provisions et aux dépréciations financières"});
    reportStructure.push({"id":"RO", "type":"group", "note":"3D", "bclass":"3", "description":"Valeurs comptables des cessions d'immobilisations"});
    reportStructure.push({"id":"RP", "type":"group", "note":"30", "bclass":"3", "description":"Autres Charges HAO"});
    reportStructure.push({"id":"RQ", "type":"group", "note":"30", "bclass":"3", "description":"Participation des travailleurs"});
    reportStructure.push({"id":"RS", "type":"group", "note":"", "bclass":"3", "description":"Impôts sur le résultat"});

    /* PASSIVE */
    reportStructure.push({"id":"CA", "type":"group", "note":"13", "bclass":"2", "description":"Capital"});
    reportStructure.push({"id":"CB", "type":"group", "note":"13", "bclass":"2", "description":"Apporteurs capital non appelé (-)"});
    reportStructure.push({"id":"CD", "type":"group", "note":"14", "bclass":"2", "description":"Primes liées au capital social"});
    reportStructure.push({"id":"CE", "type":"group", "note":"3e", "bclass":"2", "description":"Ecarts de réévaluation"});
    reportStructure.push({"id":"CF", "type":"group", "note":"14", "bclass":"2", "description":"Réserves indisponibles"});
    reportStructure.push({"id":"CG", "type":"group", "note":"14", "bclass":"2", "description":"Réserves libres"});
    reportStructure.push({"id":"CH", "type":"group", "note":"14", "bclass":"2", "description":"Report à nouveau (+ ou -)"});
    reportStructure.push({"id":"CJT", "type":"group", "note":"", "bclass":"2", "description":"Résultat net de l'exercice (bénéfice + ou perte -)"});
    reportStructure.push({"id":"CJ", "type":"group", "note":"", "description":"Résultat net de l'exercice (bénéfice + ou perte -)", 
                            "sum":"CJT;TA;TB;TC;TD;TE;TF;TG;TH;TI;TJ;TL;TM;TN;TO;-RA;-RB;-RC;-RD;-RE;-RF;-RG;-RH;-RI;-RJ;-RK;-RL;-RM;-RN;-RO;-RP;-RQ;-RS"});
    reportStructure.push({"id":"CL", "type":"group", "note":"15", "bclass":"2", "description":"Subventions d'investissement"});
    reportStructure.push({"id":"CM", "type":"group", "note":"15", "bclass":"2", "description":"Provisions réglementées"});
    reportStructure.push({"id":"CP", "type":"total", "note":"", "description":"TOTAL CAPITAUX PROPRES ET RESSOURCES ASSIMILEES", "sum":"CA;CB;CD;CE;CF;CG;CH;CJ;CL;CM"});
    reportStructure.push({"id":"DA", "type":"group", "note":"16", "bclass":"2", "description":"Emprunts et dettes financières diverses"});
    reportStructure.push({"id":"DB", "type":"group", "note":"16", "bclass":"2", "description":"Dettes de location acquisition"});
    reportStructure.push({"id":"DC", "type":"group", "note":"16", "bclass":"2", "description":"Provisions pour risques et charges"});
    reportStructure.push({"id":"DD", "type":"total", "note":"", "description":"TOTAL DETTES FINANCIERES ET RESSOURCES ASSIMILEES", "sum":"DA;DB;DC"});
    reportStructure.push({"id":"DF", "type":"total", "note":"", "description":"TOTAL RESSOURCES STABLES", "sum":"CP;DD"});
    reportStructure.push({"id":"DH", "type":"group", "note":"5", "bclass":"2", "description":"Dettes circulantes HAO"});
    reportStructure.push({"id":"DI", "type":"group", "note":"7", "bclass":"2", "description":"Clients, avances reçues"});
    reportStructure.push({"id":"DJ", "type":"group", "note":"17", "bclass":"2", "description":"Fournisseurs d'exploitation"});
    reportStructure.push({"id":"DK", "type":"group", "note":"18", "bclass":"2", "description":"Dettes fiscales et sociales"});
    reportStructure.push({"id":"DM", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DN", "type":"group", "note":"19", "bclass":"2", "description":"Provisions pour risques à court terme"});
    reportStructure.push({"id":"DP", "type":"total", "note":"", "description":"TOTAL PASSIF CIRCULANT", "sum":"DH;DI;DJ;DK;DM;DN"});
    reportStructure.push({"id":"DQ", "type":"group", "note":"20", "bclass":"2", "description":"Banques, crédits d'escompte"});
    reportStructure.push({"id":"DR", "type":"group", "note":"20", "bclass":"2", "description":"Banques, établissements financiers et crédits de trésorerie"});
    reportStructure.push({"id":"DT", "type":"total", "note":"", "description":"TOTAL TRESORERIE-PASSIF", "sum":"DQ;DR"});
    reportStructure.push({"id":"DV", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DZ", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"DF;DP;DT;DV"});

    return reportStructure;
}


// Profit & Loss statement
function createReportStructureProfitLoss() {
    var reportStructure = [];

    reportStructure.push({"id":"TA", "type":"group", "note":"21", "bclass":"4", "description":"Ventes de marchandises"});
    reportStructure.push({"id":"RA", "type":"group", "note":"22", "bclass":"3", "description":"Achats de marchandises"});
    reportStructure.push({"id":"RB", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks de marchandises"});
    reportStructure.push({"id":"XA", "type":"total", "note":"", "description":"MARGE COMMERCIALE (Somme TA à RB)", "sum":"TA;-RA;-RB"});
    reportStructure.push({"id":"TB", "type":"group", "note":"21", "bclass":"4", "description":"Ventes de produits fabriqués"});
    reportStructure.push({"id":"TC", "type":"group", "note":"21", "bclass":"4", "description":"Travaux, services vendus"});
    reportStructure.push({"id":"TD", "type":"group", "note":"21", "bclass":"4", "description":"Produits accessoires"});
    reportStructure.push({"id":"XB", "type":"total", "note":"", "description":"CHIFFRE D'AFFAIRES (A + B + C + D)", "sum":"TA;TB;TC;TD"});
    reportStructure.push({"id":"TE", "type":"group", "note":"6", "bclass":"4", "description":"Production stockée (ou déstockage)"});
    reportStructure.push({"id":"TF", "type":"group", "note":"21", "bclass":"4", "description":"Production immobilisée"});
    reportStructure.push({"id":"TG", "type":"group", "note":"21", "bclass":"4", "description":"Subventions d’exploitation"});
    reportStructure.push({"id":"TH", "type":"group", "note":"21", "bclass":"4", "description":"Autres produits"});
    reportStructure.push({"id":"TI", "type":"group", "note":"12", "bclass":"4", "description":"Transferts de charges d'exploitation"});
    reportStructure.push({"id":"RC", "type":"group", "note":"22", "bclass":"3", "description":"Achats de matières premières et fournitures liées"});
    reportStructure.push({"id":"RD", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks de matières premières et fournitures liées"});
    reportStructure.push({"id":"RE", "type":"group", "note":"22", "bclass":"3", "description":"Autres achats"});
    reportStructure.push({"id":"RF", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks d’autres approvisionnements"});
    reportStructure.push({"id":"RG", "type":"group", "note":"23", "bclass":"3", "description":"Transports"});
    reportStructure.push({"id":"RH", "type":"group", "note":"24", "bclass":"3", "description":"Services extérieurs"});
    reportStructure.push({"id":"RI", "type":"group", "note":"25", "bclass":"3", "description":"Impôts et taxes"});
    reportStructure.push({"id":"RJ", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"XC", "type":"total", "note":"", "description":"VALEUR AJOUTEE (XB+RA+RB) + (somme TE à RJ)", "sum":"XB;-RA;-RB;TE;TF;TG;TH;TI;-RC;-RD;-RE;-RF;-RG;-RH;-RI;-RJ"});
    reportStructure.push({"id":"RK", "type":"group", "note":"27", "bclass":"3", "description":"Charges de personnel"});
    reportStructure.push({"id":"XD", "type":"total", "note":"28", "description":"EXCEDENT BRUT D'EXPLOITATION (XC+RK)", "sum":"XC;-RK"});
    reportStructure.push({"id":"TJ", "type":"group", "note":"28", "bclass":"4", "description":"Reprises d’amortissements, provisions et dépréciations"});
    reportStructure.push({"id":"RL", "type":"group", "note":"3C&28", "bclass":"3", "description":"Dotations aux amortissements, aux provisions et dépréciations"});
    reportStructure.push({"id":"XE", "type":"total", "note":"", "description":"RESULTAT D'EXPLOITATION (XD+TJ+RL)", "sum":"XD;TJ;-RL"});
    reportStructure.push({"id":"TK", "type":"group", "note":"29", "bclass":"4", "description":"Revenus financiers et assimilés"});
    reportStructure.push({"id":"TL", "type":"group", "note":"28", "bclass":"4", "description":"Reprises de provisions  et dépréciations financières"});
    reportStructure.push({"id":"TM", "type":"group", "note":"12", "bclass":"4", "description":"Transferts de charges financières"});
    reportStructure.push({"id":"RM", "type":"group", "note":"29", "bclass":"3", "description":"Frais financiers et charges assimilées"});
    reportStructure.push({"id":"RN", "type":"group", "note":"3C&28", "bclass":"3", "description":"Dotations aux provisions et aux dépréciations financières"});
    reportStructure.push({"id":"XF", "type":"total", "note":"", "description":"RESULTAT FINANCIER (somme TK à RN)", "sum":"TK;TL;TM;-RM;-RN"});
    reportStructure.push({"id":"XG", "type":"total", "note":"", "description":"RESULTAT DES ACTIVITES ORDINAIRES (XE+XF)", "sum":"XE;XF"});
    reportStructure.push({"id":"TN", "type":"group", "note":"3D", "bclass":"4", "description":"Produits des cessions d'immobilisations"});
    reportStructure.push({"id":"TO", "type":"group", "note":"30", "bclass":"4", "description":"Autres Produits HAO"});
    reportStructure.push({"id":"RO", "type":"group", "note":"3D", "bclass":"3", "description":"Valeurs comptables des cessions d'immobilisations"});
    reportStructure.push({"id":"RP", "type":"group", "note":"30", "bclass":"3", "description":"Autres Charges HAO"});
    reportStructure.push({"id":"XH", "type":"total", "note":"", "description":"RESULTAT HORS ACTIVITES ORDINAIRES (somme TN à RP)", "sum":"TN;TO;-RO;-RP"});
    reportStructure.push({"id":"RQ", "type":"group", "note":"30", "bclass":"3", "description":"Participation des travailleurs"});
    reportStructure.push({"id":"RS", "type":"group", "note":"", "bclass":"3", "description":"Impôts sur le résultat"});
    reportStructure.push({"id":"XI", "type":"total", "note":"", "description":"RESULTAT NET (XG+XH+RQ+RS)", "sum":"XG;XH;-RQ;-RS"});
    
    return reportStructure;
}