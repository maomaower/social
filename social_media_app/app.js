// app.js – vanilla JS social media SPA

// ---------- Utility ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ---------- State ----------
let currentUser = localStorage.getItem('currentUser') || null;
let posts = JSON.parse(localStorage.getItem('posts') || '[]'); // each post: {id, author, content, likes: []}

// ---------- DOM References ----------
const navFeedBtn = $('#nav-feed');
const navProfileBtn = $('#nav-profile');
const navLoginBtn = $('#nav-login');
const feedView = $('#feed-view');
const profileView = $('#profile-view');
const authModal = $('#auth-modal');
const authTitle = $('#auth-title');
const authUsername = $('#auth-username');
const authSubmit = $('#auth-submit');
const authClose = $('#auth-close');
const postContent = $('#post-content');
const postSubmit = $('#post-submit');
const feedContainer = $('#feed');
const profileFeed = $('#profile-feed');
const profileUsername = $('#profile-username');

// ---------- Navigation ----------
function setActiveNav(btn) {
  $$('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function showView(view) {
  $$('.view').forEach(v => v.classList.add('hidden'));
  view.classList.remove('hidden');
}
function route() {
  const hash = location.hash || '#feed';
  if (hash === '#feed') {
    setActiveNav(navFeedBtn);
    showView(feedView);
    renderFeed();
  } else if (hash === '#profile') {
    if (!currentUser) return alert('Please log in first');
    setActiveNav(navProfileBtn);
    showView(profileView);
    renderProfile();
  } else if (hash === '#login') {
    setActiveNav(navLoginBtn);
    openAuthModal('Log In');
  }
}
window.addEventListener('hashchange', route);

// ---------- Auth ----------
function openAuthModal(mode) {
  authTitle.textContent = mode;
  authModal.classList.remove('hidden');
  authUsername.value = '';
  authUsername.focus();
}
function closeAuthModal() {
  authModal.classList.add('hidden');
}
authClose.addEventListener('click', closeAuthModal);
navLoginBtn.addEventListener('click', () => openAuthModal('Log In'));
navProfileBtn.addEventListener('click', () => { if (!currentUser) openAuthModal('Log In'); });

authSubmit.addEventListener('click', () => {
  const name = authUsername.value.trim();
  if (!name) return alert('Enter a username');
  currentUser = name;
  localStorage.setItem('currentUser', currentUser);
  navLoginBtn.textContent = `👤 ${currentUser}`;
  closeAuthModal();
  location.hash = '#feed';
});

// ---------- Posts ----------
function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}
function createPost(content) {
  const post = {
    id: Date.now().toString(),
    author: currentUser,
    content,
    likes: []
  };
  posts.unshift(post);
  savePosts();
}
function toggleLike(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const idx = post.likes.indexOf(currentUser);
  if (idx === -1) post.likes.push(currentUser);
  else post.likes.splice(idx, 1);
  savePosts();
}

// ---------- Rendering ----------
function renderPostCard(post, container) {
  const card = document.createElement('div');
  card.className = 'post-card';
  const author = document.createElement('div');
  author.className = 'author';
  author.textContent = post.author;
  const content = document.createElement('div');
  content.className = 'content';
  content.textContent = post.content;
  const actions = document.createElement('div');
  actions.className = 'actions';
  const likeBtn = document.createElement('button');
  likeBtn.className = 'like-btn' + (post.likes.includes(currentUser) ? ' liked' : '');
  likeBtn.innerHTML = `❤️ <span>${post.likes.length}</span>`;
  likeBtn.addEventListener('click', () => {
    toggleLike(post.id);
    route(); // re‑render current view
  });
  actions.appendChild(likeBtn);
  card.appendChild(author);
  card.appendChild(content);
  card.appendChild(actions);
  container.appendChild(card);
}
function renderFeed() {
  feedContainer.innerHTML = '';
  if (!posts.length) feedContainer.textContent = 'No posts yet.';
  posts.forEach(p => renderPostCard(p, feedContainer));
}
function renderProfile() {
  profileUsername.textContent = currentUser ? `${currentUser}'s Profile` : '';
  profileFeed.innerHTML = '';
  const myPosts = posts.filter(p => p.author === currentUser);
  if (!myPosts.length) profileFeed.textContent = 'You have not posted yet.';
  myPosts.forEach(p => renderPostCard(p, profileFeed));
}

// ---------- New Post ----------
postSubmit.addEventListener('click', () => {
  if (!currentUser) return alert('Log in to post');
  const txt = postContent.value.trim();
  if (!txt) return alert('Write something');
  createPost(txt);
  postContent.value = '';
  renderFeed();
});

// ---------- Init ----------
if (currentUser) navLoginBtn.textContent = `👤 ${currentUser}`;
route();
