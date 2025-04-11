// src/service/_handleDBError.ts
import ServiceError from '../core/serviceError';

const handleDBError = (error: any) => {
  const { code = '', message } = error;

  if (code === 'P2002') {
    switch (true) {
      case message.includes('idx_team_name_user_id_unique'):
        throw ServiceError.validationFailed(
          'A team with this name already exists',
        );
      case message.includes('idx_user_email_unique'):
        throw ServiceError.validationFailed(
          'There is already a user with this email address',
        );
      default:
        throw ServiceError.validationFailed('This item already exists');
    }
  }

  if (code === 'P2025') {
    switch (true) {
      case message.includes('fk_player_user'):
        throw ServiceError.notFound('This user does not exist');
      case message.includes('fk_team_user'):
        throw ServiceError.notFound('This user does not exist');
      case message.includes('fk_stat_player'):
        throw ServiceError.notFound('This player does not exist');
      case message.includes('user'):
        throw ServiceError.notFound('No user with this id exists');
      case message.includes('player'):
        throw ServiceError.notFound('No player with this id exists');
      case message.includes('team'):
        throw ServiceError.notFound('No team with this id exists');
      case message.includes('stat'):
        throw ServiceError.notFound('No stat with this id exists');
      
    }
  }

  if (code === 'P2003') {
    switch (true) {
      case message.includes('player_id'):
        throw ServiceError.conflict(
          'This player does not exist',
        );
      case message.includes('user_id'):
        throw ServiceError.conflict(
          'This user does not exist',
        );
    }
  }

  // Rethrow error because we don't know what happened
  throw error;
};

export default handleDBError;
