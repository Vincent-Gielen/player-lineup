import { prisma } from '../data';
import type { Player, PlayerCreateInput, PlayerUpdateInput} from '../types/player';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import Role from '../core/roles';

// Get all players
export const getAllPlayers = async (): Promise<Player[]> => {
  return prisma.player.findMany();
};

// Get a player by ID
export const getPlayerById = async (id: number): Promise<Player> => {

  const player = await prisma.player.findUnique({
    where: {
      id,
    },
    include: {
      stats: true,
    },
  });
  if (!player) {
    throw ServiceError.notFound('No player with this id exists');
  }

  return player;
};

// Create a player
export const createPlayer = async(player: PlayerCreateInput, user_id: number): Promise<Player> => {
  try {
    return await prisma.player.create({
      data: {
        ...player, 
        user_id,
      },
    });
  } catch (error:any) {
    throw handleDBError(error);
  }
};

// Update a player's name or position by ID
export const updatePlayerDetailsById = async (
  id: number, user_id: number, changes: PlayerUpdateInput): Promise<Player> => {
  
  try {
    await checkUserHasPlayer(id, user_id);

    return await prisma.player.update({
      where: {
        id,
        user_id,
      },
      data: changes,
    });
  } catch (error:any) {
    throw handleDBError(error);
  }
}; 

// Delete a player by ID
export const deletePlayerById = async (id: number, user_id: number): Promise<void> => {
  try {
    await checkUserHasPlayer(id, user_id);

    await prisma.player.delete({
      where: {
        id,
        user_id,
      },
    });
  } catch (error:any) {
    throw handleDBError(error);
  }
};

export const checkUserHasPlayer = async (player_id: number, user_id: number): Promise<void> => {
  const player = await prisma.player.findUnique({
    where: {
      id: player_id,
      user_id,
    },
  });
  if (!player) {
    throw ServiceError.notFound('No player with this id exists');
  }
};

