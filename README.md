# Chat bots

Chatbots for Google Chat.

## Getting Started

### Prerequisites

-   Node.js 18.x
-   NPM 9.x

To install Node.js and NPM, try [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installing

-   Clone the repository
-   Run `npm ci` to install dependencies

The project is now ready to run.

## Usage

### Building

Run `npm run build` to build the project.

It will create a `dist` folder with the compiled code. For each bot there will be a single file.

Eg: `dist/attendance.js` for the attendance bot.

## Development

### Testing

Jest is used as a test runner.

-   Run `npm test` to start the tests.

## Creating a bot

### Create the folder

To create a new bot, create a new folder with the name of the bot in the `bots` folder.

Eg: `bots/attendance`

### Create the bot file

Inside the folder create a `js` file, the name of the file should be the name of the bot.

Eg: `bots/attendance/attendance.js`

The file should export a function that will be called when the bot is triggered.

Eg:

```js
module.exports = function attendance() {
    // Bot code
};
```

### Add tests

Create a test file with the same name as the bot file, but with the `.test.js` extension.

Eg: `bots/attendance/attendance.test.js`

The test file should import the bot function and run it in tests.

Eg:

```js
const attendance = require('./attendance');

describe('attendance', () => {
    it('should return a message', () => {
        const message = attendance();
        expect(message).toBe('Hello World!');
    });
});
```

## Tools

### Linter

This project uses [eslint](https://eslint.org/) as a linter. The configuration is in `.eslintrc.js`.

To run the linter, run `npm run lint`.

### Pre-commit hooks

This project uses [husky](https://github.com/typicode/husky) to run pre-commit hooks. Linter is run on every commit.

### VSCode Extensions

Open the project in VSCode.

Type `Ctrl + Shift + X` to open the extensions panel. Type `@recommended` and install the recommended extensions.

### Stryker Mutator

[StrykerJS](https://stryker-mutator.io/docs/stryker-js/introduction/) is configured to run on this project, when you 
want to test your tests with mutation testing (not continuously).

To run mutation testing on the whole project :
```shell
npm run test:mutate
```
Or the real underlying command
```shell 
stryker run
```

To run mutation testing on a specific folder :
```shell
npm run test:mutate -- --mutate "path/to/my/folder/**/!(*.test).js"
```
Or the real underlying command
```shell
stryker run --mutate "path/to/my/folder/**/!(*.test).js"
```