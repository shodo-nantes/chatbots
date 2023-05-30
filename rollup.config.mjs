import replace from '@rollup/plugin-replace';
import { glob } from 'glob';
import path from 'path';

const BOTS_FOLDER = 'bots';
const DIST_FOLDER = 'dist';

const rollupConfig = [];

for (const botFolderPath of glob.sync(`${BOTS_FOLDER}/*`)) {
    const botName = botFolderPath.split('/')[1];

    rollupConfig.push({
        input: path.join(botFolderPath, `${botName}.js`),
        output: {
            file: path.join(DIST_FOLDER, `${botName}.js`),
            format: 'cjs',
            strict: false,
        },
        plugins: [
            replace({
                preventAssignment: false,
                values: {
                    'module.exports': `exports.${botName}`,
                },
            }),
        ],
    });
}

export default rollupConfig;
