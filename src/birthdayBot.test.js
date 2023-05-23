const { DateTime } = require('luxon');
const jsonData = require('./users.json');
const birthdayBot = require('./birthdayBot');

describe('birthdayBot', () => {
    test('Should wish birthday to Michel everyday', () => {
        expect(birthdayBot.greetsBirthdays()).toContain('Joyeux anniversaire Michel Anniversaire');
    });

    test('Should return happy birthday to users with the same birthday', () => {
        //Permet de modifier la date d'anniversaire de Thomas et Peter à celle du jour
        //Pour eviter d'avoir à changer la date dans le fichier json pour que le tests fonctionne tous les jours
        //On appelle la fonction map qui
        jsonData.users.map((user) => {
            if (user.name === 'Thomas Price' || user.name === 'Peter Parker') {
                user.birthday = DateTime.now().toFormat('dd/MM/yyyy');
            }
            return user;
        });
        //Attend que l'on souhaite l'anniversaire de Thomas, Peter et Michel
        expect(birthdayBot.greetsBirthdays()).toContain(
            'Joyeux anniversaire Thomas Price',
            'Joyeux anniversaire Peter Parker',
            'Joyeux anniversaire Michel Anniversaire',
        );
    });

    test("Should not return user if it's not their birthday", () => {
        jsonData.users.map((user) => {
            const today = DateTime.now();
            const todayMinusOneDay = today.minus(86_400_000);
            if (user.name === 'Gwenn Stacy') {
                user.birthday = todayMinusOneDay.toFormat('dd/MM/yyyy');
            }
            return user;
        });
        expect(birthdayBot.greetsBirthdays()).not.toContain('Joyeux anniversaire Gwenn Stacy');
    });
});
