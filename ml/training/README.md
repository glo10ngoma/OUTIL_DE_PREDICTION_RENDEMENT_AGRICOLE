# Entrainement ML

Ce dossier servira a entrainer les futurs modeles IA avec les donnees terrain collectees en RD Congo.

Pipeline prevu :

1. importer les donnees brutes depuis `data/raw` ou PostgreSQL ;
2. nettoyer et valider les valeurs ;
3. creer les variables utiles pour le modele ;
4. entrainer plusieurs modeles candidats ;
5. comparer les scores ;
6. sauvegarder le meilleur modele dans `ml/models`.

Modeles recommandes pour les premieres versions :

- Random Forest ;
- XGBoost ;
- LightGBM ;
- CatBoost si les donnees categorielles deviennent nombreuses.

