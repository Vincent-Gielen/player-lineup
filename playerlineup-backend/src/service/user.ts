import type { PublicUser, User, UserCreateInput, UserUpdateInput } from '../types/user';
import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import { hashPassword, verifyPassword } from '../core/password';
import handleDBError from './_handleDBError';
import Role from '../core/roles';
import type { SessionInfo } from '../types/auth';
import { verifyJWT, generateJWT } from '../core/jwt';
import jwt from 'jsonwebtoken';
import { getLogger } from '../core/logging';

const makeExposedUser = ({ id, name, email }: User): PublicUser => {
  return {
    id,
    name,
    email,
  };
};

export const checkAndParseSession = async (authHeader?: string): Promise<SessionInfo> => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);

  try {
    const { roles, sub } = await verifyJWT(authToken);

    return {
      userId: Number(sub),
      roles,
    };
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized('The token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(
        `Invalid authentication token: ${error.message}`,
      );
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

export const checkRole = (role: string, roles: string[]): void => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden('You are not allowed to view this part of the application');
  }
};

export const login = async (email: string, password: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  return await generateJWT(user);
};

// Get all users
export const getAll = async (): Promise<PublicUser[]> => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

// Get a user by ID
export const getById = async (id: number): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  
  if (!user) {
    throw ServiceError.notFound('No user with this id exists');
  }
  
  return user;
};

// Register a new user
export const register = async ({name, email, password}: UserCreateInput): Promise<string> => {
  try {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
        roles: [Role.USER],
      },
    });
    return await generateJWT(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Update a user by ID
export const updateById = async (id: number, {name, email}: UserUpdateInput): Promise<PublicUser> => {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
    });
    return makeExposedUser(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

// Delete a user by ID
export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};
