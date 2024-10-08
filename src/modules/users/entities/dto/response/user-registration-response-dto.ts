export class UserRegistrationResponseDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  token?: string;

  constructor(
    id: number,
    name: string,
    email: string,
    role: string,
    token?: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.token = token;
  }
}
