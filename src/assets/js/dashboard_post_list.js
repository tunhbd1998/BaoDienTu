/**
 * GLOBAL VARIABLES
 */
var postList = []
var currentPage = 1
var pageCount = 5
var postCountPerPage = 10

/**
 * FUNCTIONS
 */
function setEventForPagination(showStatus = false) {
  $('.pagination__item:not(.pagination__item-control)').click(function () {
    let chosenPage = parseInt($(this).attr('page'))
    if (chosenPage != currentPage) {
      choosePage(chosenPage, showStatus)
    }
  })
  $('.pagination__item-previous-button').click(function () {
    showPreviousPage(showStatus)
  })
  $('.pagination__item-next-button').click(function () {
    showNextPage(showStatus)
  })
}

function choosePage(pageNum, showStatus = false) {
  currentPage = pageNum
  $('.pagination__item-active').removeClass('pagination__item-active');
  $(`.pagination__item[page="${pageNum}"]`).addClass('pagination__item-active')
  showPostList(pageNum, showStatus)
}

function showPreviousPage(showStatus = false) {
  if (currentPage > 1) {
    choosePage(currentPage - 1, showStatus)
  }
}

function showNextPage(showStatus = false) {
  if (currentPage < pageCount) {
    choosePage(currentPage + 1, showStatus)
  }
}

function renderControlTooltip(postId, postIndex, container) {
  let control = document.createElement('td')
  $(control).addClass('post-list__cell')

  // edit button and delete button
  if (
    (currentDashboardPage === PAGES.DRAFT.id || currentDashboardPage === PAGES.REJECT.id)
    &&
    (userRule === USERS.WRITER || userRule === USERS.ADMIN)
  ) {
    // buttons container
    let controlTooltip = document.createElement('div')
    $(controlTooltip).addClass('control-tooltip')

    let controlButtons = document.createElement('div')
    $(controlButtons).addClass('control-buttons')

    // edit button
    let editControl = document.createElement('button')
    $(editControl).addClass('btn btn-light')
    $(editControl).text('Edit')
    $(editControl).click(function () {

    })
    $(controlButtons).append(editControl)

    // delete button
    let deleteControl = document.createElement('button')
    $(deleteControl).addClass('btn btn-light')
    $(deleteControl).text('Delete')
    $(deleteControl).click(function () {

    })
    $(controlButtons).append(deleteControl)

    $(controlTooltip).append(controlButtons)
    $(control).append(controlTooltip)

    // trigger icon for tooltip
    let controlIcon = document.createElement('img')
    $(controlIcon).addClass('control-icon')
    controlIcon.src = '../../media/statics/images/ic_more.png'
    
    $(controlIcon).mouseenter(function() {
      $(controlTooltip).show()

      $(controlTooltip).mouseenter(function() {
        $(controlTooltip).show()
      })
      $(controlTooltip).mouseleave(function() {
        $(controlTooltip).hide()
      })
    })
    $(controlIcon).mouseleave(function() {
      $(controlTooltip).hide()
    })
    // $(controlIcon).tooltip({
    //   html: true,
    //   animation: true,
    //   container,
    //   trigger: 'hover focus',
    //   title: controlButtons,
    //   placement: 'bottom',
    //   template:
    //     `<div class="tooltip control-tooltip" role="tooltip">
            
    //         <div class="tooltip-inner control-tooltip-inner">
    //         </div>
    //       </div>`
    // })

    $(control).append(controlIcon)
    // $(control).click(function(e) {
    //   console.log('ko')
    //   // e.stopPropagation()
      
    // })
  }

  return control
}

function showPostDetail(post) {
  currentPost = post

  $('#postDetailLabel').text(post.title)
  $('.postDetailModal-dialog-content-body').html(post.content)

  $('.postDetailModal-dialog-content-body').append('<div class="post-info"></div>')
  $('.post-info').append(`<div><b>Category:</b> ${post.category.category_name}</div>`)
  $('.post-info').append(`<div><b>Tags:</b> ${post.tags.join(', ')}</div>`)

  if (currentDashboardPage !== PAGES.DRAFT.id || (userRule !== USERS.ADMIN && userRule !== USERS.EDITOR)) {
    $('.save-btn').remove()
  }
  else {
    // Set event for save button
    $('.save-btn').click(function () {
      // do something

    })
  }
}

function showCheckingFunction() {
  if (currentDashboardPage === PAGES.DRAFT.id && userRule === USERS.ADMIN || userRule === USERS.EDITOR) {
    $('.postDetailModal-dialog-content-body').append(`<div class="post-checking"></div>`)

    $('.post-checking').append(
      `<div class="custom-control custom-radio">
        <input type="radio" id="isPublished" value="1" name="checking" class="custom-control-input">
        <label class="custom-control-label" for="isPublished">Allow to publish</label>
      </div>`
    )
    $('.post-checking').append('<input class="form-control" id="publishedDateInput" placeholder="Enter date to publish post">')
    $('#publishedDateInput').datepicker({
      defaultDate: new Date(),
      minDate: new Date(),
    });

    $('.post-checking').append(
      `<div class="custom-control custom-radio">
        <input type="radio" id="reject" value="0" name="checking" class="custom-control-input">
        <label class="custom-control-label" for="reject">Reject</label>
      </div>`
    )
    $('.post-checking').append(
      `<div class="form-group" id="whyRejectForm">
        <label for="whyReject">Why do you reject this post?</label>
        <textarea class="form-control bao-dien-tu-scrollbar" id="whyReject" rows="3"></textarea>
      </div>`
    )

    $('input[name="checking"]').change(function () {
      if ($(this).val() == 1) {
        $('#whyRejectForm').css('display', 'none')
        $('#publishedDateInput').css('display', 'block')
      }
      else {
        $('#whyRejectForm').css('display', 'block')
        $('#publishedDateInput').css('display', 'none')
      }
    })
  }


  //     <div class="custom-control custom-radio">
  //       <input type="radio" id="reject" name="customRadio" class="custom-control-input">
  //         <label class="custom-control-label" for="reject">Reject</label>
  // </div>
}

function showPostList(pageNum, showStatus = false) {
  var postListObj = $('.post-list__content')

  postListObj.html('')

  let startPos = postCountPerPage * (pageNum - 1)
  let endPos = postCountPerPage * pageNum
  endPos = endPos > postList.length ? postList.length : endPos
  
  if (showStatus) {
    for (let index = startPos; index < endPos; index++) {
      let postItem = $(
        `<tr class="post-list__row" data-toggle="modal" data-target="#postDetail">
        <td class="post-list__cell">${postList[index].title}</td>
        <td class="post-list__cell">${postList[index].category.category_name}</td>
        <td class="post-list__cell">
          ${
        (postList[index].author.pseudonym === undefined
          || postList[index].author.pseudonym === '')
          ? postList[index].author.name
          : postList[index].author.pseudonym
        }
        </td>
        <td class="post-list__cell">${postList[index].created_date}</td>
        <td class="post-list__cell">${postList[index].published_date}</td>
      </tr>`
      )

      postItem.append(renderControlTooltip(postList[index].id, index, postItem))
      postItem.click(function () {
        showPostDetail(postList[index])
        showCheckingFunction()
      })
      postListObj.append(postItem)
    }
  }
  else {
    for (let index = startPos; index < endPos; index++) {
      let postItem = $(
        `<tr class="post-list__row" data-toggle="modal" data-target="#postDetail">
        <td class="post-list__cell">${postList[index].title}</td>
        <td class="post-list__cell">${postList[index].category.category_name}</td>
        <td class="post-list__cell">
          ${
        (postList[index].author.pseudonym === undefined
          || postList[index].author.pseudonym === '')
          ? postList[index].author.name
          : postList[index].author.pseudonym
        }
        </td>
        <td class="post-list__cell">${postList[index].created_date}</td>

      </tr>`
      )

      postItem.append(renderControlTooltip(postList[index].id, index, postItem))
      postItem.click(function () {
        showPostDetail(postList[index])
        showCheckingFunction()
      })
      postListObj.append(postItem)
    }
  }

}

function generatePagination() {
  let pagination = $('.pagination ul')
  pageCount = Math.ceil(postList.length / postCountPerPage)

  // init
  pagination.html('')
  pagination.append(`
        <li class="pagination__item pagination__item-control pagination__item-previous-button">
        <i class="pagination-icon pagination-icon-arrow-left"></i>
      </li>
      `)
  for (let index = 1; index <= pageCount; index++) {
    pagination.append(`
            <li page="${index}" class="pagination__item">${index}</li>
        `)
  }
  pagination.append(`
        <li class="pagination__item pagination__item-control pagination__item-next-button">
        <i class="pagination-icon pagination-icon-arrow-right"></i>
      </li>
      `)
}

function loadPostList(showStatus = false) {
  postList = [
    {
      id: '0',
      title: 'Post 01 post 01 post 01 post 01 post 01 post 01 post 01 post 01 post 01 post 01 post 01',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01',
        category_name: 'Kinh Tế',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: `<div class="nn-text-post">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td>
              <img alt="1123101533" border="0" id="234821"
                src="https://image.nongnghiep.vn/upload/2019/4/17/1123101533.JPG" title="1123101533"></td>
          </tr>
          <tr>
            <td class="nn-tt-img">
              Hậu đang say sưa hát bài “Nếu tôi chết hãy chôn tôi với cây đàn guitar”</td>
          </tr>
        </tbody>
      </table>
      <p>
        Anh không chỉ đang hát, mà đang chìm vào âm nhạc, “cái phao” đã giúp đứa bé bị mù hẳn lúc mới 12 tuổi bởi
        căn bệnh “teo thần kinh thị giác” không bị chìm trong tuyệt vọng.</p>
      <p>
        Anh là Võ Minh Hậu (46 tuổi) ở phường Bình Định, TX An Nhơn ,Bình Định.
        &nbsp;</p>
      <h3>
        Tuổi thơ đen tối</h3>
      <p>
        Là con thứ 5 trong gia đình có 7 anh chị em ở phường Bình Định (TX An Nhơn, Bình Định). Từ thơ ấu, Hậu đã
        có cơ hội tiếp cận với âm nhạc mỗi ngày. Bởi 2 người anh của Hậu đều là nhạc công nức tiếng tài hoa ở địa
        phương.</p>
      <p>
        Anh Võ Minh Tuấn, cây guitar chủ đạo và anh Võ Minh Việt, tay trống không thể thay thế của phong trào văn
        nghệ quần chúng lúc bấy giờ.</p>
      <p>
        Mỗi ngày, những lúc 2 người anh luyện nhạc, Hậu cứ “đeo” theo 1 bên. Tiếng đàn, tiếng trống dần “ngấm” vào
        Hậu. Chẳng biết từ lúc nào, âm nhạc đã trở thành cuộc sống của đứa bé mới chỉ 7 – 8 tuổi.</p>
      <p>
        Cha mẹ, anh chị của Hậu thấy cậu bé “quấn quýt” với âm nhạc, ai cũng mong sau này Hậu sẽ trở thành 1 thành
        viên trong ban nhạc gia đình.</p>
      <p>
        Thế nhưng “đời không như là mơ”, anh trai của Hậu, tay trống Võ Minh Việt, bất ngờ phải vĩnh viễn giã từ
        niềm đam mê âm nhạc sau 1 tai nạn giao thông trong 1 lần đi chơi nhạc về ở cái tuổi 40.</p>
      <p>
        Từ khi căn nhà vắng tiếng trống của anh trai, Hậu buồn! Nhưng còn buồn hơn khi vừa lên 9 tuổi, đôi mắt của
        Hậu bỗng dưng không còn nhìn rõ sự vật, cha mẹ đưa Hậu đi khám thì mới biết cậu bé bị căn bệnh “teo thần
        kinh thị giác”. Hậu được gia đình đưa đi chữa trị khắp nơi, cả Đông Tây y, nhưng không có kết quả. Đến năm
        12 tuổi thì đôi mắt của Hậu mất ánh sáng hoàn toàn.</p>
      <p>
        “Đang bình thường bỗng trở thành trở thành đứa trẻ mù lòa, vô dụng, mọi đi đứng sinh hoạt đều phải nhờ đến
        cha mẹ, anh chị chăm sóc. Tuyệt vọng, đã nhiều lần tôi muốn tìm đến cái chết để được giải thoát, nhưng cha
        mẹ anh chị em luôn ở bên cạnh động viên. Khi ấy tôi lại nghĩ đến âm nhạc, dấn thân vào âm nhạc và chính âm
        nhạc đã vực dậy cuộc đời tôi”, Hậu tâm sự.</p>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td>
              <img alt="2123101751" border="0" id="234822"
                src="https://image.nongnghiep.vn/upload/2019/4/17/2123101751.JPG" title="2123101751"></td>
          </tr>
          <tr>
            <td class="nn-tt-img">
              Hậu sẽ đàn hát phục vụ khách du lịch khi có yêu cầu</td>
          </tr>
        </tbody>
      </table>
      <p>
        “Lúc chưa mù, tôi đã được anh Việt và anh Tuấn tập đánh trống và tập chơi đàn guitar. Sau khi mắt bị mù
        hẳn, vị trí chức năng từng cái trống trong giàn trống và vị trí những dây đàn trên cần đàn guitar vẫn còn
        in trong đầu, nhờ đó việc tập của tôi đỡ vất vả hơn những người bị mù bẩm sinh. Tuy nhiên, thời gian đầu
        tôi cũng gặp rất nhiều khó khăn, cặp dùi thi thoảng cứ gõ trật trống. Cầm đến cây guitar còn vất vả hơn
        nữa, vì 6 dây đàn đã nhỏ mà khoảng cách lại rất gần nhau, nên khi bấm dây này cứ lẫn dây kia, muốn bấm hợp
        âm này nhưng tay bấm nhầm nên tiếng đàn lạc điệu. Hơn nữa, vì không nhìn thấy được bài nhạc nên tôi phải
        “đọc” giai điệu, tiết tấu từng bài hát bằng trí nhớ và mày mò luyện tập cho đến khi thuộc”, Hậu kể.
        &nbsp;</p>
      <h3>
        Có công mài sắt…</h3>
      <p>
        Từ khi đôi mắt mất ánh sáng, Hậu rất ngại ra ngoài, cả ngày anh thui thủi ở nhà, phần nhiều thời gian dành
        cho âm nhạc, cho những loại nhạc cụ. Vậy nhưng, nếu đôi tay chỉ miệt mài mà trong người không có tố chất
        âm nhạc thì dẫu luyện tập chuyên cần đến mấy cũng khó thành công. Ngoài khổ luyện, năng khiếu âm nhạc
        chính là tố chất khiến chẳng bao lâu sau Hậu đạt được ước nguyện.</p>
      <p>
        Sau nhiều năm tháng miệt mài, nhạc cụ thành thạo đầu tiên của Hậu là trống. Về sau, 6 dây đàn guitar cũng
        không còn làm khó anh, ngón đàn của anh có thể “nhả” ra những giai điệu ngọt ngào chẳng thua người anh Võ
        Minh Tuấn.</p>
      <p>
        Tiếp đến, Hậu thử sức mình với cây đàn organ và anh cũng đã nhanh chóng làm chủ bàn phím. Đàn “chay” thôi
        cũng chán, Hậu bắt đầu luyện giọng hát. Chất giọng trầm ấm của anh được nội tâm tiếp sức, nên Hậu sở hữu
        được giọng hát rất truyền cảm, nhất là khi chuyển tải những tâm trạng buồn, những day dứt trong cuộc đời.
      </p>
      <p>
        Năm 18 tuổi, Hậu mong có 1 ngày được ôm đàn hát trên sân khấu. Giấc mơ ấy rồi cũng trở thành hiện thực.
        Trong 1 hội diễn văn nghệ quần chúng được tổ chức tại TP Quy Nhơn (Bình Định), Hậu được mời biểu diễn. Lần
        đầu lên sân khấu ấy đã tiếp thêm động lực cho Hậu bằng sự cổ vũ nhiệt thành của khán giả. Hậu đã chiếm
        được tình yêu của người yêu nghệ thuật.</p>
      <p>
        Năm 2006, Hậu trở thành “đứa con” trong “mái ấm” Trung tâm người khuyết tật Nguyễn Nga đóng trên địa bàn
        TP Quy Nhơn, trực thuộc Hội bảo trợ người khuyết tật và Bảo vệ quyền trẻ em tỉnh Bình Định. Tại đây, Hậu
        đã “truyền lửa” âm nhạc cho những đứa trẻ khuyết tật khác.</p>
      <p>
        Noi gương Hậu, những trẻ em khuyết tật tìm thấy được niềm vui và bước qua mặc cảm để hòa mình vào cuộc
        sống.</p>
      <p>
        Từ đó, Hậu tự tin góp mặt với nhiều chương trình văn nghệ. Những kỷ niệm đáng nhớ nhất với Hậu là vào năm
        2007, anh được vinh dự mời tham gia biểu diễn văn nghệ khắp cả nước trong gần 2 năm trời do Trung ương Hội
        bảo trợ Người tàn tật và Trẻ mồ côi tổ chức; tham gia cuộc thi Tiếng hát Karaoke năm 2009 do Liên đoàn lao
        động tỉnh Bình Định tổ chức và lọt vào Top 10; giải nhất đơn ca trong Hội trại Lý Công Uẩn do Câu lạc bộ
        Hoành Pháp Trẻ tổ chức tại khu du lịch Đại Nam (Bình Dương) năm 2010…</p>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td>
              <img alt="3123101877" border="0" id="234823"
                src="https://image.nongnghiep.vn/upload/2019/4/17/3123101877.jpg" title="3123101877"></td>
          </tr>
          <tr>
            <td class="nn-tt-img">
              2 tay Hậu “múa” trên bộ trống cổ truyền</td>
          </tr>
        </tbody>
      </table>
      <p>
        Hậu còn tích cực tham gia các hoạt động từ thiện, các hoạt động văn nghệ từ thiện ở chùa, các trung tâm
        trẻ mồ côi. Hậu không những là nhạc công, là giọng ca chính, mà anh còn phụ trách luôn phần tập những ca
        khúc cho cả nhóm. Thời gian gần đây, Hậu còn được nhiều quán cà phê nhạc sống mời về chơi guitar cho
        chương trình mỗi đêm, cả chơi nhạc đám cưới và phục vụ khách du lịch khi có yêu cầu.</p>
      <p>
        “Mỗi ngày được ôm đàn, được hát là hạnh phúc lắm rồi. Hơn nữa, những show chơi nhạc vừa được thỏa lòng đam
        mê, vừa cho tôi tiền để có thể tự chủ được phần nào cuộc sống của mình, không còn hoàn toàn lệ thuộc vào
        gia đình như trước đây”, Hậu bộc bạch.</p>

      <div class="nn-user-post">
        VŨ ĐÌNH THUNG
        <span></span>
      </div>
    </div>`
    },
    {
      id: '1',
      title: 'Post 02',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01.1',
        category_name: 'Nông nghiệp',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: 'Post 02',
    },
    {
      id: '2',
      title: 'Post 03',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01.2',
        category_name: 'Công nghiệp',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: 'Post 03'
    },
    {
      id: '3',
      title: 'Post 04',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ02',
        category_name: 'Xe',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: '',
    },
    {
      id: '4',
      title: 'Post 05',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ03',
        category_name: 'Xã hội',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
    {
      id: '5',
      title: 'Post 06',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ04',
        category_name: 'Pháp luật',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
    {
      id: '6',
      title: 'Post 07',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ05',
        category_name: 'Kinh Tế',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
    {
      id: '7',
      title: 'Post 08',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01',
        category_name: 'Kinh Tế',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
    {
      id: '8',
      title: 'Post 09',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01',
        category_name: 'Kinh Tế',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
    {
      id: '9',
      title: 'Post 10',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01',
        category_name: 'Kinh Tế',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
    {
      id: '10',
      title: 'Post 11',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01',
        category_name: 'Kinh Tế',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
    {
      id: '11',
      title: 'Post 12',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01',
        category_name: 'Kinh Tế',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
    {
      id: '12',
      title: 'Post 13',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01',
        category_name: 'Kinh Tế',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
    {
      id: '13',
      title: 'Post 14',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01',
        category_name: 'Kinh Tế',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
    {
      id: '14',
      title: 'Post 15',
      author: {
        name: 'Nguyen Huu Tu',
        pseudonym: '',
      },
      category: {
        category_id: 'categ01',
        category_name: 'Kinh Tế',
      },
      tags: ['trong trot', 'chan nuoi'],
      created_date: '2019/05/12',
      published_date: '2019/05/12',
      summary: '',
      content: ''
    },
  ]
  generatePagination()
  choosePage(1, showStatus)
}

/**
 * MAIN SCRIPT
 */


