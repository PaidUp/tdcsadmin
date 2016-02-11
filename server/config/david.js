var david = require('david');
var manifest = require('../../package.json');
var chalk = require('chalk');

david.getDependencies(manifest, function (er, deps) {
  console.log(chalk.green.underline.bold('latest dependencies information for', manifest.name));
  listDependencies(deps);
});

david.getDependencies(manifest, { dev: true }, function (er, deps) {
  console.log(chalk.green('latest devDependencies information for', manifest.name));
  listDependencies(deps);
});

david.getUpdatedDependencies(manifest, function (er, deps) {
  console.log(chalk.yellow.underline.bold('dependencies with newer versions for', manifest.name));
  listDependencies(deps);
});

david.getUpdatedDependencies(manifest, { dev: true }, function (er, deps) {
  console.log(chalk.yellow('devDependencies with newer versions for', manifest.name));
  listDependencies(deps);
});

david.getUpdatedDependencies(manifest, { stable: true }, function (er, deps) {
  console.log(chalk.red.underline.bold('dependencies with newer STABLE versions for', manifest.name));
  listDependencies(deps);
});
 
david.getUpdatedDependencies(manifest, { dev: true, stable: true }, function (er, deps) {
  console.log(chalk.red('devDependencies with newer STABLE versions for', manifest.name));
  listDependencies(deps);
});
 
function listDependencies(deps) {
  Object.keys(deps).forEach(function(depName) {
    var required = deps[depName].required || '*';
    var stable = deps[depName].stable || 'None';
    var latest = deps[depName].latest;
    if(required != stable){
      console.log('%s Required: %s Stable: %s Latest: %s', chalk.gray.italic(depName), chalk.red(required), chalk.green(stable), chalk.yellow(latest));
    }
  });
}