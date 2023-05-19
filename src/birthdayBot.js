const users = [
    {
        name: 'Gwenn Stacy',
        birthday: '10 Avril',
    },
    {
        name: 'Thomas Price',
        birthday: '20 Mai',
    },
    {
        name: 'Peter Parker',
        birthday: '20 Mai',
    },
];

function greetsBirthdays(date) {
    //Si la fonction retourne une valeur alors on la retourne
    if (getBirthdaysToGreet(date)) {
        return getBirthdaysToGreet(date);
    }
    //Sinon on renvoie Joyeux anniversaire Michel Anniversaire
    return 'Joyeux anniversaire Michel Anniversaire';
}

function getBirthdaysToGreet(date) {
    // on instancie la variable greeting en dehors de la boucle
    const greeting = [];

    //On fait une boucle pour lire nos utilisateurs
    for (const index in users) {
        // On récupère leur index et on l'assigne à un user
        const user = users[index];

        //On verifie que la fonction renvoie une valeur.
        if (greetsUserBirthday(user, date)) {
            //Si oui, on l'ajoute au tableau greeting.
            greeting.push(greetsUserBirthday(user, date));

            //La methode suivante est équivalente :
            //const birthday = greetsUserBirthday(user, date);
            //greeting.push(birthday);
        }
    }

    //On verifie qu'il y ait bien des gens à qui souhaiter leur anniversaire et que la taille du tableau n'est pas égale à 0
    //(sinon erreur dans les test car renvoi un tableau vide []) A refactoriser
    if (greeting && greeting.length > 0) {
        //Si ok on renvoi greeting
        return greeting;
    }
}

//Permet de trouver si un user dont la date d'anniversaire correspond au debut de la date du jour (cad dire sans prendre en compte les années)
//Et  retourne Joyeux anniversaire avec le nom de la personne.
function greetsUserBirthday(user, date) {
    if (date.startsWith(user.birthday)) {
        return `Joyeux anniversaire ${user.name}`;
    }
}
module.exports = { greetsBirthdays, greetsUserBirthday, getBirthdaysToGreet };
