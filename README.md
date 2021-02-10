# Mail

Il y a quelques mois j'ai paramétré un petit serveur de mail destiné à mon usage personnel et à celui de mes amis.  
Dans un soucis de confidentialité et de sécurité, j'ai souhaité faire en sorte de chiffrer les mails reçus par défaut, à l'aide d'une clef publique associée à chaque boîte mail, sur le serveur. 

Malheureusement, ce système n'est pas satisfaisant en l'état, la plupart des logiciels de mailing gère mal un tel montage (par exemple, Thunderbird ne décrypte pas les pièces jointes et affiche le code html au lieu de le rendre). De fait, il est inutilisable en l'état.

J'ai donc développé ce projet parallèle visant à expérimenter une nouvelle approche, profitant de la rapidité de traitement offerte par le C++ (notamment pour ce qui concerne le chiffrement/déchiffrement des mails) et de la praticité des technologies web, pour ce qui concerne la construction d'interfaces. 

Ce projet s'articule donc autour de deux ensembles: 
* Le backend, en C++ réalise les opérations effectives (chiffrement/dechiffrement, récupérations des données depuis le serveur de mail)
* Le frontend en HTML/CSS/JS (React) rendu à l'aide d'ultralight (pour contourner la consommation excessive d'Electron)

## Le modèle de données
La communication entre le frontend et le backend ainsi que le traitement des données se construit autour des ensembles suivants: 

**Mail**
* Headers (key/value)
    * headers connus (content-type, date etc...)
		* headers non-connus (X- et tout le reste)
* Bodies (liste)
    * Liste de toutes les alternatives possibles pour le mail
* Attachments (liste)
    * Liste de toutes les pièces jointes 
* Attributs (key/value)
    * A définir 

**Folder**
* name (string)
    * Nom du dossier
* mails (liste)
    * Liste de tous les mails contenus dans le dossier

**Account**
* imap (key/value)
    * host (string)
	      * Adresse du serveur IMAP
		* username (string)
		    * Nom d'utilisateur 
		* password (string)
		    * Mot de passe
* smtp (key/value)
    * host (string)
	      * Adresse du serveur IMAP
		* username (string)
		    * Nom d'utilisateur 
		* password (string)
		    * Mot de passe
* key (string)
    * Chemin de la clef privée sur le disque 
	
## Le backend 
Pour proposer une base de fonctionnalités acceptable, le backend doit proposer les opérations suivantes: 

**Sur les mails**

* Envoyer un mail
* Consulter/déchiffrer un mail
* Modifier les attributs d'un mail (lu/non lu etc...)
* Supprimer un mail

**Sur les dossiers**

* Créer un dossier
* Récupérer le contenu d'un dossier (lister tous les mails/chercher des mails)
* Ajouter/supprimer un mail
* Supprimer un dossier 

**Sur les comptes**

* Initialiser un compte 
* Lister tous les dossiers
* Modifier le compte (credentials/clef privée)
* Supprimer le compte 