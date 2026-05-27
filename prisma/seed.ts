import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Cities ────────────────────────────────────────────────────────────────
  const beijing = await prisma.city.upsert({
    where: { slug: "beijing" },
    update: {},
    create: {
      slug: "beijing",
      nameEn: "Beijing",
      nameZh: "北京",
      nameJa: "北京",
      nameKo: "베이징",
      nameFr: "Pékin",
      descEn: "China's ancient capital and political heart, Beijing blends imperial grandeur with modern dynamism. Walk the Great Wall, explore the Forbidden City, and taste authentic Peking duck in the world's most historic capital.",
      descZh: "北京是中国古老的首都和政治中心，融合了帝王气魄与现代活力。游览长城、探索故宫，在这座充满历史底蕴的城市品尝正宗烤鸭。",
      heroImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&auto=format",
      lat: 39.9042,
      lng: 116.4074,
      published: true,
    },
  });

  const shanghai = await prisma.city.upsert({
    where: { slug: "shanghai" },
    update: {},
    create: {
      slug: "shanghai",
      nameEn: "Shanghai",
      nameZh: "上海",
      nameJa: "上海",
      nameKo: "상하이",
      nameFr: "Shanghai",
      descEn: "Where East meets West in spectacular fashion. Shanghai dazzles with its iconic skyline, vibrant street food scene, and world-class museums. The Bund at night is one of Asia's most breathtaking sights.",
      descZh: "上海是东西方文化交汇的璀璨之地，以标志性天际线、丰富的街头美食和世界级博物馆令人叹为观止。夜晚的外滩是亚洲最令人叹为观止的景色之一。",
      heroImage: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=1200&auto=format",
      lat: 31.2304,
      lng: 121.4737,
      published: true,
    },
  });

  const chengdu = await prisma.city.upsert({
    where: { slug: "chengdu" },
    update: {},
    create: {
      slug: "chengdu",
      nameEn: "Chengdu",
      nameZh: "成都",
      nameJa: "成都",
      nameKo: "청두",
      nameFr: "Chengdu",
      descEn: "The city of giant pandas and fiery cuisine. Chengdu is famous for its laid-back teahouse culture, the Sichuan cuisine that inspired food lovers worldwide, and the adorable giant panda research base.",
      descZh: "成都是大熊猫和麻辣美食之城，以悠闲的茶馆文化、享誉全球的川菜和可爱的大熊猫繁育研究基地著称。",
      heroImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&auto=format",
      lat: 30.5728,
      lng: 104.0668,
      published: true,
    },
  });

  console.log("✅ Cities created");

  // ── Beijing Attractions ───────────────────────────────────────────────────
  await prisma.attraction.upsert({
    where: { slug: "great-wall-mutianyu" },
    update: {},
    create: {
      cityId: beijing.id,
      slug: "great-wall-mutianyu",
      nameEn: "Great Wall of China (Mutianyu)",
      nameZh: "长城（慕田峪）",
      descEn: "One of the world's greatest architectural achievements, the Mutianyu section is the most scenic and less crowded part of the Great Wall. Built over 2,000 years ago, it winds spectacularly across mountain ridges for thousands of kilometers.",
      descZh: "慕田峪长城是世界上最伟大的建筑成就之一，也是长城最美丽、最不拥挤的段落。这段长城建于2000多年前，壮观地蜿蜒于山脊之上。",
      category: "HISTORICAL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&auto=format",
        "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&auto=format",
      ]),
      lat: 40.4319,
      lng: 116.5704,
      published: true,
    },
  });

  await prisma.attraction.upsert({
    where: { slug: "forbidden-city" },
    update: {},
    create: {
      cityId: beijing.id,
      slug: "forbidden-city",
      nameEn: "Forbidden City (Palace Museum)",
      nameZh: "故宫博物院",
      descEn: "The world's largest palace complex, the Forbidden City served as the imperial palace for 24 emperors of the Ming and Qing dynasties. Its 9,999 rooms and vast courtyards form an awe-inspiring maze of Chinese imperial architecture.",
      descZh: "故宫是世界上最大的宫殿建筑群，曾是明清两朝24位皇帝的皇宫。9999间房间和宏大的庭院构成了令人叹为观止的中国皇家建筑迷宫。",
      category: "HISTORICAL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1584650589362-35aeea2c3d17?w=800&auto=format",
      ]),
      lat: 39.9163,
      lng: 116.3972,
      published: true,
    },
  });

  await prisma.attraction.upsert({
    where: { slug: "temple-of-heaven" },
    update: {},
    create: {
      cityId: beijing.id,
      slug: "temple-of-heaven",
      nameEn: "Temple of Heaven",
      nameZh: "天坛",
      descEn: "A UNESCO World Heritage Site where emperors prayed for good harvests. The Hall of Prayer for Good Harvests is an architectural masterpiece with no nails, and the surrounding park is a beloved gathering place for locals.",
      descZh: "天坛是UNESCO世界文化遗产，皇帝在此祈祷丰收。祈年殿是无钉建造的建筑杰作，周围的公园也是北京市民喜爱的休闲场所。",
      category: "HISTORICAL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?w=800&auto=format",
      ]),
      lat: 39.8822,
      lng: 116.4066,
      published: true,
    },
  });

  console.log("✅ Beijing attractions created");

  // ── Shanghai Attractions ──────────────────────────────────────────────────
  await prisma.attraction.upsert({
    where: { slug: "the-bund" },
    update: {},
    create: {
      cityId: shanghai.id,
      slug: "the-bund",
      nameEn: "The Bund (Wai Tan)",
      nameZh: "外滩",
      descEn: "Shanghai's most iconic waterfront promenade lined with colonial-era European-style buildings facing the futuristic Pudong skyline across the Huangpu River. The contrast between old and new makes for unforgettable photos, especially at night.",
      descZh: "外滩是上海最标志性的滨江步道，殖民时代的欧式建筑与对岸浦东的未来感天际线隔黄浦江相望，新旧对比令人难忘，尤其是夜景。",
      category: "CULTURAL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&auto=format",
      ]),
      lat: 31.2401,
      lng: 121.4907,
      published: true,
    },
  });

  await prisma.attraction.upsert({
    where: { slug: "yu-garden" },
    update: {},
    create: {
      cityId: shanghai.id,
      slug: "yu-garden",
      nameEn: "Yu Garden",
      nameZh: "豫园",
      descEn: "A classical Chinese garden paradise in the heart of old Shanghai. Built in 1559 during the Ming Dynasty, Yu Garden features pavilions, rockeries, koi ponds, and corridors winding through 5 acres of traditional landscaping.",
      descZh: "豫园是上海老城区中心的中式古典园林，建于明朝1559年，园内亭台楼阁、假山、锦鲤池和曲折走廊，占地5英亩，古色古香。",
      category: "NATURAL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format",
      ]),
      lat: 31.2271,
      lng: 121.4913,
      published: true,
    },
  });

  console.log("✅ Shanghai attractions created");

  // ── Chengdu Attractions ───────────────────────────────────────────────────
  await prisma.attraction.upsert({
    where: { slug: "chengdu-panda-base" },
    update: {},
    create: {
      cityId: chengdu.id,
      slug: "chengdu-panda-base",
      nameEn: "Giant Panda Breeding Research Base",
      nameZh: "成都大熊猫繁育研究基地",
      descEn: "The best place in the world to see giant pandas up close. This research center houses over 80 pandas and red pandas in naturalistic habitats. Arrive early in the morning when pandas are most active and feeding.",
      descZh: "这是全球近距离观赏大熊猫的最佳场所，研究中心在自然栖息地饲养着80余只大熊猫和小熊猫。建议清晨前往，那时熊猫最为活跃。",
      category: "NATURAL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&auto=format",
      ]),
      lat: 30.7375,
      lng: 104.1499,
      published: true,
    },
  });

  console.log("✅ Chengdu attractions created");

  // ── Beijing Food ──────────────────────────────────────────────────────────
  await prisma.food.upsert({
    where: { slug: "peking-duck" },
    update: {},
    create: {
      cityId: beijing.id,
      slug: "peking-duck",
      nameEn: "Peking Duck",
      nameZh: "北京烤鸭",
      descEn: "Beijing's most iconic dish, Peking Duck has been prepared since the imperial era. The duck is air-dried, glazed with maltose syrup, and roasted in a hung oven until the skin becomes impossibly crispy while the meat stays tender. Served with thin pancakes, spring onion, cucumber, and hoisin sauce.",
      descZh: "北京烤鸭是北京最具代表性的菜肴，自帝王时代便已有之。鸭子经过风干、涂抹麦芽糖浆，在挂炉中烤制，外皮酥脆、肉质鲜嫩，配薄饼、葱丝、黄瓜和甜面酱食用。",
      category: "ROASTED",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format",
      ]),
      spiceLevel: 0,
      priceRange: "UPSCALE",
      published: true,
    },
  });

  await prisma.food.upsert({
    where: { slug: "jianbing" },
    update: {},
    create: {
      cityId: beijing.id,
      slug: "jianbing",
      nameEn: "Jianbing (Chinese Crepe)",
      nameZh: "煎饼",
      descEn: "Beijing's beloved street breakfast. A thin mung bean crepe cooked on a flat griddle, topped with egg, hoisin and chili sauces, cilantro, pickled vegetables, and a crunchy wonton cracker folded inside. The perfect cheap, filling street breakfast.",
      descZh: "煎饼是北京最受欢迎的街头早餐，薄薄的绿豆皮在平底锅上煎熟，加入鸡蛋、海鲜酱和辣酱、香菜、咸菜和脆薄脆，折叠食用，物美价廉。",
      category: "STREET_FOOD",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format",
      ]),
      spiceLevel: 1,
      priceRange: "BUDGET",
      published: true,
    },
  });

  console.log("✅ Beijing food created");

  // ── Shanghai Food ─────────────────────────────────────────────────────────
  await prisma.food.upsert({
    where: { slug: "xiaolongbao" },
    update: {},
    create: {
      cityId: shanghai.id,
      slug: "xiaolongbao",
      nameEn: "Xiaolongbao (Soup Dumplings)",
      nameZh: "小笼包",
      descEn: "Shanghai's most celebrated delicacy — delicate steamed dumplings filled with minced pork and a magical soup broth that forms from gelatin during steaming. Place in a spoon, nibble a hole, sip the hot broth, then eat the whole dumpling.",
      descZh: "小笼包是上海最著名的美食——精致的蒸饺内有猪肉馅和在蒸制过程中由明胶形成的神奇汤汁。放在勺中，轻轻咬破，先喝热汤，再整个吃下。",
      category: "DUMPLINGS",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format",
      ]),
      spiceLevel: 0,
      priceRange: "MEDIUM",
      published: true,
    },
  });

  await prisma.food.upsert({
    where: { slug: "shengjianbao" },
    update: {},
    create: {
      cityId: shanghai.id,
      slug: "shengjianbao",
      nameEn: "Shengjianbao (Pan-Fried Pork Buns)",
      nameZh: "生煎包",
      descEn: "A Shanghai breakfast icon — thick-dough buns filled with juicy pork and broth, pan-fried until the bottom turns golden and crispy while the top remains fluffy. Served with sesame seeds and chopped green onion.",
      descZh: "生煎包是上海标志性的早餐，厚皮包裹鲜汁猪肉，底部煎至金黄酥脆，顶部依然松软，撒上芝麻和葱花。",
      category: "STREET_FOOD",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format",
      ]),
      spiceLevel: 0,
      priceRange: "BUDGET",
      published: true,
    },
  });

  console.log("✅ Shanghai food created");

  // ── Chengdu Food ──────────────────────────────────────────────────────────
  await prisma.food.upsert({
    where: { slug: "mapo-tofu" },
    update: {},
    create: {
      cityId: chengdu.id,
      slug: "mapo-tofu",
      nameEn: "Mapo Tofu",
      nameZh: "麻婆豆腐",
      descEn: "One of China's most iconic dishes — silky tofu in a fiery sauce of doubanjiang (chili bean paste), ground pork, Sichuan peppercorns, and black bean sauce. The combination creates the famous 'mala' — numbing and spicy sensation.",
      descZh: "麻婆豆腐是中国最具代表性的菜肴之一，嫩豆腐浸于由豆瓣酱、肉末、花椒和豆豉制成的浓辣汁中，呈现出经典的麻辣口感。",
      category: "HOTPOT",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format",
      ]),
      spiceLevel: 3,
      priceRange: "BUDGET",
      published: true,
    },
  });

  await prisma.food.upsert({
    where: { slug: "sichuan-hot-pot" },
    update: {},
    create: {
      cityId: chengdu.id,
      slug: "sichuan-hot-pot",
      nameEn: "Sichuan Hot Pot",
      nameZh: "四川火锅",
      descEn: "The communal dining experience that defines Sichuan culture. A bubbling cauldron of spicy broth loaded with Sichuan peppercorns sits at the center of the table. Diners cook raw meats, vegetables, tofu, and offal directly in the broth.",
      descZh: "四川火锅是四川饮食文化的精髓，一口沸腾的麻辣锅底摆在桌子中央，食客将生肉、蔬菜、豆腐等食材直接涮熟，共享美味。",
      category: "HOTPOT",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format",
      ]),
      spiceLevel: 4,
      priceRange: "MEDIUM",
      published: true,
    },
  });

  await prisma.food.upsert({
    where: { slug: "dan-dan-noodles" },
    update: {},
    create: {
      cityId: chengdu.id,
      slug: "dan-dan-noodles",
      nameEn: "Dan Dan Noodles",
      nameZh: "担担面",
      descEn: "Named after the carrying pole vendors used to sell them on the street, dan dan noodles feature chewy wheat noodles topped with a savory, spicy sauce of sesame paste, chili oil, minced pork, preserved vegetables, and Sichuan peppercorns.",
      descZh: "担担面因挑担沿街叫卖的小贩而得名，劲道的小麦面条配以芝麻酱、辣油、肉末、榨菜和花椒制成的鲜辣酱汁，风味独特。",
      category: "NOODLES",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format",
      ]),
      spiceLevel: 3,
      priceRange: "BUDGET",
      published: true,
    },
  });

  console.log("✅ Chengdu food created");
  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => void prisma.$disconnect());
