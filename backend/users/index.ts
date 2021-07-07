import UserFile from './UserFile';
import UserData from './UserData';

type StoreLoader = () => UserData;

export default function loaderFunc() {
  console.log('enter store loader');
  const uf = new UserFile(process.cwd + '/users.json');
  uf.createIfNotExisting();
  console.log('start loading data');
  const store = UserData.loadFromFile(uf);
  console.log('store loaded');
  return store;
}

// export default store;
// store
//   .addUser({
//     name: 'Killroy',
//     email: 'killroy@washere.com',
//     password: 'stuff'
//   })
//   .then(() => {
//     store.writeToFile(uf);
//   })
//   .catch((err: Error) => {
//     console.error('failed to write:', err);
//   });
