const API_URL = "https://4mdmc3on3j.execute-api.us-east-1.amazonaws.com/prod";
const CLIENT_ID = "2s363ittj18dt991brfbsqs1td";

async function loadPosts() {
  const res = await fetch(`${API_URL}/posts`);
  const posts = await res.json();
  document.getElementById("posts").innerHTML =
    posts
      .map(
        (p) =>
          `<div class="post"><a href="post.html?id=${p.postId}">${p.title}</a><br>by ${p.author}</div>`,
      )
      .join("") || "No posts yet.";
}

async function loadPost() {
  const id = new URLSearchParams(location.search).get("id");
  const res = await fetch(`${API_URL}/posts/${id}`);
  const post = await res.json();
  document.getElementById("post").innerHTML =
    `<h1>${post.title}</h1><p>by ${post.author}</p><p>${post.content}</p>`;
}

function initNewPost() {
  if (localStorage.getItem("token")) {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("postBox").classList.remove("hidden");
  }

  document.getElementById("loginForm").onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`https://cognito-idp.us-east-1.amazonaws.com/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
      body: JSON.stringify({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: { USERNAME: email, PASSWORD: password },
      }),
    });
    const data = await res.json();
    if (data.AuthenticationResult) {
      localStorage.setItem("token", data.AuthenticationResult.IdToken);
      document.getElementById("loginBox").classList.add("hidden");
      document.getElementById("postBox").classList.remove("hidden");
    } else {
      document.getElementById("loginMsg").innerText = "Login failed";
    }
  };

  document.getElementById("postForm").onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      document.getElementById("postMsg").innerText = "Post created!";
      document.getElementById("postForm").reset();
    } else {
      document.getElementById("postMsg").innerText = "Failed to create post";
    }
  };
}
