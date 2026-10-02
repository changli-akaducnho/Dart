export type ArtworkCategory =
  | "Portrait"
  | "Character Illustration"
  | "Landscape"
  | "Pet"
  | "Custom Concept";

export type ArtworkStatus = "available" | "delivered" | "inquiry";

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  price: number | null;
  category: ArtworkCategory;
  medium: string;
  dimensions: string;
  description: string;
  image: string;
  images?: string[];
  available: boolean;
  status: ArtworkStatus;
};

// Original DART inventory supplied by the user. Prices are in VND.
// Physical dimensions have not been supplied. Delivered works stay in the portfolio.
export const heroArtworkIds: string[] = ["akaza", "raiden", "p7", "p8"];

export const artworks: Artwork[] = [
  {
    id: "cc2",
    slug: "anh-nhin-xanh-cc2",
    title: "Ánh nhìn xanh",
    artist: "DART Studio",
    price: 49000,
    category: "Custom Concept",
    medium: "Bút bi xanh trên giấy kẻ dòng",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Gương mặt nghiêng nhẹ được phác bằng bút bi xanh trên trang giấy kẻ dòng. Những nét đan dày quanh mắt, tóc và dưới cằm tạo chiều sâu giữa các khoảng giấy còn thoáng.",
    image: "/images/artworks/cc2.webp",
    available: true,
    status: "available",
  },
  {
    id: "c1",
    slug: "chien-binh-chibi-c1",
    title: "Chiến binh chibi",
    artist: "DART Studio",
    price: 99000,
    category: "Character Illustration",
    medium: "Chì graphite trên giấy mỹ thuật trắng",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Nhân vật chibi khoanh tay với mái tóc dựng, bộ giáp và chiếc đuôi cuộn. Các lớp chì đậm nhạt tạo khối cho trang phục và giữ lại vẻ cứng cỏi trong một dáng hình nhỏ gọn.",
    image: "/images/artworks/c1.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "c3",
    slug: "san-sang-xuat-tran-c3",
    title: "Sẵn sàng xuất trận",
    artist: "DART Studio",
    price: 109000,
    category: "Character Illustration",
    medium: "Chì graphite trên giấy mỹ thuật",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Chiến binh chibi với mái tóc dựng cao, đôi tay nắm chặt và trang phục rách ở vai, đầu gối. Các mảng chì đậm tập trung ở quần áo làm nổi bật gương mặt và tư thế hướng về phía trước.",
    image: "/images/artworks/c3.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "c4",
    slug: "diona-c4",
    title: "Diona",
    artist: "DART Studio",
    price: 149000,
    category: "Character Illustration",
    medium: "Chì màu trên giấy",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Diona trong Genshin Impact với mái tóc hồng, đôi tai mèo và đôi mắt xanh đang rót đồ uống vào chiếc cốc nhỏ. Sắc hồng, xanh lam và vàng tạo nên một minh họa tươi sáng với nhiều chi tiết trên mũ và trang phục.",
    image: "/images/artworks/c4.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "c5",
    slug: "cun-kiem-si-c5",
    title: "Cún kiếm sĩ",
    artist: "DART Studio",
    price: 139000,
    category: "Pet",
    medium: "Chì màu trên giấy",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Chú cún đội nón lá, khoác áo choàng xanh và mang thanh kiếm ngang thân. Chất lông nâu mềm cùng phần vải bay rộng tạo nên một nhân vật thú cưng vừa đáng yêu vừa có dáng dấp kiếm sĩ.",
    image: "/images/artworks/c5.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "c6",
    slug: "hayate-c6",
    title: "Hayate",
    artist: "DART Studio",
    price: 89000,
    category: "Character Illustration",
    medium: "Mực và marker trên giấy",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Hayate ở góc nghiêng hiện lên qua những nét mực đen mạnh, đứt và kéo dài. Các khoảng trắng xen giữa phần đầu, tóc và vai tạo cảm giác chuyển động cho bố cục đơn sắc.",
    image: "/images/artworks/c6-2c26012c.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "c8",
    slug: "sucrose-c8",
    title: "Sucrose",
    artist: "DART Studio",
    price: 149000,
    category: "Character Illustration",
    medium: "Chì màu trên giấy có vân",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Sucrose trong Genshin Impact với mái tóc xanh ngọc, kính tròn và đôi mắt màu hổ phách. Những lớp chì màu vẫn để lộ vân giấy, với sắc xanh lam và vàng nhạt trên trang phục.",
    image: "/images/artworks/c8.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "p1",
    slug: "sac-do-sau-trong-kinh-p1",
    title: "Sắc đỏ sau tròng kính",
    artist: "DART Studio",
    price: 249000,
    category: "Portrait",
    medium: "Chì màu trên giấy mỹ thuật",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Chân dung cận với mái tóc màu đồng và chiếc kính tròng đỏ hạ thấp trên sống mũi. Các lớp chì mảnh diễn tả sợi tóc, ánh mắt và sắc da, đối lập với phần áo tối màu.",
    image: "/images/artworks/p1.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "p2",
    slug: "nu-cuoi-ao-xanh-p2",
    title: "Nụ cười áo xanh",
    artist: "DART Studio",
    price: 199000,
    category: "Portrait",
    medium: "Chì màu trên giấy mỹ thuật",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Chân dung người đàn ông đeo kính với nụ cười nhẹ, áo vest xanh và cà vạt kẻ chéo. Mái tóc điểm bạc cùng những lớp màu ấm trên gương mặt được thể hiện bằng nét chì tỉ mỉ.",
    image: "/images/artworks/p2.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "p3",
    slug: "chiec-no-do-p3",
    title: "Chiếc nơ đỏ",
    artist: "DART Studio",
    price: 239000,
    category: "Portrait",
    medium: "Chì màu trên giấy mỹ thuật",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Chân dung em bé với đôi mắt mở to, mái tóc đen và chiếc nơ đỏ. Màu áo đồng điệu với nơ, trong khi phần cổ ren trắng và những lớp màu da nhẹ tạo cảm giác mềm mại.",
    image: "/images/artworks/p3.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "p7",
    slug: "hoa-ben-mai-toc-p7",
    title: "Hoa bên mái tóc",
    artist: "DART Studio",
    price: 259000,
    category: "Portrait",
    medium: "Chì màu trên giấy mỹ thuật",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Chân dung góc ba phần tư với mái tóc đen búi thấp và nhành hoa trắng hồng bên tai. Sắc da, đôi môi và những lọn tóc buông được diễn tả nhẹ nhàng bằng các lớp chì màu.",
    image: "/images/artworks/p7.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "p8",
    slug: "khoanh-khac-ngot-ngao-p8",
    title: "Khoảnh khắc ngọt ngào",
    artist: "DART Studio",
    price: 269000,
    category: "Portrait",
    medium: "Chì màu trên giấy mỹ thuật",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Chân dung với kính tròn, mái tóc nâu đỏ và chiếc đĩa tráng miệng được nâng trên tay. Tông áo sáng làm nổi bật mái tóc và biểu cảm vui nhẹ trong một khoảnh khắc đời thường.",
    image: "/images/artworks/p8-d439bf16.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "shoes-vietnam",
    slug: "giay-ve-tay-viet-nam",
    title: "Việt Nam trên từng bước chân",
    artist: "DART Studio",
    price: 249000,
    category: "Custom Concept",
    medium: "Vẽ tay trên giày",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Đôi giày trắng được vẽ tay với chữ Việt Nam ở mũi giày, Chợ Bến Thành, phố Hội An và kiến trúc cung đình ở hai bên. Năm góc chụp ghi lại các chi tiết của cùng một sản phẩm đặt riêng đã bàn giao.",
    image: "/images/artworks/giay-viet-nam-5.webp",
    images: [
      "/images/artworks/giay-viet-nam-5.webp",
      "/images/artworks/giay-viet-nam-1.webp",
      "/images/artworks/giay-viet-nam-2.webp",
      "/images/artworks/giay-viet-nam-3.webp",
      "/images/artworks/giay-viet-nam-4.webp",
    ],
    available: false,
    status: "delivered",
  },
  {
    id: "golf",
    slug: "gay-golf-ve-tay",
    title: "Dấu ấn trên đầu gậy golf",
    artist: "DART Studio",
    price: 349000,
    category: "Custom Concept",
    medium: "Vẽ tay trên đầu gậy golf",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Đầu gậy golf được vẽ nhân vật tóc xanh trên nền trời và dòng chữ Tôi yêu Việt Nam bằng sắc vàng, đỏ. Hai ảnh cho thấy các mặt của cùng một sản phẩm đặt riêng đã bàn giao.",
    image: "/images/artworks/gay-golf-1.webp",
    images: [
      "/images/artworks/gay-golf-1.webp",
      "/images/artworks/gay-golf-2.webp",
    ],
    available: false,
    status: "delivered",
  },
  {
    id: "akaza",
    slug: "akaza",
    title: "Akaza",
    artist: "DART Studio",
    price: null,
    category: "Character Illustration",
    medium: "Chì màu trên giấy nâu",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Gương mặt Akaza được thể hiện với những vệt màu xanh tím, đôi mắt vàng và viền đỏ rực. Phần tóc còn ở dạng nét phác, để ánh nhìn và biểu cảm trở thành trọng tâm trên nền giấy nâu. Liên hệ DART để được báo giá.",
    image: "/images/artworks/akaza.webp",
    available: false,
    status: "inquiry",
  },
  {
    id: "raiden",
    slug: "raiden",
    title: "Raiden",
    artist: "DART Studio",
    price: null,
    category: "Character Illustration",
    medium: "Chì màu trên giấy nâu",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Góc nghiêng của Raiden hiện lên với sắc tím ở mắt, tóc và chi tiết vũ khí. Các vùng màu được đặt cạnh những đường chì phác và nét trắng trên giấy nâu, giữ lại dấu vết của quá trình vẽ. Liên hệ DART để được báo giá.",
    image: "/images/artworks/raiden.webp",
    available: false,
    status: "inquiry",
  },
  {
    id: "frieren",
    slug: "frieren",
    title: "Frieren",
    artist: "DART Studio",
    price: null,
    category: "Character Illustration",
    medium: "Minh họa màu trên giấy nâu",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Frieren với mái tóc bạc ánh tím, đôi tai nhọn và ánh mắt xanh trên nền giấy nâu. Trang phục sáng viền vàng cùng điểm nhấn đỏ ở vai làm nổi bật dáng đứng khoanh tay nhẹ nhàng.",
    image: "/images/artworks/frieren-1c2ac2f8.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "luffy",
    slug: "luffy",
    title: "Luffy",
    artist: "DART Studio",
    price: null,
    category: "Character Illustration",
    medium: "Bút bi xanh trên giấy",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Luffy bật lên trong tư thế chiến đấu với nụ cười rộng, nắm tay giơ cao và chiếc mũ rơm phía sau đầu. Những lớp nét bút xanh đan dày tạo khối cho trang phục, xen giữa các đường cong gợi chuyển động.",
    image: "/images/artworks/luffy-ce58a0a1.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "quilien",
    slug: "quilien",
    title: "Quilien",
    artist: "DART Studio",
    price: null,
    category: "Character Illustration",
    medium: "Bút bi xanh trên giấy",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Nhân vật mang giáp và mặt nạ được dựng bằng những lớp nét bút bi xanh. Mũ trụ góc cạnh, các đai chéo trước ngực và lưỡi vũ khí lớn tạo nên một dáng đứng mạnh mẽ, nhiều chi tiết.",
    image: "/images/artworks/quilien-8510a163.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "tokito-muichiro",
    slug: "tokito-muichiro",
    title: "Tokito Muichiro",
    artist: "DART Studio",
    price: null,
    category: "Character Illustration",
    medium: "Minh họa màu trên giấy",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Tokito Muichiro nâng thanh kiếm phía sau đầu, mái tóc dài chuyển từ đen sang xanh ngọc bay sang một bên. Tông màu dịu trên nền giấy ấm làm nổi bật ánh mắt và tư thế cầm kiếm.",
    image: "/images/artworks/tokito-muichiro-9be4ae2c.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "veres-kimono",
    slug: "veres-kimono",
    title: "Veres — Kimono",
    artist: "DART Studio",
    price: null,
    category: "Character Illustration",
    medium: "Chì graphite trên giấy",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Chân dung Veres với chiếc kính, mái tóc dài và phụ kiện tóc có đường nét đối xứng. Các lớp chì đậm nhạt diễn tả gương mặt, cổ áo và những nếp vải đan chéo ở phần dưới bố cục.",
    image: "/images/artworks/veres-kimono-ab6a0257.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "nu-cuoi-ao-vang",
    slug: "nu-cuoi-ao-vang",
    title: "Nụ cười áo vàng",
    artist: "DART Studio",
    price: null,
    category: "Portrait",
    medium: "Chì màu trên giấy",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Em bé mỉm cười trong bộ trang phục vàng kem với phần cổ áo đỏ nâu và khăn đội đầu đồng điệu. Những lớp màu ấm trên má, môi và nếp vải giữ lại vẻ rạng rỡ của khoảnh khắc.",
    image: "/images/artworks/nu-cuoi-ao-vang-c0a586d6.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "net-diu-dang",
    slug: "net-diu-dang",
    title: "Nét dịu dàng",
    artist: "DART Studio",
    price: null,
    category: "Portrait",
    medium: "Chì màu trên giấy",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Chân dung cô gái tóc dài trong chiếc áo trắng, với ánh nhìn nhẹ và sắc hồng thoáng trên má. Mái tóc tối màu được tỉa bằng những nét mảnh, tạo tương phản với gương mặt và nền giấy sáng.",
    image: "/images/artworks/net-diu-dang-3ff2cb1b.webp",
    available: false,
    status: "delivered",
  },
];
