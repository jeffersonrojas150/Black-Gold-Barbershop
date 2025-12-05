import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const seed = async () => {
    try {
        console.log('🌱 Seeding database...');

        const hashedPassword = await bcrypt.hash('password123', 10);

        // 1. Crear usuarios
        await pool.query(`
      INSERT INTO users (name, email, password, phone, role) VALUES
      ('Admin Principal', 'admin@barbershop.com', ?, '987654321', 'admin'),
      ('Carlos Mendoza', 'carlos@barbershop.com', ?, '987654322', 'barber'),
      ('Miguel Torres', 'miguel@barbershop.com', ?, '987654323', 'barber'),
      ('Juan Pérez', 'juan@example.com', ?, '987654324', 'client'),
      ('María García', 'maria@example.com', ?, '987654325', 'client')
    `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword, hashedPassword]);

        console.log('✅ Users created');

        // 2. Crear servicios
        await pool.query(`
      INSERT INTO services (name, description, price, duration, image_url) VALUES
      ('Corte Clásico', 'Corte de cabello tradicional con máquina y tijera', 25.00, 30, 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400'),
      ('Corte + Barba', 'Corte de cabello más arreglo de barba completo', 40.00, 45, 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400'),
      ('Barba Premium', 'Arreglo y perfilado de barba con toalla caliente', 20.00, 25, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400'),
      ('Corte Infantil', 'Corte especial para niños menores de 12 años', 18.00, 25, 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400'),
      ('Tinte de Cabello', 'Aplicación de tinte en todo el cabello', 60.00, 90, 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400'),
      ('Afeitado Clásico', 'Afeitado tradicional con navaja y toalla caliente', 30.00, 35, 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400')
    `);

        console.log('✅ Services created');

        // 3. Crear barberos (usuarios 2 y 3 son barberos)
        await pool.query(`
      INSERT INTO barbers (user_id, specialty, bio, image_url) VALUES
      (2, 'Cortes clásicos y modernos', 'Más de 10 años de experiencia en estilos tradicionales y tendencias actuales', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
      (3, 'Especialista en barbas', 'Experto en diseño y cuidado de barbas. Técnicas premium de afeitado', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400')
    `);

        console.log('✅ Barbers created');

        // 4. Crear horarios de barberos (Lunes a Sábado, 9:00 AM - 7:00 PM)
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const schedules = [];

        for (let barberId = 1; barberId <= 2; barberId++) {
            for (const day of days) {
                schedules.push([barberId, day, '09:00:00', '19:00:00', true]);
            }
        }

        await pool.query(`
      INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time, is_available) 
      VALUES ?
    `, [schedules]);

        console.log('✅ Barber schedules created');

        // 5. Crear algunas citas de ejemplo
        await pool.query(`
      INSERT INTO appointments (client_id, barber_id, service_id, appointment_date, appointment_time, status, notes) VALUES
      (4, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', 'confirmed', 'Cliente prefiere corte corto'),
      (5, 2, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', 'pending', 'Primera vez en el local'),
      (4, 1, 3, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '16:00:00', 'confirmed', NULL)
    `);

        console.log('✅ Appointments created');
        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Test credentials:');
        console.log('Admin: admin@barbershop.com / password123');
        console.log('Barber 1: carlos@barbershop.com / password123');
        console.log('Barber 2: miguel@barbershop.com / password123');
        console.log('Client 1: juan@example.com / password123');
        console.log('Client 2: maria@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seed();