import { db } from '@/lib/db'

async function seed() {
  // Create admin user
  const adminExists = await db.user.findUnique({ where: { username: 'admin' } })
  if (!adminExists) {
    await db.user.create({
      data: {
        username: 'admin',
        password: 'admin123',
        name: 'مدیر سیستم',
        role: 'admin',
      },
    })
    console.log('✅ Admin user created')
  }

  // Create regular user
  const userExists = await db.user.findUnique({ where: { username: 'user' } })
  if (!userExists) {
    await db.user.create({
      data: {
        username: 'user',
        password: 'user123',
        name: 'کاربر عادی',
        role: 'user',
      },
    })
    console.log('✅ Regular user created')
  }

  // Create branches
  const branchNames = [
    'تهران غرب',
    'تهران شرق',
    'تهران جنوب',
    'تهران هورکا',
    'تهران عمده',
    'اصفهان',
    'گیلان',
    'خراسان رضوی',
    'فارس',
    'البرز',
    'بابل',
    'خوزستان',
  ]

  for (const name of branchNames) {
    const exists = await db.branch.findUnique({ where: { name } })
    if (!exists) {
      await db.branch.create({
        data: { name, targetSent: false },
      })
    }
  }
  console.log('✅ Branches created')

  await db.$disconnect()
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
