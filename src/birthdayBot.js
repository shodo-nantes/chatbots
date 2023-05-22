const jsonData = require('./users.json');

//Souhaite l'anniversaire des employés.

function greetsBirthdays(date) {
    //Si la fonction retourne une valeur alors on la retourne
    if (getBirthdaysToGreet(date)) {
        return getBirthdaysToGreet(date);
    }
    //Sinon on renvoie Joyeux anniversaire Michel Anniversaire
    return 'Joyeux anniversaire Michel Anniversaire';
}
//Cherche s'il y a des anniversaires à souhaiter.
function getBirthdaysToGreet(date) {
    //utilisation de la programmation fonctionnelle, on definit ce que l'on souhaite recuperer, plus rapide à utiliser que des boucles
    //dans filter on fait une fonction qui nous permet de recuperer les valeurs de tous les utilisateurs dont la date d'anniversaire commence par celle en parametre.
    //dans map on fait une fonction qui nous permet de renvoyer une valeur qui souhaite l'anniversaire des valeurs trouvées precedement avec le nom de la personne associée.
    const greeting = jsonData.users
        .filter((user) => date.startsWith(user.birthday))
        .map((user) => `Joyeux anniversaire ${user.name}`);

    //On verifie qu'il y ait bien des gens à qui souhaiter leur anniversaire et que la taille du tableau n'est pas égale à 0
    //(sinon erreur dans les test car renvoi un tableau vide [])
    if (greeting && greeting.length > 0) {
        //Si ok on renvoi greeting
        return greeting;
    }
}

module.exports = { greetsBirthdays, getBirthdaysToGreet };
