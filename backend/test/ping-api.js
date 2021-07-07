import axios from 'axios';
import https from 'https';
import fs, { promises } from 'fs';
import util from 'util';
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

const loadOptions = () => {
  const cookie = loadCookie();
  const optionsWithCookie = { ...options };
  if (cookie) {
    optionsWithCookie['headers'] = {
      cookie
    };
  }
  return optionsWithCookie;
};


const writeCookie = async (data) => {
  await promises.writeFile('./cookies.txt', data);
};

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


export const currentUser = async () => {
  const url = `https://${domain}/api/users/currentuser`;
  try {
    const response = await axios.get(url, loadOptions());
    console.log('currentuser:', response.data);

  }
  catch (err) {
    console.log(err.toString());

  }
};

export const getTest = async () => {
  const url = `http://${domain}/auth/signup`;
  try {
    const resp = await axios.get(url, loadOptions());
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
    return resp.data;
  }
  catch (err) {
    console.log(err.toString());
  }
  return [];
}

export const createTicket = async (title, price) => {
  const data = {
    title,
    price: parseFloat(price)
  }
  const url = `https://${domain}/api/tickets`;
  try {
    const response = await axios.post(url, data, loadOptions());
    // axios does not implement await correctly; you *always*
    // get back a Promise<Pending>. This sucks. WTF?
    return await response.data;
  }
  catch (err) {
    console.error('threw in createTicket');
    console.error(err.toString());
    console.error(err);
    console.error(err.response.data);
  }
  return {};
};

export const createOrder = async (ticketId) => {
  const data = {
    ticketId
  };
  const url = `https://${domain}/api/orders`;
  try {
    const response = await axios.post(url, data, loadOptions());
    // axios does not implement await correctly; you *always*
    // get back a Promise<Pending>. This sucks. WTF?
    return await response.data;
  }
  catch (err) {
    console.error('threw in createOrder');
    console.error(err.toString());
  }
  return {};
};

export const createPayment = async (orderId, token, ticketId) => {
  const url = `https://${domain}/api/payments`;
  let response;
  try {
    response = await axios.post(url, { orderId, token, ticketId }, loadOptions());
    // axios does not implement await correctly; you *always*
    // get back a Promise<Pending>. This sucks. WTF?
    return await response.data;
  }
  catch (err) {
    console.log("err in payment");
    console.log(typeof response);
    console.log(err.stack);
    console.error(err.toString());
  }
  return {};

};

// https://gist.github.com/nzvtrk/ebf494441e36200312faf82ce89de9f2
export const signup = async (email, password) => {
  const url = `https://${domain}/api/users/signup`;

  try {
    const response = await axios.post(url, {
      email,
      password
    }, options);

    await writeCookie(response.headers['set-cookie'][0]);

  }
  catch (err) {
    console.log(err.toString());
  }
};

export const signin = async (email, password) => {
  const url = `https://${domain}/api/users/signin`;

  try {
    const response = await axios.post(url, {
      email,
      password
    }, options);

    console.log(response.data);
    console.log(response.headers);
    await writeCookie(response.headers['set-cookie'][0]);

  }
  catch (err) {
    console.log(err.toString());
  }
};

export const signout = () => {
  // Just toss the cookie.
  if (fs.existsSync('./cookies.txt')) {
    fs.unlinkSync('./cookies.txt');
    console.log('deleted cookie file');
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
  signup: async (name, email, password) => {
    name = name || 'yaya3';
    email = email || 'yaya3@yayas.org';
    password = password || 'yayayayaya';
    const reply = await signupUser(name, email, password);
    console.log('signup returned:', reply);
  },
  signin: (email, pw) => {
    if (!email || !pw) {
      console.error('usage: signin email pw');
      return;
    }
    console.log('email', email, 'pw', pw);
    signin(email, pw);
  },
  signout: () => {
    signout();
    console.log('logged out');
  },
  currentuser: () => {
    currentUser();
  },
  tickets: async () => {
    const tickets = await getTickets();
    console.log(tickets);
  },
  payment: async () => {
    const data = createTicket('Show That Never Ends', 42);
    const ticket = await data;
    data.then(rslt => {
      console.log('ticket:', rslt);
      const ticketId = rslt.id;
      const orderPromise = createOrder(ticketId);
      orderPromise.then(order => {
        console.log('order:', order);
        const orderId = order.id;
        // we use the stripe library test token.
        const fakeToken = 'tok_visa';
        const paymentPromise = createPayment(orderId, fakeToken, ticketId);
        paymentPromise.then(payment => {
          console.log('Payment created');
          console.log(payment);
        });
      })
    })
  },

  ticket: async (...titles) => {
    console.log(titles);
    for (const ndx in titles) {
      console.log('title:', titles[ndx]);
      const price = parseFloat((10 + Math.random() * 60).toFixed(2));
      await createTicket(titles[ndx], price);
    }
  }

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

