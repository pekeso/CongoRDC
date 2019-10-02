# Rapports comptables pour OHADA-RDC

L'App Banana [Rapports comptables (OHADA - RDC)](https://www.banana.ch/apps/fr/node/9093) crée un rapport avec les trois documents suivants
* Bilan
* Compte de Résultat 
* Flux de Trésorerie

L'application a été développée en suivant les documentations spécifiques OHADA-RDC :
* [Documentation concernant le Bilan](https://github.com/BananaAccounting/CongoRDC/blob/master/reports/statements/balancesheet/balancesheet_documentation.pdf)
* [Documentation concernant le Compte de Résultat](https://github.com/BananaAccounting/CongoRDC/blob/master/reports/statements/profitlossstatement/profitlosstatement_documentation.pdf)
* [Documentation concernant le Flux de Trésorerie](https://github.com/BananaAccounting/CongoRDC/blob/master/reports/statements/cashflow/cashflow_documentation.pdf)

Dans la documentation, la syntaxe utilisée pour spécifier les données à utiliser est **{compte/groupe,colonne}**, où:
* **compte/groupe**: indique le compte ou le groupe du tableau Comptes dans Banana (les groupes commencent avec **Gr=**) ;
* **colonne**: indique le type de données (Ouverture, Débit, Crédit, Total(débit-crédit)) du tableau Comptes dans Banana ;
* **(-1)**: indique que la valeur doit être inversée. Si positif, inverse à une valeur négative, si négatif, inverse à une valeur positive.

Fichiers JavaScript :
* [Fichier JavaScript Bilan](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/balancesheet/ch.banana.africa.balancesheetrdc.js)
* [Fichier JavaScript Compte de Résultat](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/profitlossstatement/ch.banana.africa.profitlossstatementrdc.js)
* [Fichier JavaScript Flux de Trésorerie](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/cashflow/ch.banana.africa.cashflowrdc.js)


## Banana Accounting file settings
In Banana select from the **menu File** the command **File and accounting propeties...**.
### Address
* Select the **Address** tab.
* Insert the **company name** in the Company field.
* Insert the **Designation of the entity number** in the Fiscal number field.
* Insert the **Identification number** in the Vat/Sales tex number.

The data inserted will be used to fill the header information of the report.

### Options
* Select the **Options** tab.
* Insert the **file from previous year**. 

The file from previous year is used only for the Cash Flow report.
It is optional: if the previous year file is selected it is used to calculate and then insert on the report the data in the EXERCICE N-1 column. If no file is selected, the EXERCICE N-1 column will be empty.


## How it works

### Install the BananaApp:
* Start Banana Accounting.
* Install the BananaApp **Accounting Reports (OHADA - RDC)**. Visit the [Menu Apps](https://www.banana.ch/doc9/en/node/4727) documentation.

### Run the BananaApp:
* Open your accounting file with Banana.
* In Banana select from the **menu Apps** the BananaApp **Accounting Reports (OHADA - RDC)** then **Balance Sheet, Profit/Loss Statement, Cash Flow**.
* Check the results.

Active Balance Sheet Report example:
![Active Balance Sheet Report Example](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/balancesheet/images/balancesheet_active_report.png)

Passive Balance Sheet Report example:
![Passive Balance Sheet Report Example](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/balancesheet/images/balancesheet_passive_report.png)

Profit/Loss Statement Report example:
![Profit/Loss Statement Report Example](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/profitlossstatement/images/profitlossstatement_report.png)

Cash Flow Report example:
![Cash Flow Report Example](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/cashflow/images/banana_report.png)

# Releases history
2019-09-23
* Update Banana Accounting file .ac2 templates.
* Update Cash Flow, changed all formulas using only groups. Accounts are not used anymore.

2019-05-27
* Update Cash Flow, changed FH,FJ,FO and FQ formulas.

2019-05-21
* Update Cash Flow, changed FD,FE,FG,FH,FK,FL and FO formulas.

2019-04-01
* Update Cash Flow, changed FD and FE formulas

2019-02-15
* Update Cash Flow, changed FD,FF,FG and FN formulas.
* Changed header information on the reports.

2019-02-11
* Update Cash Flow, changed FD,FJ,FK and FE formulas.
* Added company and address information on the reports.

2019-01-21
* Update Cash Flow, changed ZC formula.

2019-01-14
* Update Cash Flow with new formulas.
