// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  authApi: 'http://54.144.227.5:11001/api/',
  adminApi: 'http://54.144.227.5:11001/api/admin/',
  feedsApi: 'http://54.144.227.5:8080/',
  newStatsApi: 'http://legolas.joveo.com:8080/gandalf/stats/'
};
