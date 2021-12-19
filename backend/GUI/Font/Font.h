/*
  1. Récupérer font chargée via css par JS
  2. Faire requete/récupérer le stream sous forme de buffer
  3. Créer instance de font FontFile via FontFile::Create(buffer)
  4. Surcharger Ultralight/FontLoader pour charger éventuellement ces polices en plus de celles du système 
  5. utiliser ce fontloader via Platform::instance().set_font_loader(fontLoader)
*/