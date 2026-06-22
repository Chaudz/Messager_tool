"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.restaurantSettings.deleteMany();
    await prisma.faqItem.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.restaurantSettings.create({
        data: {
            restaurantName: 'Nhà hàng Đại Hằng',
            address: '123 Đường Biển, Quận Sơn Trà, Đà Nẵng',
            phone: '0905123456',
            openingHours: {
                mon: '10:00-22:00',
                tue: '10:00-22:00',
                wed: '10:00-22:00',
                thu: '10:00-22:00',
                fri: '10:00-22:00',
                sat: '10:00-23:00',
                sun: '10:00-23:00',
            },
            aiEnabled: true,
            aiModel: 'gpt-4o-mini',
            confidenceThreshold: 70,
            systemPrompt: `Bạn là nhân viên tư vấn của Nhà hàng Đại Hằng - nhà hàng hải sản tươi sống tại Đà Nẵng.
PHONG CÁCH: Luôn mở đầu "Dạ", xưng hô anh/chị, thân thiện, ngắn gọn, emoji nhẹ 1-2 cái.
KHÔNG tự bịa thông tin. CHỈ dùng dữ liệu trong CONTEXT.`,
            facebookVerifyToken: process.env.FACEBOOK_VERIFY_TOKEN ?? 'daihang-verify-token',
        },
    });
    await prisma.faqItem.createMany({
        data: [
            {
                question: 'Giờ mở cửa?',
                answer: 'Dạ bên em mở cửa từ 10h sáng đến 22h tối các ngày trong tuần, cuối tuần đến 23h ạ.',
                category: client_1.FaqCategory.OPENING_HOURS,
                keywords: ['giờ', 'mở cửa', 'đóng cửa', 'mấy giờ'],
                sortOrder: 1,
            },
            {
                question: 'Địa chỉ nhà hàng?',
                answer: 'Dạ nhà hàng em ở 123 Đường Biển, Quận Sơn Trà, Đà Nẵng ạ.',
                category: client_1.FaqCategory.ADDRESS,
                keywords: ['địa chỉ', 'ở đâu', 'chỉ đường'],
                sortOrder: 2,
            },
            {
                question: 'Số điện thoại?',
                answer: 'Dạ anh/chị gọi em số 0905123456 nha 😊',
                category: client_1.FaqCategory.PHONE,
                keywords: ['số điện thoại', 'hotline', 'gọi'],
                sortOrder: 3,
            },
            {
                question: 'Có chỗ đậu xe không?',
                answer: 'Dạ bên em có bãi đậu xe miễn phí cho khách ạ.',
                category: client_1.FaqCategory.PARKING,
                keywords: ['đậu xe', 'gửi xe', 'bãi xe'],
                sortOrder: 4,
            },
        ],
    });
    await prisma.menuItem.createMany({
        data: [
            {
                name: 'Tôm hùm Alaska',
                category: client_1.MenuCategory.HAI_SAN,
                description: 'Tôm hùm tươi sống, chế biến theo yêu cầu',
                price: 890000,
                unit: 'kg',
                isAvailable: true,
                isSeasonal: true,
                sortOrder: 1,
            },
            {
                name: 'Cua hoàng đế',
                category: client_1.MenuCategory.HAI_SAN,
                description: 'Cua hoàng đế nhập khẩu',
                price: 1200000,
                unit: 'con',
                isAvailable: true,
                sortOrder: 2,
            },
            {
                name: 'Ốc hương nướng',
                category: client_1.MenuCategory.MON_NUONG,
                description: 'Ốc hương tươi nướng mỡ hành',
                price: 180000,
                unit: 'đĩa',
                isAvailable: true,
                sortOrder: 3,
            },
            {
                name: 'Lẩu hải sản',
                category: client_1.MenuCategory.LAU,
                description: 'Lẩu hải sản tổng hợp cho 2-4 người',
                price: 450000,
                unit: 'nồi',
                isAvailable: true,
                sortOrder: 4,
            },
            {
                name: 'Cơm hải sản',
                category: client_1.MenuCategory.COM,
                description: 'Cơm chiên hải sản',
                price: 85000,
                unit: 'đĩa',
                isAvailable: true,
                sortOrder: 5,
            },
            {
                name: 'Nước dừa tươi',
                category: client_1.MenuCategory.DO_UONG,
                description: 'Dừa xiêm tươi',
                price: 35000,
                unit: 'trái',
                isAvailable: true,
                sortOrder: 6,
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
//# sourceMappingURL=seed.js.map