console.log("Hello, World! This is the frontend JavaScript file.");

function Posts() {
  const me = {};

  me.showError = ({ msg, res, type = "danger" } = {}) => {
    const main = document.getElementById("post-container");
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.role = type;
    alert.innerHTML = `${msg}: ${res.status} ${res.statusText}`;
    main.prepend(alert);
  };

  const renderPosts = (posts) => {
    console.log("Rendering posts:", posts);
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML = "";
    for (const { author, content, timestamp } of posts) {
      const postElement = document.createElement("div");
      postElement.className = "news-post";
      postElement.innerHTML = `
        <div class="news-post">
          <!-- User Data -->
          <div class="user-info">
            <a href="#user-link" class="user-link">
              <img
                class="profile-pic"
                src="../sourceimages/user.png"
                alt="Profile Picture"
              />
            </a>
            <div class="user-details">
              <p>
                <a href="#user-link" class="name user-link">${author}</a>
                • ${new Date(timestamp).toLocaleString()}
              </p>
              <a class="username" href="#user-link">@johnsmith</a>
            </div>
          </div>
            
          <!-- Post Content -->
          <div class="post-content">
            <p>
                ${content}
            </p>
          </div>
            
          <!-- Reference -->
          <div class="article-reference">
            <a href="#article-link" class="article-link"
              ><img
                class="article-image"
                src="../sourceimages/article-test.png"
                alt="Article Reference"
            /></a>
            <div class="article-details">
              <a href="#article-link" class="article-link">
                <p class="article-title">Article Title</p>
              </a>
              <p class="article-blurb">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sequi, soluta, deleniti sunt dolorum dolor voluptate
                aspernatur voluptates quos sint voluptatum delectus rerum
                eius et enim temporibus, eligendi repudiandae nihil
                officiis!
              </p>
            </div>
          </div>
            
          <!-- Up and Down Vote Buttons -->
          <div class="vote-buttons">
            <button class="btn btn-outline-light">
              <img
                class="vote-icon"
                src="../sourceimages/up-arrow.svg"
                alt="Upvote"
              />
            </button>
            <p>10</p>
            <button class="btn btn-outline-light">
              <img
                class="vote-icon"
                src="../sourceimages/bottom-arrow.svg"
                alt="Downvote"
              />
            </button>
            <p>2</p>
          </div>
        </div>
        `;
      postContainer.appendChild(postElement);
    }
  };

  me.refreshPosts = async () => {
    const res = await fetch("/api/posts");

    if (!res.ok) {
      console.error("Failed to fetch posts:", res.status, res.statusText);
      me.showError({ msg: "Failed to fetch posts", res });
      return;
    }

    const data = await res.json();
    console.log("Fetched posts:", data);

    renderPosts(data);
  };

  return me;
}

const myPosts = Posts();

myPosts.refreshPosts();
