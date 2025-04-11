import type {Team, TeamCreateInput} from '../types/team';
import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
import Role from '../core/roles';

// Get all teams
export const getAllTeams = async (user_id: number, roles: string[]): Promise<Team[]> => {
  return prisma.team.findMany({
    where: roles.includes(Role.ADMIN) ? {} : { user_id },
    include: {
      players: true,
    },
  });
};

// Get a team by ID
export const getTeamById = async (id: number, user_id: number, roles: string[]): Promise<Team> => {
  const extraFilter = roles.includes(Role.ADMIN) ? {} : { user_id };
  
  const team = await prisma.team.findUnique({
    where: {
      id,
      ...extraFilter,
    },
    include: {
      players: {
        include: {
          stats: true,
        },
      },
    },
  });
  if (!team) {
    throw ServiceError.notFound('No team with this id exists');
  }

  return team;
};

export const createTeam = async (team: TeamCreateInput, user_id: number): Promise<Team> => {
  
  try {
    return await prisma.team.create({
      data :{
        ...team,
        user_id,
      },
    });
  } catch (error:any) {
    throw handleDBError(error);
  }
};

export const updateTeamNameById = async (id: number, user_id: number, name: string): Promise<Team> => {
  try {
    await checkUserHasTeam(id, user_id);

    return await prisma.team.update({
      where: {
        id,
        user_id,
      },
      data: {
        name,
      },
    });
  } catch (error:any) {
    throw handleDBError(error);
  }
};

export const addPlayerToTeam = async (id: number, playerId: number, user_id: number): Promise<Team> => {
  try {
    await checkUserHasTeam(id, user_id);
    await checkTeamHas5Players(id);

    return await prisma.team.update({
      where: {
        id,
        user_id,
      },
      data: {
        players: {
          connect: {
            id: playerId,
          },
        },
      },
      include: {
        players: true,
      },
    });
  } catch (error:any) {
    throw handleDBError(error);
  }
};

export const removePlayerFromTeam = async (id: number, playerId: number, user_id: number): Promise<Team> => {
  try {
    await checkUserHasTeam(id, user_id);
    await checkTeamHasPlayer(id, playerId);

    return await prisma.team.update({
      where: {
        id,
        user_id,
      },
      data: {
        players: {
          disconnect: {
            id: playerId,
          },
        },
      },
      include: {
        players: true,
      },
    });
  } catch (error:any) {
    throw handleDBError(error);
  }
};

export const deleteTeamById = async (id: number, user_id: number): Promise<void> => {
  try {
    await checkUserHasTeam(id, user_id);
    
    await prisma.team.delete({
      where: {
        id,
        user_id,
      },
    });
  } catch (error:any) {
    throw handleDBError(error);
  }
};

export const checkUserHasTeam = async (team_id: number, user_id: number): Promise<void> => {
  const team = await prisma.team.findUnique({
    where: {
      id: team_id,
      user_id,
    },
  });
  if (!team) {
    throw ServiceError.notFound('No team with this id exists');
  }
};

export const checkTeamHas5Players = async (team_id: number): Promise<void> => {
  const team = await prisma.team.findUnique({
    where: {
      id: team_id,
    },
    include: {
      players: true,
    },
  });

  if (team?.players) {
    if (team.players.length >= 5) {
      throw ServiceError.conflict('Team already has 5 players');
    }
  }
};

export const checkTeamHasPlayer = async (team_id: number, player_id: number): Promise<void> => {
  const team = await prisma.team.findUnique({
    where: {
      id: team_id,
    },
    include: {
      players: {
        where: {
          id: player_id,
        },
      },
    },
  });

  const player = team?.players[0];

  if (!player) {
    throw ServiceError.notFound('No player with this id exists in the team');
  }
};

