import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { MenuItem } from '../menu-items/menu-item.entity';

export async function seed(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
  const menuItemRepo = dataSource.getRepository(MenuItem);

  console.log('🌱 Seeding database...');

  // Clear existing data
  await menuItemRepo.delete({});
  await categoryRepo.delete({});
  await userRepo.delete({});

  // Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = userRepo.create({
    name: 'Admin User',
    email: 'admin@foodio.com',
    password: adminPassword,
    address: 'House:1, Road:1, New York, USA',
    role: UserRole.ADMIN,
  });

  const user = userRepo.create({
    name: 'John Doe',
    email: 'user@foodio.com',
    password: userPassword,
    address: 'House:23, Road:23, Jamaica, USA',
    role: UserRole.USER,
  });

  await userRepo.save([admin, user]);
  console.log('✅ Users seeded');

  // Categories
  const startersCategory = categoryRepo.create({ name: 'Starters' });
  const mainCoursesCategory = categoryRepo.create({ name: 'Main Courses' });
  const dessertsCategory = categoryRepo.create({ name: 'Desserts' });

  await categoryRepo.save([startersCategory, mainCoursesCategory, dessertsCategory]);
  console.log('✅ Categories seeded');

  // Menu Items
  const menuItems = [
    // Starters
    {
      name: 'Golden Crunch Bites',
      description: 'Crispy golden bites with a savory herb seasoning, served with a tangy dipping sauce.',
      price: 15.0,
      category: startersCategory,
      isAvailable: true,
    },
    {
      name: 'Mediterranean Olive Medley',
      description: 'A vibrant selection of marinated olives with garlic, herbs, and citrus zest.',
      price: 25.0,
      category: startersCategory,
      isAvailable: true,
    },
    {
      name: 'Crispy Fire Bites',
      description: 'Spicy crispy bites with a fiery kick, perfect for those who love bold flavors.',
      price: 15.0,
      category: startersCategory,
      isAvailable: true,
    },
    {
      name: 'Pan-Seared Scallops',
      description: 'Jumbo scallops with cauliflower purée and truffle oil.',
      price: 24.0,
      category: startersCategory,
      isAvailable: true,
    },
    // Main Courses
    {
      name: 'Creamy Garlic Shrimp Pasta',
      description: 'Al dente pasta tossed in a rich garlic cream sauce with juicy sautéed shrimp.',
      price: 10.0,
      category: mainCoursesCategory,
      isAvailable: true,
    },
    {
      name: 'Herb-Roasted Chicken Bowl',
      description: 'Tender herb-roasted chicken served over seasoned rice with roasted vegetables.',
      price: 15.0,
      category: mainCoursesCategory,
      isAvailable: true,
    },
    // Desserts
    {
      name: 'Citrus Swirl Delights',
      description: 'Light and zesty citrus-flavored swirl cake with a lemon glaze and fresh berries.',
      price: 35.0,
      category: dessertsCategory,
      isAvailable: true,
    },
    {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream.',
      price: 15.0,
      category: dessertsCategory,
      isAvailable: true,
    },
    {
      name: 'Signature Crunch Squares',
      description: 'Buttery, crunchy squares layered with caramel and dark chocolate.',
      price: 15.0,
      category: dessertsCategory,
      isAvailable: true,
    },
  ];

  for (const item of menuItems) {
    await menuItemRepo.save(menuItemRepo.create(item));
  }

  console.log('✅ Menu items seeded');
  console.log('\n🎉 Seeding complete!');
  console.log('   Admin: admin@foodio.com / admin123');
  console.log('   User:  user@foodio.com  / user123');
}
