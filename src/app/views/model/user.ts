export class User {
  userId: number;
  token: string;
  username: string;
  name: string;
  roleId: number;

  constructor( userId: number, token:string,username: string, name:string) {
    this.userId = userId;
    this.token = token;
    this.username = username;
    this.name = name;
  }

  setValue(value , name): void {
    this[name] = value;
  }

}
