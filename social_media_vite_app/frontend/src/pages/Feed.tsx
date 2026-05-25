import React, { useState, useEffect } from "react";
import client from "../api/client";

interface Post {
  id: number;
  content: string;
  likes: number;
  author_id: number;
}

interface FeedProps {
  username: string;
  userId: number;
}

export default function Feed({ username, userId }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await client.get("/posts/");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      const response = await client.post("/posts/", null, {
        params: {
          content: newPost,
          user_id: userId,
        },
      });
      setPosts([response.data, ...posts]);
      setNewPost("");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await client.post(`/posts/${postId}/like`);
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, likes: response.data.likes } : p
        )
      );
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <div style={{
      maxWidth: "680px",
      margin: "2rem auto",
      width: "100%",
      padding: "0 1rem",
      textAlign: "left"
    }}>
      <div style={{
        background: "var(--social-bg)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "1.5rem",
        marginBottom: "2rem",
        boxShadow: "var(--shadow)",
        backdropFilter: "blur(8px)"
      }}>
        <h3 style={{ margin: "0 0 1rem 0", color: "var(--text-h)", fontWeight: 600 }}>
          Welcome back, @{username}! What's on your mind?
        </h3>
        <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <textarea
            placeholder="Share your thoughts with the world..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            required
            rows={3}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-h)",
              fontFamily: "var(--sans)",
              fontSize: "1rem",
              resize: "none",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={posting}
              style={{
                background: "linear-gradient(135deg, var(--accent), #7c3aed)",
                color: "white",
                border: "none",
                padding: "0.6rem 1.5rem",
                borderRadius: "30px",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {posting ? "Posting..." : "Post to Feed"}
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Recent Activity</h2>
          <button 
            onClick={fetchPosts} 
            style={{
              background: "none",
              border: "none",
              color: "var(--accent)",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "0.9rem"
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "var(--text)", padding: "2rem" }}>
            Loading feed...
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: "center",
            color: "var(--text)",
            padding: "3rem",
            border: "1px dashed var(--border)",
            borderRadius: "16px"
          }}>
            No posts yet. Be the first to share something!
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "var(--shadow)",
                transition: "transform 0.2s, border-color 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-border)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                <span style={{ fontWeight: 600, color: "var(--text-h)" }}>
                  Anonymous User #{post.author_id}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text)" }}>
                  Post #{post.id}
                </span>
              </div>
              <p style={{
                color: "var(--text-h)",
                fontSize: "1.05rem",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
                marginBottom: "1.2rem"
              }}>
                {post.content}
              </p>
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                borderTop: "1px solid var(--border)",
                paddingTop: "0.8rem"
              }}>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent-border)",
                    color: "var(--accent)",
                    padding: "0.4rem 1rem",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  ❤️ {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
