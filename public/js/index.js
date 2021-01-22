$(document).ready(() => {
  const inputModal = $('#input-modal')
  const inputModalWrap = $('#input-modal-wrap')
  const openModalBtn = $('#open-modal-btn')
  const closeModalBtn = $('#close-modal-btn')
  const saveBtn = $('#save-btn')
  const titleInput = $('#article-title')
  const authorInput = $('#article-author')
  const contentsInput = $('#article-contents')

  const commentsBtn = $('.button-comment')
  const commentSaveBtn = $('#save-comment-btn')
  const commentsCloseBtn = $('#close-comment-modal-btn')
  const commentsWrap = $('#comments')
  const commentModal = $('#comment-modal')
  const commentModalWrap = $('#comment-modal-wrap')
  const commentName = $('#comment-author')
  const commentContents = $('#comment-contents')

  const likeBtn = $('.button-like')

  const likedArticles = localStorage.getItem('liked') ? JSON.parse(localStorage.getItem('liked')) : []

  const openInputModal = () => {
    inputModal.modal('toggle')
    inputModalWrap.show()
    inputModal.removeAttr("style")
  }

  const closeInputModal = () => {
    inputModal.modal('toggle')
    inputModalWrap.hide()

    titleInput.val('')
    authorInput.val('')
    contentsInput.val('')
  }

  const validate = (value, type) => {
    if (!value || value.length < 1) {
      console.log('error-' + type)
      $('.error-' + type).removeClass('hide')

      console.log($('error-' + type))
      return false
    }

    $('.error-' + type).removeClass('hide').addClass('hide')

    return value
  }

  const openCommentModal = () => {
    commentModal.modal('toggle')
    commentModalWrap.show()
    commentModal.removeAttr("style")
  }

  const closeCommentModal = () => {
    commentModal.modal('toggle')
    commentModalWrap.hide()

    commentName.val('')
    commentContents.val('')

    commentSaveBtn.data('articleId', '')
  }

  function loadComments() {
    const id = $(this).data('articleId')
    commentSaveBtn.data('articleId', id)

    $.get(`/api/articles/${id}`, (data) => {
      const { result: { comments } } = data

      commentsWrap.empty()

      comments.forEach(comment => {
        commentsWrap.append(`<li class="list-group-item">
        <b>${comment.author}</b>
        <p>${comment.comment}</p>
        ${comment.date.toLocaleString()}</li>`)
      })

      openCommentModal()
    })
  }

  const saveArticle = () => {
    const title = validate(titleInput.val(), 'title')
    const author = validate(authorInput.val(), 'name')
    const contents = validate(contentsInput.val(), 'contents')

    if (!title || !author || !contents) return

    $.post('/api/articles', {
      title,
      author,
      contents
    }, (data, status) => {
        console.log({ data, status })
        closeInputModal()
        location.reload()
    })
  }

  function saveComments() {
    const articleId = $(this).data('articleId')
    const author = validate(commentName.val(), 'comment-name')
    const comment = validate(commentContents.val(), 'comment')

    if (!author || !comment) return

    $.post(`/api/articles/${articleId}/comment`, {
      author,
      comment
    }, (data, status) => {
        console.log({ data, status })
        closeCommentModal()
        location.reload()
    })
  }

  function renderLiked() {
    const articleId = $(this).data('articleId')

    const isLiked = likedArticles.find(id => id === articleId)

    $(this).append(
      isLiked ?
        `<i class="bi bi-heart-fill" style="font-size: 1.5rem; color: red;"></i>` :
        `<i class="bi bi-heart" style="font-size: 1.5rem;"></i>`
    )
  }

  function toggleLiked() {
    const articleId = $(this).data('articleId')

    const likedIndex = likedArticles.findIndex(id => id === articleId)

    $.get(`/api/articles/${articleId}`, (data) => {
      const { result: { liked } } = data

      $.post(`/api/articles/${articleId}/like`, {
        liked: likedIndex > -1 ? liked - 1 : liked + 1
      }, (data, status) => {
          console.log({ data, status })

          if (likedIndex > -1) {
            likedArticles.splice(likedIndex, 1)
          } else {
            likedArticles.push(articleId)
          }

          localStorage.setItem('liked', JSON.stringify(likedArticles))

          location.reload()
      })
    })
  }

  openModalBtn.on('click', openInputModal)
  closeModalBtn.on('click', closeInputModal)

  saveBtn.on('click', saveArticle)

  commentsBtn.on('click', loadComments)
  commentSaveBtn.on('click', saveComments)
  commentsCloseBtn.on('click', closeCommentModal)

  likeBtn.each(renderLiked)
  likeBtn.on('click', toggleLiked)
})