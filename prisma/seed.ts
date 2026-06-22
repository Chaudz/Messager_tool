import {
  FaqCategory,
  MenuCategory,
  PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.restaurantSettings.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.menuItem.deleteMany();

  await prisma.restaurantSettings.create({
    data: {
      restaurantName: 'Đặc sản Lý Sơn Đại Hằng',
      address: 'Lý Sơn, Quảng Ngãi (giao hàng toàn quốc)',
      phone: '0905123456',
      openingHours: {
        mon: '07:00-21:00',
        tue: '07:00-21:00',
        wed: '07:00-21:00',
        thu: '07:00-21:00',
        fri: '07:00-21:00',
        sat: '07:00-21:00',
        sun: '07:00-21:00',
      },
      aiEnabled: true,
      aiModel: 'gpt-4o-mini',
      confidenceThreshold: 70,
      systemPrompt: `Bạn là nhân viên tư vấn bán hàng của shop Đặc sản Lý Sơn Đại Hằng.
Sản phẩm chính: cá tươi Lý Sơn, chả cá Lý Sơn, hành và tỏi Lý Sơn.
Giá chả cá: chả sống 159.000đ/kg, chả chín 169.000đ/kg.
PHONG CÁCH: Luôn mở đầu "Dạ", xưng hô anh/chị, thân thiện, ngắn gọn, emoji nhẹ 1-2 cái.
KHÔNG tự bịa giá hoặc thông tin. CHỈ dùng dữ liệu trong CONTEXT.`,
      facebookVerifyToken: process.env.FACEBOOK_VERIFY_TOKEN ?? 'daihang-verify-token',
    },
  });

  await prisma.faqItem.createMany({
    data: [
      {
        question: 'Giờ nhận đơn?',
        answer:
          'Dạ bên em nhận đơn từ 7h sáng đến 21h tối hằng ngày ạ.',
        category: FaqCategory.OPENING_HOURS,
        keywords: ['giờ', 'mở cửa', 'đóng cửa', 'mấy giờ', 'nhận đơn'],
        sortOrder: 1,
      },
      {
        question: 'Shop ở đâu?',
        answer:
          'Dạ bên em chuyên hàng Lý Sơn, giao hàng toàn quốc ạ. Anh/chị nhắn em địa chỉ nhận hàng nha.',
        category: FaqCategory.ADDRESS,
        keywords: ['địa chỉ', 'ở đâu', 'lý sơn', 'giao hàng'],
        sortOrder: 2,
      },
      {
        question: 'Số điện thoại?',
        answer: 'Dạ anh/chị gọi hoặc nhắn em số 0905123456 nha 😊',
        category: FaqCategory.PHONE,
        keywords: ['số điện thoại', 'hotline', 'gọi', 'zalo'],
        sortOrder: 3,
      },
      {
        question: 'Giá chả cá bao nhiêu?',
        answer:
          'Dạ chả cá sống Lý Sơn 159.000đ/kg, chả cá chín 169.000đ/kg ạ 🐟',
        category: FaqCategory.OTHER,
        keywords: ['chả', 'giá chả', 'chả sống', 'chả chín', '159', '169'],
        sortOrder: 4,
      },
      {
        question: 'Có ship không?',
        answer:
          'Dạ bên em giao hàng toàn quốc ạ. Anh/chị cho em địa chỉ và số lượng, em báo phí ship nha.',
        category: FaqCategory.OTHER,
        keywords: ['ship', 'giao hàng', 'giao', 'vận chuyển', 'cod'],
        sortOrder: 5,
      },
    ],
  });

  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Chả cá sống Lý Sơn',
        category: MenuCategory.HAI_SAN,
        description: 'Chả cá tươi làm từ cá Lý Sơn, giao sống',
        price: 159000,
        unit: 'kg',
        isAvailable: true,
        sortOrder: 1,
      },
      {
        name: 'Chả cá chín Lý Sơn',
        category: MenuCategory.HAI_SAN,
        description: 'Chả cá chín sẵn, thơm ngon đặc trưng Lý Sơn',
        price: 169000,
        unit: 'kg',
        isAvailable: true,
        sortOrder: 2,
      },
      {
        name: 'Cá tươi Lý Sơn',
        category: MenuCategory.HAI_SAN,
        description: 'Cá tươi ngày, giá theo loại — nhắn em báo giá ạ',
        price: 0,
        unit: 'kg',
        isAvailable: true,
        sortOrder: 3,
      },
      {
        name: 'Hành Lý Sơn',
        category: MenuCategory.KHAC,
        description: 'Hành tím Lý Sơn thơm, giá theo mùa — nhắn em báo giá',
        price: 0,
        unit: 'kg',
        isAvailable: true,
        isSeasonal: true,
        sortOrder: 4,
      },
      {
        name: 'Tỏi Lý Sơn',
        category: MenuCategory.KHAC,
        description: 'Tỏi Lý Sơn cay thơm đặc trưng — nhắn em báo giá',
        price: 0,
        unit: 'kg',
        isAvailable: true,
        isSeasonal: true,
        sortOrder: 5,
      },
    ],
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
