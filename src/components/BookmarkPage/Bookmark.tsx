import { Empty, Layout, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Header from "../HomePage/Header";
import { Content } from "antd/es/layout/layout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../App";
import SinglePost from "../HomePage/SinglePost";
import { useUserAuth } from "../../context/AuthContext";

const Bookmark: React.FC<any> = ({
  likedPosts,
  deleteLikePost,
  bookmarkPost,
  removeBookmarkPosts,
  bookmarkedPostId,
  likedPostsId,
}) => {
  const [userPost, setUserPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const { currUser }: any = useUserAuth();

  const colRef = collection(db, "posts");

  const getBookmarkPosts = () => {
    getDocs(colRef)
      .then((snapshot) => {
        let postDocs: any = [];
        snapshot.docs.forEach((doc) => {
          postDocs.push({ ...doc.data() });
        });

        let newBookmarkedPosts: any = [];
        postDocs.map((post: any) => {
          bookmarkPost.map((postDetail: any) => {
            if (
              post.postId === postDetail.postId &&
              postDetail.userId === currUser.userId
            ) {
              newBookmarkedPosts.push(post);
            }
          });
        });

        setUserPost(newBookmarkedPosts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleRemoveBookmarkPosts = (id: any) => {
    setUserPost((prevState) =>
      prevState.filter((post: any) => post.postId !== id)
    );
  };

  useEffect(() => {
    getBookmarkPosts();
  }, []);

  return (
    <Layout>
      <Layout className="site-layout scroll-app">
        <Header />
        <h1 className="like-title">Bookmarks</h1>

        {error ? (
          <p className="no-comments-text">Error Please try Again!</p>
        ) : null}
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          {loading ? (
            <div className="loading-spin">
              <Spin tip="Loading" size="large">
                <div className="content" />
              </Spin>
            </div>
          ) : (
            <div>
              {userPost?.length === 0 ? (
                <div style={{ marginTop: "100px" }}>
                  <Empty />
                </div>
              ) : (
                <div>
                  {userPost.map((newPost: any, index: any) => {
                    return (
                      <SinglePost
                        key={index}
                        postItem={newPost}
                        likedPosts={likedPosts}
                        deleteLikePost={deleteLikePost}
                        bookmarkPost={bookmarkPost}
                        removeBookmarkPosts={removeBookmarkPosts}
                        handleRemoveBookmarkPosts={handleRemoveBookmarkPosts}
                        bookmarkedPostId={bookmarkedPostId}
                        likedPostsId={likedPostsId}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Bookmark;
