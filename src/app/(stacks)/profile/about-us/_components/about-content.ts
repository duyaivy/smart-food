export type AboutBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'bullets';
      items: string[];
    };

export type AboutSubsection = {
  id: string;
  title: string;
  blocks: AboutBlock[];
};

export type AboutDocumentSection = {
  id: string;
  title: string;
  meta: {
    project: string;
    school: string;
    course: string;
    contact?: string;
    contactLabel?: string;
  };
  subsections: AboutSubsection[];
};

export const ABOUT_SECTIONS: AboutDocumentSection[] = [
  {
    id: 'about-1',
    title: 'Về SmartFood',
    meta: {
      project: 'Đồ án SmartFood',
      school: 'Trường Đại học Bách khoa - Đại học Đà Nẵng',
      course: 'PBL5',
      contact: '[email hỗ trợ hoặc email nhóm]',
      contactLabel: 'Liên hệ',
    },
    subsections: [
      {
        id: 'about-1.1',
        title: 'SmartFood là gì?',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood là một ứng dụng hỗ trợ người dùng quản lý thực phẩm thông minh và xây dựng thói quen ăn uống khoa học hơn trong đời sống hằng ngày.',
          },
          {
            type: 'paragraph',
            text: 'Ứng dụng kết hợp giữa phần mềm quản lý thực phẩm và cân thông minh, cho phép người dùng theo dõi nguyên liệu đang có, ước tính lượng calo dựa trên khối lượng thực phẩm và gợi ý món ăn phù hợp từ những nguyên liệu sẵn có trong tủ lạnh ảo.',
          },
        ],
      },
      {
        id: 'about-1.2',
        title: 'Mục tiêu của dự án',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood được xây dựng với mong muốn giải quyết một số vấn đề phổ biến trong sinh hoạt hằng ngày liên quan đến việc quản lý thực phẩm và hỗ trợ lựa chọn bữa ăn phù hợp.',
          },
          {
            type: 'bullets',
            items: [
              'Giúp người dùng quản lý thực phẩm đang có trong nhà một cách thuận tiện hơn.',
              'Hạn chế lãng phí thực phẩm do quên sử dụng hoặc bảo quản không hiệu quả.',
              'Hỗ trợ người dùng ước tính lượng calo từ thực phẩm thông qua cân thông minh.',
              'Tiết kiệm thời gian lựa chọn món ăn bằng cách gợi ý món dựa trên nguyên liệu sẵn có.',
            ],
          },
        ],
      },
      {
        id: 'about-1.3',
        title: 'Các chức năng nổi bật',
        blocks: [
          {
            type: 'bullets',
            items: [
              'Tủ lạnh ảo: lưu trữ và quản lý danh sách thực phẩm mà người dùng hiện có.',
              'Kết nối cân thông minh: hỗ trợ ghi nhận khối lượng thực phẩm một cách trực tiếp.',
              'Ước tính calo: tính toán lượng calo dựa trên khối lượng thực phẩm đo được.',
              'Gợi ý món ăn: đề xuất các món ăn phù hợp từ nguyên liệu hiện có trong tủ lạnh ảo.',
            ],
          },
        ],
      },
      {
        id: 'about-1.4',
        title: 'Về nhóm phát triển',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood là một đồ án do sinh viên Trường Đại học Bách khoa - Đại học Đà Nẵng thực hiện במסגרת học phần PBL5.',
          },
          {
            type: 'paragraph',
            text: 'Dự án là sự kết hợp giữa kiến thức về phát triển phần mềm, xử lý dữ liệu, thiết kế hệ thống thông minh và xây dựng giải pháp có tính ứng dụng thực tế trong đời sống.',
          },
        ],
      },
      {
        id: 'about-1.5',
        title: 'Định hướng phát triển',
        blocks: [
          {
            type: 'paragraph',
            text: 'Trong tương lai, SmartFood có thể tiếp tục được mở rộng và cải thiện để mang lại trải nghiệm tốt hơn cho người dùng.',
          },
          {
            type: 'bullets',
            items: [
              'Theo dõi hạn sử dụng của thực phẩm.',
              'Cá nhân hóa chế độ ăn theo mục tiêu sức khỏe của từng người dùng.',
              'Đồng bộ dữ liệu trên nhiều thiết bị.',
              'Cải thiện độ chính xác trong phân tích dinh dưỡng và gợi ý món ăn.',
            ],
          },
        ],
      },
      {
        id: 'about-1.6',
        title: 'Lời cảm ơn',
        blocks: [
          {
            type: 'paragraph',
            text: 'Nhóm phát triển xin chân thành cảm ơn giảng viên hướng dẫn, nhà trường và các thành viên trong nhóm đã đồng hành trong quá trình nghiên cứu, thiết kế và hoàn thiện dự án SmartFood.',
          },
        ],
      },
    ],
  },
];
