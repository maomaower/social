import React, { useState, useEffect } from "react";
import client from "../api/client";

interface Post {
  id: number;
  content: string;
  likes: number;
  author_id: number;
}

interface ProfileProps {
  username: string;
  userId: number;
}

export default function Profile({ username, userId }: ProfileProps) {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const response = await client.get("/posts/");
        // Filter posts created by the current user
        const filtered = response.data.filter((post: Post) => post.author_id === userId);
        setUserPosts(filtered);
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, [userId]);

  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);

  return (
    <div style={{
      maxWidth: "680px",
      margin: "2rem auto",
      width: "100%",
      padding: "0 1rem",
      textAlign: "left"
    }}>
      {/* Profile Header Card */}
      <div style={{
        background: "linear-gradient(135deg, var(--social-bg), var(--bg))",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        padding: "2rem",
        marginBottom: "2rem",
        boxShadow: "var(--shadow)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "150px",
          height: "150px",
          background: "var(--accent-bg)",
          borderRadius: "50%",
          filter: "blur(40px)",
          zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)"
            }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.8rem", color: "var(--text-h)" }}>@{username}</h2>
              <p style={{ margin: 0, color: "var(--text)", fontSize: "0.95rem" }}>Member ID: #{userId}</p>
            </div>
          </div>

          {/* User stats */}
          <div style={{ display: "flex", gap: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-h)" }}>
                {userPosts.length}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text)" }}>Posts Created</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-h)" }}>
                {totalLikes}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text)" }}>Total Likes Received</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts List */}
      <div>
        <h3 style={{ marginBottom: "1.2rem", color: "var(--text-h)", fontWeight: 600 }}>Your Posts</h3>

        {loading ? (
          <div style={{ textAlign: "center", color: "var(--text)", padding: "2rem" }}>
            Loading your posts...
          </div>
        ) : userPosts.length === 0 ? (
          <div style={{
            textAlign: "center",
            color: "var(--text)",
            padding: "3rem",
            border: "1px dashed var(--border)",
            borderRadius: "16px"
          }}>
            You haven't posted anything yet. Share your first thought on the feed!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {userPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: "var(--shadow)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-h)" }}>@{username}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text)" }}>Post #{post.id}</span>
                </div>
                <p style={{
                  color: "var(--text-h)",
                  fontSize: "1.05rem",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  marginBottom: "1rem"
                }}>
                  {post.content}
                </p>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "0.8rem"
                }}>
                  <span style={{ fontSize: "0.9rem", color: "var(--text)" }}>
                    ❤️ {post.likes} {post.likes === 1 ? "like" : "likes"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
