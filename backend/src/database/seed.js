import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize, User, Hostel, Room } from '../models/index.js';
import { ROLES, BCRYPT_ROUNDS } from '../constants/index.js';
import { logger } from '../utils/logger.util.js';

const seed = async () => {
  try {
    await sequelize.sync({ alter: true });
    logger.info('Seeding database...');

    // Admin user
    const existing = await User.findOne({ where: { email: 'admin@hostel.com' } });
    if (!existing) {
      const hash = await bcrypt.hash('Admin@123', BCRYPT_ROUNDS);
      await User.create({ name: 'Super Admin', email: 'admin@hostel.com', password: hash, role: ROLES.ADMIN });
      logger.success('Admin created → admin@hostel.com / Admin@123');
    }

    // Sample hostel
    const [hostel] = await Hostel.findOrCreate({
      where: { hostelName: 'Block A — Men\'s Hostel' },
      defaults: { hostelName: 'Block A — Men\'s Hostel', totalRooms: 5, description: 'Ground + 2 floors. Mess, Wi-Fi, laundry.' },
    });

    // Sample rooms
    const roomData = [
      { roomNumber: 'A-101', capacity: 2, occupied: 0, hostelId: hostel.id },
      { roomNumber: 'A-102', capacity: 3, occupied: 1, hostelId: hostel.id },
      { roomNumber: 'A-201', capacity: 2, occupied: 2, hostelId: hostel.id },
      { roomNumber: 'A-202', capacity: 4, occupied: 0, hostelId: hostel.id },
      { roomNumber: 'A-301', capacity: 1, occupied: 0, hostelId: hostel.id },
    ];

    for (const room of roomData) {
      await Room.findOrCreate({ where: { roomNumber: room.roomNumber, hostelId: hostel.id }, defaults: room });
    }

    logger.success('Seed complete ✔');
    process.exit(0);
  } catch (err) {
    logger.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();