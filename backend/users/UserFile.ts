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
    if (!fs.existsSync(this.path)) {
      this.writeData([]);
    }
  }

  writeData(users: UserType[]) {
    const fh = fs.openSync(this.path, 'w');
    if (!fh) {
      throw new Error('Could not open user file for write');
    }
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
