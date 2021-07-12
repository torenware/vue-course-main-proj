// for portability, load our env first from the Vue .env name,
// and then from the base name, since docker/k8s will do that
// instead.
const baseEnvVar = (baseName: string, defaultVal: string) => {
  let val = '';
  if (process.env['VUE_APP_' + baseName]) {
    val = process.env['VUE_APP_' + baseName] || '';
    console.log(baseName, val);
  } else if (process.env[baseName]) {
    val = process.env[baseName] || '';
  } else {
    val = defaultVal;
  }
  return val;
};

export default {
  IDLE_TIMEOUT: baseEnvVar('IDLE_TIMEOUT', '1h')
};
