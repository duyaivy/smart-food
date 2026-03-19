export type LegalBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'bullets';
      items: string[];
    };

export type LegalSubsection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocumentSection = {
  id: string;
  title: string;
  meta: {
    effectiveDate: string;
    operator: string;
    contact: string;
    contactLabel?: string;
  };
  subsections: LegalSubsection[];
};

export const LEGAL_SECTIONS: LegalDocumentSection[] = [
  {
    id: '1',
    title: 'Điều khoản sử dụng SmartFood',
    meta: {
      effectiveDate: '[dd/mm/yyyy]',
      operator: '[Tên công ty/nhóm phát triển]',
      contact: '[email hỗ trợ]',
    },
    subsections: [
      {
        id: '1.1',
        title: 'Giới thiệu',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood là ứng dụng hỗ trợ người dùng quản lý thực phẩm thông qua:',
          },
          {
            type: 'bullets',
            items: [
              'Lưu trữ thông tin thực phẩm trong tủ lạnh ảo.',
              'Kết nối với cân thông minh để đo khối lượng thực phẩm.',
              'Ước tính lượng calo dựa trên dữ liệu thực phẩm và khối lượng đo được.',
              'Gợi ý món ăn dựa trên nguyên liệu hiện có trong tủ lạnh ảo.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Khi sử dụng SmartFood, bạn đồng ý với các điều khoản dưới đây.',
          },
        ],
      },
      {
        id: '1.2',
        title: 'Điều kiện sử dụng',
        blocks: [
          {
            type: 'paragraph',
            text: 'Người dùng cam kết:',
          },
          {
            type: 'bullets',
            items: [
              'Cung cấp thông tin chính xác khi đăng ký tài khoản.',
              'Sử dụng ứng dụng đúng mục đích cá nhân, hợp pháp.',
              'Không can thiệp, phá hoại, sao chép trái phép hoặc làm gián đoạn hoạt động của ứng dụng và thiết bị cân thông minh.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Nếu người dùng dưới [13/16/18] tuổi, việc sử dụng cần có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp.',
          },
        ],
      },
      {
        id: '1.3',
        title: 'Tài khoản người dùng',
        blocks: [
          {
            type: 'paragraph',
            text: 'Người dùng có trách nhiệm:',
          },
          {
            type: 'bullets',
            items: [
              'Bảo mật tài khoản, mật khẩu và thiết bị đăng nhập.',
              'Thông báo ngay cho SmartFood khi phát hiện truy cập trái phép.',
              'Chịu trách nhiệm đối với các hoạt động phát sinh từ tài khoản của mình.',
            ],
          },
          {
            type: 'paragraph',
            text: 'SmartFood có quyền tạm khóa hoặc chấm dứt tài khoản nếu phát hiện hành vi vi phạm điều khoản hoặc gây ảnh hưởng đến hệ thống.',
          },
        ],
      },
      {
        id: '1.4',
        title: 'Chức năng của ứng dụng',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood cung cấp các tính năng sau:',
          },
          {
            type: 'bullets',
            items: [
              'Tủ lạnh ảo: cho phép người dùng nhập, cập nhật, theo dõi thực phẩm đang có.',
              'Kết nối cân thông minh: nhận dữ liệu khối lượng thực phẩm từ thiết bị tương thích.',
              'Ước tính calo: tính toán giá trị năng lượng dựa trên khối lượng thực phẩm và cơ sở dữ liệu dinh dưỡng.',
              'Gợi ý món ăn: đề xuất công thức hoặc món ăn dựa trên nguyên liệu hiện có và thông tin người dùng cung cấp.',
            ],
          },
        ],
      },
      {
        id: '1.5',
        title: 'Giới hạn về độ chính xác',
        blocks: [
          {
            type: 'paragraph',
            text: 'Người dùng hiểu và đồng ý rằng:',
          },
          {
            type: 'bullets',
            items: [
              'Dữ liệu calo, dinh dưỡng và gợi ý món ăn trên SmartFood chỉ mang tính tham khảo.',
              'Kết quả có thể sai lệch do khối lượng đo, loại thực phẩm, cách chế biến, thương hiệu, độ tươi sống, sai số thiết bị hoặc dữ liệu người dùng nhập vào.',
              'SmartFood không phải là công cụ chẩn đoán y tế, thiết bị y tế hay dịch vụ tư vấn dinh dưỡng chuyên môn.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Người dùng không nên sử dụng SmartFood như cơ sở duy nhất cho quyết định điều trị, ăn kiêng nghiêm ngặt hoặc kiểm soát bệnh lý. Với các trường hợp sức khỏe đặc biệt, cần tham khảo bác sĩ hoặc chuyên gia dinh dưỡng.',
          },
        ],
      },
      {
        id: '1.6',
        title: 'Nghĩa vụ của người dùng',
        blocks: [
          {
            type: 'paragraph',
            text: 'Người dùng cam kết không:',
          },
          {
            type: 'bullets',
            items: [
              'Nhập dữ liệu sai lệch nhằm đánh lừa hệ thống.',
              'Sử dụng ứng dụng cho mục đích vi phạm pháp luật.',
              'Sao chép, chỉnh sửa, bán lại, cho thuê hoặc khai thác thương mại trái phép ứng dụng.',
              'Dùng công cụ tự động để truy cập trái phép, quét dữ liệu hoặc làm quá tải hệ thống.',
            ],
          },
        ],
      },
      {
        id: '1.7',
        title: 'Quyền sở hữu trí tuệ',
        blocks: [
          {
            type: 'paragraph',
            text: 'Toàn bộ nội dung thuộc SmartFood bao gồm nhưng không giới hạn:',
          },
          {
            type: 'bullets',
            items: [
              'Tên ứng dụng, logo, giao diện.',
              'Thuật toán gợi ý.',
              'Dữ liệu được biên soạn bởi hệ thống.',
              'Mã nguồn, thiết kế, tài liệu kỹ thuật.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Các nội dung nêu trên đều thuộc quyền sở hữu của [Tên công ty/nhóm phát triển] hoặc bên cấp phép liên quan. Người dùng không được sử dụng trái phép các tài sản này.',
          },
        ],
      },
      {
        id: '1.8',
        title: 'Nội dung do người dùng cung cấp',
        blocks: [
          {
            type: 'paragraph',
            text: 'Người dùng giữ quyền đối với dữ liệu do mình nhập vào, như:',
          },
          {
            type: 'bullets',
            items: [
              'Danh sách thực phẩm.',
              'Lịch sử cân đo.',
              'Ghi chú cá nhân.',
              'Sở thích ăn uống.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Tuy nhiên, người dùng đồng ý cho SmartFood quyền xử lý dữ liệu đó để:',
          },
          {
            type: 'bullets',
            items: [
              'Vận hành ứng dụng.',
              'Đồng bộ tài khoản.',
              'Tính toán calo.',
              'Tạo gợi ý món ăn.',
              'Cải thiện trải nghiệm và chất lượng dịch vụ theo Chính sách bảo mật.',
            ],
          },
        ],
      },
      {
        id: '1.9',
        title: 'Thiết bị và kết nối',
        blocks: [
          {
            type: 'paragraph',
            text: 'Một số tính năng của SmartFood chỉ hoạt động khi:',
          },
          {
            type: 'bullets',
            items: [
              'Có kết nối internet ổn định.',
              'Cân thông minh tương thích và hoạt động đúng cách.',
              'Bluetooth hoặc các phương thức kết nối cần thiết được bật.',
            ],
          },
          {
            type: 'paragraph',
            text: 'SmartFood không chịu trách nhiệm nếu dịch vụ bị ảnh hưởng do:',
          },
          {
            type: 'bullets',
            items: [
              'Lỗi phần cứng.',
              'Pin yếu.',
              'Mất mạng.',
              'Lỗi hệ điều hành.',
              'Lỗi từ dịch vụ bên thứ ba.',
            ],
          },
        ],
      },
      {
        id: '1.10',
        title: 'Giới hạn trách nhiệm',
        blocks: [
          {
            type: 'paragraph',
            text: 'Trong phạm vi pháp luật cho phép, SmartFood không chịu trách nhiệm đối với:',
          },
          {
            type: 'bullets',
            items: [
              'Thiệt hại phát sinh từ việc người dùng dựa hoàn toàn vào dữ liệu calo hoặc gợi ý món ăn.',
              'Sai lệch dữ liệu từ cân thông minh hoặc từ thông tin do người dùng nhập.',
              'Mất mát dữ liệu do lỗi khách quan, sự cố kỹ thuật hoặc hành vi trái phép ngoài tầm kiểm soát hợp lý.',
            ],
          },
        ],
      },
      {
        id: '1.11',
        title: 'Tạm ngừng hoặc chấm dứt dịch vụ',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood có thể tạm ngừng, thay đổi hoặc chấm dứt một phần/toàn bộ dịch vụ để:',
          },
          {
            type: 'bullets',
            items: [
              'Bảo trì hệ thống.',
              'Nâng cấp tính năng.',
              'Xử lý lỗi.',
              'Tuân thủ quy định pháp luật.',
              'Ngăn chặn hành vi lạm dụng.',
            ],
          },
        ],
      },
      {
        id: '1.12',
        title: 'Cập nhật điều khoản',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood có thể sửa đổi điều khoản theo từng thời điểm. Phiên bản mới sẽ được đăng trong ứng dụng hoặc website kèm ngày hiệu lực. Việc tiếp tục sử dụng sau khi điều khoản được cập nhật đồng nghĩa với việc người dùng chấp nhận nội dung mới.',
          },
        ],
      },
      {
        id: '1.13',
        title: 'Luật áp dụng',
        blocks: [
          {
            type: 'paragraph',
            text: 'Điều khoản này được điều chỉnh theo pháp luật Việt Nam, trừ khi có thỏa thuận hoặc quy định khác bắt buộc áp dụng.',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Chính sách bảo mật SmartFood',
    meta: {
      effectiveDate: '[dd/mm/yyyy]',
      operator: '[Tên công ty/nhóm phát triển]',
      contact: '[email]',
      contactLabel: 'Liên hệ bảo mật',
    },
    subsections: [
      {
        id: '2.1',
        title: 'Mục đích',
        blocks: [
          {
            type: 'paragraph',
            text: 'Chính sách này giải thích cách SmartFood thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của người dùng khi sử dụng ứng dụng và cân thông minh đi kèm.',
          },
        ],
      },
      {
        id: '2.2',
        title: 'Dữ liệu SmartFood thu thập',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood có thể thu thập các nhóm dữ liệu sau:',
          },
          {
            type: 'bullets',
            items: [
              'Thông tin tài khoản: họ tên hoặc tên hiển thị; email, số điện thoại; mật khẩu đã mã hóa; thông tin đăng nhập hoặc định danh tài khoản.',
              'Dữ liệu sử dụng ứng dụng: danh sách thực phẩm trong tủ lạnh ảo; lịch sử thêm/sửa/xóa; món ăn đã xem hoặc lưu; lịch sử gợi ý; tùy chọn, sở thích ăn uống, chế độ ăn.',
              'Dữ liệu từ cân thông minh: khối lượng thực phẩm đo được; thời gian đo; mã hoặc thông tin thiết bị; trạng thái kết nối thiết bị.',
              'Dữ liệu tính toán dinh dưỡng: lượng calo ước tính; thông tin dinh dưỡng suy ra; lịch sử phân tích thực phẩm.',
              'Dữ liệu kỹ thuật: loại thiết bị, hệ điều hành; địa chỉ IP; log lỗi, nhật ký hoạt động; Bluetooth hoặc dữ liệu kết nối cần thiết để ghép nối cân thông minh.',
            ],
          },
        ],
      },
      {
        id: '2.3',
        title: 'Mục đích sử dụng dữ liệu',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood sử dụng dữ liệu để:',
          },
          {
            type: 'bullets',
            items: [
              'Tạo và quản lý tài khoản người dùng.',
              'Lưu trữ tủ lạnh ảo.',
              'Kết nối và đồng bộ với cân thông minh.',
              'Tính toán calo và thông tin dinh dưỡng.',
              'Gợi ý món ăn phù hợp với nguyên liệu hiện có.',
              'Cá nhân hóa trải nghiệm.',
              'Cải thiện thuật toán đề xuất.',
              'Hỗ trợ kỹ thuật, xử lý lỗi và bảo mật hệ thống.',
              'Gửi thông báo liên quan đến dịch vụ, nếu người dùng cho phép.',
            ],
          },
        ],
      },
      {
        id: '2.4',
        title: 'Cơ sở xử lý dữ liệu',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood xử lý dữ liệu dựa trên một hoặc nhiều căn cứ sau:',
          },
          {
            type: 'bullets',
            items: [
              'Sự đồng ý của người dùng.',
              'Nhu cầu thực hiện dịch vụ mà người dùng yêu cầu.',
              'Nghĩa vụ pháp lý.',
              'Lợi ích hợp pháp để vận hành, bảo mật và cải tiến sản phẩm.',
            ],
          },
        ],
      },
      {
        id: '2.5',
        title: 'Dữ liệu sức khỏe và dinh dưỡng',
        blocks: [
          {
            type: 'paragraph',
            text: 'Thông tin về thực phẩm tiêu thụ, lượng calo ước tính hoặc chế độ ăn có thể được xem là dữ liệu nhạy cảm trong một số bối cảnh. SmartFood cam kết:',
          },
          {
            type: 'bullets',
            items: [
              'Chỉ xử lý dữ liệu này để cung cấp chức năng của ứng dụng.',
              'Không bán dữ liệu cá nhân nhạy cảm cho bên thứ ba.',
              'Áp dụng biện pháp bảo mật phù hợp để bảo vệ dữ liệu.',
            ],
          },
        ],
      },
      {
        id: '2.6',
        title: 'Chia sẻ dữ liệu với bên thứ ba',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood có thể chia sẻ dữ liệu trong các trường hợp cần thiết sau:',
          },
          {
            type: 'bullets',
            items: [
              'Nhà cung cấp hạ tầng lưu trữ, máy chủ, phân tích lỗi.',
              'Đơn vị cung cấp dịch vụ xác thực hoặc gửi email/thông báo.',
              'Cơ quan nhà nước có thẩm quyền khi pháp luật yêu cầu.',
              'Bên nhận chuyển giao hợp pháp trong trường hợp sáp nhập, mua bán doanh nghiệp hoặc tái cấu trúc.',
            ],
          },
          {
            type: 'paragraph',
            text: 'SmartFood không chia sẻ dữ liệu cá nhân của người dùng cho mục đích thương mại trái với chính sách này nếu chưa có sự đồng ý phù hợp.',
          },
        ],
      },
      {
        id: '2.7',
        title: 'Lưu trữ dữ liệu',
        blocks: [
          {
            type: 'paragraph',
            text: 'Dữ liệu được lưu trữ trong khoảng thời gian cần thiết để:',
          },
          {
            type: 'bullets',
            items: [
              'Cung cấp dịch vụ.',
              'Đáp ứng nghĩa vụ pháp lý.',
              'Giải quyết tranh chấp.',
              'Ngăn chặn gian lận và bảo vệ hệ thống.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Khi không còn cần thiết, dữ liệu sẽ được xóa, ẩn danh hoặc hủy theo quy trình phù hợp.',
          },
        ],
      },
      {
        id: '2.8',
        title: 'Bảo mật dữ liệu',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood áp dụng các biện pháp bảo mật hợp lý, bao gồm:',
          },
          {
            type: 'bullets',
            items: [
              'Mã hóa dữ liệu nhạy cảm khi truyền và/hoặc lưu trữ.',
              'Kiểm soát truy cập nội bộ.',
              'Phân quyền đối với nhân sự có liên quan.',
              'Ghi nhận nhật ký truy cập và giám sát rủi ro.',
              'Sao lưu và phục hồi dữ liệu trong giới hạn phù hợp.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Tuy nhiên, không có hệ thống nào an toàn tuyệt đối. Người dùng cần tự bảo vệ tài khoản và thiết bị cá nhân của mình.',
          },
        ],
      },
      {
        id: '2.9',
        title: 'Quyền của người dùng',
        blocks: [
          {
            type: 'paragraph',
            text: 'Người dùng có thể có các quyền sau, tùy theo quy định pháp luật áp dụng:',
          },
          {
            type: 'bullets',
            items: [
              'Quyền biết dữ liệu nào đang được thu thập.',
              'Quyền yêu cầu truy cập, chỉnh sửa hoặc cập nhật dữ liệu.',
              'Quyền yêu cầu xóa tài khoản hoặc dữ liệu cá nhân.',
              'Quyền rút lại sự đồng ý đối với một số hoạt động xử lý.',
              'Quyền phản đối hoặc hạn chế một số hình thức xử lý dữ liệu.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Người dùng có thể gửi yêu cầu qua [email hỗ trợ].',
          },
        ],
      },
      {
        id: '2.10',
        title: 'Quyền riêng tư của trẻ em',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood không cố ý thu thập dữ liệu của trẻ em dưới độ tuổi luật định nếu không có sự đồng ý của cha mẹ hoặc người giám hộ. Nếu phát hiện dữ liệu được cung cấp không phù hợp, SmartFood có thể xóa hoặc hạn chế xử lý dữ liệu đó.',
          },
        ],
      },
      {
        id: '2.11',
        title: 'Cookie và công nghệ tương tự',
        blocks: [
          {
            type: 'paragraph',
            text: 'Nếu SmartFood có website hoặc dịch vụ web đi kèm, hệ thống có thể sử dụng cookie hoặc công nghệ tương tự để:',
          },
          {
            type: 'bullets',
            items: [
              'Duy trì phiên đăng nhập.',
              'Ghi nhớ tùy chọn.',
              'Đo lường hiệu suất.',
              'Cải thiện trải nghiệm người dùng.',
            ],
          },
        ],
      },
      {
        id: '2.12',
        title: 'Chuyển dữ liệu quốc tế',
        blocks: [
          {
            type: 'paragraph',
            text: 'Trong trường hợp hạ tầng lưu trữ hoặc nhà cung cấp dịch vụ đặt ngoài lãnh thổ Việt Nam, dữ liệu có thể được xử lý ở quốc gia khác. SmartFood sẽ áp dụng biện pháp phù hợp để bảo vệ dữ liệu theo quy định hiện hành.',
          },
        ],
      },
      {
        id: '2.13',
        title: 'Cập nhật chính sách',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood có thể cập nhật Chính sách bảo mật khi cần thiết. Bản cập nhật sẽ được công bố trong ứng dụng hoặc kênh chính thức, kèm ngày hiệu lực mới.',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Điều khoản bổ sung khuyến nghị cho SmartFood',
    meta: {
      effectiveDate: '[dd/mm/yyyy]',
      operator: '[Tên công ty/nhóm phát triển]',
      contact: '[email hỗ trợ]',
    },
    subsections: [
      {
        id: '3.1',
        title: 'Điều khoản về dữ liệu cân đo',
        blocks: [
          {
            type: 'paragraph',
            text: 'Nên ghi rõ:',
          },
          {
            type: 'bullets',
            items: [
              'Cân thông minh chỉ hỗ trợ đo khối lượng, không xác minh chính xác 100% loại thực phẩm.',
              'Trường hợp người dùng nhập sai tên món, hệ thống có thể cho ra calo sai.',
              'Dữ liệu đo có thể bị ảnh hưởng bởi mặt phẳng đặt cân, độ ổn định, pin, nhiệt độ, rung lắc.',
            ],
          },
        ],
      },
      {
        id: '3.2',
        title: 'Điều khoản về gợi ý món ăn',
        blocks: [
          {
            type: 'paragraph',
            text: 'Nên ghi rõ:',
          },
          {
            type: 'bullets',
            items: [
              'Gợi ý món ăn được tạo tự động từ nguyên liệu hiện có.',
              'SmartFood không đảm bảo món ăn phù hợp với dị ứng, bệnh lý hoặc nhu cầu dinh dưỡng đặc biệt nếu người dùng không khai báo đầy đủ.',
              'Người dùng tự kiểm tra nguyên liệu, hạn sử dụng và an toàn thực phẩm trước khi chế biến.',
            ],
          },
        ],
      },
      {
        id: '3.3',
        title: 'Điều khoản về thực phẩm hết hạn',
        blocks: [
          {
            type: 'paragraph',
            text: 'Vì có “tủ lạnh ảo”, nên thêm:',
          },
          {
            type: 'bullets',
            items: [
              'SmartFood chỉ nhắc nhở hoặc hỗ trợ theo dõi hạn dùng nếu người dùng nhập dữ liệu tương ứng.',
              'Ứng dụng không chịu trách nhiệm về chất lượng, độ an toàn hay tình trạng thực phẩm thực tế ngoài đời.',
            ],
          },
        ],
      },
      {
        id: '3.4',
        title: 'Điều khoản miễn trừ y tế',
        blocks: [
          {
            type: 'paragraph',
            text: 'SmartFood không phải ứng dụng y tế, không thay thế bác sĩ, chuyên gia dinh dưỡng hoặc tư vấn điều trị.',
          },
        ],
      },
    ],
  },
];
