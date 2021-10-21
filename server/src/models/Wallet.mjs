import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

const { DataTypes: DT } = Sequelize;
import { WALLET_CREATED_FROM } from '../config/constants';

export class Wallet extends Base {
  static get CREATED_FROM() {
    return WALLET_CREATED_FROM;
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        publicKey: { type: DT.STRING, allowNull: false },
        edgeId: { type: DT.STRING, unique: true },
        name: { type: DT.STRING, allowNull: true },
        data: { type: DT.JSON },
        from: {
          type: DT.STRING,
          allowNull: false,
          defaultValue: Wallet.CREATED_FROM.EDGE,
        },
      },
      {
        sequelize,
        tableName: 'wallets',
        paranoid: true,
        timestamps: false,
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }

  static list(where) {
    return this.findAll({
      where,
    });
  }

  static format({ publicKey, edgeId, name, data }) {
    return {
      id: edgeId,
      publicKey,
      name,
      data,
    };
  }
}
