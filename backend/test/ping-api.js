const axios = require('axios');
const https = require('https');
const fs = require('fs');
const promises = fs.promises;
const jwt = require('jsonwebtoken');

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

const getTest = () => {
  const url = `http://${domain}/auth/signup`;
  let resp;
  try {
    axios.get(url, loadOptions('token'))
      .then(data => {
        resp = data;
        throw 'got-data';
      })
      .catch(err => {
        if (err === 'got-data') {
          console.log('got data 1', resp.data);
          return;
        }
        throw new Error(err);
      });
  }
  catch (err) {
    console.log(err.toString());
  }
  return resp && resp.data ? resp.data : '';
}

const currentUser = async () => {
  const url = `http://${domain}/auth/current-user`;
  let resp;
  try {
    axios.get(url, loadOptions())
      .then(data => {
        resp = data;
        throw 'got-data';
      })
      .catch(err => {
        if (err === 'got-data') {
          console.log('got data 1', resp.data);
          return;
        }
        throw new Error(err);
      });

    return resp.data;
  }
  catch (err) {
    console.log(err.toString());
    if (err.toJSON) {
      console.log(err.toJSON());
    }
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
    axios.post(url, data, loadOptions())
      .then(data => {
        console.log('entered then');
        resp = data;
        if (resp.data && resp.data.token) {
          writeToken(resp.data.token);
          const payload = getTokenData(resp.data.token);
          console.log('token:', payload);
        }
        throw 'got-data';
      })
      .catch(err => {
        if (err === 'got-data') {
          console.log('got data 1', resp.data);
          return;
        }
        throw new Error(err);
      });

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

const signin = (email, password) => {
  const url = `http://${domain}/auth/signin`;
  let resp;
  try {
    axios.post(url, {
      email,
      password
    }, options)
      .then(data => {
        resp = data;
        console.log(data);
        if (resp.data && resp.data.token) {
          writeToken(resp.data.token);
          const payload = getTokenData(resp.data.token);
          console.log('token:', payload);
        }
        throw 'got-data';
      })
      .catch(err => {
        if (err === 'got-data') {
          console.log('got data 1', resp);
          return;
        }
        throw new Error(err);
      });

    return resp.data;
  }
  catch (err) {
    console.log(err.toString());
  }
};


const getRequests = (params = {}) => {
  const url = `http://${domain}/api/requests`;
  const options = loadOptions();
  const axiosParams = buildAxiosParams(params);
  options.params = axiosParams;
  console.log(axiosParams);
  let resp;
  try {
    axios.get(url, options)
      .then(data => {
        resp = data;
        throw 'got-data';
      })
      .catch(err => {
        if (err === 'got-data') {
          console.log('got data 1', resp.data);
          return;
        }
        console.log(err.toString());
      });
  }
  catch (err) {
    if (err === 'got-data') {
      return resp.data;
    }
  }
  return [];
}

const signout = (authType = 'cookie') => {
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
  test: () => {
    const rslt = getTest();
    console.log('run test', rslt);
  },
  user: () => {
    const rslt = currentUser();
  },
  requests: () => {
    params = {
      // coachId: 'c3'
    };
    const rslt = getRequests(params);
    console.log(rslt);
  },
  signup: (name, email, password) => {
    name = name || 'yaya3';
    email = email || 'yaya3@yayas.org';
    password = password || 'yayayayaya';
    const reply = signupUser(name, email, password);
    let val;
    reply.then(data => {
      val = data;
    });
    console.log('signup returned:', val);
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

