/* Configuration de la COPIE DE TEST de l'application Fléchettes PDC.

   databaseURL vide = mode local : rien n'est envoyé à la base commune du club pendant les essais.

   PDC_PHOTO : envoi des photos de test vers le dossier Drive du club (voir drive/INSTALLATION-DRIVE.txt).
     url  = adresse du script publié (se termine par /exec)
     code = le même code que celui écrit dans le script (variable CODE)
   Tant que url est vide, les photos restent en attente sur le téléphone.
*/
window.PDC_CONFIG = {
  databaseURL: ''
};
window.PDC_PHOTO = {
           url: 'https://script.google.com/macros/s/AKfycbxMUiCJfXCTyPjBuWWSMBCkptB3trio5Nn7E6zRXSsXlywOHO7T2ROC6MiiDgy8k60/exec',
           code: 'pdcTest7K2m'
         };