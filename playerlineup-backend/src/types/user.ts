import type { Prisma } from '@prisma/client';
import type { Entity, ListResponse } from './common';

export interface User extends Entity {
  name: string;
  email: string;
  password_hash: string;
  roles: Prisma.JsonValue;
}

export interface PublicUser extends Pick<User, 'id' | 'name' | 'email'> {}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdateInput extends Pick<UserCreateInput, 'name' | 'email'> {}

export interface UpdateUserRequest extends Pick<UserCreateInput, 'name' | 'email'> {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  
}

export interface GetUserRequest {
  id: number | 'me';
}

export interface GetAllUsersResponse extends ListResponse<PublicUser> {}
export interface GetUserByIdResponse extends PublicUser {}
export interface RegisterResponse extends GetUserByIdResponse {}
export interface UpdateUserResponse extends GetUserByIdResponse {}
