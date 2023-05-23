//Imports pour le fichier json ou sont les users ET DateTime pour la lib afin de gerer les dates
const jsonData = require('./users.json');
const { DateTime } = require('luxon');

//Souhaite l'anniversaire des employés.
function greetsBirthdays() {
    //utilisation de la programmation fonctionnelle, on definit ce que l'on souhaite recuperer, plus rapide à utiliser que des boucles
    //dans filter on appelle la fonction getUserIfBirthday qui va parcourir users et renvoyer une ou des valeurs s'il y a occurence
    //dans map on fait une fonction qui nous permet de réaliser un traitement sur les valeurs trouvées en renvoyant 'Joyeux anniversaire'avec le nom de la personne associée.

    const greetings = jsonData.users
        .filter((user) => getUserIfBirthday(user))
        .map((user) => `Joyeux anniversaire ${user.name}`);

    //Comme on doit souhaiter tous les jours l'anniversaire de Michel, on l'ajoute automatiquement au tableau greetings
    greetings.push('Joyeux anniversaire Michel Anniversaire');

    //On retourne les valeurs dans greetings
    return greetings;
}

//on fait une fonction qui nous permet de comparer la date du jour avec la date de naissance d'un user,
//On retourne le user si y a un match !
function getUserIfBirthday(user) {
    //On fait des constantes avec la date du jour et de l'anniversaire pour plus de clarté
    const today = DateTime.now();
    const userBirthday = DateTime.fromFormat(user.birthday, 'dd/MM/yyyy');

    if (today.day === userBirthday.day && today.month === userBirthday.month) {
        return user;
    }
}

module.exports = { greetsBirthdays, getUserIfBirthday };
