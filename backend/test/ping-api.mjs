import axios from 'axios';
import https from 'https';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const getDomain = () => {
  return 'localhost:3005';
};

const domain = getDomain();

const options = {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  timeout: 10 * 1000
};

const loadOptions = (authType = 'token') => {
  if (authType !== 'none') {
    const auth = authType === 'token' ? loadToken() : loadCookie();
    const optionsWithAuth = { ...options };
    if (authType === 'cookie') {
      optionsWithAuth['headers'] = {
        cookie: auth
      };
    }
    else if (authType === 'token') {
      optionsWithAuth['headers'] = {
        'Authorization': 'Bearer ' + auth
      };
    }
    return optionsWithAuth;
  }
  else {
    return options;
  }
};

function getTokenData(token) {
  const data = jwt.decode(token);
  return data;
}

const writeCookie = (data) => {
  fs.writeFileSync('./cookies.txt', data);
};

const writeToken = (data) => {
  console.log('writing token');
  fs.writeFileSync('./token.txt', data);
}

const loadCookie = () => {
  let data;
  try {
    if (!fs.existsSync('./cookies.txt')) {
      console.log('No cookie file found.')
      return null;
    }
    data = fs.readFileSync('./cookies.txt');
    return data;
  }
  catch (err) {
    console.log('loadCookie:', err.toString());
  }
  return null;
};

const loadToken = () => {
  let data;
  try {
    if (!fs.existsSync('./token.txt')) {
      console.log('No token file found.')
      return null;
    }
    data = fs.readFileSync('./token.txt');
    return data;
  }
  catch (err) {
    console.log('loadToken:', err.toString());
  }
  return null;
};

const buildAxiosParams = params => {
  const axiosParams = new URLSearchParams();
  for (let key of Object.keys(params)) {
    axiosParams.append(key, params[key]);
  }
  return axiosParams;
}

const getTest = async () => {
  const url = `http://${domain}/auth/signup`;
  let resp;
  try {
    resp = await axios.get(url, loadOptions());
    console.log(resp.data);
  }
  catch (err) {
    console.log(err.message);
  }
  return resp && resp.data ? resp.data : '';
}

const currentUser = async () => {
  const url = `http://${domain}/auth/current-user`;
  let resp;
  try {
    resp = await axios.get(url, loadOptions());
    return resp.data;
  }
  catch (err) {
    console.log(err.message);
  }
  return null;
}


const signupUser = async (name, email, password) => {
  const url = `http://${domain}/auth/signup`;
  const data = {
    name,
    password,
    email
  }
  let resp;
  try {
    resp = await axios.post(url, data, loadOptions('none'));

    if (resp.data && resp.data.token) {
      writeToken(resp.data.token);
      const payload = getTokenData(resp.data.token);
      console.log('token:', payload);
    }
    return resp.data;
  }
  catch (err) {
    console.log(err.toString());
    if (err.toJSON()) {
      console.log(err.toJSON());
    }
  }
  return [];
}

const signin = async (email, password) => {
  const url = `http://${domain}/auth/signin`;
  let resp;
  try {
    resp = await axios.post(url, {
      email,
      password
    }, options);
    if (resp.data && resp.data.token) {
      writeToken(resp.data.token);
      const payload = getTokenData(resp.data.token);
      console.log('token:', payload);
    }
    return resp.data;
  }
  catch (err) {
    console.log(err.toString());
  }
  return null;
};


const getRequests = async () => {

  const url = `http://${domain}/api/requests`;
  const options = loadOptions();
  // const axiosParams = buildAxiosParams(params);
  // options.params = axiosParams;
  // console.log(axiosParams);
  let resp;
  try {
    resp = await axios.get(url, options);
    return resp.data;
  }
  catch (err) {
    console.log(err.toString());
    // return resp.data;
  }
  return [];
}

const signout = (authType = 'token') => {
  // Just toss the cookie.
  const file = authType == 'cookie' ? 'cookies.txt' : 'token.txt';
  if (fs.existsSync('./' + file)) {
    fs.unlinkSync('./' + file);
    console.log('deleted cookie/token file');
  }
}


const email = 'kenny@killroy.com';
const password = 'secret';
const name = 'kenny';

// const data = await signupUser(name, email, password);
// const data = await signin(email, password);
// const user = await currentUser();
// console.log(user);
// // console.log(data);
// const loaded = await getRequests();
// console.log(loaded);

const args = process.argv.slice(2);

const dispatch = {
  help: () => {
    console.error('no help yet');
  },
  test: async () => {
    const rslt = await getTest();
    console.log('run test', rslt);
  },
  user: async () => {
    const rslt = await currentUser();
    console.log(rslt);
  },
  requests: async () => {
    params = {
      // coachId: 'c3'
    };
    const rslt = await getRequests(params);
    console.log(rslt);
  },
  signup: async (name, email, password) => {
    name = name || 'yaya3';
    email = email || 'yaya3@yayas.org';
    password = password || 'yayayayaya';
    const reply = await signupUser(name, email, password);
    console.log('signup returned:', reply);
  },
  signin: async (email, password) => {
    email = email || 'yaya3@yayas.org';
    password = password || 'yayayayaya';
    if (!email || !password) {
      console.error('usage: signin email pw');
      return;
    }
    console.log('email', email, 'pw', password);
    const rslt = await signin(email, password);
    console.log(rslt);
  },
  signout: () => {
    signout('token');
    console.log('logged out');
  },

};

// signUp('yaya@yayas.org', 'yayayayaya');
if (!args[0]) {
  dispatch.help();
}
else {
  const command = args[0];
  if (dispatch[command]) {
    dispatch[command](...args.slice(1));
  }
  else {
    console.error(`No command "${command}"`);
    dispatch.help();
  }
}

