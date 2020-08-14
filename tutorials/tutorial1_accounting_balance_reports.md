## Comment utiliser l'extension Rapport Balance des comptes OHADA RDC ?

### 1. Introduction

Cette extension permet de générer, en quelques clics, le rapport balance des comptes selon le modèle OHADA.

### 2. Préalables

Pour obtenir le résultat escompté, il faut préalablement télécharger un des modèles, selon que vous vouliez faire la comptabilité mono ou multidevise et avec ou sans TVA, à partir du lien ci-après. https://www.banana.ch/apps/fr?combine=&langcode=All&country=307

### 3. Utilisation

#### Propriétés fichier (Données de base)

Configurer les propriétés du fichier (données de base):

- Du menu Fichier, commande **Propriétés Fichier (Données de base)**, indiquez le nom de l'entreprise qui apparaîtra sur les rapports imprimés et sur d'autres données.

- Sélectionnez la devise de base pour la gestion de la comptabilité.

![Propriétés fichier](images/file_properties.jpg)

#### Le plan des comptes

Le plan des comptes figure dans le tableau **Comptes** où l'on définit les comptes et les groupes dans lesquels les comptes devront être totalisés. 
Notez que pour les fichiers modèles (.ac2) téléchargés, on peut créer des nouveaux comptes selon les besoins, mais il n'est pas envisageable de supprimer ou modifier les groupes existants.
Pour plus de détails sur le plan comptable, référez-vous à la documentation sur le logiciel Banana concernant le sujet. https://www.banana.ch/doc9/fr/node/3826

![Plan comptable](images/accounting_plan.jpg)

#### Soldes d'ouverture

Quand on utilise Banana Comptabilité pour la première fois, il est nécessaire d'insérer les soldes initiales manuellement pour créer le bilan d'ouverture.

![Solde d'ouverture](images/opening_balance.jpg)

La documentation Banana donne plus de détails sur les soldes d'ouverture, les différences soldes d'ouverture et soldes de l'année précédente. 

Lien vers la documentation: https://www.banana.ch/doc9/fr/node/2626

#### Écritures

Les écritures doivent être insérées dans le tableau **Écritures**.

![Écritures](images/transactions.jpg)

Pour plus de détails sur les différents types d'écritures, les écritures répétées, les colonnes, etc... il suffit de consulter la documentation Banana Comptabilité sur les écritures.

https://www.banana.ch/doc9/fr/node/2630

#### Rapport balance des comptes

Pour obtenir un rapport de balance des comptes selon le modèle OHADA:

- Menu **Extensions** -> **Rapport Balance des Comptes OHADA et Congo RDC [BETA]**

- Sélection de la période de comptabilité dans la fenêtre de dialogue qui s'affiche.

- Paramétrage pour l'impression du rapport 

![Paramètres](images/parameters.jpg)

**Le rapport balance des comptes mono-devise**

![rapport balance des comptes](images/account_balance_report.jpg)

#### Rapport Balance des comptes multi-devise

Pour obtenir un rapport de balance des comptes multi-devise selon le modèle OHADA:

- Menu **Extensions** -> **Rapport Balance des Comptes Multi-devise OHADA et Congo RDC [BETA]**

- Sélection de la période de comptabilité dans la fenêtre de dialogue qui s'affiche.

- Paramétrage pour l'impression du rapport

![Paramètres multi](images/parameters_multi.jpg)

**Le rapport balance des comptes multi-devise**

![rapport multi-devise](images/account_balance_multi_report.jpg)








