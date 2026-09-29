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
    id: "cc1",
    slug: "hai-sac-thai-cc1",
    title: "Hai sắc thái",
    artist: "DART Studio",
    price: 79000,
    category: "Custom Concept",
    medium: "Chì graphite và màu nhẹ trên giấy",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Hai phác họa nữ trên cùng một trang giấy: một góc nghiêng với tóc búi và một gương mặt nhìn thẳng. Nét chì mảnh kết hợp những lớp màu xanh tím, hồng nhẹ làm rõ ánh mắt và các lọn tóc.",
    image: "/images/artworks/cc1.webp",
    available: true,
    status: "available",
  },
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
    id: "c2",
    slug: "cung-thu-tren-trang-vo-c2",
    title: "Cung thủ trên trang vở",
    artist: "DART Studio",
    price: 89000,
    category: "Character Illustration",
    medium: "Chì graphite trên giấy vở kẻ dòng",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Nhân vật tai nhọn trong tư thế giương cung, với tóc dài, trang phục nhiều lớp và ống tên phía sau. Nét chì trên giấy kẻ dòng giữ rõ từng chi tiết nhỏ của bộ trang phục và vũ khí.",
    image: "/images/artworks/c2.webp",
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
    image: "/images/artworks/c6.webp",
    available: false,
    status: "delivered",
  },
  {
    id: "c7",
    slug: "frieren-c7",
    title: "Frieren",
    artist: "DART Studio",
    price: 49000,
    category: "Character Illustration",
    medium: "Chì graphite trên giấy vở kẻ dòng",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Frieren với đôi tai nhọn, mái tóc dài, khuyên tai và chiếc vòng cổ có mặt đá. Nét chì thanh cùng các vùng bóng nhẹ giữ biểu cảm trầm tĩnh của nhân vật trên nền giấy kẻ dòng.",
    image: "/images/artworks/c7.webp",
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
    id: "p5",
    slug: "nu-cuoi-trong-trang-vo-p5",
    title: "Nụ cười trong trang vở",
    artist: "DART Studio",
    price: 69000,
    category: "Portrait",
    medium: "Chì graphite trên giấy vở kẻ dòng",
    dimensions: "Liên hệ để biết kích thước",
    description:
      "Gương mặt mỉm cười với bàn tay đặt nhẹ dưới cằm, được vẽ trên trang vở lò xo. Mái tóc tối và vùng bóng quanh mắt, má tạo tương phản với phần giấy sáng ở trán và gò má.",
    image: "/images/artworks/p5.webp",
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
    image: "/images/artworks/p8.webp",
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
];
