import axios from 'axios';
import https from 'https';
import fs, { promises } from 'fs';
import util from 'util';
import jwt from 'jsonwebtoken';
import { exec as oldExec } from 'child_process';


const exec = util.promisify(oldExec);

const getDomain = async () => {
  return 'localhost:3005';
};



const domain = await getDomain();

const options = {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  timeout: 10 * 1000
};

const loadOptions = (authType = 'token') => {
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
};

function getTokenData(token) {
  const data = jwt.decode(token);
  return data;
}

const writeCookie = async (data) => {
  await promises.writeFile('./cookies.txt', data);
};

const writeToken = async (data) => {
  console.log('writing token');
  await promises.writeFile('./token.txt', data);
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

export const getTest = async () => {
  const url = `http://${domain}/auth/signup`;
  try {
    const resp = await axios.get(url, loadOptions('token'));
    return resp.data;
  }
  catch (err) {
    console.log(err.toString());
  }
  return [];
}

export const signupUser = async (name, email, password) => {
  const url = `http://${domain}/auth/signup`;
  const data = {
    name,
    password,
    email
  }
  try {
    const resp = await axios.post(url, data, loadOptions());
    if (resp.data && resp.data.token) {
      await writeToken(resp.data.token);
      const payload = getTokenData(resp.data.token);
      console.log('token:', payload);
    }
    return resp.data;
  }
  catch (err) {
    console.log(err.toString());
    if (err.toJSON) {
      console.log(err.toJSON());
    }
  }
  return [];
}

const signin = async (email, password) => {
  const url = `http://${domain}/auth/signin`;

  try {
    const response = await axios.post(url, {
      email,
      password
    }, options);

    console.log(response.data);
    console.log(response.headers);
    if (response.data && response.data.token) {
      await writeToken(response.data.token);
      const payload = getTokenData(response.data.token);
      console.log('token:', payload);
    }

  }
  catch (err) {
    console.log(err.toString());
  }
};


const getRequests = async () => {
  const url = `http://${domain}/api/requests`;
  try {
    const resp = await axios.get(url, loadOptions());
    return resp.data;
  }
  catch (err) {
    console.log(err.toString());
  }
  return [];
}


export const signout = (authType = 'cookie') => {
  // Just toss the cookie.
  const file = authType == 'cookie' ? 'cookies.txt' : 'token.txt';
  if (fs.existsSync('./' + file)) {
    fs.unlinkSync('./' + file);
    console.log('deleted cookie/token file');
  }
}

const args = process.argv.slice(2);

const dispatch = {
  help: () => {
    console.error('no help yet');
  },
  test: async () => {
    const rslt = await getTest();
    console.log('run test', rslt);
  },
  requests: async () => {
    const rslt = await getRequests();
    console.log(rslt);
  },
  signup: async (name, email, password) => {
    name = name || 'yaya3';
    email = email || 'yaya3@yayas.org';
    password = password || 'yayayayaya';
    const reply = await signupUser(name, email, password);
    console.log('signup returned:', reply);
  },
  signin: (email, password) => {
    email = email || 'yaya3@yayas.org';
    password = password || 'yayayayaya';
    if (!email || !password) {
      console.error('usage: signin email pw');
      return;
    }
    console.log('email', email, 'pw', password);
    signin(email, password);
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

