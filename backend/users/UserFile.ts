import fs from 'fs';
import type { UserType } from '../types';

export default class UserFile {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  createIfNotExisting() {
    const path = this.path;
    const cwd = process.cwd();
    console.log('cinx ran');
    console.log('path', path);
    console.log('current dir', cwd);
    if (!fs.existsSync(this.path)) {
      this.writeData([]);
    }
  }

  writeData(users: UserType[]) {
    console.log('entering write');
    const fh = fs.openSync(this.path, 'w');
    if (!fh) {
      throw new Error('Could not open user file for write');
    }
    console.log('about to write:', users);
    const content = JSON.stringify(users, null, 2);
    fs.writeSync(fh, content);
    fs.closeSync(fh);
  }

  readData(): UserType[] {
    const data = fs.readFileSync(this.path);
    const users = JSON.parse(data.toString());
    return users;
  }
}

// const uf = new UserFile('./test.json');
// uf.createIfNotExisting();
