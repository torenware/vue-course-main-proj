import UserFile from './UserFile';
import UserData from './UserData';

type StoreLoader = () => UserData;

export default function loaderFunc() {
  const uf = new UserFile(process.cwd + '/users.json');
  uf.createIfNotExisting();
  const store = UserData.loadFromFile(uf);
  return store;
}
