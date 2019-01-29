const { exec } = require('child_process');
const { resolve } = require('path');
const { writeFileSync, readFileSync } = require('fs');
const ora = require('ora');

const { argv } = require('yargs');

const execCmd = (cmd) => {
  return new Promise((resolve, reject) => {
    // console.log(`Running command: ${cmd}`);
    exec(cmd, (err, stout, sterr) => {
      if (err) {
        console.error(sterr);
        reject(sterr);
      } else {
        // console.log(stout);
        resolve(stout);
      }
    });
  });
}

const getPackageContent = () => {
  try {
    return JSON.parse(readFileSync(resolve(__dirname, './release/package.json')), 'utf-8');
  } catch (err) {
    throw new Error('package.json is not existed!');
  }
}

const replacePackageJSON = async () => {
  const oldPackage = getPackageContent();
  const replacePackage = {};
  replacePackage.name = oldPackage.name;
  replacePackage.version = oldPackage.version;
  replacePackage.main = oldPackage.main;
  replacePackage.dependencies = oldPackage.dependencies;
  writeFileSync(resolve(__dirname, './release/package.json'), JSON.stringify(replacePackage, null, 2));
}

const run = async () => {
  const { platform } = argv;
  console.log(`Packaging platform: ${platform}`);
  process.chdir(resolve(__dirname, './release'));
  const spinner = ora('installing ...');
  const spinner2 = ora('packaging ...');
  spinner.start();
  await replacePackageJSON();
  // await execCmd('npm install');
  spinner2.start();
  const buildCommand = platform === 'win'
    ? 'electron-packager . reyworks --platform=win32 --icon=./favicon.ico --overwrite'
    : 'electron-packager . reyworks --platform=darwin --icon=./icon.icns --overwrite';
  await execCmd(buildCommand);
  spinner2.stop();
  console.log('/n Packaging done!');
  spinner.stop();
}

run();
